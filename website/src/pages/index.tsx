import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type ModuleCard = {
  title: string;
  number: number;
  description: string;
  link: string;
  chapters: number;
  icon: string;
};

const modules: ModuleCard[] = [
  {
    title: 'ROS 2 Fundamentals',
    number: 1,
    description:
      'Master the Robot Operating System 2 — nodes, topics, services, actions, URDF, and TF2 transforms for building modular robot software.',
    link: '/docs/module-1-ros2/ros2-architecture',
    chapters: 5,
    icon: '\u{1F916}',
  },
  {
    title: 'Digital Twin Simulation',
    number: 2,
    description:
      'Build and test robots in Gazebo and Unity before deploying to real hardware. Physics engines, sensors, and end-to-end digital twin pipelines.',
    link: '/docs/module-2-simulation/gazebo-basics',
    chapters: 4,
    icon: '\u{1F30D}',
  },
  {
    title: 'NVIDIA Isaac Platform',
    number: 3,
    description:
      'Harness GPU-accelerated perception, reinforcement learning with Isaac Gym, and sim-to-real transfer on Jetson edge devices.',
    link: '/docs/module-3-isaac/isaac-sdk-setup',
    chapters: 4,
    icon: '\u{1F9E0}',
  },
  {
    title: 'VLA Robotics',
    number: 4,
    description:
      'Integrate vision, language, and action — from Whisper voice commands to LLM task planning and Vision-Language-Action models.',
    link: '/docs/module-4-vla/conversational-robotics',
    chapters: 4,
    icon: '\u{1F5E3}',
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/">
            Start Learning
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/schedule"
            style={{marginLeft: '1rem'}}>
            13-Week Schedule
          </Link>
        </div>
      </div>
    </header>
  );
}

function ModuleCardComponent({title, number, description, link, chapters, icon}: ModuleCard) {
  return (
    <div className={clsx('col col--6')} style={{marginBottom: '1.5rem'}}>
      <div className={styles.moduleCard}>
        <div className={styles.moduleHeader}>
          <span className={styles.moduleIcon}>{icon}</span>
          <span className={styles.moduleNumber}>Module {number}</span>
        </div>
        <Heading as="h3" style={{marginTop: '0.5rem'}}>
          <Link to={link} className={styles.moduleLink}>
            {title}
          </Link>
        </Heading>
        <p>{description}</p>
        <div className={styles.moduleFooter}>
          <span>{chapters} chapters</span>
          <Link to={link} className="button button--primary button--sm">
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
}

function ModulesSection() {
  return (
    <section className={styles.modules}>
      <div className="container">
        <Heading as="h2" className="text--center" style={{marginBottom: '2rem'}}>
          Four Modules, One Complete Robotics Engineer
        </Heading>
        <div className="row">
          {modules.map((mod) => (
            <ModuleCardComponent key={mod.number} {...mod} />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickLinks() {
  return (
    <section className={styles.quickLinks}>
      <div className="container">
        <div className="row">
          <div className="col col--4 text--center">
            <Heading as="h3">Capstone Project</Heading>
            <p>
              Integrate all four modules to build an autonomous humanoid robot
              with voice commands and object manipulation.
            </p>
            <Link to="/docs/capstone/overview" className="button button--outline button--primary">
              View Capstone
            </Link>
          </div>
          <div className="col col--4 text--center">
            <Heading as="h3">Hardware Guides</Heading>
            <p>
              Setup guides for Jetson Orin Nano edge kits and supported robot
              platforms with step-by-step instructions.
            </p>
            <Link to="/docs/hardware/jetson-orin-nano" className="button button--outline button--primary">
              Hardware Setup
            </Link>
          </div>
          <div className="col col--4 text--center">
            <Heading as="h3">AI Chatbot</Heading>
            <p>
              Ask questions about any chapter. The AI chatbot uses RAG to
              provide accurate answers with citations.
            </p>
            <Link to="/docs/" className="button button--outline button--primary">
              Try the Chatbot
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="An AI-Native Textbook for Physical AI & Humanoid Robotics — ROS 2, simulation, NVIDIA Isaac, and Vision-Language-Action models.">
      <HomepageHeader />
      <main>
        <ModulesSection />
        <QuickLinks />
      </main>
    </Layout>
  );
}
