# Chapter 2: Gazebo Worlds & Physics

## Overview

Gazebo is a powerful 3D simulation environment that provides accurate physics simulation, realistic sensor models, and rendering capabilities. This chapter covers the fundamentals of creating and configuring Gazebo worlds, understanding the physics engine, and setting up realistic simulation environments for humanoid robots.

## Gazebo Architecture

Gazebo consists of several key components:

- **Physics Engine**: Handles collision detection, dynamics, and contact forces
- **Sensor System**: Simulates various types of sensors (cameras, LiDAR, IMU, etc.)
- **Rendering Engine**: Provides visual rendering for simulation
- **Plugin System**: Extensible architecture for custom functionality
- **Transport System**: Handles communication between components

## Creating Gazebo Worlds

A Gazebo world file is an XML file that defines the environment for simulation. Here's the basic structure:

```xml
<?xml version="1.0" ?>
<sdf version="1.7">
  <world name="my_world">
    <!-- World properties -->
    <physics type="ode">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1</real_time_factor>
      <real_time_update_rate>1000</real_time_update_rate>
    </physics>

    <!-- Gravity -->
    <gravity>0 0 -9.8</gravity>

    <!-- Models -->
    <include>
      <uri>model://ground_plane</uri>
    </include>

    <include>
      <uri>model://sun</uri>
    </include>

    <!-- Custom models can be added here -->
  </world>
</sdf>
```

## Physics Engines in Gazebo

Gazebo supports multiple physics engines:

### 1. ODE (Open Dynamics Engine)
- Default physics engine
- Good performance for most applications
- Supports rigid body dynamics

### 2. Bullet
- More robust collision detection
- Better for complex contact scenarios

### 3. Simbody
- Multibody dynamics
- Good for articulated systems

### 4. DART (Dynamic Animation and Robotics Toolkit)
- Advanced contact modeling
- Good for humanoid robots

## Physics Parameters

### Time Step Configuration
```xml
<physics type="ode">
  <max_step_size>0.001</max_step_size>  <!-- Simulation time step -->
  <real_time_factor>1</real_time_factor>  <!-- Real-time factor -->
  <real_time_update_rate>1000</real_time_update_rate>  <!-- Hz -->
</physics>
```

### Gravity
```xml
<gravity>0 0 -9.8</gravity>  <!-- Standard Earth gravity -->
```

### Solver Parameters
```xml
<physics type="ode">
  <ode>
    <solver>
      <type>quick</type>  <!-- or "world" -->
      <iters>10</iters>    <!-- Number of iterations -->
      <sor>1.3</sor>      <!-- Successive over-relaxation -->
    </solver>
    <constraints>
      <cfm>0.0</cfm>      <!-- Constraint force mixing -->
      <erp>0.2</erp>      <!-- Error reduction parameter -->
      <contact_max_correcting_vel>100.0</contact_max_correcting_vel>
      <contact_surface_layer>0.001</contact_surface_layer>
    </constraints>
  </ode>
</physics>
```

## Creating a Simple World for Humanoid Robotics

Here's a complete example of a Gazebo world file suitable for humanoid robot simulation:

```xml
<?xml version="1.0" ?>
<sdf version="1.7">
  <world name="humanoid_world">
    <!-- Physics -->
    <physics type="ode">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1</real_time_factor>
      <real_time_update_rate>1000</real_time_update_rate>
      <ode>
        <solver>
          <type>quick</type>
          <iters>10</iters>
          <sor>1.3</sor>
        </solver>
        <constraints>
          <cfm>0.0</cfm>
          <erp>0.2</erp>
          <contact_max_correcting_vel>100.0</contact_max_correcting_vel>
          <contact_surface_layer>0.001</contact_surface_layer>
        </constraints>
      </ode>
    </physics>

    <!-- Gravity -->
    <gravity>0 0 -9.8</gravity>

    <!-- Include standard models -->
    <include>
      <uri>model://ground_plane</uri>
    </include>

    <include>
      <uri>model://sun</uri>
    </include>

    <!-- Simple room with obstacles -->
    <model name="wall_1">
      <pose>0 5 1 0 0 0</pose>
      <link name="link">
        <collision name="collision">
          <geometry>
            <box>
              <size>10 0.2 2</size>
            </box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box>
              <size>10 0.2 2</size>
            </box>
          </geometry>
          <material>
            <ambient>0.5 0.5 0.5 1</ambient>
            <diffuse>0.8 0.8 0.8 1</diffuse>
          </material>
        </visual>
        <inertial>
          <mass>100</mass>
          <inertia>
            <ixx>1.0</ixx>
            <ixy>0.0</ixy>
            <ixz>0.0</ixz>
            <iyy>1.0</iyy>
            <iyz>0.0</iyz>
            <izz>1.0</izz>
          </inertia>
        </inertial>
      </link>
    </model>

    <!-- Simple box obstacle -->
    <model name="box_obstacle">
      <pose>-2 0 0.5 0 0 0</pose>
      <link name="link">
        <collision name="collision">
          <geometry>
            <box>
              <size>1 1 1</size>
            </box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box>
              <size>1 1 1</size>
            </box>
          </geometry>
          <material>
            <ambient>0.2 0.8 0.2 1</ambient>
            <diffuse>0.3 0.9 0.3 1</diffuse>
          </material>
        </visual>
        <inertial>
          <mass>5</mass>
          <inertia>
            <ixx>0.1667</ixx>
            <ixy>0.0</ixy>
            <ixz>0.0</ixz>
            <iyy>0.1667</iyy>
            <iyz>0.0</iyz>
            <izz>0.1667</izz>
          </inertia>
        </inertial>
      </link>
    </model>

    <!-- Add a simple humanoid robot (will be spawned separately) -->
  </world>
</sdf>
```

## Physics Properties for Humanoid Robots

### 1. Mass and Inertia
Accurate mass and inertia properties are crucial for realistic humanoid simulation:

```xml
<inertial>
  <mass>10.0</mass>
  <inertia>
    <ixx>0.4</ixx>
    <ixy>0.0</ixy>
    <ixz>0.0</ixz>
    <iyy>0.4</iyy>
    <iyz>0.0</iyz>
    <izz>0.2</izz>
  </inertia>
</inertial>
```

### 2. Friction
Proper friction values are essential for stable walking:

```xml
<collision name="collision">
  <surface>
    <friction>
      <ode>
        <mu>0.5</mu>    <!-- Primary friction coefficient -->
        <mu2>0.5</mu2>  <!-- Secondary friction coefficient -->
      </ode>
    </friction>
  </surface>
</collision>
```

### 3. Damping
Damping helps stabilize simulations:

```xml>
<collision name="collision">
  <surface>
    <bounce>
      <restitution_coefficient>0.01</restitution_coefficient>
      <threshold>100000</threshold>
    </bounce>
    <contact>
      <ode>
        <max_vel>100.0</max_vel>
        <min_depth>0.001</min_depth>
      </ode>
    </contact>
  </surface>
</collision>
```

## Gazebo Plugins for Humanoid Simulation

### 1. Joint Control Plugins
For controlling robot joints:

```xml
<gazebo>
  <plugin name="gazebo_ros_control" filename="libgazebo_ros_control.so">
    <robotNamespace>/humanoid_robot</robotNamespace>
    <robotSimType>gazebo_ros_control/DefaultRobotHWSim</robotSimType>
  </plugin>
</gazebo>
```

### 2. Sensor Plugins
For simulating various sensors:

```xml
<gazebo reference="camera_link">
  <sensor type="camera" name="camera1">
    <update_rate>30.0</update_rate>
    <camera name="head">
      <horizontal_fov>1.3962634</horizontal_fov>
      <image>
        <width>800</width>
        <height>600</height>
        <format>R8G8B8</format>
      </image>
      <clip>
        <near>0.02</near>
        <far>300</far>
      </clip>
    </camera>
    <plugin name="camera_controller" filename="libgazebo_ros_camera.so">
      <frame_name>camera_link</frame_name>
      <topic_name>image_raw</topic_name>
    </plugin>
  </sensor>
</gazebo>
```

## Launching Gazebo with Custom Worlds

To launch Gazebo with your custom world:

```bash
# Launch Gazebo with a specific world
gazebo --verbose /path/to/your/world.world

# Or using ROS 2 launch files
ros2 launch your_package your_launch_file.launch.py
```

Example launch file:
```python
from launch import LaunchDescription
from launch.actions import IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import PathJoinSubstitution
from launch_ros.actions import Node
from launch_ros.substitutions import FindPackageShare

def generate_launch_description():
    world_path = PathJoinSubstitution([
        FindPackageShare('your_package'),
        'worlds',
        'humanoid_world.world'
    ])

    return LaunchDescription([
        IncludeLaunchDescription(
            PythonLaunchDescriptionSource([
                FindPackageShare('gazebo_ros'),
                '/launch',
                'gazebo.launch.py'
            ]),
            launch_arguments={
                'world': world_path
            }.items()
        )
    ])
```

## Best Practices for Humanoid Simulation

### 1. Physics Tuning
- Start with default parameters and adjust gradually
- Use smaller time steps for more stability
- Balance real-time factor with simulation accuracy

### 2. Model Optimization
- Simplify collision geometries where possible
- Use appropriate mesh resolutions
- Balance visual quality with performance

### 3. Sensor Simulation
- Add realistic noise models to sensors
- Match sensor parameters to real hardware
- Consider computational cost of sensor simulation

### 4. Environment Design
- Create environments that match testing requirements
- Include appropriate obstacles and challenges
- Consider lighting conditions for vision sensors

## Troubleshooting Common Issues

### 1. Instability
- Reduce time step size
- Adjust solver parameters
- Check mass and inertia values

### 2. Penetration
- Increase constraint parameters
- Check collision geometries
- Verify model poses

### 3. Performance
- Simplify collision meshes
- Reduce update rates for sensors
- Limit the number of objects in the scene

## Summary

In this chapter, we've covered the fundamentals of Gazebo worlds and physics simulation. We've explored the structure of world files, physics parameters, and best practices for humanoid robot simulation. Understanding these concepts is crucial for creating realistic and stable simulation environments for humanoid robots. In the next chapter, we'll explore sensor simulation in detail.