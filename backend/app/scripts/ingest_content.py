"""
Content ingestion pipeline.

Parses MDX files from website/docs/, chunks text (~500 tokens, 50-token overlap),
generates embeddings via OpenAI, and upserts to Qdrant "textbook_content" collection.

Usage:
    python -m app.scripts.ingest_content --docs-path ../website/docs
"""

import argparse
import asyncio
import os
import re
import uuid
from pathlib import Path

from qdrant_client.models import Distance, VectorParams, PointStruct

from app.services.embeddings import generate_embedding
from app.services.qdrant_client import get_qdrant_client

COLLECTION_NAME = "textbook_content"
EMBEDDING_DIM = 1536
CHUNK_SIZE = 500  # approximate tokens
CHUNK_OVERLAP = 50  # approximate token overlap

# Module mapping from directory names
MODULE_MAP = {
    "module-1-ros2": "Module 1: ROS 2 Fundamentals",
    "module-2-simulation": "Module 2: Digital Twin Simulation",
    "module-3-isaac": "Module 3: NVIDIA Isaac Platform",
    "module-4-vla": "Module 4: VLA Robotics",
    "capstone": "Capstone Project",
    "hardware": "Hardware Guides",
}


def strip_mdx(content: str) -> str:
    """Remove MDX/JSX components and frontmatter, keeping text content."""
    # Remove frontmatter
    content = re.sub(r"^---\n.*?\n---\n", "", content, flags=re.DOTALL)
    # Remove import statements
    content = re.sub(r"^import\s+.*$", "", content, flags=re.MULTILINE)
    # Remove JSX component tags (self-closing and block)
    content = re.sub(r"<[A-Z]\w+[^>]*/?>", "", content)
    content = re.sub(r"</[A-Z]\w+>", "", content)
    # Remove mermaid code blocks (keep other code blocks)
    content = re.sub(r"```mermaid\n.*?```", "", content, flags=re.DOTALL)
    # Remove HTML comments
    content = re.sub(r"<!--.*?-->", "", content, flags=re.DOTALL)
    # Remove Docusaurus admonition markers but keep content
    content = re.sub(r"^:::\w+.*$", "", content, flags=re.MULTILINE)
    # Clean up excessive newlines
    content = re.sub(r"\n{3,}", "\n\n", content)
    return content.strip()


def extract_sections(content: str) -> list[dict]:
    """Split content into sections based on headings."""
    sections = []
    current_section = ""
    current_heading = "Introduction"

    for line in content.split("\n"):
        heading_match = re.match(r"^(#{1,3})\s+(.+)$", line)
        if heading_match:
            if current_section.strip():
                sections.append({
                    "heading": current_heading,
                    "text": current_section.strip(),
                })
            current_heading = heading_match.group(2).strip()
            current_section = ""
        else:
            current_section += line + "\n"

    if current_section.strip():
        sections.append({
            "heading": current_heading,
            "text": current_section.strip(),
        })

    return sections


def chunk_text(text: str, max_tokens: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Split text into chunks of approximately max_tokens with overlap."""
    words = text.split()
    # Rough approximation: 1 token ~ 0.75 words
    words_per_chunk = int(max_tokens * 0.75)
    overlap_words = int(overlap * 0.75)

    if len(words) <= words_per_chunk:
        return [text]

    chunks = []
    start = 0
    while start < len(words):
        end = start + words_per_chunk
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start = end - overlap_words

    return chunks


def parse_docs(docs_path: str) -> list[dict]:
    """Parse all MDX/MD files and return list of chunk records."""
    records = []
    docs_dir = Path(docs_path)

    for mdx_file in sorted(docs_dir.rglob("*.mdx")) + sorted(docs_dir.rglob("*.md")):
        # Skip category files and non-content files
        if mdx_file.name.startswith("_"):
            continue

        relative = mdx_file.relative_to(docs_dir)
        parts = relative.parts

        # Determine module
        module = parts[0] if len(parts) > 1 else "root"
        chapter = mdx_file.stem
        url = f"/docs/{'/'.join(parts[:-1])}/{chapter}".replace("//", "/")

        content = mdx_file.read_text(encoding="utf-8")
        clean_content = strip_mdx(content)
        sections = extract_sections(clean_content)

        chunk_index = 0
        for section in sections:
            chunks = chunk_text(section["text"])
            for chunk in chunks:
                if len(chunk.strip()) < 50:
                    continue
                records.append({
                    "id": str(uuid.uuid4()),
                    "module": module,
                    "chapter": chapter,
                    "section": section["heading"],
                    "text": chunk,
                    "difficulty": "intermediate",
                    "url": url,
                    "chunk_index": chunk_index,
                })
                chunk_index += 1

    return records


async def ensure_collection():
    """Create the Qdrant collection if it doesn't exist."""
    client = get_qdrant_client()
    collections = client.get_collections().collections
    names = [c.name for c in collections]

    if COLLECTION_NAME not in names:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=EMBEDDING_DIM,
                distance=Distance.COSINE,
            ),
        )
        print(f"Created collection: {COLLECTION_NAME}")
    else:
        print(f"Collection exists: {COLLECTION_NAME}")


async def ingest(docs_path: str):
    """Full ingestion pipeline: parse -> chunk -> embed -> upsert."""
    print(f"Parsing documents from: {docs_path}")
    records = parse_docs(docs_path)
    print(f"Generated {len(records)} chunks from documents")

    await ensure_collection()
    client = get_qdrant_client()

    batch_size = 50
    for i in range(0, len(records), batch_size):
        batch = records[i:i + batch_size]
        points = []

        for record in batch:
            embedding = await generate_embedding(record["text"])
            points.append(
                PointStruct(
                    id=record["id"],
                    vector=embedding,
                    payload={
                        "module": record["module"],
                        "chapter": record["chapter"],
                        "section": record["section"],
                        "text": record["text"],
                        "difficulty": record["difficulty"],
                        "url": record["url"],
                        "chunk_index": record["chunk_index"],
                    },
                )
            )

        client.upsert(collection_name=COLLECTION_NAME, points=points)
        print(f"Upserted batch {i // batch_size + 1} ({len(points)} points)")

    print(f"Ingestion complete. Total: {len(records)} chunks.")


def main():
    parser = argparse.ArgumentParser(description="Ingest textbook content into Qdrant")
    parser.add_argument("--docs-path", required=True, help="Path to website/docs directory")
    args = parser.parse_args()

    if not os.path.isdir(args.docs_path):
        print(f"Error: {args.docs_path} is not a valid directory")
        return

    asyncio.run(ingest(args.docs_path))


if __name__ == "__main__":
    main()
