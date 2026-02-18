# Layouts

## Docusaurus Default Layout
**Source:** `@theme/Layout` (Docusaurus built-in)
**Description:** Wraps all pages. Includes navbar and footer from docusaurus.config.ts.

### Navbar config:
```ts
navbar: {
  title: 'Physical AI Textbook',
  logo: { alt: 'Physical AI & Humanoid Robotics Logo', src: 'img/logo.svg' },
  items: [
    { type: 'docSidebar', sidebarId: 'textbookSidebar', position: 'left', label: 'Textbook' },
    { href: 'https://github.com/safdaralishah/hackathon01', label: 'GitHub', position: 'right' },
  ],
}
```

### Footer config:
```ts
footer: {
  style: 'dark',
  links: [
    {
      title: 'Modules',
      items: [
        { label: 'ROS 2 Fundamentals', to: '/docs/module-1-ros2/ros2-architecture' },
        { label: 'Digital Twin Simulation', to: '/docs/module-2-simulation/gazebo-basics' },
        { label: 'NVIDIA Isaac', to: '/docs/module-3-isaac/isaac-sdk-setup' },
        { label: 'VLA Robotics', to: '/docs/module-4-vla/conversational-robotics' },
      ],
    },
    {
      title: 'Resources',
      items: [
        { label: 'Capstone Project', to: '/docs/capstone/overview' },
        { label: 'Hardware Guides', to: '/docs/hardware/jetson-orin-nano' },
        { label: '13-Week Schedule', to: '/docs/schedule' },
      ],
    },
  ],
}
```
