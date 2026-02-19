---
id: 008
title: Add Module 2 Knowledge Check Quizzes
stage: green
date: 2026-02-19
surface: agent
model: claude-sonnet-4-6
feature: 001-physical-ai-textbook
branch: 001-physical-ai-textbook
user: safdaralishah
command: python3 script to append KnowledgeCheck components to Module 2 MDX files
labels: ["knowledge-check","quiz","module-2","digital-twin","simulation","docusaurus"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - website/docs/module-2-simulation/01-gazebo-basics.mdx
  - website/docs/module-2-simulation/02-physics-sensors.mdx
  - website/docs/module-2-simulation/03-unity-visualization.mdx
  - website/docs/module-2-simulation/04-digital-twin-pipeline.mdx
tests:
  - null
---

## Prompt

Add knowledge check quiz sections to Module 2 Digital Twin Simulation chapters. Execute the following Python script exactly:

```bash
python3 << 'PYEOF'

def update_mdx(filepath, quiz_block):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Add import after frontmatter if not already present
    if "import KnowledgeCheck" not in content:
        idx = content.find('---', 3)
        if idx != -1:
            insert_pos = idx + 3
            content = content[:insert_pos] + "\nimport KnowledgeCheck from '@site/src/components/KnowledgeCheck';\n" + content[insert_pos:]
    
    # Append quiz block at end
    if not content.endswith('\n'):
        content += '\n'
    content = content + '\n' + quiz_block + '\n'
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Updated: {filepath}")

base = "/home/safdaralishah/Documents/github/hackathon01/website/docs/module-2-simulation"
# [quiz1, quiz2, quiz3, quiz4 defined per chapter — 5 questions each]
# files_quizzes maps each chapter file to its quiz block
# Script iterates and calls update_mdx for each pair
PYEOF
```

Run this exact Python script and report success or any errors.

## Response snapshot

Script executed successfully. All 4 files updated:

- Updated: /home/safdaralishah/Documents/github/hackathon01/website/docs/module-2-simulation/01-gazebo-basics.mdx
- Updated: /home/safdaralishah/Documents/github/hackathon01/website/docs/module-2-simulation/02-physics-sensors.mdx
- Updated: /home/safdaralishah/Documents/github/hackathon01/website/docs/module-2-simulation/03-unity-visualization.mdx
- Updated: /home/safdaralishah/Documents/github/hackathon01/website/docs/module-2-simulation/04-digital-twin-pipeline.mdx
All Module 2 files updated.

Each file received:
1. `import KnowledgeCheck from '@site/src/components/KnowledgeCheck';` inserted after frontmatter closing `---`
2. A `## Knowledge Check` section appended at the end with a `<KnowledgeCheck>` component containing 5 questions, correct answers, explanations, and section references

## Outcome

- Impact: Added interactive 5-question knowledge check quizzes to all 4 Module 2 Digital Twin Simulation chapters, covering Gazebo Basics, Physics & Sensors, Unity Visualization, and Digital Twin Pipeline
- Tests: No automated tests run; visual verification of file updates confirmed via script output
- Files: 4 MDX files modified under website/docs/module-2-simulation/
- Next prompts: Verify KnowledgeCheck component renders correctly in Docusaurus dev server; add similar quizzes to other modules
- Reflection: Script ran cleanly with zero errors; import injection and quiz block appending logic worked correctly for all 4 files

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none run
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Run Docusaurus dev server to verify quiz rendering in browser
