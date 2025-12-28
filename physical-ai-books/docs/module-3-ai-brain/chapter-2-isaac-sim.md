# Chapter 2: Isaac Sim & Synthetic Data

## Overview

Isaac Sim is NVIDIA's high-fidelity simulation environment built on the Omniverse platform, specifically designed for robotics development. This chapter explores Isaac Sim's capabilities for humanoid robotics simulation, synthetic data generation, and how to leverage these features for training AI models and validating robot behaviors.

## Introduction to Isaac Sim

Isaac Sim provides a comprehensive simulation environment that bridges the gap between virtual and real-world robotics. Key features include:

- **Photorealistic Rendering**: RTX-accelerated rendering for realistic sensor simulation
- **PhysX Physics Engine**: Accurate physics simulation with support for complex articulated systems
- **USD-Based Scene Composition**: Universal Scene Description for complex scene creation
- **Synthetic Data Generation**: Tools for generating large datasets for AI training
- **Robot Simulation**: Full support for complex humanoid robots with accurate dynamics
- **Multi-Sensor Simulation**: Cameras, LiDAR, IMU, force/torque sensors, and more

## Isaac Sim Architecture

### Omniverse Platform
Isaac Sim is built on NVIDIA's Omniverse platform, which provides:
- Real-time collaborative 3D design tools
- Physically accurate simulation
- High-fidelity rendering
- USD-based scene composition

### USD (Universal Scene Description)
USD is Pixar's scene description format that Isaac Sim uses for:
- Scene composition
- Asset interchange
- Layering and referencing
- Animation and simulation data

### PhysX Integration
The PhysX physics engine provides:
- Accurate collision detection
- Rigid and soft body dynamics
- Fluid simulation capabilities
- Vehicle dynamics
- Complex articulated systems

## Setting Up Isaac Sim for Humanoid Robotics

### Installation and Prerequisites

```bash
# Install Isaac Sim prerequisites
sudo apt update
sudo apt install -y omni-isaac-gym-py

# Or download from NVIDIA Developer website
# Requires NVIDIA GPU with RTX capabilities
```

### Basic Isaac Sim Configuration

```python
# Example configuration for Isaac Sim
import omni
from omni.isaac.core import World
from omni.isaac.core.utils.stage import add_reference_to_stage
from omni.isaac.core.utils.prims import get_prim_at_path
from omni.isaac.core.articulations import ArticulationView
from omni.isaac.core.utils.nucleus import get_assets_root_path
import carb

# Initialize Isaac Sim
omni.kit.OmniWorld.get_simulation_context().play()

# Create a world instance
world = World(stage_units_in_meters=1.0)

# Add a humanoid robot to the simulation
assets_root_path = get_assets_root_path()
if assets_root_path is None:
    carb.log_error("Could not find Isaac Sim assets folder")
else:
    # Add a humanoid robot (example path)
    add_reference_to_stage(
        usd_path=assets_root_path + "/Isaac/Robots/Humanoid/humanoid.usd",
        prim_path="/World/Humanoid"
    )

    # Set up the robot articulation
    world.scene.add(ArticulationView(prim_path="/World/Humanoid", name="humanoid_view"))

# Reset the world
world.reset()
```

## Creating Humanoid Robot Environments

### Environment Setup

```python
import omni
from omni.isaac.core import World
from omni.isaac.core.utils.stage import add_reference_to_stage
from omni.isaac.core.utils.prims import set_targets
from omni.isaac.core.utils.semantics import add_semantics
from pxr import UsdGeom, Gf
import numpy as np

class HumanoidEnvironment:
    def __init__(self):
        self.world = World(stage_units_in_meters=1.0)
        self.setup_environment()
        
    def setup_environment(self):
        # Add ground plane
        self.add_ground_plane()
        
        # Add humanoid robot
        self.add_humanoid_robot()
        
        # Add obstacles and objects
        self.add_environment_objects()
        
        # Add lighting
        self.add_lighting()
        
        # Add sensors
        self.add_sensors()
        
    def add_ground_plane(self):
        # Create a ground plane
        plane = UsdGeom.Mesh.Define(self.world.stage, "/World/GroundPlane")
        plane.CreatePointsAttr([(0, 0, 0), (10, 0, 0), (10, 0, 10), (0, 0, 10)])
        plane.CreateFaceVertexIndicesAttr([0, 1, 2, 3])
        plane.CreateFaceVertexCountsAttr([4])
        
        # Add collision
        plane.AddApi(UsdGeom.CollisionAPI)
        
    def add_humanoid_robot(self):
        # Add a humanoid robot to the scene
        # This would typically reference a pre-built humanoid model
        add_reference_to_stage(
            usd_path="/path/to/humanoid/model.usd",
            prim_path="/World/Humanoid"
        )
        
        # Set initial position
        from omni.isaac.core.utils.transforms import set_translate
        set_translate("/World/Humanoid", np.array([0.0, 0.0, 1.0]))
        
    def add_environment_objects(self):
        # Add various objects for the humanoid to interact with
        # Tables, chairs, boxes, etc.
        pass
        
    def add_lighting(self):
        # Add dome light for realistic illumination
        from omni.isaac.core.utils.prims import create_prim
        create_prim(
            prim_path="/World/DomeLight",
            prim_type="DomeLight",
            position=np.array([0, 0, 0]),
            attributes={"color": (0.2, 0.2, 0.2), "intensity": 3000}
        )
        
    def add_sensors(self):
        # Add various sensors to the humanoid
        # Cameras, IMU, LiDAR, etc.
        pass

# Example usage
env = HumanoidEnvironment()
```

## Synthetic Data Generation

### Generating Training Data

Isaac Sim excels at generating synthetic training data for AI models:

```python
import omni
from omni.isaac.core import World
from omni.isaac.synthetic_utils import SyntheticDataHelper
from PIL import Image
import numpy as np
import os

class SyntheticDataGenerator:
    def __init__(self, output_dir="synthetic_data"):
        self.world = World(stage_units_in_meters=1.0)
        self.output_dir = output_dir
        self.synthetic_helper = SyntheticDataHelper()
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(os.path.join(output_dir, "images"), exist_ok=True)
        os.makedirs(os.path.join(output_dir, "labels"), exist_ok=True)
        
    def generate_dataset(self, num_samples=1000):
        """Generate synthetic dataset with images and labels"""
        
        for i in range(num_samples):
            # Randomize environment
            self.randomize_environment()
            
            # Step simulation
            self.world.step(render=True)
            
            # Capture RGB image
            rgb_image = self.capture_rgb_image()
            
            # Capture semantic segmentation
            semantic_labels = self.capture_semantic_labels()
            
            # Capture depth image
            depth_image = self.capture_depth_image()
            
            # Save data
            self.save_sample(i, rgb_image, semantic_labels, depth_image)
            
            print(f"Generated sample {i+1}/{num_samples}")
    
    def randomize_environment(self):
        """Randomize environment parameters for domain randomization"""
        # Randomize lighting
        light_prim = self.world.scene.get_object("DomeLight")
        if light_prim:
            # Randomize light intensity and color
            new_intensity = np.random.uniform(1000, 5000)
            new_color = (
                np.random.uniform(0.8, 1.0),
                np.random.uniform(0.8, 1.0),
                np.random.uniform(0.8, 1.0)
            )
            # Apply new lighting parameters
            
        # Randomize object positions
        # Randomize textures and materials
        # Randomize camera positions
        
    def capture_rgb_image(self):
        """Capture RGB image from camera"""
        # This would interface with Isaac Sim's rendering pipeline
        # Return RGB image as numpy array
        pass
        
    def capture_semantic_labels(self):
        """Capture semantic segmentation labels"""
        # This would interface with Isaac Sim's semantic labeling system
        # Return semantic labels as numpy array
        pass
        
    def capture_depth_image(self):
        """Capture depth image"""
        # This would interface with Isaac Sim's depth rendering
        # Return depth image as numpy array
        pass
        
    def save_sample(self, idx, rgb_img, semantic_labels, depth_img):
        """Save a sample with its annotations"""
        # Save RGB image
        img_path = os.path.join(self.output_dir, "images", f"sample_{idx:06d}.png")
        Image.fromarray(rgb_img).save(img_path)
        
        # Save semantic labels
        label_path = os.path.join(self.output_dir, "labels", f"labels_{idx:06d}.npy")
        np.save(label_path, semantic_labels)
        
        # Save depth image
        depth_path = os.path.join(self.output_dir, "labels", f"depth_{idx:06d}.npy")
        np.save(depth_path, depth_img)

# Example usage
generator = SyntheticDataGenerator()
generator.generate_dataset(num_samples=100)
```

### Domain Randomization

Domain randomization helps transfer learning from simulation to reality:

```python
import random
import numpy as np

class DomainRandomizer:
    def __init__(self):
        self.randomization_params = {
            'lighting': {
                'intensity_range': (1000, 5000),
                'color_variance': 0.2,
            },
            'materials': {
                'roughness_range': (0.1, 0.9),
                'metallic_range': (0.0, 0.5),
            },
            'textures': {
                'scale_range': (0.5, 2.0),
                'rotation_range': (0, 360),
            },
            'objects': {
                'position_jitter': 0.1,
                'rotation_jitter': 5.0,  # degrees
            },
            'camera': {
                'position_jitter': 0.05,
                'rotation_jitter': 2.0,  # degrees
            }
        }
    
    def randomize_lighting(self, light_prim):
        """Randomize lighting parameters"""
        intensity = random.uniform(
            self.randomization_params['lighting']['intensity_range'][0],
            self.randomization_params['lighting']['intensity_range'][1]
        )
        
        color_variance = self.randomization_params['lighting']['color_variance']
        color = (
            max(0.0, min(1.0, 1.0 + random.uniform(-color_variance, color_variance))),
            max(0.0, min(1.0, 1.0 + random.uniform(-color_variance, color_variance))),
            max(0.0, min(1.0, 1.0 + random.uniform(-color_variance, color_variance)))
        )
        
        # Apply randomized parameters to light
        # light_prim.set_intensity(intensity)
        # light_prim.set_color(color)
    
    def randomize_materials(self, material_prims):
        """Randomize material properties"""
        for material_prim in material_prims:
            roughness = random.uniform(
                self.randomization_params['materials']['roughness_range'][0],
                self.randomization_params['materials']['roughness_range'][1]
            )
            
            metallic = random.uniform(
                self.randomization_params['materials']['metallic_range'][0],
                self.randomization_params['materials']['metallic_range'][1]
            )
            
            # Apply randomized material properties
            # material_prim.set_roughness(roughness)
            # material_prim.set_metallic(metallic)
    
    def randomize_textures(self, texture_prims):
        """Randomize texture properties"""
        for texture_prim in texture_prims:
            scale = random.uniform(
                self.randomization_params['textures']['scale_range'][0],
                self.randomization_params['textures']['scale_range'][1]
            )
            
            rotation = random.uniform(
                self.randomization_params['textures']['rotation_range'][0],
                self.randomization_params['textures']['rotation_range'][1]
            )
            
            # Apply randomized texture properties
            # texture_prim.set_scale(scale)
            # texture_prim.set_rotation(rotation)
    
    def randomize_objects(self, object_prims):
        """Randomize object positions and orientations"""
        for object_prim in object_prims:
            pos_offset = np.array([
                random.uniform(-self.randomization_params['objects']['position_jitter'], 
                              self.randomization_params['objects']['position_jitter']),
                random.uniform(-self.randomization_params['objects']['position_jitter'], 
                              self.randomization_params['objects']['position_jitter']),
                random.uniform(-self.randomization_params['objects']['position_jitter']/2, 
                              self.randomization_params['objects']['position_jitter']/2)
            ])
            
            rot_offset = np.array([
                random.uniform(-self.randomization_params['objects']['rotation_jitter'], 
                              self.randomization_params['objects']['rotation_jitter']),
                random.uniform(-self.randomization_params['objects']['rotation_jitter'], 
                              self.randomization_params['objects']['rotation_jitter']),
                random.uniform(-self.randomization_params['objects']['rotation_jitter'], 
                              self.randomization_params['objects']['rotation_jitter'])
            ])
            
            # Apply randomized transforms
            # current_pos = object_prim.get_position()
            # object_prim.set_position(current_pos + pos_offset)
            #
            # current_rot = object_prim.get_orientation()
            # object_prim.set_orientation(current_rot + np.deg2rad(rot_offset))
    
    def randomize_camera(self, camera_prim):
        """Randomize camera parameters"""
        pos_offset = np.array([
            random.uniform(-self.randomization_params['camera']['position_jitter'], 
                          self.randomization_params['camera']['position_jitter']),
            random.uniform(-self.randomization_params['camera']['position_jitter'], 
                          self.randomization_params['camera']['position_jitter']),
            random.uniform(-self.randomization_params['camera']['position_jitter'], 
                          self.randomization_params['camera']['position_jitter'])
        ])
        
        rot_offset = np.array([
            random.uniform(-self.randomization_params['camera']['rotation_jitter'], 
                          self.randomization_params['camera']['rotation_jitter']),
            random.uniform(-self.randomization_params['camera']['rotation_jitter'], 
                          self.randomization_params['camera']['rotation_jitter']),
            random.uniform(-self.randomization_params['camera']['rotation_jitter'], 
                          self.randomization_params['camera']['rotation_jitter'])
        ])
        
        # Apply randomized camera parameters
        # current_pos = camera_prim.get_position()
        # camera_prim.set_position(current_pos + pos_offset)
        #
        # current_rot = camera_prim.get_orientation()
        # camera_prim.set_orientation(current_rot + np.deg2rad(rot_offset))

# Example usage
randomizer = DomainRandomizer()
# randomizer.randomize_lighting(light_prim)
# randomizer.randomize_materials(material_prims)
# randomizer.randomize_objects(object_prims)
```

## Isaac Sim Sensors for Humanoid Robots

### Camera Simulation

```python
from omni.isaac.sensor import Camera
import numpy as np

class HumanoidCameraSystem:
    def __init__(self, robot_prim_path):
        self.robot_prim_path = robot_prim_path
        self.cameras = {}
        
    def add_head_camera(self):
        """Add a camera to the robot's head"""
        camera_path = f"{self.robot_prim_path}/HeadCamera"
        
        # Create camera
        camera = Camera(
            prim_path=camera_path,
            frequency=30,
            resolution=(640, 480)
        )
        
        # Set camera properties
        camera.set_focal_length(24.0)  # mm
        camera.set_horizontal_aperture(20.955)  # mm
        camera.set_vertical_aperture(15.29)  # mm
        
        # Position camera at head
        camera.set_translation(np.array([0.1, 0.0, 0.05]))  # 10cm forward, 5cm up from head
        
        self.cameras['head'] = camera
        return camera
    
    def add_eye_cameras(self):
        """Add stereo cameras to simulate eyes"""
        # Left eye
        left_camera_path = f"{self.robot_prim_path}/LeftEyeCamera"
        left_camera = Camera(
            prim_path=left_camera_path,
            frequency=30,
            resolution=(640, 480)
        )
        
        # Position left camera
        left_camera.set_translation(np.array([0.08, 0.05, 0.1]))  # 8cm forward, 5cm left, 10cm up
        
        # Right eye
        right_camera_path = f"{self.robot_prim_path}/RightEyeCamera"
        right_camera = Camera(
            prim_path=right_camera_path,
            frequency=30,
            resolution=(640, 480)
        )
        
        # Position right camera
        right_camera.set_translation(np.array([0.08, -0.05, 0.1]))  # 8cm forward, 5cm right, 10cm up
        
        self.cameras['left_eye'] = left_camera
        self.cameras['right_eye'] = right_camera
        
        return left_camera, right_camera
    
    def get_camera_data(self, camera_name):
        """Get data from a specific camera"""
        if camera_name in self.cameras:
            camera = self.cameras[camera_name]
            rgb_data = camera.get_rgb()
            depth_data = camera.get_depth()
            seg_data = camera.get_semantic_segmentation()
            
            return {
                'rgb': rgb_data,
                'depth': depth_data,
                'segmentation': seg_data
            }
        else:
            return None

# Example usage
camera_system = HumanoidCameraSystem("/World/Humanoid")
head_camera = camera_system.add_head_camera()
left_eye, right_eye = camera_system.add_eye_cameras()
```

### LiDAR Simulation

```python
from omni.isaac.sensor import RotatingLidarSensor
import numpy as np

class HumanoidLidarSystem:
    def __init__(self, robot_prim_path):
        self.robot_prim_path = robot_prim_path
        self.lidars = {}
        
    def add_head_lidar(self):
        """Add a LiDAR to the robot's head"""
        lidar_path = f"{self.robot_prim_path}/HeadLidar"
        
        # Create LiDAR sensor
        lidar = RotatingLidarSensor(
            prim_path=lidar_path,
            translation=np.array([0.0, 0.0, 0.15]),  # 15cm above head
            orientation=np.array([0.0, 0.0, 0.0, 1.0]),  # No rotation
            sensor_period=0.1,  # 10Hz
            samples_per_scan=720,  # 0.5 degree resolution
            max_range=25.0,
            vertical_samples=64,
            vertical_fov=30.0,
            rotation_frequency=10.0,  # 10 rotations per second
        )
        
        self.lidars['head'] = lidar
        return lidar
    
    def get_lidar_data(self, lidar_name):
        """Get data from a specific LiDAR"""
        if lidar_name in self.lidars:
            lidar = self.lidars[lidar_name]
            return lidar.get_linear_depth_data()
        else:
            return None

# Example usage
lidar_system = HumanoidLidarSystem("/World/Humanoid")
head_lidar = lidar_system.add_head_lidar()
```

### IMU Simulation

```python
from omni.isaac.core.sensors import IMU
import numpy as np

class HumanoidIMUMount:
    def __init__(self, robot_prim_path):
        self.robot_prim_path = robot_prim_path
        self.imus = {}
        
    def add_torso_imu(self):
        """Add IMU to the robot's torso"""
        imu_path = f"{self.robot_prim_path}/TorsoIMU"
        
        # Create IMU sensor
        imu = IMU(
            prim_path=imu_path,
            frequency=100,  # 100Hz
            translation=np.array([0.0, 0.0, 0.0])  # Center of torso
        )
        
        self.imus['torso'] = imu
        return imu
    
    def add_head_imu(self):
        """Add IMU to the robot's head"""
        imu_path = f"{self.robot_prim_path}/HeadIMU"
        
        # Create IMU sensor
        imu = IMU(
            prim_path=imu_path,
            frequency=100,  # 100Hz
            translation=np.array([0.0, 0.0, 0.1])  # Top of head
        )
        
        self.imus['head'] = imu
        return imu
    
    def get_imu_data(self, imu_name):
        """Get data from a specific IMU"""
        if imu_name in self.imus:
            imu = self.imus[imu_name]
            linear_acceleration = imu.get_linear_acceleration()
            angular_velocity = imu.get_angular_velocity()
            orientation = imu.get_orientation()
            
            return {
                'linear_acceleration': linear_acceleration,
                'angular_velocity': angular_velocity,
                'orientation': orientation
            }
        else:
            return None

# Example usage
imu_mount = HumanoidIMUMount("/World/Humanoid")
torso_imu = imu_mount.add_torso_imu()
head_imu = imu_mount.add_head_imu()
```

## Isaac Sim for RL Training

### Reinforcement Learning Environment

```python
import torch
import omni
from omni.isaac.core import World
from omni.isaac.core.utils.stage import add_reference_to_stage
from omni.isaac.core.articulations import ArticulationView
from omni.isaac.core.utils.nucleus import get_assets_root_path
from rl_games.common.player import BasePlayer
from rl_games.algos_torch import torch_ext
import numpy as np

class IsaacHumanoidEnv:
    def __init__(self, num_envs=1024, device="cuda"):
        self.num_envs = num_envs
        self.device = device
        
        # Initialize Isaac Sim world
        self.world = World(stage_units_in_meters=1.0)
        
        # Setup environments
        self.setup_environments()
        
        # Initialize RL parameters
        self.observation_space = self.get_observation_space()
        self.action_space = self.get_action_space()
        
    def setup_environments(self):
        """Setup multiple environments for parallel training"""
        assets_root_path = get_assets_root_path()
        
        if assets_root_path is None:
            raise Exception("Could not find Isaac Sim assets folder")
        
        # Create multiple humanoid robot instances
        self.humanoid_views = []
        
        for i in range(self.num_envs):
            # Define unique prim path for each environment
            env_path = f"/World/envs/env_{i}"
            humanoid_path = f"{env_path}/Humanoid"
            
            # Add humanoid to this environment
            add_reference_to_stage(
                usd_path=assets_root_path + "/Isaac/Robots/Humanoid/humanoid.usd",
                prim_path=humanoid_path
            )
            
            # Create articulation view for this humanoid
            humanoid_view = ArticulationView(prim_path=humanoid_path, name=f"humanoid_view_{i}")
            self.world.scene.add(humanoid_view)
            self.humanoid_views.append(humanoid_view)
        
        # Reset the world to initialize all environments
        self.world.reset()
    
    def get_observation_space(self):
        """Define observation space for the humanoid"""
        # Observation includes:
        # - Joint positions (21 joints)
        # - Joint velocities (21 joints)
        # - Body positions (13 bodies)
        # - Body rotations (13 bodies)
        # - Body velocities (13 bodies)
        # - Body angular velocities (13 bodies)
        # - Commands (e.g., target velocity)
        obs_dim = 21*2 + 13*3 + 13*4 + 13*3 + 13*3 + 3  # 133 dimensions
        return obs_dim
    
    def get_action_space(self):
        """Define action space for the humanoid"""
        # Action space corresponds to joint torques for 21 actuated joints
        return 21
    
    def reset(self):
        """Reset all environments"""
        # Reset robot poses to initial configuration
        for humanoid_view in self.humanoid_views:
            # Reset joint positions to default
            default_positions = humanoid_view.get_joint_positions()
            humanoid_view.set_joint_positions(default_positions)
            
            # Reset joint velocities to zero
            zero_velocities = torch.zeros_like(humanoid_view.get_joint_velocities())
            humanoid_view.set_joint_velocities(zero_velocities)
        
        # Step the world to apply resets
        self.world.step(render=False)
        
        # Return initial observations
        return self.get_observations()
    
    def step(self, actions):
        """Execute actions in all environments"""
        # Apply actions to all humanoid robots
        for i, humanoid_view in enumerate(self.humanoid_views):
            # Convert actions to joint torques
            torques = actions[i]
            humanoid_view.set_applied_torques(torques)
        
        # Step the simulation
        self.world.step(render=False)
        
        # Get observations, rewards, dones, and info
        obs = self.get_observations()
        rew = self.compute_rewards()
        done = self.check_termination()
        info = self.get_extras()
        
        return obs, rew, done, info
    
    def get_observations(self):
        """Get observations from all environments"""
        obs_list = []
        
        for humanoid_view in self.humanoid_views:
            # Get joint positions and velocities
            joint_pos = humanoid_view.get_joint_positions()
            joint_vel = humanoid_view.get_joint_velocities()
            
            # Get body positions, rotations, velocities, and angular velocities
            body_pos = humanoid_view.get_body_positions()
            body_rot = humanoid_view.get_body_rotations()
            body_vel = humanoid_view.get_body_linear_velocities()
            body_ang_vel = humanoid_view.get_body_angular_velocities()
            
            # Concatenate all observations
            obs = torch.cat([
                joint_pos.flatten(),
                joint_vel.flatten(),
                body_pos.flatten(),
                body_rot.flatten(),
                body_vel.flatten(),
                body_ang_vel.flatten(),
                # Add command (e.g., target velocity)
                torch.tensor([0.5, 0.0, 0.0], device=self.device)  # Target forward velocity
            ])
            
            obs_list.append(obs)
        
        return torch.stack(obs_list)
    
    def compute_rewards(self):
        """Compute rewards for all environments"""
        # Compute reward based on forward velocity, stability, etc.
        rewards = torch.zeros(self.num_envs, device=self.device)
        
        for i, humanoid_view in enumerate(self.humanoid_views):
            # Example reward computation
            # Reward forward movement
            body_vel = humanoid_view.get_body_linear_velocities()
            forward_vel = body_vel[:, 0]  # X-axis velocity
            
            # Penalize excessive energy consumption
            joint_vel = humanoid_view.get_joint_velocities()
            energy_penalty = torch.sum(torch.abs(joint_vel), dim=1)
            
            # Reward stability (penalize falling)
            base_pos = humanoid_view.get_body_positions()[:, 2]  # Z-axis position (height)
            height_reward = torch.clamp(base_pos - 0.8, 0.0, 1.0)  # Reward staying above 0.8m
            
            # Combine rewards
            rewards[i] = 2.0 * forward_vel - 0.01 * energy_penalty + 1.0 * height_reward
        
        return rewards
    
    def check_termination(self):
        """Check if episodes are terminated"""
        dones = torch.zeros(self.num_envs, dtype=torch.bool, device=self.device)
        
        for i, humanoid_view in enumerate(self.humanoid_views):
            # Check if humanoid fell down
            base_pos = humanoid_view.get_body_positions()[0, 2]  # Height of base link
            if base_pos < 0.5:  # Fell below 0.5m
                dones[i] = True
        
        return dones
    
    def get_extras(self):
        """Get extra information"""
        extras = {}
        return extras

# Example usage for RL training
def train_humanoid_policy():
    # Initialize environment
    env = IsaacHumanoidEnv(num_envs=1024, device="cuda")
    
    # Initialize RL agent (example with a simple random agent)
    for episode in range(1000):
        obs = env.reset()
        
        for step in range(500):  # 500 steps per episode
            # Random actions for demonstration
            actions = torch.randn(env.num_envs, env.action_space, device=env.device)
            
            # Execute step
            obs, rew, done, info = env.step(actions)
            
            # Print average reward
            avg_reward = torch.mean(rew).item()
            print(f"Step {step}, Average Reward: {avg_reward:.2f}")
        
        print(f"Episode {episode} completed")

# Uncomment to run training
# train_humanoid_policy()
```

## Best Practices for Isaac Sim

### 1. Performance Optimization
- Use appropriate level-of-detail (LOD) models
- Optimize scene complexity
- Use efficient rendering settings
- Batch operations when possible

### 2. Realism vs Performance
- Balance visual fidelity with simulation speed
- Use domain randomization to bridge reality gap
- Validate simulation results with physical experiments

### 3. Data Quality
- Ensure proper lighting and shadows
- Use high-resolution textures
- Verify sensor accuracy
- Include diverse scenarios

### 4. Validation
- Compare simulation results with real-world data
- Test edge cases in simulation
- Validate physics parameters
- Ensure consistent behavior across platforms

## Troubleshooting Common Issues

### 1. Performance Issues
- Reduce scene complexity
- Lower rendering resolution
- Simplify collision meshes
- Use fewer environments in parallel

### 2. Physics Instabilities
- Adjust solver parameters
- Verify mass and inertia properties
- Check joint limits and damping
- Reduce simulation timestep

### 3. Sensor Inaccuracies
- Verify sensor parameters match real hardware
- Check coordinate system conversions
- Validate calibration parameters
- Compare with real sensor data

## Summary

In this chapter, we've explored Isaac Sim's capabilities for humanoid robotics simulation and synthetic data generation. We've covered environment setup, sensor simulation, domain randomization techniques, and reinforcement learning integration. Isaac Sim provides powerful tools for developing and testing humanoid robots in a safe, controllable virtual environment. In the next chapter, we'll explore Isaac ROS acceleration packages that enhance perception and navigation capabilities.