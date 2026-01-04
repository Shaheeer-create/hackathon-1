import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <Heading as="h1" className={clsx('hero__title', styles.fadeInUp)}>
              {siteConfig.title}
            </Heading>
            <p className={clsx('hero__subtitle', styles.fadeInUp, styles.delay1)}>
              {siteConfig.tagline}
            </p>
            <div className={clsx(styles.buttons, styles.fadeInUp, styles.delay2)}>
              <Link
                className="button button--primary button--lg"
                to="/docs/intro">
                Get Started - 5min ⏱️
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="/docs/module-1-ros2/chapter-1-architecture">
                Start Learning
              </Link>
            </div>
          </div>
          <div className={clsx(styles.heroImage, styles.fadeIn, styles.delay1)}>
            <div className={styles.robotIllustration}>
              <div className={styles.robotArm}></div>
              <div className={styles.robotHead}></div>
              <div className={styles.robotBody}></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// New Skills Section Component
function SkillsSection() {
  const skills = [
    {
      title: 'ROS 2 Development',
      description: 'Master the Robot Operating System for building complex robotic applications',
      icon: '🤖'
    },
    {
      title: 'AI & Machine Learning',
      description: 'Integrate artificial intelligence to create smarter, autonomous robots',
      icon: '🧠'
    },
    {
      title: 'Simulation',
      description: 'Test and validate your robots in realistic simulated environments',
      icon: '🎮'
    },
    {
      title: 'Computer Vision',
      description: 'Enable robots to perceive and understand their environment',
      icon: '👁️'
    },
    {
      title: 'Navigation',
      description: 'Implement path planning and obstacle avoidance algorithms',
      icon: '🧭'
    },
    {
      title: 'Human-Robot Interaction',
      description: 'Design intuitive interfaces for seamless human-robot collaboration',
      icon: '🤝'
    }
  ];

  return (
    <section className={styles.skillsSection}>
      <div className="container">
        <Heading as="h2" className={styles.skillsTitle}>
          Core Robotics Skills
        </Heading>
        <p className={styles.skillsSubtitle}>
          Master the essential technologies powering the future of robotics
        </p>
        <div className={styles.skillsGrid}>
          {skills.map((skill, index) => (
            <div className={styles.skillCard} key={index}>
              <div className={styles.skillIcon}>{skill.icon}</div>
              <Heading as="h3" className={styles.skillTitle}>{skill.title}</Heading>
              <p className={styles.skillDescription}>{skill.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Building Autonomous Humanoid Robots with ROS 2, Simulation, and LLMs">
      <div className="fade-in">
        <HomepageHeader />
        <main>
          <SkillsSection />
        </main>
      </div>
    </Layout>
  );
}