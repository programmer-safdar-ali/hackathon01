---
id: 006
title: Analyze Cross-Artifact Consistency
stage: misc
date: 2026-02-16
surface: agent
model: claude-opus-4-6
feature: 001-physical-ai-textbook
branch: 001-physical-ai-textbook
user: safdaralishah
command: /sp.analyze
labels: ["analysis", "consistency", "quality", "cross-artifact"]
links:
  spec: specs/001-physical-ai-textbook/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - N/A (read-only analysis, no files modified)
tests:
  - N/A
---

## Prompt

/sp.analyze — Perform non-destructive cross-artifact consistency and quality analysis across spec.md, plan.md, and tasks.md after task generation.

## Response snapshot

Loaded all 7 artifacts (spec.md, plan.md, tasks.md, constitution.md, research.md, data-model.md, contracts/api.yaml) and ran 6 detection passes: Duplication, Ambiguity, Underspecification, Constitution Alignment, Coverage Gaps, Inconsistency. Found 15 total findings: 0 CRITICAL, 4 HIGH, 8 MEDIUM, 3 LOW. Coverage: 95.5% of functional requirements have tasks, 92.9% of success criteria covered, 62.5% of edge cases covered. Constitution alignment: 7/7 principles PASS with one latency DRIFT (constitution <5s vs spec <2s). Key HIGH issues: (F1) Phase 2 header contradicts dependency section re: US1, (F2) no task to create 100-question chatbot test set, (F3) Claude Code Subagents missing from spec/tasks despite constitution listing it as bonus #1, (F4) KnowledgeCheck only covers multiple-choice but spec requires code-completion and concept-matching too. Recommended resolving 4 HIGH issues before /sp.implement.

## Outcome

- Impact: Quality gate passed — artifacts are consistent enough for implementation with 4 HIGH items to resolve
- Tests: N/A (analysis only)
- Files: No files modified (read-only analysis)
- Next prompts: Resolve HIGH findings (F1-F4), then /sp.implement
- Reflection: Strong artifact consistency overall (95.5% coverage). Main gaps are in edge case handling and constitution-spec drift on bonus features and performance targets.

## Evaluation notes (flywheel)

- Failure modes observed: None — all artifacts loaded successfully
- Graders run and results (PASS/FAIL): Constitution 7/7 PASS (1 DRIFT), Coverage 95.5% PASS, Edge Cases 62.5% NEEDS ATTENTION
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
