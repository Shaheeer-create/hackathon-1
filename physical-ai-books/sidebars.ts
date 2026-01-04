import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Sidebar for the Physical AI & Humanoid Robotics book
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsible: true,
      collapsed: false,
      items: [
        'intro',
        {
          type: 'category',
          label: 'General Robotics Concepts',
          collapsible: true,
          collapsed: true,
          items: [
            'general-robotics/exercises',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Module 1: The Robotic Nervous System (ROS 2)',
      collapsible: true,
      collapsed: false,
      items: [
        'module-1-ros2/chapter-1-architecture',
        'module-1-ros2/chapter-2-dds',
        'module-1-ros2/chapter-3-controllers',
        'module-1-ros2/chapter-4-bridging-ai',
        'module-1-ros2/chapter-5-urdf',
        'module-1-ros2/chapter-6-kinematics',
        {
          type: 'category',
          label: 'Module 1 Exercises',
          collapsible: true,
          collapsed: true,
          items: [
            'module-1-ros2/exercises',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Module 2: The Digital Twin (Gazebo & Unity)',
      collapsible: true,
      collapsed: false,
      items: [
        'module-2-digital-twin/chapter-1-digital-twin-concepts',
        'module-2-digital-twin/chapter-2-gazebo-worlds',
        'module-2-digital-twin/chapter-3-sensor-simulation',
        'module-2-digital-twin/chapter-4-unity-rendering',
        'module-2-digital-twin/chapter-5-robot-interaction',
        'module-2-digital-twin/chapter-6-ros2-unity-integration',
        {
          type: 'category',
          label: 'Module 2 Exercises',
          collapsible: true,
          collapsed: true,
          items: [
            'module-2-digital-twin/exercises',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Module 3: The AI-Robot Brain (NVIDIA Isaac™)',
      collapsible: true,
      collapsed: false,
      items: [
        'module-3-ai-brain/chapter-1-isaac-ecosystem',
        'module-3-ai-brain/chapter-2-isaac-sim',
        'module-3-ai-brain/chapter-3-isaac-ros-acceleration',
        'module-3-ai-brain/chapter-4-vslam',
        'module-3-ai-brain/chapter-5-nav2-stack',
        'module-3-ai-brain/chapter-6-path-planning',
        {
          type: 'category',
          label: 'Module 3 Exercises',
          collapsible: true,
          collapsed: true,
          items: [
            'module-3-ai-brain/exercises',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action (VLA)',
      collapsible: true,
      collapsed: false,
      items: [
        'module-4-vla/chapter-1-vla-overview',
        'module-4-vla/chapter-2-voice-commands',
        'module-4-vla/chapter-3-llm-planning',
        'module-4-vla/chapter-4-language-to-actions',
        'module-4-vla/chapter-5-object-detection',
        'module-4-vla/chapter-6-safety-validation',
        {
          type: 'category',
          label: 'Module 4 Exercises',
          collapsible: true,
          collapsed: true,
          items: [
            'module-4-vla/exercises',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Capstone: Autonomous Humanoid',
      collapsible: true,
      collapsed: false,
      items: [
        'capstone-autonomous-humanoid/capstone-project',
        {
          type: 'category',
          label: 'Capstone Exercises',
          collapsible: true,
          collapsed: true,
          items: [
            'capstone-autonomous-humanoid/exercises',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Appendices',
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: 'link',
          label: 'Glossary',
          href: '/docs/glossary', // Assuming a glossary page exists or will be created
        },
        {
          type: 'link',
          label: 'Resources & References',
          href: '/docs/resources', // Assuming a resources page exists or will be created
        },
        {
          type: 'link',
          label: 'Troubleshooting',
          href: '/docs/troubleshooting', // Assuming a troubleshooting page exists or will be created
        },
      ],
    },
  ],
};

export default sidebars;
