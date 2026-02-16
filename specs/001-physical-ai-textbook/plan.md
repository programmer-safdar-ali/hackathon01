# Implementation Plan: Physical AI & Humanoid Robotics AI-Native Textbook

**Branch**: `001-physical-ai-textbook` | **Date**: 2026-02-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-physical-ai-textbook/spec.md`

## Summary

Build a Docusaurus 3.x AI-native textbook with four learning modules (ROS 2, Digital Twin Simulation, NVIDIA Isaac, VLA Robotics), an embedded RAG chatbot powered by FastAPI + Qdrant Cloud + OpenAI, deployed to GitHub Pages (static) and Vercel (API). Base deliverables include the deployed textbook with 16-20 chapters, working chatbot with 95%+ accuracy, interactive assessments, 13-week learning schedule, capstone project guide, and a demo video under 90 seconds. Bonus features include Better-Auth user authentication, tabbed difficulty personalization, Urdu i18n, and AI tutoring with Claude Code Subagents.

## Technical Context

**Language/Version**: TypeScript/JavaScript (Docusaurus frontend, Node.js 18+), Python 3.11+ (FastAPI backend)
**Primary Dependencies**: Docusaurus 3.x, React 18, FastAPI, Pydantic v2, openai, qdrant-client, asyncpg, Better-Auth, Tailwind CSS
**Storage**: Neon Serverless Postgres (user data, sessions, chat history), Qdrant Cloud (vector embeddings)
**Testing**: Vitest (frontend components), pytest (backend API), Lighthouse CI (performance/accessibility)
**Target Platform**: Web (static site + serverless API), browsers supporting ES2020+
**Project Type**: Web application (frontend + backend)
**Performance Goals**: Page load < 3s, chatbot p95 < 2s, Lighthouse >= 90, build < 5 minutes
**Constraints**: Free-tier hosting only (GitHub Pages, Vercel, Neon free, Qdrant free), no hardcoded secrets, WCAG 2.1 AA
**Scale/Scope**: 16-20 chapters, 50 concurrent chatbot users, 100+ question test set, 13-week curriculum

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Content-First Development | PASS | Content (P1) is the highest priority user story. All infrastructure exists to serve the 4 modules. |
| II. Runnable Code Examples | PASS | FR-002 mandates syntax-highlighted, copy-enabled code blocks. SC-002 requires 100% execution validation. CI pipeline validates examples. |
| III. Spec-Driven Development | PASS | Full SDD pipeline followed: /sp.specify → /sp.clarify → /sp.plan. All work traceable to spec. |
| IV. Modular Independence | PASS | 4 modules with independent chapter hierarchies, sidebar categories, and content files. Cross-module deps documented per chapter. |
| V. Accessibility & Inclusivity | PASS | FR-018 (WCAG 2.1 AA), FR-015 (Urdu RTL), FR-014 (difficulty tabs). Lighthouse CI enforces accessibility. |
| VI. Performance & Reliability | PASS | Performance budgets defined: page < 3s, chatbot < 2s p95, Lighthouse >= 90. Chatbot graceful degradation in edge cases. |
| VII. Smallest Viable Diff | PASS | Phased delivery: base deliverables (P1-P4) first, bonus (P5-P7) only after base is stable. Incremental PRs. |

**Gate result**: ALL PASS. Proceed to implementation planning.

## Project Structure

### Documentation (this feature)

```text
specs/001-physical-ai-textbook/
├── plan.md              # This file
├── research.md          # Phase 0 output — technology decisions
├── data-model.md        # Phase 1 output — entity schemas
├── quickstart.md        # Phase 1 output — dev setup guide
├── contracts/           # Phase 1 output — API contracts
│   └── api.yaml         # OpenAPI 3.0 specification
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
website/                           # Docusaurus frontend
├── docusaurus.config.js           # Site config (i18n, plugins, theme)
├── sidebars.js                    # Sidebar navigation config
├── tailwind.config.js             # Tailwind CSS config
├── package.json                   # Frontend dependencies
├── docs/                          # Textbook content (MDX)
│   ├── intro.md                   # Welcome / getting started
│   ├── schedule.md                # 13-week learning schedule
│   ├── module-1-ros2/             # Module 1: ROS 2 Fundamentals
│   │   ├── _category_.json        # Sidebar category config
│   │   ├── 01-ros2-architecture.mdx
│   │   ├── 02-nodes-topics.mdx
│   │   ├── 03-services-actions.mdx
│   │   ├── 04-python-packages.mdx
│   │   └── 05-urdf-transforms.mdx
│   ├── module-2-simulation/       # Module 2: Digital Twin Simulation
│   │   ├── _category_.json
│   │   ├── 01-gazebo-basics.mdx
│   │   ├── 02-physics-sensors.mdx
│   │   ├── 03-unity-visualization.mdx
│   │   └── 04-digital-twin-pipeline.mdx
│   ├── module-3-isaac/            # Module 3: NVIDIA Isaac Platform
│   │   ├── _category_.json
│   │   ├── 01-isaac-sdk-setup.mdx
│   │   ├── 02-perception-pipeline.mdx
│   │   ├── 03-reinforcement-learning.mdx
│   │   └── 04-sim-to-real.mdx
│   ├── module-4-vla/              # Module 4: VLA Robotics
│   │   ├── _category_.json
│   │   ├── 01-conversational-robotics.mdx
│   │   ├── 02-whisper-voice.mdx
│   │   ├── 03-llm-planning.mdx
│   │   └── 04-vla-integration.mdx
│   ├── capstone/                  # Capstone project guide
│   │   ├── _category_.json
│   │   ├── overview.mdx
│   │   └── steps.mdx
│   └── hardware/                  # Hardware setup guides
│       ├── _category_.json
│       ├── jetson-orin-nano.mdx
│       └── robot-platforms.mdx
├── i18n/                          # Internationalization
│   └── ur/                        # Urdu translations (bonus)
│       ├── docusaurus-plugin-content-docs/
│       └── docusaurus-theme-classic/
├── src/                           # Custom React source
│   ├── components/                # Reusable components
│   │   ├── ChatbotWidget/         # Embedded RAG chatbot (FR-004)
│   │   │   ├── index.tsx
│   │   │   └── ChatbotWidget.module.css
│   │   ├── KnowledgeCheck/        # Quiz component (FR-006)
│   │   │   └── index.tsx
│   │   ├── DifficultyTabs/        # Beginner/Intermediate/Advanced tabs
│   │   │   └── index.tsx
│   │   └── MermaidDiagram/        # Mermaid wrapper (if needed beyond plugin)
│   │       └── index.tsx
│   ├── pages/                     # Custom pages
│   │   └── index.tsx              # Homepage
│   ├── css/                       # Global styles
│   │   └── custom.css             # Tailwind + custom theme
│   └── theme/                     # Swizzled theme components
│       └── Root.tsx               # Global providers (auth context)
└── static/                        # Static assets
    ├── img/                       # Images and SVGs
    └── diagrams/                  # Pre-rendered diagrams

backend/                           # FastAPI backend
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app, CORS, middleware
│   ├── config.py                  # Settings (env vars, Pydantic BaseSettings)
│   ├── api/
│   │   ├── __init__.py
│   │   ├── chat.py                # POST /api/chat, GET /api/chat/history
│   │   ├── auth.py                # Auth validation middleware
│   │   └── user.py                # GET/PUT /api/user/profile
│   ├── services/
│   │   ├── __init__.py
│   │   ├── rag.py                 # RAG pipeline (embed → search → generate)
│   │   ├── embeddings.py          # OpenAI embedding generation
│   │   ├── qdrant_client.py       # Qdrant Cloud connection
│   │   └── rate_limiter.py        # Tiered rate limiting (10/60 per hour)
│   ├── models/
│   │   ├── __init__.py
│   │   ├── database.py            # SQLAlchemy async engine + session
│   │   ├── user.py                # User, UserProfile models
│   │   └── chat.py                # ChatConversation, ChatMessage models
│   └── scripts/
│       └── ingest_content.py      # CLI: parse MDX → chunk → embed → upsert
├── alembic/                       # Database migrations
│   ├── alembic.ini
│   └── versions/
├── tests/
│   ├── conftest.py
│   ├── test_chat.py
│   ├── test_rate_limiter.py
│   └── test_rag.py
├── requirements.txt
├── pyproject.toml
└── vercel.json                    # Vercel serverless config

auth/                              # Better-Auth service (bonus, P5)
├── src/
│   ├── index.ts                   # Better-Auth server config
│   └── auth.ts                    # Auth instance with email/password
├── package.json
└── vercel.json                    # Deploy as Vercel serverless

scripts/                           # Build and deployment scripts
├── ingest-content.sh              # Run content ingestion pipeline
├── validate-code-examples.sh      # Validate all code examples execute
└── generate-embeddings.sh         # Re-embed all content

.github/
└── workflows/
    ├── deploy-website.yml         # Build Docusaurus → deploy to GitHub Pages
    ├── deploy-backend.yml         # Deploy FastAPI to Vercel
    └── validate.yml               # Run tests, Lighthouse, link checks
```

**Structure Decision**: Web application structure selected. Frontend (Docusaurus) and backend (FastAPI) are separate directories at repo root, with a third `auth/` directory for the Better-Auth Node.js service (bonus). This separation enables independent deployment: static site to GitHub Pages, API to Vercel serverless.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 3 project directories (website, backend, auth) | Better-Auth is TypeScript-only; FastAPI is Python-only; Docusaurus is its own build. | Single-language backend impossible given Better-Auth requirement. Auth service is a thin config layer (~50 LOC), not a full project. |
| External vector store (Qdrant) alongside Postgres | RAG requires vector similarity search that Postgres full-text search cannot provide with sufficient quality. | pgvector was considered but Qdrant provides better filtering and managed free tier. |
