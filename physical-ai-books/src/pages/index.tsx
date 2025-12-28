import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
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
            <div className={styles.robotIllustration}></div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Building Autonomous Humanoid Robots with ROS 2, Simulation, and LLMs">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}