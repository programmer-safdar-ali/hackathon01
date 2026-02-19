# Tasks: Physical AI & Humanoid Robotics AI-Native Textbook

**Input**: Design documents from `/specs/001-physical-ai-textbook/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api.yaml

**Tests**: Test tasks are included for backend API (pytest) and frontend build validation per spec SC-002, SC-003, SC-004.

**Organization**: Tasks grouped by user story for independent implementation and testing. 7 user stories (P1-P7), 3 directories (website/, backend/, auth/).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Exact file paths included in descriptions

## Path Conventions

- **website/**: Docusaurus 3.x frontend (TypeScript/React)
- **backend/**: FastAPI backend (Python 3.11+)
- **auth/**: Better-Auth Node.js service (bonus P5)
- **scripts/**: Build and deployment scripts
- **.github/workflows/**: CI/CD pipelines

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize all three project directories with dependencies and base configuration

- [x] T001 Initialize Docusaurus 3.x project in website/ with TypeScript template and install dependencies (react, react-dom, @docusaurus/core, @docusaurus/preset-classic)
- [x] T002 Configure website/docusaurus.config.js with site metadata (title: "Physical AI & Humanoid Robotics", tagline, URL), Mermaid plugin (@docusaurus/theme-mermaid), and local search plugin (@easyops-cn/docusaurus-search-local)
- [x] T003 [P] Install and configure Tailwind CSS in website/ with website/tailwind.config.js and website/src/css/custom.css for theme styling
- [x] T004 [P] Configure website/sidebars.js with sidebar categories for four modules, capstone, and hardware guides
- [x] T005 Initialize FastAPI project in backend/ with backend/pyproject.toml and backend/requirements.txt (fastapi, uvicorn, pydantic[v2], openai, qdrant-client, asyncpg, sqlalchemy[asyncio], alembic, slowapi, python-dotenv)
- [x] T006 [P] Create backend/app/__init__.py, backend/app/config.py with Pydantic BaseSettings loading env vars (OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY, DATABASE_URL, CORS_ORIGINS, BETTER_AUTH_SECRET)
- [x] T007 [P] Create backend/.env.example and website/.env.example with placeholder environment variables per quickstart.md
- [x] T008 [P] Create backend/vercel.json with serverless function configuration for FastAPI deployment
- [x] T009 [P] Add .gitignore entries for node_modules/, .venv/, __pycache__/, .env, build/, .docusaurus/
- [x] T010 [P] Create website/static/img/ directory and add placeholder logo/favicon assets

**Checkpoint**: Both website/ and backend/ directories initialized with dependencies. `npm run start` in website/ shows default Docusaurus site; `uvicorn app.main:app` in backend/ starts (after T011).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend infrastructure that MUST be complete before user story implementation

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T011 Create backend/app/main.py with FastAPI app instance, CORS middleware (origins from config), and include API routers
- [x] T012 [P] Create backend/app/models/database.py with SQLAlchemy async engine, async sessionmaker, and Base declarative class using DATABASE_URL from config
- [x] T013 [P] Create backend/app/services/qdrant_client.py with Qdrant Cloud client initialization (url, api_key from config) and collection existence check for "textbook_content"
- [x] T014 [P] Create backend/app/services/embeddings.py with async function to generate embeddings using OpenAI text-embedding-3-small (1536 dimensions)
- [x] T015 Initialize Alembic in backend/alembic/ with backend/alembic/alembic.ini configured for async Postgres (Neon) using DATABASE_URL
- [x] T016 Create backend/app/models/chat.py with SQLAlchemy models for chat_conversations and chat_messages tables per data-model.md
- [x] T017 [P] Create backend/app/models/user.py with SQLAlchemy models for users, sessions, user_profiles, and rate_limits tables per data-model.md
- [x] T018 Create first Alembic migration in backend/alembic/versions/ for all 6 tables (users, sessions, user_profiles, chat_conversations, chat_messages, rate_limits) with indexes per data-model.md
- [x] T019 [P] Create backend/app/api/__init__.py with APIRouter setup and register chat, user, and health routers in main.py
- [x] T020 Create backend/app/api/health.py with GET /api/health endpoint returning status, qdrant connectivity, and database connectivity per contracts/api.yaml

**Checkpoint**: Foundation ready. `alembic upgrade head` creates all tables. GET /api/health returns JSON with connection statuses. User story implementation can begin.

---

## Phase 3: User Story 1 — Browse and Read Textbook Content (Priority: P1) MVP

**Goal**: Students can navigate 4 modules with 16-20 chapters, read content with code examples, diagrams, and follow the 13-week schedule. Fully static — no backend required.

**Independent Test**: Open http://localhost:3000, navigate to any module, read chapters with rendered Mermaid diagrams and syntax-highlighted code. Search for a keyword. View 13-week schedule.

### Implementation for User Story 1

- [x] T021 [P] [US1] Create website/docs/module-1-ros2/_category_.json with label "Module 1: ROS 2 Fundamentals", position 1, and link description
- [x] T022 [P] [US1] Create website/docs/module-2-simulation/_category_.json with label "Module 2: Digital Twin Simulation", position 2
- [x] T023 [P] [US1] Create website/docs/module-3-isaac/_category_.json with label "Module 3: NVIDIA Isaac Platform", position 3
- [x] T024 [P] [US1] Create website/docs/module-4-vla/_category_.json with label "Module 4: VLA Robotics", position 4
- [x] T025 [P] [US1] Create website/docs/capstone/_category_.json with label "Capstone Project", position 5
- [x] T026 [P] [US1] Create website/docs/hardware/_category_.json with label "Hardware Guides", position 6
- [x] T027 [P] [US1] Write website/docs/module-1-ros2/01-ros2-architecture.mdx — ROS 2 architecture overview with system diagram (Mermaid), node/topic concepts, DDS middleware explanation, and Python code examples
- [x] T028 [P] [US1] Write website/docs/module-1-ros2/02-nodes-topics.mdx — ROS 2 nodes, topics, publishers/subscribers with code examples (rclpy), Mermaid pub-sub diagram
- [x] T029 [P] [US1] Write website/docs/module-1-ros2/03-services-actions.mdx — ROS 2 services and actions with client/server code examples, async action patterns
- [x] T030 [P] [US1] Write website/docs/module-1-ros2/04-python-packages.mdx — Creating ROS 2 Python packages, setup.py, package.xml, colcon build workflow
- [x] T031 [P] [US1] Write website/docs/module-1-ros2/05-urdf-transforms.mdx — URDF robot description, TF2 transforms, joint types, visualization with RViz
- [x] T032 [P] [US1] Write website/docs/module-2-simulation/01-gazebo-basics.mdx — Gazebo Fortress setup, world files, spawning models, basic simulation controls
- [x] T033 [P] [US1] Write website/docs/module-2-simulation/02-physics-sensors.mdx — Physics engine configuration, sensor plugins (camera, lidar, IMU), SDF format
- [x] T034 [P] [US1] Write website/docs/module-2-simulation/03-unity-visualization.mdx — Unity Robotics Hub, ROS-TCP-Connector, URDF importer, visualization pipeline
- [x] T035 [P] [US1] Write website/docs/module-2-simulation/04-digital-twin-pipeline.mdx — End-to-end digital twin pipeline connecting Gazebo/Unity with ROS 2, data flow diagram
- [x] T036 [P] [US1] Write website/docs/module-3-isaac/01-isaac-sdk-setup.mdx — NVIDIA Isaac SDK installation, Jetson setup, sample application walkthrough
- [x] T037 [P] [US1] Write website/docs/module-3-isaac/02-perception-pipeline.mdx — Isaac perception: object detection, pose estimation, depth processing with code examples
- [x] T038 [P] [US1] Write website/docs/module-3-isaac/03-reinforcement-learning.mdx — Isaac Gym RL training, reward shaping, sim-to-real considerations, training scripts
- [x] T039 [P] [US1] Write website/docs/module-3-isaac/04-sim-to-real.mdx — Domain randomization, transfer learning, real-world deployment checklist
- [x] T040 [P] [US1] Write website/docs/module-4-vla/01-conversational-robotics.mdx — Conversational AI for robots, NLU pipeline, intent recognition, dialogue management
- [x] T041 [P] [US1] Write website/docs/module-4-vla/02-whisper-voice.mdx — OpenAI Whisper integration, speech-to-text pipeline, ROS 2 audio node, voice command processing
- [x] T042 [P] [US1] Write website/docs/module-4-vla/03-llm-planning.mdx — LLM-based task planning, prompt engineering for robot actions, safety constraints
- [x] T043 [P] [US1] Write website/docs/module-4-vla/04-vla-integration.mdx — Vision-Language-Action model integration, end-to-end VLA pipeline, multimodal inputs
- [x] T044 [P] [US1] Write website/docs/intro.md — Welcome page with textbook overview, learning objectives, prerequisites, and module navigation links
- [x] T045 [P] [US1] Write website/docs/schedule.md — 13-week learning schedule with weekly breakdowns mapping chapters to weeks, estimated 8-10 hours/week per SC-009
- [x] T046 [US1] Create website/src/pages/index.tsx — Homepage with hero section, module cards (4 modules), quick start links, and responsive layout using Tailwind CSS
- [x] T047 [US1] Create custom 404 page at website/src/pages/404.tsx with navigation back to module index (edge case: nonexistent chapter URL)
- [x] T048 [US1] Verify all Mermaid diagrams render in chapters, all code examples have syntax highlighting and copy button, and `npm run build` completes successfully in website/

**Checkpoint**: User Story 1 complete. All 4 modules with 17 chapters navigable. Mermaid diagrams render. Code examples highlighted. 13-week schedule visible. Search works. Build passes. No backend required.

---

## Phase 4: User Story 2 — Ask the RAG Chatbot Questions (Priority: P2)

**Goal**: Students can open the chatbot on any page, ask a question about textbook content, and receive an accurate answer with chapter citations within 2 seconds.

**Independent Test**: Open chatbot widget, ask "What is a ROS 2 node?", receive an answer citing Module 1 Chapter 1 within 2s. Ask an off-topic question, receive a polite refusal. Test rate limiting for anonymous users (10/hr).

### Implementation for User Story 2

- [x] T049 [P] [US2] Create backend/app/scripts/ingest_content.py — CLI script to parse MDX files from website/docs/, chunk text (~500 tokens, 50-token overlap), generate embeddings via OpenAI, and upsert to Qdrant "textbook_content" collection with payload fields (module, chapter, section, text, difficulty, url, chunk_index) per data-model.md
- [x] T050 [P] [US2] Create backend/app/services/rate_limiter.py — Tiered rate limiting service: 10 queries/hr anonymous (by IP hash), 60 queries/hr authenticated (by user_id). Uses rate_limits table. Sliding window reset logic per data-model.md
- [x] T051 [US2] Create backend/app/services/rag.py — RAG pipeline: accept question → embed with text-embedding-3-small → search Qdrant top 5 → build prompt with retrieved context → call GPT-4o-mini → return answer with citations. Support module_filter and difficulty_filter. Handle no-results edge case with fallback message
- [x] T052 [US2] Create backend/app/api/chat.py — POST /api/chat endpoint per contracts/api.yaml: accept ChatRequest, call RAG service, check rate limits, return ChatResponse with message, conversation_id, citations, rate_limit info. Handle 429 (rate limit) and 503 (service unavailable) errors
- [x] T053 [US2] Add POST /api/chat/stream endpoint in backend/app/api/chat.py — SSE streaming variant using StreamingResponse, yielding ChatStreamEvent objects as Server-Sent Events per contracts/api.yaml
- [x] T054 [US2] Create website/src/components/ChatbotWidget/index.tsx — Floating chat button (bottom-right), expandable chat panel with message list, input field, send button. Call POST /api/chat on submit, display response with citation links. Show loading state and error messages
- [x] T055 [US2] Create website/src/components/ChatbotWidget/ChatbotWidget.module.css — Chat panel styling: floating button, slide-up panel, message bubbles (user/assistant), citation links, responsive mobile layout
- [x] T056 [US2] Integrate ChatbotWidget globally by adding it to website/src/theme/Root.tsx as a persistent component across all pages
- [x] T057 [US2] Add chatbot graceful degradation: when backend returns 503, show "Chatbot is temporarily unavailable" in the ChatbotWidget. When rate limited (429), show limit message with reset time
- [x] T058 [US2] Add input validation in ChatbotWidget: truncate messages exceeding 2000 characters and display notification to user (edge case per spec)
- [x] T059 [US2] Create scripts/ingest-content.sh — Shell wrapper to run content ingestion pipeline: activate venv, execute ingest_content.py with --docs-path argument
- [x] T060 [US2] Create backend/tests/test_chat.py — pytest tests for POST /api/chat: valid question returns answer with citations, off-topic question returns refusal, rate limit exceeded returns 429, empty message returns 400
- [x] T061 [US2] Create backend/tests/test_rate_limiter.py — pytest tests for rate limiter: anonymous user blocked after 10 queries, window reset after 1 hour, authenticated user allowed 60 queries
- [x] T062 [US2] Create backend/tests/test_rag.py — pytest tests for RAG pipeline: embedding generation, Qdrant search returns results, prompt construction with context, no-results fallback message
- [x] T063 [US2] Create backend/tests/conftest.py — pytest fixtures: async test client, mock Qdrant client, mock OpenAI client, test database session, sample chat request payloads

**Checkpoint**: User Story 2 complete. Chatbot widget on every page. Questions answered with citations <2s. Rate limiting enforced. Graceful degradation on errors. Backend tests pass.

---

## Phase 5: User Story 3 — Complete Interactive Assessments (Priority: P3)

**Goal**: Students complete knowledge checks at chapter ends with multiple-choice questions, immediate scoring, and feedback. Client-side evaluation — no backend needed.

**Independent Test**: Navigate to any chapter's Knowledge Check section, answer questions, see score and feedback. No login required.

### Implementation for User Story 3

- [ ] T064 [P] [US3] Create website/src/components/KnowledgeCheck/index.tsx — React component accepting quiz data (questions, options, correct answers, explanations), rendering multiple-choice questions, handling answer selection, showing immediate feedback per question, and summary score at completion (e.g., "7/10 correct")
- [ ] T065 [P] [US3] Create quiz data for Module 1 chapters: add knowledge check sections with 5-10 questions each at the end of website/docs/module-1-ros2/01-ros2-architecture.mdx through 05-urdf-transforms.mdx using MDX import of KnowledgeCheck component
- [ ] T066 [P] [US3] Create quiz data for Module 2 chapters: add knowledge check sections at the end of website/docs/module-2-simulation/01-gazebo-basics.mdx through 04-digital-twin-pipeline.mdx
- [ ] T067 [P] [US3] Create quiz data for Module 3 chapters: add knowledge check sections at the end of website/docs/module-3-isaac/01-isaac-sdk-setup.mdx through 04-sim-to-real.mdx
- [ ] T068 [P] [US3] Create quiz data for Module 4 chapters: add knowledge check sections at the end of website/docs/module-4-vla/01-conversational-robotics.mdx through 04-vla-integration.mdx
- [ ] T069 [US3] Add "review sections for missed questions" links in KnowledgeCheck score summary — each incorrect answer links back to the relevant chapter section anchor

**Checkpoint**: User Story 3 complete. Every chapter has a Knowledge Check with 5-10 questions. Scoring works client-side. Feedback shown per question. Review links for missed answers.

---

## Phase 6: User Story 4 — Capstone Project Guidance (Priority: P4)

**Goal**: Students follow a step-by-step capstone project integrating all 4 modules to build an autonomous humanoid robot with voice commands and object manipulation.

**Independent Test**: Read capstone overview, follow steps that reference specific chapters from each module, verify checkpoint validation instructions are clear.

### Implementation for User Story 4

- [x] T070 [P] [US4] Write website/docs/capstone/overview.mdx — Capstone project goals, prerequisites (all 4 modules), system architecture diagram (Mermaid), hardware requirements, expected outcomes
- [x] T071 [P] [US4] Write website/docs/capstone/steps.mdx — 10+ step-by-step tasks per SC-010: ROS 2 workspace setup, Gazebo simulation environment, Isaac perception integration, VLA voice commands, object manipulation, with checkpoint validations and cross-module chapter references
- [x] T072 [P] [US4] Write website/docs/hardware/jetson-orin-nano.mdx — Jetson Orin Nano setup guide: parts list, OS installation, CUDA/cuDNN setup, Isaac SDK installation, troubleshooting
- [x] T073 [P] [US4] Write website/docs/hardware/robot-platforms.mdx — Supported robot platforms overview, comparison table, assembly guides, ROS 2 driver setup

**Checkpoint**: User Story 4 complete. Capstone guide with 10+ steps references all 4 modules. Hardware guides provide setup instructions. All content navigable without backend.

---

## Phase 7: User Story 5 — Authenticate and Get Personalized Experience (Priority: P5, Bonus)

**Goal**: Students sign up, set background/skill level, and see chapter content adapted via difficulty tabs. Chat history persists server-side for authenticated users.

**Independent Test**: Sign up, select "beginner" skill level, see Beginner tab active. Toggle to Advanced tab, see deeper content. Sign out, content defaults to Intermediate tab. Sign back in, previous chat history visible.

### Implementation for User Story 5

- [ ] T074 [P] [US5] Initialize auth/ directory with package.json (better-auth, @better-auth/node dependencies), tsconfig.json
- [ ] T075 [P] [US5] Create auth/src/auth.ts — Better-Auth instance configuration with email/password provider, database adapter pointing to shared Neon Postgres, session settings
- [ ] T076 [US5] Create auth/src/index.ts — Express/Node server exposing Better-Auth API routes at http://localhost:3001, CORS configuration for frontend
- [ ] T077 [US5] Create auth/.env.example with DATABASE_URL and BETTER_AUTH_SECRET placeholders
- [ ] T078 [P] [US5] Create auth/vercel.json for serverless deployment of auth service
- [ ] T079 [US5] Create backend/app/api/auth.py — Auth validation middleware: extract Bearer token from Authorization header, query sessions table to validate token, attach user_id to request state. Allow unauthenticated requests to pass through for public endpoints
- [ ] T080 [US5] Create backend/app/api/user.py — GET /api/user/profile and PUT /api/user/profile endpoints per contracts/api.yaml: return UserProfile, update background/skill_level/language_preference in user_profiles table. Create profile row on first access
- [ ] T081 [US5] Add chat history persistence in backend/app/api/chat.py — GET /api/chat/history (paginated conversation list) and GET /api/chat/history/{conversation_id} (messages) per contracts/api.yaml. Save conversations and messages for authenticated users only
- [ ] T082 [P] [US5] Create website/src/components/DifficultyTabs/index.tsx — Tabs component (Beginner / Intermediate / Advanced) wrapping MDX content sections. Default tab = Intermediate for unauthenticated users, user preference for authenticated users. Persist tab selection
- [ ] T083 [US5] Update all 17 chapter MDX files in website/docs/ to use DifficultyTabs component with beginner, intermediate, and advanced content variants within each chapter
- [ ] T084 [US5] Create website/src/theme/Root.tsx — Global auth context provider: check auth status, provide user profile to child components, expose login/logout methods
- [ ] T085 [US5] Add sign-up/sign-in UI flow in website/: login button in navbar, modal or page for email/password sign-up with background and skill level selection during onboarding

**Checkpoint**: User Story 5 complete. Auth works. Difficulty tabs show in every chapter. Profile persists skill level. Chat history saved for authenticated users. Unauthenticated users see Intermediate tab and ephemeral chat.

---

## Phase 8: User Story 6 — Read Content in Urdu (Priority: P6, Bonus)

**Goal**: Urdu-speaking students toggle language to Urdu, see translated navigation and chapter content with RTL rendering. Code examples stay in English.

**Independent Test**: Toggle language to Urdu, see RTL layout, translated navigation. On an untranslated chapter, see "translation in progress" notice with English fallback.

### Implementation for User Story 6

- [ ] T086 [US6] Update website/docusaurus.config.js to add i18n configuration: defaultLocale "en", locales ["en", "ur"], locale label "Urdu" with direction "rtl"
- [ ] T087 [P] [US6] Create website/i18n/ur/docusaurus-theme-classic/ with Urdu translations for theme strings (navbar, footer, search, pagination labels)
- [ ] T088 [P] [US6] Create website/i18n/ur/docusaurus-plugin-content-docs/current/ with Urdu translations for at least one complete module (Module 1: ROS 2 Fundamentals — 5 chapters) per SC-014
- [ ] T089 [US6] Add RTL-specific CSS rules in website/src/css/custom.css for Urdu locale: text-align, direction, font-family for Urdu script, code block LTR override
- [ ] T090 [US6] Add language toggle component or use Docusaurus built-in locale dropdown in navbar configuration
- [ ] T091 [US6] Handle untranslated chapter fallback: show "This chapter is not yet available in Urdu. Showing English version." notice when Urdu translation file is missing

**Checkpoint**: User Story 6 complete. Urdu locale accessible via toggle. Module 1 fully translated with RTL. Untranslated chapters show English with notice. Code examples remain in English.

---

## Phase 9: User Story 7 — AI Tutoring Conversations (Priority: P7, Bonus)

**Goal**: Authenticated students engage with AI tutor for step-by-step explanations, practice problems, and code review within the chatbot interface.

**Independent Test**: Start tutoring session on a chapter, ask for a practice problem, submit an answer, receive a hint if incorrect. Multi-turn conversation maintains context.

### Implementation for User Story 7

- [ ] T092 [US7] Extend backend/app/services/rag.py with tutoring mode: detect tutoring intents (explain step-by-step, generate exercise, review code), use enhanced system prompt with pedagogical instructions, maintain multi-turn context via conversation history
- [ ] T093 [US7] Add "Start Tutoring Session" button in ChatbotWidget that sets tutoring mode flag and sends chapter context to backend for richer AI responses
- [ ] T094 [US7] Implement practice problem generation in RAG service: when tutoring mode active and user requests practice, generate a relevant exercise based on current chapter content with expected output
- [ ] T095 [US7] Implement hint-based feedback: when student submits incorrect answer in tutoring mode, return a hint rather than full answer. Track attempt count in conversation context
- [ ] T096 [US7] Gate tutoring features behind authentication: "Start Tutoring Session" button only visible for authenticated users. Unauthenticated users see "Sign in for AI tutoring" prompt

**Checkpoint**: User Story 7 complete. Tutoring mode generates practice problems, gives hints on wrong answers, maintains multi-turn context. Requires authentication.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: CI/CD, performance, accessibility, deployment, and demo preparation

- [x] T097 [P] Create .github/workflows/deploy-website.yml — GitHub Actions: on push to main, build Docusaurus, deploy to GitHub Pages
- [x] T098 [P] Create .github/workflows/deploy-backend.yml — GitHub Actions: on push to main, deploy FastAPI to Vercel
- [x] T099 [P] Create .github/workflows/validate.yml — GitHub Actions: run pytest in backend/, run npm run build in website/, run Lighthouse CI (target >= 90), check for broken links
- [x] T100 [P] Create scripts/validate-code-examples.sh — Script to extract and validate all code examples from MDX files execute correctly
- [x] T101 [P] Create scripts/generate-embeddings.sh — Shell wrapper to re-embed all textbook content to Qdrant
- [ ] T102 Run WCAG 2.1 AA accessibility audit on all pages: verify alt text on diagrams, keyboard navigation, color contrast, screen reader compatibility per FR-018 and SC-006
- [ ] T103 Optimize page load performance: verify initial page load < 3s (SC-005), lazy-load ChatbotWidget, optimize image assets in website/static/img/
- [ ] T104 Verify chatbot p95 latency < 2s under normal load (SC-004) using the 100-question test set (SC-003). Document accuracy results
- [ ] T105 Create backend/app/models/__init__.py and backend/app/services/__init__.py and backend/app/api/__init__.py ensuring all Python packages are properly initialized
- [ ] T106 Create FR-020 deployment documentation: update quickstart.md with final deployment procedures, environment variable reference, and maintenance operations
- [ ] T107 Record demo video (< 90 seconds per SC-011): showcase textbook navigation across modules, chatbot Q&A interaction with citation, and one knowledge check assessment
- [ ] T108 Final build validation: run `npm run build` in website/ (< 5 min), run `pytest` in backend/ (all pass), verify deployed site at GitHub Pages URL and API at Vercel URL

**Checkpoint**: All user stories polished. CI/CD pipelines active. Accessibility and performance targets met. Demo video recorded. Deployment verified.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T005, T006) — BLOCKS all backend user stories
- **US1 Content (Phase 3)**: Depends on Phase 1 (T001-T004) only — frontend tasks, NO backend dependency
- **US2 Chatbot (Phase 4)**: Depends on Phase 2 (backend foundation) AND Phase 3 (content to ingest)
- **US3 Assessments (Phase 5)**: Depends on Phase 3 (chapters exist to add quizzes to) — NO backend dependency
- **US4 Capstone (Phase 6)**: Depends on Phase 3 (module content referenced) — NO backend dependency
- **US5 Auth (Phase 7)**: Depends on Phase 2 (backend) AND Phase 4 (chat endpoints to extend)
- **US6 Urdu (Phase 8)**: Depends on Phase 3 (English content to translate) — NO backend dependency
- **US7 Tutoring (Phase 9)**: Depends on Phase 4 (chatbot) AND Phase 7 (auth gating)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

```text
Phase 1 (Setup)
  ├── Phase 2 (Foundation) ──── BLOCKS ──→ Phase 4 (US2 Chatbot)
  │                                           │
  │                                           ├──→ Phase 7 (US5 Auth) ──→ Phase 9 (US7 Tutoring)
  │                                           │
  │                                           └──→ Phase 10 (Polish)
  │
  └── Phase 3 (US1 Content) ─── can start immediately after Setup
        │
        ├──→ Phase 4 (US2 Chatbot — needs content to ingest)
        ├──→ Phase 5 (US3 Assessments — needs chapters to attach quizzes)
        ├──→ Phase 6 (US4 Capstone — references module content)
        └──→ Phase 8 (US6 Urdu — needs English content to translate)
```

### Within Each User Story

- Models before services
- Services before endpoints/API
- Backend before frontend integration
- Core implementation before edge cases
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: T003, T004, T006, T007, T008, T009, T010 all run in parallel
- **Phase 2**: T012, T013, T014, T017 run in parallel; T016 parallel with T017
- **Phase 3**: ALL chapter MDX files (T027-T045) run in parallel — completely independent files
- **Phase 4**: T049 (ingestion) and T050 (rate limiter) run in parallel; T054 and T060-T063 after backend tasks
- **Phase 5**: All 4 module quiz tasks (T065-T068) run in parallel
- **Phase 6**: T070-T073 all run in parallel (independent content files)
- **Phase 7**: T074, T075, T078, T082 run in parallel
- **Phase 8**: T087, T088 run in parallel
- **Phase 10**: T097, T098, T099, T100, T101 all run in parallel

---

## Parallel Example: User Story 1 (Content)

```bash
# Launch ALL chapter content tasks together (completely independent files):
Task: "Write website/docs/module-1-ros2/01-ros2-architecture.mdx"      # T027
Task: "Write website/docs/module-1-ros2/02-nodes-topics.mdx"           # T028
Task: "Write website/docs/module-2-simulation/01-gazebo-basics.mdx"    # T032
Task: "Write website/docs/module-3-isaac/01-isaac-sdk-setup.mdx"       # T036
Task: "Write website/docs/module-4-vla/01-conversational-robotics.mdx" # T040
# ... all 17 chapter files can be written in parallel

# After all chapters complete, run:
Task: "Create homepage in website/src/pages/index.tsx"                  # T046
Task: "Verify build passes with npm run build"                          # T048
```

## Parallel Example: User Story 2 (Chatbot Backend)

```bash
# Launch independent backend services together:
Task: "Create ingestion script in backend/app/scripts/ingest_content.py"  # T049
Task: "Create rate limiter in backend/app/services/rate_limiter.py"       # T050

# After those complete, build the RAG pipeline:
Task: "Create RAG service in backend/app/services/rag.py"                 # T051

# Then the API endpoint:
Task: "Create chat endpoint in backend/app/api/chat.py"                   # T052

# Frontend and tests can start in parallel after backend:
Task: "Create ChatbotWidget in website/src/components/ChatbotWidget/"     # T054
Task: "Create pytest tests in backend/tests/"                             # T060, T061, T062
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (both website/ and backend/)
2. Complete Phase 2: Foundational (backend infrastructure)
3. Complete Phase 3: User Story 1 — Content (all 4 modules, 17 chapters)
4. **STOP and VALIDATE**: `npm run build` passes, all chapters navigable, diagrams render
5. Complete Phase 4: User Story 2 — Chatbot (RAG pipeline + widget)
6. **STOP and VALIDATE**: Chatbot answers questions accurately with citations <2s
7. Deploy MVP: GitHub Pages (static site) + Vercel (API)

### Incremental Delivery (Base Deliverables)

1. Setup + Foundation → Infrastructure ready
2. Add US1 (Content) → **Deploy static textbook** (MVP increment 1)
3. Add US2 (Chatbot) → **Deploy with chatbot** (MVP increment 2)
4. Add US3 (Assessments) → **Deploy with quizzes** (base increment 3)
5. Add US4 (Capstone) → **Deploy complete base** (base deliverable complete)

### Bonus Features (After Base is Stable)

6. Add US5 (Auth/Personalization) → Difficulty tabs, chat history persistence
7. Add US6 (Urdu) → RTL translation for Module 1
8. Add US7 (AI Tutoring) → Practice problems, hints, multi-turn tutoring

---

## Summary

| Phase | User Story | Priority | Tasks | Parallel |
|-------|-----------|----------|-------|----------|
| 1 | Setup | — | T001-T010 (10) | 7 parallel |
| 2 | Foundation | — | T011-T020 (10) | 5 parallel |
| 3 | US1: Content | P1 MVP | T021-T048 (28) | 24 parallel |
| 4 | US2: Chatbot | P2 | T049-T063 (15) | 6 parallel |
| 5 | US3: Assessments | P3 | T064-T069 (6) | 5 parallel |
| 6 | US4: Capstone | P4 | T070-T073 (4) | 4 parallel |
| 7 | US5: Auth | P5 Bonus | T074-T085 (12) | 4 parallel |
| 8 | US6: Urdu | P6 Bonus | T086-T091 (6) | 2 parallel |
| 9 | US7: Tutoring | P7 Bonus | T092-T096 (5) | 0 parallel |
| 10 | Polish | — | T097-T108 (12) | 5 parallel |
| **Total** | | | **108 tasks** | **62 parallelizable** |

---

## Notes

- [P] tasks = different files, no dependencies — safe to run in parallel
- [US#] label maps each task to its user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group of parallel tasks
- Stop at any checkpoint to validate the story independently
- Base deliverables (US1-US4) = 63 tasks; Bonus (US5-US7) = 23 tasks; Infra = 22 tasks
- Suggested MVP scope: US1 + US2 (53 tasks) = deployable textbook with working chatbot
