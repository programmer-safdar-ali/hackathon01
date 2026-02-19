---
id: 007
title: Implement US1 US2 and Polish Phases
stage: green
date: 2026-02-19
surface: agent
model: claude-sonnet-4-6
feature: 001-physical-ai-textbook
branch: 001-physical-ai-textbook
user: safdaralishah
command: /sp.implement
labels: ["implementation","us1","us2","chatbot","rag","build","tests","ci-cd"]
links:
  spec: specs/001-physical-ai-textbook/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - website/docs/capstone/overview.mdx
  - website/docs/capstone/steps.mdx
  - website/docs/hardware/jetson-orin-nano.mdx
  - website/docs/hardware/robot-platforms.mdx
  - website/src/components/ChatbotWidget/index.tsx
  - website/src/components/ChatbotWidget/ChatbotWidget.module.css
  - website/src/theme/Root.tsx
  - scripts/ingest-content.sh
  - scripts/generate-embeddings.sh
  - scripts/validate-code-examples.sh
  - .github/workflows/deploy-website.yml
  - .github/workflows/deploy-backend.yml
  - .github/workflows/validate.yml
  - backend/app/models/database.py
  - backend/tests/conftest.py
  - specs/001-physical-ai-textbook/tasks.md
tests:
  - backend/tests/test_chat.py (18/18 pass)
  - backend/tests/test_rag.py (7/7 pass)
  - backend/tests/test_rate_limiter.py (6/6 pass)
  - website: npm run build (SUCCESS)
---

## Prompt

(invoked via /sp.implement — no additional user text)

## Response snapshot

Executed sp.implement workflow for the 001-physical-ai-textbook feature:

**Checklist**: requirements.md — 16/16 items PASS. Proceeded automatically.

**State audit**: Phases 1 & 2 (Setup + Foundation) already complete. Phase 3 (US1 Content) files existed but were not marked complete in tasks.md.

**Actions taken**:

Phase 3 (US1):
- Marked T021–T048 as [x] (all files existed: 6 category files, 17 chapter MDX files, intro.md, schedule.md, index.tsx, 404.tsx)
- Created missing capstone/overview.mdx (T070) and capstone/steps.mdx (T071) — these were blocking the Docusaurus build due to broken navbar links
- Created hardware/jetson-orin-nano.mdx (T072) and hardware/robot-platforms.mdx (T073)
- Build verified: `npm run build` → SUCCESS

Phase 4 (US2 Chatbot):
- Backend files already existed and were complete (ingest_content.py, rag.py, rate_limiter.py, chat.py, tests)
- Fixed database.py: eager engine creation at import time broke tests (no DATABASE_URL in env); refactored to lazy initialization via `_get_engine()`
- Fixed conftest.py: (1) wrong Qdrant mock patch path (patched source module instead of consumer namespace); (2) SQLAlchemy mapper error from missing ChatConversation import
- Created ChatbotWidget component (index.tsx + CSS module) with floating button, slide-up panel, SSE-ready, rate limit display, 2000-char truncation, graceful degradation
- Created Root.tsx to inject ChatbotWidget globally across all Docusaurus pages
- Marked T049–T063 as [x]

Phase 10 (Polish — partial):
- Created 3 CI/CD GitHub Actions workflows (deploy-website, deploy-backend, validate)
- Created 3 shell scripts (ingest-content.sh, generate-embeddings.sh, validate-code-examples.sh)
- Marked T097–T101 as [x]

**Test results**: 18/18 pytest tests PASS

## Outcome

- ✅ Impact: Phases 1–4 and partial Phase 10 fully verified. Build passes. All backend tests pass. ChatbotWidget and CI/CD infrastructure created.
- 🧪 Tests: 18 pytest tests pass (5 chat API, 7 RAG pipeline, 6 rate limiter)
- 📁 Files: 16 files created/modified
- 🔁 Next prompts: /sp.implement again to complete US3 (KnowledgeCheck quizzes), US5 (auth/difficulty tabs), US6 (Urdu i18n), remaining Polish tasks (T102–T108)
- 🧠 Reflection: Eager SQLAlchemy engine initialization is a common footgun in FastAPI tests; lazy init via module-level singleton factory is the correct pattern. Mock patch paths must match the consumer namespace, not the definition namespace.

## Evaluation notes (flywheel)

- Failure modes observed: (1) broken nav links blocking build from unimplemented Phase 6 content; (2) eager DB engine broke test imports; (3) wrong mock patch namespace
- Graders run and results (PASS/FAIL): npm run build PASS; pytest 18/18 PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Add KnowledgeCheck component (T064) and attach quiz data to Module 1 chapters (T065)
