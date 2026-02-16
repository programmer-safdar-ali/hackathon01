"""
RAG (Retrieval-Augmented Generation) pipeline.

Accepts a question, embeds it, searches Qdrant for relevant content,
builds a prompt with retrieved context, and generates an answer with
citations using GPT-4o-mini.
"""

from typing import Optional

from openai import AsyncOpenAI
from qdrant_client.models import Filter, FieldCondition, MatchValue

from app.config import settings
from app.services.embeddings import generate_embedding
from app.services.qdrant_client import get_qdrant_client

COLLECTION_NAME = "textbook_content"
TOP_K = 5

SYSTEM_PROMPT = """You are an AI tutor for the Physical AI & Humanoid Robotics textbook.
Answer questions using ONLY the provided context from the textbook chapters.
If the context does not contain enough information to answer, say:
"I don't have enough information in the textbook to answer that question. Try rephrasing or ask about a specific topic covered in the modules."

Always cite the source chapter when providing information. Format citations as [Module X, Chapter Y].
Keep answers concise, accurate, and educational. Use code examples when relevant."""

NO_RESULTS_MESSAGE = (
    "I couldn't find relevant content in the textbook for your question. "
    "Try asking about topics covered in the four modules: ROS 2 Fundamentals, "
    "Digital Twin Simulation, NVIDIA Isaac Platform, or VLA Robotics."
)

_openai_client: AsyncOpenAI | None = None


def _get_openai_client() -> AsyncOpenAI:
    global _openai_client
    if _openai_client is None:
        _openai_client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _openai_client


def _build_qdrant_filter(
    module_filter: Optional[str] = None,
    difficulty_filter: Optional[str] = None,
) -> Optional[Filter]:
    """Build a Qdrant filter from optional parameters."""
    conditions = []
    if module_filter:
        conditions.append(
            FieldCondition(key="module", match=MatchValue(value=module_filter))
        )
    if difficulty_filter:
        conditions.append(
            FieldCondition(key="difficulty", match=MatchValue(value=difficulty_filter))
        )
    if not conditions:
        return None
    return Filter(must=conditions)


async def search_content(
    query: str,
    module_filter: Optional[str] = None,
    difficulty_filter: Optional[str] = None,
) -> list[dict]:
    """
    Search Qdrant for textbook content relevant to the query.

    Returns list of dicts with keys: text, module, chapter, section, url.
    """
    embedding = await generate_embedding(query)
    client = get_qdrant_client()

    search_filter = _build_qdrant_filter(module_filter, difficulty_filter)

    results = client.search(
        collection_name=COLLECTION_NAME,
        query_vector=embedding,
        limit=TOP_K,
        query_filter=search_filter,
    )

    return [
        {
            "text": hit.payload.get("text", ""),
            "module": hit.payload.get("module", ""),
            "chapter": hit.payload.get("chapter", ""),
            "section": hit.payload.get("section", ""),
            "url": hit.payload.get("url", ""),
            "score": hit.score,
        }
        for hit in results
    ]


def _build_prompt(question: str, context_chunks: list[dict], conversation_history: list[dict] | None = None) -> list[dict]:
    """Build the chat completion messages with context and history."""
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Add last 5 messages of conversation history for context
    if conversation_history:
        for msg in conversation_history[-5:]:
            messages.append({"role": msg["role"], "content": msg["content"]})

    # Build context from retrieved chunks
    context_parts = []
    for i, chunk in enumerate(context_chunks, 1):
        source = f"[{chunk['module']}/{chunk['chapter']}#{chunk['section']}]"
        context_parts.append(f"Source {i} {source}:\n{chunk['text']}")

    context_text = "\n\n---\n\n".join(context_parts) if context_parts else "No relevant content found."

    user_message = f"""Context from textbook:

{context_text}

---

Student question: {question}"""

    messages.append({"role": "user", "content": user_message})
    return messages


def _extract_citations(context_chunks: list[dict]) -> list[dict]:
    """Extract unique citations from context chunks."""
    seen = set()
    citations = []
    for chunk in context_chunks:
        key = (chunk["module"], chunk["chapter"])
        if key not in seen:
            seen.add(key)
            citations.append({
                "module": chunk["module"],
                "chapter": chunk["chapter"],
                "section": chunk["section"],
                "url": chunk["url"],
            })
    return citations


async def generate_answer(
    question: str,
    module_filter: Optional[str] = None,
    difficulty_filter: Optional[str] = None,
    conversation_history: list[dict] | None = None,
) -> dict:
    """
    Full RAG pipeline: embed question -> search -> generate answer.

    Returns dict with keys: message (str), citations (list[dict]).
    """
    context_chunks = await search_content(question, module_filter, difficulty_filter)

    if not context_chunks or all(c["score"] < 0.3 for c in context_chunks):
        return {
            "message": NO_RESULTS_MESSAGE,
            "citations": [],
        }

    messages = _build_prompt(question, context_chunks, conversation_history)
    client = _get_openai_client()

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.3,
        max_tokens=1024,
    )

    answer = response.choices[0].message.content or ""
    citations = _extract_citations(context_chunks)

    return {
        "message": answer,
        "citations": citations,
    }


async def generate_answer_stream(
    question: str,
    module_filter: Optional[str] = None,
    difficulty_filter: Optional[str] = None,
    conversation_history: list[dict] | None = None,
):
    """
    Streaming RAG pipeline. Yields chunks of the response.

    Yields dicts with key: delta (str) for content, or citations (list) at the end.
    """
    context_chunks = await search_content(question, module_filter, difficulty_filter)

    if not context_chunks or all(c["score"] < 0.3 for c in context_chunks):
        yield {"delta": NO_RESULTS_MESSAGE}
        yield {"citations": []}
        return

    messages = _build_prompt(question, context_chunks, conversation_history)
    client = _get_openai_client()

    stream = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.3,
        max_tokens=1024,
        stream=True,
    )

    async for chunk in stream:
        if chunk.choices and chunk.choices[0].delta.content:
            yield {"delta": chunk.choices[0].delta.content}

    yield {"citations": _extract_citations(context_chunks)}
