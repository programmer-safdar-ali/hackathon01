---
id: 001
title: Create Physical AI Textbook Constitution
stage: constitution
date: 2026-02-15
surface: agent
model: claude-opus-4-6
feature: none
branch: master
user: safdaralishah
command: /sp.constitution
labels: ["constitution", "project-setup", "physical-ai", "textbook"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A
---

## Prompt

"Create a Spec-Kit Plus constitution for an AI-native technical textbook project called 'Physical AI & Humanoid Robotics Textbook.' The book teaches students to bridge digital AI with embodied robotics intelligence across four modules: ROS 2 fundamentals, robot simulation with Gazebo and Unity, NVIDIA Isaac AI platform, and conversational robotics with Vision-Language-Action models. The textbook will be built with Docusaurus and deployed on GitHub Pages, featuring an integrated RAG chatbot powered by FastAPI, Neon Serverless Postgres, and Qdrant Cloud that answers questions about book content. The constitution should define the project's purpose (teaching Physical AI to students and developers), core structure (four learning modules with chapters, code examples, and diagrams), integrated features (RAG chatbot, user authentication via Better-Auth, content personalization based on skill level, and Urdu translation support), technical stack (Docusaurus frontend, FastAPI backend, OpenAI APIs, and Claude Code for development), base deliverables (deployed book with working chatbot), bonus features (Claude Code Subagents, authentication system, personalization, translation), quality standards (runnable code examples, clear documentation, WCAG accessibility, fast performance), and success metrics (all modules complete, 95%+ chatbot accuracy, successful deployment, working demo video under 90 seconds). The project uses spec-driven development methodology with Claude Code and Spec-Kit Plus, with a submission deadline of November 30, 2025.

## Response snapshot

Created constitution v1.0.0 for the Physical AI & Humanoid Robotics Textbook project. Defined 7 core principles: (I) Content-First Development, (II) Runnable Code Examples, (III) Spec-Driven Development, (IV) Modular Independence, (V) Accessibility & Inclusivity, (VI) Performance & Reliability, (VII) Smallest Viable Diff. Added Technical Stack & Constraints section covering Docusaurus, FastAPI, Neon Postgres, Qdrant Cloud, OpenAI APIs, Better-Auth, and Claude Code. Defined base deliverables (deployed textbook + RAG chatbot + code examples + demo video) and bonus features (subagents, auth, personalization, Urdu translation). Established quality gates, branch strategy, success metrics, and governance with semantic versioning for amendments.

## Outcome

- Impact: Project constitution established — all future specs, plans, and tasks governed by these 7 principles
- Tests: N/A (governance document)
- Files: .specify/memory/constitution.md (created v1.0.0)
- Next prompts: /sp.specify for first feature, project structure setup, Docusaurus initialization
- Reflection: Template had 6 principle slots; expanded to 7 to cover the full scope. All templates confirmed compatible — no propagation changes needed.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Manual validation PASS — no unresolved placeholders, dates ISO format, principles declarative and testable
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
