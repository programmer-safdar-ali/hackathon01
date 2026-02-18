import type {ReactNode} from 'react';
import {useEffect} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {
  Layers,
  Globe,
  Microchip,
  BrainCircuit,
  Rocket,
  Box,
  Bot,
  Cpu,
  Zap,
  ArrowRight,
  ChevronRight,
  Database,
  Terminal,
} from 'lucide-react';

import styles from './index.module.css';

// ─── Data ──────────────────────────────────────────────────────────────────

type ModuleData = {
  number: number;
  blockId: string;
  title: string;
  description: string;
  link: string;
  chapters: number;
  accent: 'cyan' | 'purple';
  Icon: React.ComponentType<{size?: number; strokeWidth?: number}>;
  FooterIcon: React.ComponentType<{size?: number; strokeWidth?: number}>;
};

const modules: ModuleData[] = [
  {
    number: 1,
    blockId: 'BLOCK_01',
    title: 'ROS 2 Core Systems',
    description:
      'Master distributed messaging, node orchestration, and real-time TF2 kinematic solvers. The backbone of every robotic deployment.',
    link: '/docs/module-1-ros2/ros2-architecture',
    chapters: 5,
    accent: 'cyan',
    Icon: Layers,
    FooterIcon: Cpu,
  },
  {
    number: 2,
    blockId: 'BLOCK_02',
    title: 'Digital Twin Genesis',
    description:
      'Physics-aligned synthetic environments using Gazebo and Unity. High-fidelity data generation for deep reinforcement learning.',
    link: '/docs/module-2-simulation/gazebo-basics',
    chapters: 4,
    accent: 'purple',
    Icon: Globe,
    FooterIcon: Database,
  },
  {
    number: 3,
    blockId: 'BLOCK_03',
    title: 'Isaac Acceleration',
    description:
      'Hardware-accelerated perception and sim-to-real transfer learning optimized for edge-compute Jetson platforms.',
    link: '/docs/module-3-isaac/isaac-sdk-setup',
    chapters: 4,
    accent: 'cyan',
    Icon: Microchip,
    FooterIcon: Zap,
  },
  {
    number: 4,
    blockId: 'BLOCK_04',
    title: 'VLA Architectures',
    description:
      'Vision-Language-Action models for humanoid autonomy. Teaching machines to understand and act via natural language prompts.',
    link: '/docs/module-4-vla/conversational-robotics',
    chapters: 4,
    accent: 'purple',
    Icon: BrainCircuit,
    FooterIcon: Terminal,
  },
];

// ─── Hero Section ──────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <header className={styles.hero}>
      {/* Left column */}
      <div className={styles.heroContent}>
        <div className={styles.heroBadge}>
          <Zap size={10} strokeWidth={2.5} />
          <span>Protocol v2025 Active</span>
        </div>

        <h1 className={styles.heroTitle}>
          Physical AI<br />
          <span className={styles.heroGradient}>Robotics</span>
        </h1>

        <p className={styles.heroSubtitle}>
          The definitive neural-first textbook for engineering high-fidelity
          humanoid intelligence and mechanical embodiment.
        </p>

        <div className={styles.heroCtas}>
          <Link to="/docs/" className={styles.btnPrimary}>
            START LEARNING <Terminal size={16} strokeWidth={2} />
          </Link>
          <Link to="/docs/schedule" className={styles.btnSecondary}>
            13-WEEK SCHEDULE
          </Link>
        </div>
      </div>

      {/* Right column — robotic arm visual */}
      <div className={styles.heroVisual}>
        <div className={styles.heroVisualGlow} />
        <div className={styles.heroVisualCard}>
          {/* Cyber grid overlay */}
          <div className={styles.cyberGrid} />

          {/* Robotic arm SVG */}
          <svg
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.roboArm}
          >
            {/* Mechanical base */}
            <rect
              x="80" y="240" width="240" height="30" rx="2"
              fill="currentColor" fillOpacity="0.05"
              stroke="currentColor" strokeWidth="1"
            />
            <path
              d="M100 240 L120 200 H280 L300 240"
              stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"
            />
            {/* Joint 1 */}
            <circle cx="200" cy="180" r="35"
              stroke="currentColor" strokeWidth="1" strokeDasharray="10 5"
              className={styles.spinSlow}
            />
            <circle cx="200" cy="180" r="8" fill="currentColor" />
            {/* Arm segment */}
            <path
              d="M200 180 L280 100"
              stroke="currentColor" strokeWidth="12" strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M200 180 L280 100"
              stroke="white" strokeWidth="2" strokeLinecap="round"
              opacity="0.4"
            />
            {/* Joint 2 */}
            <circle cx="280" cy="100" r="25"
              stroke="currentColor" strokeWidth="1"
            />
            <circle cx="280" cy="100" r="6" fill="#a855f7" />
            {/* Gripper */}
            <path
              d="M280 100 L320 40"
              stroke="currentColor" strokeWidth="8" strokeLinecap="round"
            />
            <path
              d="M310 30 L340 50 M300 45 L330 65"
              stroke="#a855f7" strokeWidth="3" strokeLinecap="round"
            />
            {/* UI elements */}
            <rect x="40" y="40" width="80" height="4" rx="2"
              fill="currentColor" fillOpacity="0.3"
            />
            <rect x="40" y="50" width="50" height="4" rx="2"
              fill="currentColor" fillOpacity="0.1"
            />
            <circle cx="360" cy="220" r="3" fill="#a855f7"
              className={styles.pingDot}
            />
          </svg>

          {/* Status bar */}
          <div className={styles.statusBar}>
            <div className={styles.statusLeft}>
              <span className={styles.statusDot} />
              <span>Syncing Neural_Weights</span>
            </div>
            <div className={styles.statusRight}>
              <span className={styles.statusPill}>LRN: 0.001</span>
              <span className={styles.statusPill}>GPU: 98%</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Module Card ───────────────────────────────────────────────────────────

function ModuleCard({
  blockId, title, description, link, chapters, accent, Icon, FooterIcon,
}: ModuleData) {
  const isCyan = accent === 'cyan';
  return (
    <div className={`${styles.moduleCard} ${isCyan ? styles.moduleCardCyan : styles.moduleCardPurple}`}>
      <div className={styles.moduleCardGlow} />

      <div className={styles.moduleCardHeader}>
        <div className={`${styles.moduleIconWrap} ${isCyan ? styles.iconCyan : styles.iconPurple}`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <span className={`${styles.moduleBadge} ${isCyan ? styles.badgeCyan : styles.badgePurple}`}>
          {blockId}
        </span>
      </div>

      <h3 className={styles.moduleTitle}>{title}</h3>
      <p className={styles.moduleDesc}>{description}</p>

      <div className={`${styles.moduleCardFooter} ${isCyan ? styles.footerCyan : styles.footerPurple}`}>
        <div className={styles.moduleChapters}>
          <FooterIcon size={12} strokeWidth={2} />
          <span>{chapters} UNITS_DEPLOYED</span>
        </div>
        <Link to={link} className={styles.moduleExecute}>
          EXECUTE <ChevronRight size={14} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}

// ─── Modules Section ───────────────────────────────────────────────────────

function ModulesSection() {
  return (
    <section className={styles.modulesSection}>
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>// CORE_MODULES</p>
            <h2 className={styles.sectionTitle}>Integrated Pipeline</h2>
            <p className={styles.sectionSubtitle}>
              A multi-stage evolution from low-level sensory-motor control to
              high-level cognitive task execution.
            </p>
          </div>
          <Link to="/docs/" className={styles.viewAllLink}>
            VIEW_FULL_GRAPH <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>

        <div className={styles.modulesGrid}>
          {modules.map((mod) => (
            <ModuleCard key={mod.number} {...mod} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Quick Links Section ───────────────────────────────────────────────────

function QuickLinksSection() {
  const links = [
    {
      Icon: Rocket,
      accent: 'cyan' as const,
      title: 'Capstone Forge',
      description: 'Apply end-to-end VLA models to a physical humanoid chassis.',
      label: '// SYSTEM_MAP',
      to: '/docs/capstone/overview',
    },
    {
      Icon: Box,
      accent: 'cyan' as const,
      title: 'Hardware Matrix',
      description: 'Optimized setup for Jetson Orin Nano and supported robot platforms.',
      label: '// ASSET_MANIFEST',
      to: '/docs/hardware/jetson-orin-nano',
    },
    {
      Icon: Bot,
      accent: 'purple' as const,
      title: 'Neural Tutor',
      description: 'RAG-enhanced AI trained on the full curriculum for technical Q&A.',
      label: '// OPEN_LINK',
      to: '/docs/',
    },
  ];

  return (
    <section className={styles.quickLinks}>
      <div className={styles.quickLinksDots} />
      <div className={styles.sectionInner}>
        <div className={styles.quickLinksGrid}>
          {links.map(({Icon, accent, title, description, label, to}) => (
            <div key={title} className={styles.quickLinkItem}>
              <div className={`${styles.quickLinkIcon} ${accent === 'purple' ? styles.quickLinkIconPurple : styles.quickLinkIconCyan}`}>
                <Icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className={styles.quickLinkTitle}>{title}</h3>
              <p className={styles.quickLinkDesc}>{description}</p>
              <Link to={to} className={`${styles.quickLinkLabel} ${accent === 'purple' ? styles.quickLinkLabelPurple : ''}`}>
                {label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function Home(): ReactNode {
  useEffect(() => {
    document.body.classList.add('homepage-dark');
    return () => {
      document.body.classList.remove('homepage-dark');
    };
  }, []);

  return (
    <Layout
      title="Home"
      description="An AI-Native Textbook for Physical AI & Humanoid Robotics — ROS 2, simulation, NVIDIA Isaac, and Vision-Language-Action models.">
      <HeroSection />
      <main>
        <ModulesSection />
        <QuickLinksSection />
      </main>
    </Layout>
  );
}
