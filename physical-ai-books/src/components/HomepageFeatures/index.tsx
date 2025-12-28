import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'ROS 2 Architecture',
    description: (
      <>
        Learn the fundamentals of ROS 2, the middleware for your humanoid robotics system. Understand nodes, topics, services, and actions.
      </>
    ),
  },
  {
    title: 'Digital Twin Simulation',
    description: (
      <>
        Master Gazebo and Unity for creating digital twins of your robots. Test behaviors in simulation before real-world deployment.
      </>
    ),
  },
  {
    title: 'AI-Robot Brain',
    description: (
      <>
        Implement perception and navigation using NVIDIA Isaac. Leverage AI for advanced robot capabilities.
      </>
    ),
  },
  {
    title: 'Vision-Language-Action',
    description: (
      <>
        Connect LLMs to your robot for natural language interaction. Enable your robot to understand and execute complex commands.
      </>
    ),
  },
  {
    title: 'Autonomous Humanoid',
    description: (
      <>
        Build a complete autonomous humanoid system that integrates all modules into a cohesive whole.
      </>
    ),
  },
  {
    title: 'Real-World Applications',
    description: (
      <>
        Apply your knowledge to practical scenarios with our capstone project and real-world examples.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.featureCard)}>
      <div className={styles.featureContent}>
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}