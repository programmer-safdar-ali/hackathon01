# Pages

## Home Page (`src/pages/index.tsx`)

### Dependency Tree:
```
src/pages/index.tsx
├── react (ReactNode)
├── clsx
├── @docusaurus/Link
├── @docusaurus/useDocusaurusContext
├── @theme/Layout
├── @theme/Heading
└── ./index.module.css
```

### Sections:
1. **HomepageHeader** — Hero banner with title, tagline, CTA buttons
2. **ModulesSection** — 2x2 grid of ModuleCard components
3. **QuickLinks** — 3-column quick links (Capstone, Hardware, AI Chatbot)

### Module Data:
```ts
const modules = [
  { title: 'ROS 2 Fundamentals', number: 1, chapters: 5, icon: '🤖',
    link: '/docs/module-1-ros2/ros2-architecture' },
  { title: 'Digital Twin Simulation', number: 2, chapters: 4, icon: '🌍',
    link: '/docs/module-2-simulation/gazebo-basics' },
  { title: 'NVIDIA Isaac Platform', number: 3, chapters: 4, icon: '🧠',
    link: '/docs/module-3-isaac/isaac-sdk-setup' },
  { title: 'VLA Robotics', number: 4, chapters: 4, icon: '🗣',
    link: '/docs/module-4-vla/conversational-robotics' },
]
```
