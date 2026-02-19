import type {ReactNode} from 'react';
import {useEffect, useState, useRef} from 'react';
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
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

import styles from './index.module.css';

// ─── Terminal Decode Animation ─────────────────────────────────────────────

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%[]<>{}|=+~?';

interface CharState {
  target: string;
  display: string;
  weight: number;
  resolved: boolean;
  scanning: boolean;
}

const INIT_DELAY    = 400;  // ms before animation starts
const CHAR_STAGGER  = 52;   // ms between each char starting
const SCRAMBLE_N    = 7;    // how many random glyphs before settling
const SCRAMBLE_MS   = 28;   // ms between each scramble frame

function TerminalHeroTitle() {
  const LINES = ['PHYSICAL', 'AI &', 'ROBOTICS'];

  // Build flat array skipping newlines (we handle line breaks structurally)
  const allChars = LINES.flatMap((line, li) =>
    line.split('').map((c) => ({ char: c, line: li }))
  );

  const [states, setStates] = useState<CharState[]>(() =>
    allChars.map(({char}) => ({
      target:   char,
      display:  char === ' ' ? '\u00A0' : '\u00A0',
      weight:   100,
      resolved: false,
      scanning: false,
    }))
  );

  const [cursorOn, setCursorOn] = useState(true);
  const [showCursor, setShowCursor] = useState(false);
  const timerIds = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const ids = timerIds.current;
    let nonSpaceIdx = 0;

    allChars.forEach(({char}, i) => {
      const delay = INIT_DELAY + nonSpaceIdx * CHAR_STAGGER;
      nonSpaceIdx++;

      // Begin scanning
      ids.push(setTimeout(() => {
        setStates(prev => {
          const next = [...prev];
          next[i] = { ...next[i], scanning: true };
          return next;
        });
      }, delay));

      // Scramble frames
      for (let r = 0; r < SCRAMBLE_N; r++) {
        ids.push(setTimeout(() => {
          setStates(prev => {
            if (prev[i].resolved) return prev;
            const next = [...prev];
            const rndChar = char === ' '
              ? '\u00A0'
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            next[i] = {
              ...prev[i],
              display: rndChar,
              weight: 100 + Math.round((r / (SCRAMBLE_N - 1)) * 700),
            };
            return next;
          });
        }, delay + r * SCRAMBLE_MS));
      }

      // Resolve to real character
      ids.push(setTimeout(() => {
        setStates(prev => {
          const next = [...prev];
          next[i] = {
            target:   char,
            display:  char === ' ' ? '\u00A0' : char,
            weight:   800,
            resolved: true,
            scanning: false,
          };
          return next;
        });
      }, delay + SCRAMBLE_N * SCRAMBLE_MS));
    });

    // Show cursor after all chars resolve
    const totalMs = INIT_DELAY + (allChars.length - 1) * CHAR_STAGGER + SCRAMBLE_N * SCRAMBLE_MS + 300;
    ids.push(setTimeout(() => setShowCursor(true), totalMs));

    return () => ids.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cursor blink
  useEffect(() => {
    const t = setInterval(() => setCursorOn(v => !v), 530);
    return () => clearInterval(t);
  }, []);

  // Group states back into lines
  const lineGroups: CharState[][] = [[], [], []];
  allChars.forEach(({line}, i) => lineGroups[line].push(states[i]));

  return (
    <h1 className={styles.heroTitle}>
      {lineGroups.map((chars, li) => (
        <span key={li} className={styles.heroTitleLine}>
          {chars.map((s, ci) => (
            <span
              key={ci}
              className={`${styles.heroTitleChar} ${s.resolved ? styles.heroTitleCharResolved : ''} ${s.scanning ? styles.heroTitleCharScanning : ''}`}
              style={{fontVariationSettings: `'wght' ${s.weight}`}}
            >
              {s.display}
            </span>
          ))}
        </span>
      ))}
      {showCursor && (
        <span className={styles.terminalCursor} style={{opacity: cursorOn ? 1 : 0}}>█</span>
      )}
    </h1>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────

type ModuleData = {
  number: number;
  blockId: string;
  title: string;
  description: string;
  link: string;
  chapters: number;
  Icon: React.ComponentType<{size?: number; strokeWidth?: number}>;
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
    Icon: Layers,
  },
  {
    number: 2,
    blockId: 'BLOCK_02',
    title: 'Digital Twin Genesis',
    description:
      'Physics-aligned synthetic environments using Gazebo and Unity. High-fidelity data generation for deep reinforcement learning.',
    link: '/docs/module-2-simulation/gazebo-basics',
    chapters: 4,
    Icon: Globe,
  },
  {
    number: 3,
    blockId: 'BLOCK_03',
    title: 'Isaac Acceleration',
    description:
      'Hardware-accelerated perception and sim-to-real transfer learning optimized for edge-compute Jetson platforms.',
    link: '/docs/module-3-isaac/isaac-sdk-setup',
    chapters: 4,
    Icon: Microchip,
  },
  {
    number: 4,
    blockId: 'BLOCK_04',
    title: 'VLA Architectures',
    description:
      'Vision-Language-Action models for humanoid autonomy. Teaching machines to understand and act via natural language prompts.',
    link: '/docs/module-4-vla/conversational-robotics',
    chapters: 4,
    Icon: BrainCircuit,
  },
];

// ─── Hero Section ──────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        {/* Left: Typography */}
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            <span>PROTOCOL v2025 // ONLINE</span>
          </div>

          <TerminalHeroTitle />

          <div className={styles.heroRule} />

          <p className={styles.heroSubtitle}>
            The definitive engineering textbook for humanoid intelligence
            and mechanical embodiment — from ROS 2 to VLA architectures.
          </p>

          <div className={styles.heroCtas}>
            <Link to="/docs/" className={styles.btnPrimary}>
              INITIATE LEARNING <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
            <Link to="/docs/schedule" className={styles.btnGhost}>
              13-WEEK CURRICULUM
            </Link>
          </div>
        </div>

        {/* Right: Technical Humanoid Schematic */}
        <div className={styles.heroRight}>
          <div className={styles.heroSchematic}>
            <div className={styles.scanLine} />

            <svg
              viewBox="0 0 340 460"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.schematicSvg}
            >
              <defs>
                <marker
                  id="arrowAmber"
                  viewBox="0 0 8 8"
                  refX="4"
                  refY="4"
                  markerWidth="4"
                  markerHeight="4"
                  orient="auto-start-reverse"
                >
                  <path d="M0 0 L8 4 L0 8z" fill="#F97316" fillOpacity="0.5" />
                </marker>
              </defs>

              {/* === HUMANOID SCHEMATIC === */}

              {/* Head */}
              <rect x="125" y="24" width="90" height="80" rx="8"
                stroke="#F97316" strokeWidth="1.25" strokeOpacity="0.75" />
              {/* Head centerline */}
              <line x1="170" y1="24" x2="170" y2="104"
                stroke="#F97316" strokeWidth="0.5" strokeOpacity="0.2"
                strokeDasharray="5 4" />
              {/* Eye sensors */}
              <circle cx="152" cy="60" r="10"
                stroke="#F97316" strokeWidth="1" strokeOpacity="0.65" />
              <circle cx="188" cy="60" r="10"
                stroke="#F97316" strokeWidth="1" strokeOpacity="0.65" />
              <circle cx="152" cy="60" r="3.5"
                fill="#F97316" fillOpacity="0.8" />
              <circle cx="188" cy="60" r="3.5"
                fill="#F97316" fillOpacity="0.8" />
              {/* Head top detail */}
              <rect x="145" y="18" width="50" height="8" rx="2"
                stroke="#F97316" strokeWidth="0.75" strokeOpacity="0.4" />

              {/* Neck */}
              <rect x="150" y="104" width="40" height="22" rx="2"
                stroke="#F97316" strokeWidth="0.9" strokeOpacity="0.55" />

              {/* Torso */}
              <rect x="104" y="126" width="132" height="140" rx="6"
                stroke="#F97316" strokeWidth="1.25" strokeOpacity="0.75" />
              {/* Torso horizontal divider */}
              <line x1="104" y1="180" x2="236" y2="180"
                stroke="#F97316" strokeWidth="0.6" strokeOpacity="0.2"
                strokeDasharray="4 4" />
              {/* Chest panels */}
              <rect x="118" y="140" width="46" height="34" rx="4"
                stroke="#F97316" strokeWidth="0.75" strokeOpacity="0.45" />
              <rect x="176" y="140" width="46" height="34" rx="4"
                stroke="#F97316" strokeWidth="0.75" strokeOpacity="0.45" />
              {/* Core reactor */}
              <rect x="148" y="192" width="44" height="36" rx="4"
                stroke="#F97316" strokeWidth="1" strokeOpacity="0.55" />
              <line x1="158" y1="210" x2="182" y2="210"
                stroke="#F97316" strokeWidth="2" strokeOpacity="0.9" strokeLinecap="round" />
              <circle cx="170" cy="210" r="5"
                stroke="#F97316" strokeWidth="1" strokeOpacity="0.6" />
              {/* Torso side ports */}
              <rect x="104" y="145" width="6" height="20" rx="1"
                fill="#F97316" fillOpacity="0.15" stroke="#F97316" strokeWidth="0.5" strokeOpacity="0.4" />
              <rect x="230" y="145" width="6" height="20" rx="1"
                fill="#F97316" fillOpacity="0.15" stroke="#F97316" strokeWidth="0.5" strokeOpacity="0.4" />

              {/* Pelvis */}
              <rect x="116" y="266" width="108" height="28" rx="4"
                stroke="#F97316" strokeWidth="1" strokeOpacity="0.6" />
              {/* Pelvis centerline */}
              <line x1="170" y1="266" x2="170" y2="294"
                stroke="#F97316" strokeWidth="0.5" strokeOpacity="0.2" />

              {/* Left Arm */}
              <rect x="64" y="132" width="36" height="116" rx="16"
                stroke="#F97316" strokeWidth="1.1" strokeOpacity="0.65" />
              <circle cx="82" cy="196" r="12"
                stroke="#F97316" strokeWidth="0.75" strokeOpacity="0.45" />
              {/* Left forearm detail */}
              <rect x="68" y="208" width="12" height="30"
                stroke="#F97316" strokeWidth="0.5" strokeOpacity="0.3" />
              {/* Left Hand */}
              <rect x="66" y="252" width="32" height="44" rx="10"
                stroke="#F97316" strokeWidth="0.9" strokeOpacity="0.55" />

              {/* Right Arm */}
              <rect x="240" y="132" width="36" height="116" rx="16"
                stroke="#F97316" strokeWidth="1.1" strokeOpacity="0.65" />
              <circle cx="258" cy="196" r="12"
                stroke="#F97316" strokeWidth="0.75" strokeOpacity="0.45" />
              {/* Right forearm detail */}
              <rect x="260" y="208" width="12" height="30"
                stroke="#F97316" strokeWidth="0.5" strokeOpacity="0.3" />
              {/* Right Hand */}
              <rect x="242" y="252" width="32" height="44" rx="10"
                stroke="#F97316" strokeWidth="0.9" strokeOpacity="0.55" />

              {/* Left Leg */}
              <rect x="120" y="294" width="44" height="128" rx="6"
                stroke="#F97316" strokeWidth="1.15" strokeOpacity="0.7" />
              <circle cx="142" cy="360" r="14"
                stroke="#F97316" strokeWidth="0.75" strokeOpacity="0.45" />
              {/* Left Foot */}
              <rect x="113" y="422" width="58" height="22" rx="7"
                stroke="#F97316" strokeWidth="0.9" strokeOpacity="0.55" />

              {/* Right Leg */}
              <rect x="176" y="294" width="44" height="128" rx="6"
                stroke="#F97316" strokeWidth="1.15" strokeOpacity="0.7" />
              <circle cx="198" cy="360" r="14"
                stroke="#F97316" strokeWidth="0.75" strokeOpacity="0.45" />
              {/* Right Foot */}
              <rect x="169" y="422" width="58" height="22" rx="7"
                stroke="#F97316" strokeWidth="0.9" strokeOpacity="0.55" />

              {/* === DIMENSION LINES === */}

              {/* Total height */}
              <line x1="38" y1="18" x2="38" y2="444"
                stroke="#F97316" strokeWidth="0.6" strokeOpacity="0.35"
                markerStart="url(#arrowAmber)" markerEnd="url(#arrowAmber)" />
              <line x1="33" y1="18" x2="125" y2="18"
                stroke="#F97316" strokeWidth="0.4" strokeOpacity="0.2" />
              <line x1="33" y1="444" x2="113" y2="444"
                stroke="#F97316" strokeWidth="0.4" strokeOpacity="0.2" />

              {/* Total width */}
              <line x1="64" y1="454" x2="276" y2="454"
                stroke="#F97316" strokeWidth="0.6" strokeOpacity="0.35"
                markerStart="url(#arrowAmber)" markerEnd="url(#arrowAmber)" />

              {/* === DIMENSION LABELS === */}
              <text x="22" y="234"
                fill="#F97316" fillOpacity="0.5"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="7.5"
                textAnchor="middle"
                writingMode="vertical-rl">
                1,800 mm
              </text>
              <text x="170" y="464"
                fill="#F97316" fillOpacity="0.5"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="7.5"
                textAnchor="middle">
                620 mm
              </text>

              {/* === CALLOUT LINES (right side) === */}
              <line x1="215" y1="64" x2="256" y2="64"
                stroke="#F97316" strokeWidth="0.6" strokeOpacity="0.4" />
              <text x="259" y="66.5"
                fill="#F97316" fillOpacity="0.6"
                fontFamily="IBM Plex Mono, monospace" fontSize="6.5">
                VISION_SYS
              </text>

              <line x1="236" y1="155" x2="260" y2="155"
                stroke="#F97316" strokeWidth="0.6" strokeOpacity="0.4" />
              <text x="263" y="157.5"
                fill="#F97316" fillOpacity="0.6"
                fontFamily="IBM Plex Mono, monospace" fontSize="6.5">
                ACTUATOR
              </text>

              <line x1="192" y1="210" x2="260" y2="210"
                stroke="#F97316" strokeWidth="0.6" strokeOpacity="0.4" />
              <text x="263" y="212.5"
                fill="#F97316" fillOpacity="0.6"
                fontFamily="IBM Plex Mono, monospace" fontSize="6.5">
                CORE_PWR
              </text>

              <line x1="220" y1="305" x2="260" y2="305"
                stroke="#F97316" strokeWidth="0.6" strokeOpacity="0.4" />
              <text x="263" y="307.5"
                fill="#F97316" fillOpacity="0.6"
                fontFamily="IBM Plex Mono, monospace" fontSize="6.5">
                MOBILITY
              </text>

              {/* Cross-hair center mark */}
              <line x1="165" y1="240" x2="175" y2="240"
                stroke="#F97316" strokeWidth="0.6" strokeOpacity="0.4" />
              <line x1="170" y1="235" x2="170" y2="245"
                stroke="#F97316" strokeWidth="0.6" strokeOpacity="0.4" />
              <circle cx="170" cy="240" r="3"
                stroke="#F97316" strokeWidth="0.5" strokeOpacity="0.35" />

              {/* Top-left technical text */}
              <text x="8" y="16"
                fill="#F97316" fillOpacity="0.35"
                fontFamily="IBM Plex Mono, monospace" fontSize="6">
                REV_04 // HMD-2025
              </text>
              <text x="8" y="26"
                fill="#F97316" fillOpacity="0.25"
                fontFamily="IBM Plex Mono, monospace" fontSize="5.5">
                BIPEDAL UNIT
              </text>
            </svg>

            <div className={styles.schematicLabel}>
              <span>HUMANOID-CLASS BIPEDAL // SCHEMATIC_VIEW</span>
              <span>
                SYS: ONLINE <span className={styles.schematicBlink}>■</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        {[
          {value: '4',   label: 'Core Modules'},
          {value: '17',  label: 'Chapters'},
          {value: '13',  label: 'Week Program'},
          {value: 'RAG', label: 'AI Tutor Engine'},
        ].map(({value, label}) => (
          <div key={label} className={styles.statItem}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>
    </header>
  );
}

// ─── Module Card ───────────────────────────────────────────────────────────

function ModuleCard({number, blockId, title, description, link, chapters, Icon}: ModuleData) {
  return (
    <div className={styles.moduleCard}>
      <div className={styles.moduleCardAccent} />
      <span className={styles.moduleCardBg}>{String(number).padStart(2, '0')}</span>

      <div className={styles.moduleCardTop}>
        <div className={styles.moduleIconWrap}>
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <span className={styles.moduleBadge}>{blockId}</span>
      </div>

      <h3 className={styles.moduleTitle}>{title}</h3>
      <p className={styles.moduleDesc}>{description}</p>

      <div className={styles.moduleCardFooter}>
        <div className={styles.moduleUnits}>
          <span>{chapters} UNITS DEPLOYED</span>
        </div>
        <Link to={link} className={styles.moduleEnter}>
          ENTER MODULE <ChevronRight size={12} strokeWidth={2.5} />
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
        <div className={styles.modulesHeader}>
          <div>
            <p className={styles.modulesMeta}>// CORE_SYSTEMS</p>
            <h2 className={styles.modulesTitle}>INTEGRATED<br />PIPELINE</h2>
            <p className={styles.modulesSubtitle}>
              A multi-stage evolution from low-level sensory-motor control to
              high-level cognitive task execution.
            </p>
          </div>
          <Link to="/docs/" className={styles.viewAllLink}>
            VIEW FULL CURRICULUM <ArrowRight size={14} strokeWidth={2} />
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
  const items = [
    {
      num: '01',
      Icon: Rocket,
      title: 'Capstone Forge',
      description: 'Apply end-to-end VLA models to a physical humanoid chassis. Build your capstone project from real hardware and trained policies.',
      label: '// OPEN PROJECT BRIEF',
      to: '/docs/capstone/overview',
    },
    {
      num: '02',
      Icon: Box,
      title: 'Hardware Matrix',
      description: 'Optimized setup for Jetson Orin Nano and supported robot platforms. From flashing firmware to running ROS 2 in minutes.',
      label: '// VIEW MANIFEST',
      to: '/docs/hardware/jetson-orin-nano',
    },
    {
      num: '03',
      Icon: Bot,
      title: 'Neural Tutor',
      description: 'RAG-enhanced AI trained on the full curriculum. Ask technical questions and receive citations from module chapters.',
      label: '// OPEN TUTOR',
      to: '/docs/',
    },
  ];

  return (
    <section className={styles.quickLinks}>
      <div className={styles.sectionInner}>
        <h2 className={styles.quickLinksTitle}>RESOURCES</h2>
        <div className={styles.quickLinksGrid}>
          {items.map(({num, Icon, title, description, label, to}) => (
            <div key={title} className={styles.quickLinkItem}>
              <div className={styles.quickLinkNum}>{num}</div>
              <div className={styles.quickLinkIconWrap}>
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <h3 className={styles.quickLinkTitle}>{title}</h3>
              <p className={styles.quickLinkDesc}>{description}</p>
              <Link to={to} className={styles.quickLinkAction}>
                {label} <ArrowRight size={11} strokeWidth={2} />
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
