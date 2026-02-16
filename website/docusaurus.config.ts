import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'An AI-Native Textbook for the Next Generation of Robotics Engineers',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://safdaralishah.github.io',
  baseUrl: '/hackathon01/',

  organizationName: 'safdaralishah',
  projectName: 'hackathon01',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/safdaralishah/hackathon01/tree/main/website/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en'],
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Physical AI Textbook',
      logo: {
        alt: 'Physical AI & Humanoid Robotics Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'textbookSidebar',
          position: 'left',
          label: 'Textbook',
        },
        {
          href: 'https://github.com/safdaralishah/hackathon01',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Modules',
          items: [
            {label: 'ROS 2 Fundamentals', to: '/docs/module-1-ros2/ros2-architecture'},
            {label: 'Digital Twin Simulation', to: '/docs/module-2-simulation/gazebo-basics'},
            {label: 'NVIDIA Isaac', to: '/docs/module-3-isaac/isaac-sdk-setup'},
            {label: 'VLA Robotics', to: '/docs/module-4-vla/conversational-robotics'},
          ],
        },
        {
          title: 'Resources',
          items: [
            {label: 'Capstone Project', to: '/docs/capstone/overview'},
            {label: 'Hardware Guides', to: '/docs/hardware/jetson-orin-nano'},
            {label: '13-Week Schedule', to: '/docs/schedule'},
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/safdaralishah/hackathon01',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics Textbook. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'python', 'yaml', 'xml', 'json'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
