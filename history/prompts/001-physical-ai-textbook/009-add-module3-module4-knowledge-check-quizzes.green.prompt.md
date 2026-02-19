---
id: 009
title: Add Module 3 and Module 4 Knowledge Check Quizzes
stage: green
date: 2026-02-19
surface: agent
model: claude-sonnet-4-6
feature: 001-physical-ai-textbook
branch: 001-physical-ai-textbook
user: safdaralishah
command: python3 script to update_mdx with KnowledgeCheck blocks
labels: ["knowledge-check", "quiz", "module-3", "module-4", "isaac", "vla", "docusaurus", "mdx"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - website/docs/module-3-isaac/01-isaac-sdk-setup.mdx
  - website/docs/module-3-isaac/02-perception-pipeline.mdx
  - website/docs/module-3-isaac/03-reinforcement-learning.mdx
  - website/docs/module-3-isaac/04-sim-to-real.mdx
  - website/docs/module-4-vla/01-conversational-robotics.mdx
  - website/docs/module-4-vla/02-whisper-voice.mdx
  - website/docs/module-4-vla/03-llm-planning.mdx
  - website/docs/module-4-vla/04-vla-integration.mdx
tests:
  - "Manual verification: 8 MDX files updated successfully (script exit 0)"
---

## Prompt

Add knowledge check quiz sections to Module 3 (NVIDIA Isaac) and Module 4 (VLA Robotics) chapters. Execute the following Python script exactly:

[Full Python script provided to update 8 MDX files — adding KnowledgeCheck import after frontmatter (if not already present) and appending a quiz block with 5 questions per chapter to:
- module-3-isaac/01-isaac-sdk-setup.mdx (NVIDIA Isaac SDK Setup)
- module-3-isaac/02-perception-pipeline.mdx (Perception Pipeline)
- module-3-isaac/03-reinforcement-learning.mdx (Reinforcement Learning with Isaac Gym)
- module-3-isaac/04-sim-to-real.mdx (Sim-to-Real Transfer)
- module-4-vla/01-conversational-robotics.mdx (Conversational Robotics)
- module-4-vla/02-whisper-voice.mdx (Whisper Voice Processing)
- module-4-vla/03-llm-planning.mdx (LLM-Based Task Planning)
- module-4-vla/04-vla-integration.mdx (VLA Integration)]

## Response snapshot

Executed the Python script exactly as provided. All 8 files were updated successfully:

Updated: /home/safdaralishah/Documents/github/hackathon01/website/docs/module-3-isaac/01-isaac-sdk-setup.mdx
Updated: /home/safdaralishah/Documents/github/hackathon01/website/docs/module-3-isaac/02-perception-pipeline.mdx
Updated: /home/safdaralishah/Documents/github/hackathon01/website/docs/module-3-isaac/03-reinforcement-learning.mdx
Updated: /home/safdaralishah/Documents/github/hackathon01/website/docs/module-3-isaac/04-sim-to-real.mdx
Updated: /home/safdaralishah/Documents/github/hackathon01/website/docs/module-4-vla/01-conversational-robotics.mdx
Updated: /home/safdaralishah/Documents/github/hackathon01/website/docs/module-4-vla/02-whisper-voice.mdx
Updated: /home/safdaralishah/Documents/github/hackathon01/website/docs/module-4-vla/03-llm-planning.mdx
Updated: /home/safdaralishah/Documents/github/hackathon01/website/docs/module-4-vla/04-vla-integration.mdx
All Module 3 and Module 4 files updated.

Each file received:
1. `import KnowledgeCheck from '@site/src/components/KnowledgeCheck';` inserted after frontmatter closing `---`
2. A `## Knowledge Check` section with a `<KnowledgeCheck>` component containing 5 questions with 4 options each, correct answer index, explanation, and section reference

## Outcome

- Impact: Knowledge check quizzes added to all 4 Module 3 (NVIDIA Isaac) chapters and all 4 Module 4 (VLA Robotics) chapters — 8 files total, 40 questions added
- Tests: Script executed with zero errors; all 8 file paths confirmed updated in stdout
- Files: 8 MDX files modified across module-3-isaac and module-4-vla docs directories
- Next prompts: Add quizzes to remaining modules (Module 5+), verify KnowledgeCheck component renders correctly in Docusaurus dev server
- Reflection: Pattern is consistent with Module 2 quiz additions (PHR 008). Script is idempotent for the import (checks before inserting) but would duplicate the quiz block if run again — note for future runs.

## Evaluation notes (flywheel)

- Failure modes observed: None — script executed cleanly
- Graders run and results (PASS/FAIL): N/A (no automated tests; manual stdout verification PASS)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add idempotency check for quiz block appending (check if KnowledgeCheck section already exists before appending)
