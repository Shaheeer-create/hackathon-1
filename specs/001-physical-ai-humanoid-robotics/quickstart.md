# Quickstart Guide: Physical AI & Humanoid Robotics Book

## Overview

This guide will help you get started with the Physical AI & Humanoid Robotics book project. This project is a comprehensive Docusaurus-based book covering ROS 2 architecture, simulation environments (Gazebo/Unity), NVIDIA Isaac ecosystem, and Vision-Language-Action systems.

## Prerequisites

Before starting, ensure you have:

- **ROS 2 Humble Hawksbill** installed (with Python 3.11)
- **Gazebo Garden** for physics simulation
- **Docker** for containerized environments (optional but recommended)
- **Node.js 18+** for Docusaurus documentation
- **Git** for version control
- **Python 3.11+** for ROS 2 nodes
- **OpenAI API key** for LLM integration (optional for core functionality)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/physical-ai-books.git
cd physical-ai-books
```

### 2. Install Docusaurus Dependencies

```bash
cd physical-ai-books
npm install
```

### 3. Set up ROS 2 Environment

```bash
# Source ROS 2 setup (adjust path based on your installation)
source /opt/ros/humble/setup.bash

# Create a workspace for the project
mkdir -p ~/physical_ai_ws/src
cd ~/physical_ai_ws
colcon build
source install/setup.bash
```

### 4. Install Simulation Dependencies

For Gazebo:
```bash
# On Ubuntu
sudo apt install ros-humble-gazebo-*
```

For Unity (optional):
- Download Unity Hub and Unity 2023.2+ LTS
- Install the ROS-TCP-Endpoint package for ROS communication

### 5. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# OpenAI API key for LLM integration (optional)
OPENAI_API_KEY=your_api_key_here

# ROS Domain ID (to avoid conflicts)
ROS_DOMAIN_ID=42

# Gazebo settings
GAZEBO_MODEL_PATH=$GAZEBO_MODEL_PATH:~/physical_ai_ws/src/physical_ai_models
```

## Running the Documentation

To start the Docusaurus documentation server:

```bash
cd physical-ai-books
npm start
```

This will start the documentation site at `http://localhost:3000`.

## Running the Simulation

### 1. Launch the Basic Robot Simulation

```bash
cd ~/physical_ai_ws
source install/setup.bash
ros2 launch physical_ai_examples basic_robot.launch.py
```

### 2. Launch the Gazebo Environment

```bash
cd ~/physical_ai_ws
source install/setup.bash
ros2 launch physical_ai_gazebo empty_world.launch.py
```

### 3. Launch the AI Integration Demo

```bash
cd ~/physical_ai_ws
source install/setup.bash
python3 src/physical_ai_examples/scripts/llm_command_interface.py
```

## Key Directories

- `docs/` - Docusaurus documentation source files
- `physical_ai_examples/` - Example ROS 2 packages
- `physical_ai_gazebo/` - Gazebo simulation configurations
- `physical_ai_models/` - Robot and environment models
- `specs/` - Project specifications and planning documents

## First Steps for New Users

1. **Read Module 1, Chapter 1** - Start with the ROS 2 architecture basics
2. **Run the basic publisher/subscriber example** - Verify your ROS 2 setup
3. **Launch the simple robot simulation** - Confirm your simulation environment works
4. **Try the voice command demo** - Experience the LLM integration

## Troubleshooting

### Common Issues

1. **ROS 2 nodes not communicating across terminals**:
   - Ensure you source the ROS setup in each terminal: `source /opt/ros/humble/setup.bash`
   - Check that `ROS_DOMAIN_ID` is the same across terminals

2. **Gazebo models not loading**:
   - Verify `GAZEBO_MODEL_PATH` includes your model directories
   - Check that model files have correct SDF/URDF format

3. **Docusaurus site not building**:
   - Run `npm install` to ensure dependencies are installed
   - Check for syntax errors in Markdown files

### Getting Help

- Check the specific module documentation for detailed troubleshooting
- Visit our community forum at [forum-url]
- File issues on GitHub at [repo-url]

## Next Steps

After completing the quickstart:

1. Proceed through the book modules in order
2. Complete the exercises in each chapter
3. Work on the capstone project integrating all concepts
4. Contribute back to the project by reporting issues or suggesting improvements