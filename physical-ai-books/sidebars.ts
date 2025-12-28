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
      label: 'Introduction',
      items: ['intro'],
    },
    {
      type: 'category',
      label: 'Module 1: The Robotic Nervous System (ROS 2)',
      items: [
        'module-1-ros2/chapter-1-architecture',
        'module-1-ros2/chapter-2-dds',
        'module-1-ros2/chapter-3-controllers',
        'module-1-ros2/chapter-4-bridging-ai',
        'module-1-ros2/chapter-5-urdf',
        'module-1-ros2/chapter-6-kinematics',
        'module-1-ros2/exercises',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: The Digital Twin (Gazebo & Unity)',
      items: [
        'module-2-digital-twin/chapter-1-digital-twin-concepts',
        'module-2-digital-twin/chapter-2-gazebo-worlds',
        'module-2-digital-twin/chapter-3-sensor-simulation',
        'module-2-digital-twin/chapter-4-unity-rendering',
        'module-2-digital-twin/chapter-5-robot-interaction',
        'module-2-digital-twin/chapter-6-ros2-unity-integration',
        'module-2-digital-twin/exercises',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: The AI-Robot Brain (NVIDIA Isaac™)',
      items: [
        'module-3-ai-brain/chapter-1-isaac-ecosystem',
        'module-3-ai-brain/chapter-2-isaac-sim',
        'module-3-ai-brain/chapter-3-isaac-ros-acceleration',
        'module-3-ai-brain/chapter-4-vslam',
        'module-3-ai-brain/chapter-5-nav2-stack',
        'module-3-ai-brain/chapter-6-path-planning',
        'module-3-ai-brain/exercises',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action (VLA)',
      items: [
        'module-4-vla/chapter-1-vla-overview',
        'module-4-vla/chapter-2-voice-commands',
        'module-4-vla/chapter-3-llm-planning',
        'module-4-vla/chapter-4-language-to-actions',
        'module-4-vla/chapter-5-object-detection',
        'module-4-vla/chapter-6-safety-validation',
        'module-4-vla/exercises',
      ],
    },
    {
      type: 'category',
      label: 'Capstone: Autonomous Humanoid',
      items: [
        'capstone-autonomous-humanoid/capstone-project',
        'capstone-autonomous-humanoid/exercises',
      ],
    },
  ],
};

export default sidebars;
