<!--
=== Sync Impact Report ===
Version change: N/A (new) → 1.0.0
Modified principles: N/A (initial creation)
Added sections:
  - Core Principles (7 principles)
  - Technical Stack & Constraints
  - Development Workflow & Deliverables
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ compatible (no changes needed)
  - .specify/templates/spec-template.md — ✅ compatible (no changes needed)
  - .specify/templates/tasks-template.md — ✅ compatible (no changes needed)
Follow-up TODOs: none
===========================
-->

# Physical AI & Humanoid Robotics Textbook Constitution

## Core Principles

### I. Content-First Development

Every decision MUST be evaluated against its impact on learner
comprehension. Educational content (chapters, code examples, diagrams)
is the primary deliverable; all tooling, infrastructure, and features
exist to serve the content. A chapter with working code examples and
clear explanations is more valuable than a polished UI with empty pages.
Rationale: This is a textbook project — pedagogical quality is the
non-negotiable measure of success.

### II. Runnable Code Examples (Non-Negotiable)

Every code example published in the textbook MUST be executable and
produce the documented output. Code snippets MUST include:
- Language and runtime version requirements
- All necessary imports and dependencies
- Expected output or behavior description
- Clear comments explaining non-obvious steps

Stale or broken examples MUST be treated as P0 bugs. No chapter may
be marked complete until all its code examples pass validation.
Rationale: Students learn by running code; broken examples destroy
trust and halt learning.

### III. Spec-Driven Development

All features and content MUST follow the SDD workflow:
Specify → Plan → Task → Implement → Validate. No implementation
work begins without a written spec approved by the project owner.
The `/sp.specify` → `/sp.plan` → `/sp.tasks` → `/sp.implement`
pipeline is the standard execution path. Deviations require explicit
justification documented in the relevant spec.
Rationale: SDD with Claude Code and Spec-Kit Plus ensures traceable,
reviewable progress and prevents scope drift on a deadline-driven
project.

### IV. Modular Independence

The four learning modules MUST be independently navigable and
self-contained:
1. **Module 1**: ROS 2 Fundamentals
2. **Module 2**: Robot Simulation (Gazebo & Unity)
3. **Module 3**: NVIDIA Isaac AI Platform
4. **Module 4**: Conversational Robotics (Vision-Language-Action Models)

Each module MUST have its own chapter structure, code examples, and
learning objectives. A student MUST be able to complete any single
module without requiring completion of another, though modules MAY
reference prerequisites from earlier modules. Cross-module dependencies
MUST be explicitly documented at the start of each chapter.
Rationale: Modular independence enables flexible learning paths and
allows parallel development of content.

### V. Accessibility & Inclusivity

All content MUST meet WCAG 2.1 AA standards. The project MUST support:
- Screen-reader-compatible navigation and alt text for all diagrams
- Responsive design for mobile and tablet reading
- Urdu translation support as a bonus deliverable
- Skill-level-based content personalization (beginner, intermediate,
  advanced) as a bonus deliverable

Rationale: Technical education MUST be accessible to the widest
possible audience, including Urdu-speaking communities and learners
with disabilities.

### VI. Performance & Reliability

The deployed textbook MUST meet these budgets:
- Page load: < 3 seconds on 3G connections (Lighthouse score >= 90)
- RAG chatbot response: < 5 seconds p95 latency
- Chatbot accuracy: >= 95% on book-content questions
- Uptime: 99.5% availability for GitHub Pages deployment
- Build time: < 5 minutes for full Docusaurus build

Infrastructure failures MUST NOT corrupt content. The chatbot MUST
gracefully degrade (show "unavailable" message) rather than return
incorrect answers when backend services are down.
Rationale: Students abandon slow or unreliable learning tools.
Performance budgets ensure a production-grade experience.

### VII. Smallest Viable Diff

Every change MUST be the minimum necessary to achieve its goal.
No unrelated refactoring, no speculative features, no premature
abstractions. Each PR MUST address a single concern traceable to
a spec or task. Code MUST be added incrementally:
base deliverables first, bonus features only after base is stable.
Rationale: A deadline of November 30, 2025 demands disciplined
scope control. Small diffs are easier to review, test, and revert.

## Technical Stack & Constraints

### Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Docusaurus 3.x | Static site generation for textbook |
| Hosting | GitHub Pages | Free, reliable static hosting |
| Backend API | FastAPI (Python 3.11+) | RAG chatbot API and content services |
| Database | Neon Serverless Postgres | User data, auth sessions, analytics |
| Vector Store | Qdrant Cloud | Embedding storage for RAG retrieval |
| AI/LLM | OpenAI APIs (GPT-4o / embeddings) | Chatbot responses and content embedding |
| Auth | Better-Auth | User authentication (bonus) |
| Dev Tooling | Claude Code + Spec-Kit Plus | AI-assisted spec-driven development |
| CI/CD | GitHub Actions | Automated build, test, deploy |

### Constraints

- **No hardcoded secrets**: All API keys and tokens MUST use `.env`
  files and environment variables. `.env` MUST be in `.gitignore`.
- **No paid hosting for base deliverables**: GitHub Pages for frontend;
  free tiers for Neon, Qdrant Cloud, and API hosting.
- **Python 3.11+** for all backend code; Node.js 18+ for Docusaurus.
- **OpenAI API** is the primary LLM provider; no vendor lock-in in
  the abstraction layer (use interface pattern for swappability).
- **Content format**: Markdown with MDX extensions for Docusaurus.
  All diagrams in Mermaid or SVG (no proprietary formats).

### Deliverables

**Base (required)**:
- [ ] Deployed Docusaurus textbook on GitHub Pages with all 4 modules
- [ ] Working RAG chatbot integrated into the textbook
- [ ] All code examples validated and runnable
- [ ] Demo video under 90 seconds

**Bonus (stretch goals, in priority order)**:
1. Claude Code Subagents for parallel development
2. User authentication via Better-Auth
3. Skill-level content personalization
4. Urdu translation support

## Development Workflow & Deliverables

### Workflow

1. **Specify**: Define feature requirements with `/sp.specify`
2. **Plan**: Create architecture and implementation plan with `/sp.plan`
3. **Task**: Break plan into testable tasks with `/sp.tasks`
4. **Implement**: Execute tasks with `/sp.implement`
5. **Validate**: Verify against spec acceptance criteria
6. **Record**: PHR created for every significant interaction

### Quality Gates

- **Code examples**: MUST compile/run and produce documented output
- **Documentation**: Every chapter MUST have learning objectives,
  prerequisites, and a summary
- **Accessibility**: WCAG 2.1 AA compliance checked before merge
- **Performance**: Lighthouse >= 90 on all deployed pages
- **Chatbot**: >= 95% accuracy on a curated test set of 100+ questions
- **No broken links**: All internal and external links validated in CI

### Branch Strategy

- `main`: Production-ready, deployed to GitHub Pages
- `feature/*`: Feature branches from `main`, merged via PR
- `content/*`: Content branches for chapter writing
- All PRs require passing CI checks before merge

### Success Metrics

- All 4 modules complete with chapters, code examples, and diagrams
- RAG chatbot achieves >= 95% accuracy on book-content questions
- Successful deployment to GitHub Pages with working chatbot
- Demo video under 90 seconds showcasing the textbook and chatbot
- Submission by November 30, 2025

## Governance

This constitution is the authoritative source of project principles
and constraints. All specs, plans, tasks, and implementations MUST
comply with the principles defined herein.

**Amendment procedure**:
1. Propose amendment with rationale in a PR modifying this file
2. Run `/sp.constitution` to validate and propagate changes
3. All active specs MUST be checked for compatibility
4. Version MUST be incremented per semantic versioning rules:
   - MAJOR: Principle removal or backward-incompatible redefinition
   - MINOR: New principle or materially expanded guidance
   - PATCH: Clarification, wording fix, non-semantic refinement

**Compliance review**:
- Every `/sp.plan` MUST include a Constitution Check section
- PRs that violate principles MUST be flagged and corrected
- ADR suggestions MUST be surfaced for architecturally significant
  decisions per the three-part test (impact + alternatives + scope)

**Version**: 1.0.0 | **Ratified**: 2026-02-15 | **Last Amended**: 2026-02-15
