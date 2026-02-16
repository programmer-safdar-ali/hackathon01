# Research: Physical AI & Humanoid Robotics AI-Native Textbook

**Branch**: `001-physical-ai-textbook` | **Date**: 2026-02-16

## R1: Frontend Framework — Docusaurus 3.x

**Decision**: Docusaurus 3.x with MDX, React 18, and the classic theme.

**Rationale**: Docusaurus is a purpose-built documentation/textbook static site generator with first-class MDX support, built-in sidebar navigation, versioning, i18n, and search plugin architecture. It maps directly to the 4-module, multi-chapter content structure. MDX enables embedding custom React components (chatbot widget, knowledge checks, difficulty tabs) directly in chapter content.

**Alternatives considered**:
- **Next.js**: More flexible but requires building navigation, sidebar, and content infrastructure from scratch. Over-engineered for a primarily static textbook.
- **GitBook**: SaaS with limited customization. Cannot embed custom React components.
- **MkDocs**: Python-based, no native React component support. Would require separate frontend for interactive features.

**Key findings**:
- Docusaurus `<Tabs>` component from `@docusaurus/theme-common` supports the Beginner/Intermediate/Advanced tab switching required by FR-014.
- `@docusaurus/theme-mermaid` plugin provides native Mermaid diagram rendering for architecture diagrams (FR-003).
- `@easyops-cn/docusaurus-search-local` provides client-side full-text search with zero external dependencies (FR-003a).
- i18n is built-in with locale configuration supporting RTL. Urdu locale (`ur`) configured with `direction: 'rtl'` in `docusaurus.config.js`. Translation files stored under `i18n/ur/`.
- GitHub Pages deployment supported via `docusaurus deploy` or GitHub Actions.
- Code blocks have built-in syntax highlighting (Prism) and copy button support.

## R2: Backend API — FastAPI with Python 3.11+

**Decision**: FastAPI with async endpoints, Pydantic v2 models, and uvicorn.

**Rationale**: FastAPI provides high-performance async Python APIs with automatic OpenAPI documentation. Python aligns with the textbook's primary code example language and the data science/ML ecosystem (OpenAI, Qdrant clients). Constitution mandates Python 3.11+.

**Alternatives considered**:
- **Express.js/Hono**: Would match Better-Auth's TypeScript ecosystem but fragments the backend language (Python content examples vs. JS backend).
- **Django REST**: Heavier framework, synchronous by default, slower for chatbot streaming.
- **Flask**: Lacks native async support and automatic API documentation.

**Key findings**:
- FastAPI dependency injection cleanly separates rate limiting, auth validation, and Qdrant client lifecycle.
- `slowapi` library provides rate limiting middleware compatible with FastAPI (based on `limits` library).
- `openai` Python SDK supports async streaming for chatbot responses.
- `qdrant-client` Python SDK provides async operations for vector search.
- `asyncpg` or `sqlalchemy[asyncio]` with Neon Postgres for user data.

## R3: Vector Store — Qdrant Cloud Free Tier

**Decision**: Qdrant Cloud (free tier: 1GB storage, 1M vectors) with `text-embedding-3-small` embeddings.

**Rationale**: Qdrant Cloud provides managed vector search with a generous free tier sufficient for textbook content (16-20 chapters, ~200-400 content chunks). The Python client integrates directly with FastAPI.

**Alternatives considered**:
- **Pinecone**: Free tier limited to 1 index. Good but Qdrant offers more flexibility.
- **ChromaDB**: Local-only, no managed cloud free tier. Would need self-hosting.
- **pgvector (Neon)**: Possible via Neon Postgres, but Qdrant provides better search quality and filtering.

**Key findings**:
- Content chunking strategy: Split chapters into ~500-token chunks with 50-token overlap. Each chunk stores metadata: module_id, chapter_id, section_title, difficulty_level.
- `text-embedding-3-small` (OpenAI): 1536 dimensions, $0.02/1M tokens. Sufficient quality for textbook RAG.
- Collection schema: `id`, `vector`, `payload: {module, chapter, section, text, difficulty, url}`.
- Qdrant filtering enables scoping search to specific modules or difficulty levels.

## R4: Database — Neon Serverless Postgres

**Decision**: Neon Serverless Postgres (free tier: 0.5 GB storage, 1 project) for user profiles, chat history, and rate limit state.

**Rationale**: Serverless Postgres scales to zero when unused (cost-efficient), provides standard SQL, and integrates with SQLAlchemy async. Free tier is sufficient for the project's user base.

**Alternatives considered**:
- **Supabase**: Also Postgres-based but adds unnecessary auth/storage layers. Better-Auth handles auth separately.
- **PlanetScale**: MySQL-based, less aligned with Python ecosystem.
- **SQLite**: No serverless option, not suitable for multi-instance deployment.

**Key findings**:
- Tables needed: `users`, `user_profiles`, `sessions`, `chat_conversations`, `chat_messages`, `rate_limits`.
- Connection via `asyncpg` with connection pooling (Neon supports connection pooling natively via `pooler` endpoint).
- Schema migrations via `alembic`.

## R5: Authentication — Better-Auth with Node.js Sidecar

**Decision**: Better-Auth as a lightweight Node.js auth service, deployed alongside FastAPI. FastAPI validates Better-Auth session tokens.

**Rationale**: Better-Auth is the user-specified auth solution. Since it's TypeScript-only, it runs as a separate small service. The FastAPI backend validates sessions by reading the Better-Auth session cookie/token from the shared Neon Postgres database. This keeps auth logic in Better-Auth while allowing FastAPI to gate personalized features.

**Alternatives considered**:
- **FastAPI-Users (Python-native)**: Would simplify architecture but contradicts the user's explicit Better-Auth requirement.
- **Better-Auth embedded in Vercel serverless**: Possible but ties auth to Vercel platform.
- **Auth0/Clerk**: Managed SaaS, adds external dependency and potential cost.

**Key findings**:
- Better-Auth stores sessions in the same Neon Postgres database, enabling FastAPI to validate sessions via direct DB query.
- Better-Auth config: `emailAndPassword.enabled: true`, custom fields for `background` (software/hardware) and `skillLevel` (beginner/intermediate/advanced) via user metadata.
- Client-side: `@better-auth/react` hooks for sign-up/sign-in forms in Docusaurus React components.
- Session validation in FastAPI: Read `better-auth_session` cookie, query `sessions` table in Neon Postgres, extract user ID.

## R6: Deployment Architecture

**Decision**: Dual deployment — GitHub Pages for static site, Vercel for backend API.

**Rationale**: GitHub Pages provides free, reliable static hosting (constitution mandate). Vercel provides serverless Python functions for FastAPI and Node.js functions for Better-Auth, with generous free tier (100GB bandwidth, 100 hours compute).

**Alternatives considered**:
- **GitHub Pages + Railway**: Railway free tier is limited (500 hours/month). Vercel offers more.
- **GitHub Pages + Render**: Render free tier spins down after inactivity (slow cold starts). Bad for chatbot responsiveness.
- **Vercel-only**: Could host both static site and API, but GitHub Pages is explicitly required by constitution.

**Key findings**:
- GitHub Pages: Static Docusaurus build via `npm run build`, deployed via GitHub Actions on push to `main`.
- Vercel: FastAPI deployed as Python serverless functions, Better-Auth as Node.js serverless functions.
- CORS: FastAPI must allow origins from both GitHub Pages URL and localhost for development.
- Environment variables: `OPENAI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`, `DATABASE_URL`, `BETTER_AUTH_SECRET` stored in Vercel environment settings.

## R7: Content Ingestion Pipeline

**Decision**: Offline batch pipeline — parse MDX → chunk → embed → upsert to Qdrant. Run as CLI script during CI/CD.

**Rationale**: Textbook content changes infrequently (new chapters, not real-time). A batch pipeline run during deployment ensures the vector store is always in sync with published content without runtime overhead.

**Alternatives considered**:
- **Real-time indexing on page build**: Adds complexity to build pipeline and risks partial indexing on failures.
- **Manual CLI script**: Simpler but risks forgetting to run. CI/CD integration ensures consistency.

**Key findings**:
- Parse MDX files with `markdown-it` or custom parser that strips JSX components.
- Split into ~500-token chunks using `langchain.text_splitter.RecursiveCharacterTextSplitter`.
- Embed via OpenAI `text-embedding-3-small`.
- Upsert to Qdrant with metadata: module, chapter, section, difficulty, source URL.
- Script runs as GitHub Actions step after Docusaurus build, before deployment.

## R8: Chatbot RAG Architecture

**Decision**: Retrieval-Augmented Generation with OpenAI GPT-4o-mini for responses and `text-embedding-3-small` for embeddings.

**Rationale**: GPT-4o-mini provides fast, cost-effective responses (meets sub-2-second target). The RAG pattern constrains answers to textbook content only (FR-004), and citations are derived from Qdrant metadata.

**Key findings**:
- Query flow: User question → embed with `text-embedding-3-small` → search Qdrant (top 5 chunks) → construct prompt with retrieved context → GPT-4o-mini generates answer with citations.
- System prompt constrains model to only answer from provided context. If no relevant chunks found, respond with the "not found" message per edge case spec.
- Conversation context: Last 5 messages included in prompt for follow-up support (FR-004, acceptance scenario 4).
- Streaming: Use SSE (Server-Sent Events) for real-time response streaming to the frontend chatbot widget.
- Cost estimate: ~$0.15/1000 queries (embedding + completion). At 60 queries/hr/user, manageable on free credits.
