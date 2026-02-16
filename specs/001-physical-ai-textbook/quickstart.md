# Quickstart: Physical AI & Humanoid Robotics AI-Native Textbook

**Branch**: `001-physical-ai-textbook` | **Date**: 2026-02-16

## Prerequisites

- Node.js 18+ and npm 9+
- Python 3.11+ and pip
- Git
- Accounts: OpenAI API key, Qdrant Cloud (free tier), Neon Postgres (free tier)

## 1. Clone and Setup

```bash
git clone <repo-url>
cd hackathon01
git checkout 001-physical-ai-textbook
```

## 2. Frontend (Docusaurus)

```bash
cd website
npm install
cp .env.example .env.local
# Edit .env.local with your API endpoint URL
npm run start
# Opens at http://localhost:3000
```

**Key environment variables** (website/.env.local):
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_AUTH_URL=http://localhost:3001
```

## 3. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
uvicorn app.main:app --reload --port 8000
# API at http://localhost:8000, docs at http://localhost:8000/docs
```

**Key environment variables** (backend/.env):
```
OPENAI_API_KEY=sk-...
QDRANT_URL=https://xxx.cloud.qdrant.io
QDRANT_API_KEY=...
DATABASE_URL=postgresql+asyncpg://user:pass@host/dbname
BETTER_AUTH_SECRET=random-secret-string
CORS_ORIGINS=http://localhost:3000,https://your-github-pages-url
```

## 4. Database Setup

```bash
cd backend
alembic upgrade head  # Run migrations against Neon Postgres
```

## 5. Content Ingestion

```bash
cd backend
python -m app.scripts.ingest_content --docs-path ../website/docs
# Parses MDX → chunks → embeds → upserts to Qdrant
```

## 6. Auth Service (Bonus — P5)

```bash
cd auth
npm install
cp .env.example .env
# Edit .env with DATABASE_URL and BETTER_AUTH_SECRET
npm run dev
# Auth API at http://localhost:3001
```

## 7. Build and Deploy

### Static site (GitHub Pages)
```bash
cd website
npm run build
# Output in website/build/ — deploy via GitHub Actions
```

### Backend (Vercel)
```bash
cd backend
vercel deploy
```

## 8. Verify

- [ ] Open http://localhost:3000 — textbook loads with all 4 modules
- [ ] Navigate to a chapter — code examples render with syntax highlighting
- [ ] Click chatbot icon — chat panel opens
- [ ] Ask "What is a ROS 2 node?" — receive answer with citation within 2s
- [ ] Navigate to Knowledge Check — quiz renders and scores answers
- [ ] Run `npm run build` — build completes in under 5 minutes
- [ ] Run `pytest` in backend/ — all tests pass

## Common Issues

| Issue | Solution |
|-------|----------|
| `OPENAI_API_KEY` not set | Copy .env.example to .env, add your key |
| Qdrant connection timeout | Verify QDRANT_URL and QDRANT_API_KEY in .env |
| CORS errors in browser | Ensure CORS_ORIGINS includes your frontend URL |
| Database migration fails | Check DATABASE_URL uses the pooler endpoint for Neon |
| Chatbot returns empty answers | Run content ingestion script first |
