# Module 3: The AI-Robot Brain (NVIDIA Isaac™) - Exercises

## Chapter 7: NVIDIA Isaac Ecosystem

### Exercise 7.1: Isaac ROS Installation and Setup
**Objective**: Install and verify the NVIDIA Isaac ROS packages on your system.

**Steps**:
1. Verify your system meets the prerequisites (CUDA-compatible GPU, ROS 2 Humble)
2. Install the Isaac ROS packages using apt
3. Verify installation by running a simple Isaac ROS component
4. Document any issues encountered during installation

**Deliverables**:
- Installation verification output
- List of prerequisites checked
- Any issues and their resolutions

### Exercise 7.2: Isaac Sim Environment Setup
**Objective**: Set up Isaac Sim and run a basic simulation.

**Steps**:
1. Install Isaac Sim following NVIDIA's documentation
2. Launch Isaac Sim and verify the basic environment
3. Load a simple robot model into the simulation
4. Document the system requirements and performance

**Deliverables**:
- Screenshots of Isaac Sim running
- Performance metrics
- List of system requirements

## Chapter 8: Isaac Sim & Synthetic Data

### Exercise 8.1: Creating Synthetic Dataset
**Objective**: Generate a synthetic dataset using Isaac Sim for a humanoid robot.

**Steps**:
1. Set up a scene with a humanoid robot and various objects
2. Configure sensors (camera, LiDAR, IMU) on the robot
3. Generate a dataset with different lighting conditions
4. Export the dataset in a standard format (e.g., COCO, KITTI)

**Deliverables**:
- Generated dataset
- Configuration files used
- Analysis of synthetic vs real data differences

### Exercise 8.2: Domain Randomization Implementation
**Objective**: Implement domain randomization techniques in Isaac Sim.

**Steps**:
1. Create a script to randomly vary lighting conditions
2. Implement texture randomization for objects
3. Add random occlusions and distractors
4. Evaluate the impact on model performance

**Deliverables**:
- Domain randomization script
- Performance comparison with/without randomization
- Analysis of transfer learning results

## Chapter 9: Isaac ROS Acceleration

### Exercise 9.1: GPU-Accelerated Perception Pipeline
**Objective**: Implement a GPU-accelerated perception pipeline using Isaac ROS packages.

**Steps**:
1. Set up a stereo camera system in simulation
2. Implement GPU-accelerated stereo processing
3. Compare performance with CPU-only implementation
4. Evaluate accuracy of the accelerated pipeline

**Deliverables**:
- Implementation code
- Performance benchmarks
- Accuracy evaluation results

### Exercise 9.2: Isaac ROS DNN Integration
**Objective**: Integrate Isaac ROS DNN packages for object detection.

**Steps**:
1. Set up Isaac ROS DNN packages
2. Implement object detection using TensorRT
3. Test with synthetic data from Isaac Sim
4. Evaluate detection accuracy and performance

**Deliverables**:
- Object detection implementation
- Performance metrics
- Accuracy evaluation on synthetic data

## Chapter 10: Visual SLAM (VSLAM)

### Exercise 10.1: Isaac ROS Visual SLAM Implementation
**Objective**: Implement visual SLAM using Isaac ROS packages.

**Steps**:
1. Configure Isaac ROS Visual SLAM node
2. Set up camera calibration
3. Test SLAM in a simulated environment
4. Evaluate trajectory accuracy

**Deliverables**:
- SLAM implementation
- Trajectory comparison with ground truth
- Performance analysis

### Exercise 10.2: Loop Closure Optimization
**Objective**: Implement and test loop closure in VSLAM.

**Steps**:
1. Enable loop closure in Isaac ROS VSLAM
2. Create a test environment with repeated paths
3. Evaluate loop closure detection and optimization
4. Analyze the impact on trajectory accuracy

**Deliverables**:
- Loop closure implementation
- Trajectory accuracy comparison
- Analysis of optimization results

## Chapter 11: Nav2 Navigation Stack

### Exercise 11.1: Nav2 Configuration for Humanoid Robot
**Objective**: Configure Nav2 for a humanoid robot with appropriate parameters.

**Steps**:
1. Create a Nav2 configuration for a humanoid robot
2. Set appropriate costmap parameters for humanoid size
3. Configure local and global planners for humanoid navigation
4. Test navigation in simulation

**Deliverables**:
- Nav2 configuration files
- Navigation test results
- Parameter tuning documentation

### Exercise 11.2: Custom Controller for Humanoid Locomotion
**Objective**: Implement a custom controller for humanoid-specific locomotion.

**Steps**:
1. Analyze humanoid locomotion requirements
2. Implement a custom controller plugin for Nav2
3. Test the controller with different terrain types
4. Evaluate stability and performance

**Deliverables**:
- Custom controller implementation
- Test results on different terrains
- Performance analysis

## Chapter 12: Path Planning for Humanoids

### Exercise 12.1: Footstep Planning Algorithm
**Objective**: Implement a footstep planning algorithm for humanoid navigation.

**Steps**:
1. Analyze the humanoid's kinematic constraints
2. Implement a footstep planning algorithm
3. Test the planner in various scenarios
4. Evaluate the stability of generated footsteps

**Deliverables**:
- Footstep planning implementation
- Test scenarios and results
- Stability analysis

### Exercise 12.2: Balance-Aware Path Optimization
**Objective**: Implement path optimization considering balance constraints.

**Steps**:
1. Define balance constraints for the humanoid
2. Implement path optimization with balance considerations
3. Test the optimized paths in simulation
4. Evaluate the trade-off between path efficiency and balance

**Deliverables**:
- Balance-aware path optimization implementation
- Comparison with standard path planning
- Trade-off analysis

## Solutions

### Solution to Exercise 7.1: Isaac ROS Installation and Setup

```bash
# Verify system prerequisites
nvidia-smi
nvcc --version

# Install Isaac ROS packages
sudo apt update
sudo apt install ros-humble-isaac-ros-* ros-humble-nitros-*

# Verify installation
ros2 pkg list | grep isaac
```

### Solution to Exercise 7.2: Isaac Sim Environment Setup

```python
# Example Python script to launch Isaac Sim programmatically
import omni
from omni.isaac.core import World
from omni.isaac.core.utils.stage import add_reference_to_stage

# Initialize Isaac Sim
config = {"headless": False}
world = World(**config)

# Add a simple robot
add_reference_to_stage(
    usd_path="path/to/humanoid.usd",
    prim_path="/World/Humanoid"
)

# Reset and step the world
world.reset()
for i in range(100):
    world.step(render=True)

# Cleanup
world.clear()
```

### Solution to Exercise 8.1: Creating Synthetic Dataset

```python
import omni
from omni.isaac.core import World
from omni.isaac.synthetic_utils import SyntheticDataHelper
import numpy as np
import cv2

class SyntheticDatasetGenerator:
    def __init__(self):
        self.world = World(stage_units_in_meters=1.0)
        self.sd_helper = SyntheticDataHelper()
        
    def generate_dataset(self, num_samples=1000):
        """Generate synthetic dataset with various conditions"""
        for i in range(num_samples):
            # Randomize environment conditions
            self.randomize_environment()
            
            # Capture data
            rgb_data = self.sd_helper.get_rgb_data()
            depth_data = self.sd_helper.get_depth_data()
            seg_data = self.sd_helper.get_segmentation_data()
            
            # Save data
            self.save_data_sample(i, rgb_data, depth_data, seg_data)
            
            # Step simulation
            self.world.step(render=False)
    
    def randomize_environment(self):
        """Randomize lighting, textures, and object positions"""
        # Randomize lighting
        # Randomize textures
        # Randomize object positions
        pass
    
    def save_data_sample(self, idx, rgb, depth, seg):
        """Save a data sample with annotations"""
        cv2.imwrite(f"rgb_{idx:06d}.png", rgb)
        np.save(f"depth_{idx:06d}.npy", depth)
        np.save(f"seg_{idx:06d}.npy", seg)

# Usage
generator = SyntheticDatasetGenerator()
generator.generate_dataset(1000)
```

### Solution to Exercise 9.1: GPU-Accelerated Perception Pipeline

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from isaac_ros_managed_nitros_bridge_interfaces.msg import ManagedNitrosBridge
import torch
import torchvision.transforms as transforms

class IsaacPerceptionPipeline(Node):
    def __init__(self):
        super().__init__('isaac_perception_pipeline')
        
        # Initialize GPU
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Create subscribers and publishers
        self.image_sub = self.create_subscription(
            Image,
            'input_image',
            self.image_callback,
            10
        )
        
        self.result_pub = self.create_publisher(
            Image,
            'output_result',
            10
        )
        
        # Initialize Isaac ROS DNN components
        self.initialize_dnn_components()
        
        self.get_logger().info('Isaac Perception Pipeline initialized')

    def initialize_dnn_components(self):
        """Initialize Isaac ROS DNN components"""
        # Load TensorRT engine
        # Configure input/output bindings
        pass

    def image_callback(self, msg):
        """Process incoming image with GPU acceleration"""
        # Convert ROS image to tensor
        # Run inference using Isaac ROS DNN
        # Publish results
        pass

def main(args=None):
    rclpy.init(args=args)
    node = IsaacPerceptionPipeline()
    
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Solution to Exercise 11.1: Nav2 Configuration for Humanoid Robot

```yaml
# config/humanoid_nav2_params.yaml
bt_navigator:
  ros__parameters:
    use_sim_time: True
    global_frame: map
    robot_base_frame: base_link
    odom_topic: /odom
    bt_loop_duration: 10
    default_server_timeout: 20
    enable_groot_monitoring: True
    enable_bt_monitoring: True
    interrupt_behavior: 1
    plugin_lib_names:
    - nav2_compute_path_to_pose_action_bt_node
    - nav2_follow_path_action_bt_node
    - nav2_back_up_action_bt_node
    - nav2_spin_action_bt_node
    - nav2_wait_action_bt_node
    - nav2_clear_costmap_service_bt_node
    - nav2_is_stuck_condition_bt_node
    - nav2_goal_reached_condition_bt_node
    - nav2_initial_pose_received_condition_bt_node
    - nav2_reinitialize_global_costmap_service_bt_node
    - nav2_transform_available_condition_bt_node

controller_server:
  ros__parameters:
    use_sim_time: True
    controller_frequency: 20.0
    min_x_velocity_threshold: 0.001
    min_y_velocity_threshold: 0.5
    min_theta_velocity_threshold: 0.001
    progress_checker_plugin: "progress_checker"
    goal_checker_plugin: "goal_checker"
    controller_plugins: ["FollowPath"]
    
    # Humanoid-specific controller parameters
    FollowPath:
      plugin: "nav2_regulated_pure_pursuit_controller::RegulatedPurePursuitController"
      desired_linear_vel: 0.2  # Slower for humanoid stability
      lookahead_dist: 0.6
      min_lookahead_dist: 0.3
      max_lookahead_dist: 0.9
      lookahead_time: 1.5
      rotate_to_heading_angular_vel: 0.4
      max_allowed_time_to_collision_up_to_carrot: 1.0
      carrot_dist: 0.5
      in_collision_zone_vel_scale: 0.1
      use_velocity_scaled_lookahead_dist: false
      min_approach_linear_velocity: 0.05
      approach_velocity_scaling_dist: 0.5
      wait_on_costmap_outside_bounds: true
      costmap_topic: "local_costmap/costmap_raw"
      footprint_topic: "local_costmap/published_footprint"
      velocity_scaling_topic: "scaled_max_vel"
      transform_tolerance: 0.3
      use_regulated_linear_velocity_scaling: true
      use_fixed_curvature_lookahead: false
      use_interpolation: true
      regulated_linear_scaling_min_radius: 0.9
      regulated_linear_scaling_min_speed: 0.25
      use_cost_regulated_linear_velocity_scaling: true
      cost_scaling_dist: 0.6
      cost_scaling_gain: 1.0
      inflation_cost_scaling_factor: 3.0
      replan_smoothing_range: 10
      use_smoothing: true
      tricycle_model: false
      cmd_header_frame: "odom"
```

### Solution to Exercise 12.1: Footstep Planning Algorithm

```python
import numpy as np
from scipy.spatial.distance import euclidean
from dataclasses import dataclass
from typing import List, Tuple

@dataclass
class FootStep:
    x: float
    y: float
    theta: float
    foot_type: str  # 'left' or 'right'
    step_time: float

class HumanoidFootstepPlanner:
    def __init__(self, step_length=0.3, step_width=0.2, max_step_height=0.15):
        self.step_length = step_length
        self.step_width = step_width
        self.max_step_height = max_step_height
        self.max_angular_change = np.pi / 4  # Max 45 degrees per step
        
        # Robot parameters
        self.leg_length = 0.8  # Length of leg segments
        self.com_height = 0.8  # Center of mass height
        
        # Balance parameters
        self.support_polygon_margin = 0.05  # Safety margin for support polygon
        self.zmp_tolerance = 0.05  # Tolerance for ZMP tracking

    def plan_footsteps(self, path: List[Tuple[float, float]], start_pose: Tuple[float, float, float]):
        """
        Plan footstep sequence from global path
        
        Args:
            path: List of (x, y) waypoints
            start_pose: Starting pose (x, y, theta)
        
        Returns:
            List of FootStep objects
        """
        footsteps = []
        
        # Start with initial foot positions based on start pose
        start_x, start_y, start_theta = start_pose
        
        # Initialize foot positions (assuming robot starts standing)
        left_foot_x = start_x - self.step_width/2 * np.sin(start_theta)
        left_foot_y = start_y + self.step_width/2 * np.cos(start_theta)
        left_foot_theta = start_theta
        
        right_foot_x = start_x + self.step_width/2 * np.sin(start_theta)
        right_foot_y = start_y - self.step_width/2 * np.cos(start_theta)
        right_foot_theta = start_theta
        
        # Add initial foot positions
        footsteps.append(FootStep(
            x=left_foot_x, y=left_foot_y, theta=left_foot_theta,
            foot_type='left', step_time=0.0
        ))
        footsteps.append(FootStep(
            x=right_foot_x, y=right_foot_y, theta=right_foot_theta,
            foot_type='right', step_time=0.0
        ))
        
        # Current state
        current_x, current_y, current_theta = start_pose
        current_left = (left_foot_x, left_foot_y, left_foot_theta)
        current_right = (right_foot_x, right_foot_y, right_foot_theta)
        
        # Determine which foot to move next (starting with right)
        move_left_next = False  # Start with moving right foot
        
        # Process path waypoints
        for i in range(len(path) - 1):
            target_x, target_y = path[i + 1]
            
            # Calculate desired step direction
            dx = target_x - current_x
            dy = target_y - current_y
            desired_theta = np.arctan2(dy, dx)
            
            # Calculate step magnitude
            step_distance = np.sqrt(dx**2 + dy**2)
            
            # Plan next step based on which foot should move
            if move_left_next:
                # Plan left foot step
                new_left_x, new_left_y, new_left_theta = self.plan_single_step(
                    current_left, current_right, desired_theta, step_distance
                )
                
                # Check if step is balanced
                if self.is_step_balanced(current_right, (new_left_x, new_left_y, new_left_theta)):
                    current_left = (new_left_x, new_left_y, new_left_theta)
                    step_time = len(footsteps) * 0.5  # Assume 0.5s per step
                    
                    footsteps.append(FootStep(
                        x=new_left_x, y=new_left_y, theta=new_left_theta,
                        foot_type='left', step_time=step_time
                    ))
                    
                    current_x, current_y = new_left_x, new_left_y
                    current_theta = new_left_theta
                    move_left_next = False  # Next move right foot
            else:
                # Plan right foot step
                new_right_x, new_right_y, new_right_theta = self.plan_single_step(
                    current_right, current_left, desired_theta, step_distance
                )
                
                # Check if step is balanced
                if self.is_step_balanced(current_left, (new_right_x, new_right_y, new_right_theta)):
                    current_right = (new_right_x, new_right_y, new_right_theta)
                    step_time = len(footsteps) * 0.5  # Assume 0.5s per step
                    
                    footsteps.append(FootStep(
                        x=new_right_x, y=new_right_y, theta=new_right_theta,
                        foot_type='right', step_time=step_time
                    ))
                    
                    current_x, current_y = new_right_x, new_right_y
                    current_theta = new_right_theta
                    move_left_next = True  # Next move left foot
        
        return footsteps

    def plan_single_step(self, moving_foot, supporting_foot, desired_direction, step_distance):
        """
        Plan a single step considering balance and kinematic constraints
        """
        supp_x, supp_y, supp_theta = supporting_foot
        move_x, move_y, move_theta = moving_foot
        
        # Calculate desired step position based on direction and distance
        step_x = supp_x + self.step_length * np.cos(desired_direction)
        step_y = supp_y + self.step_length * np.sin(desired_direction)
        
        # Adjust for step width (maintain appropriate lateral distance)
        # Perpendicular to the direction of movement
        perp_dx = -np.sin(desired_direction)
        perp_dy = np.cos(desired_direction)
        
        # Alternate sides for left/right feet
        if abs(move_x - supp_x) < self.step_width/2:  # If feet are close together
            # Move to appropriate side
            if "left" in str(moving_foot):  # This is a simplification
                step_x += self.step_width/2 * perp_dx
                step_y += self.step_width/2 * perp_dy
            else:
                step_x -= self.step_width/2 * perp_dx
                step_y -= self.step_width/2 * perp_dy
        
        # Limit angular change
        step_theta = np.clip(
            desired_direction, 
            move_theta - self.max_angular_change,
            move_theta + self.max_angular_change
        )
        
        # Ensure step is within kinematic reach
        max_reach = self.leg_length * 0.8  # Conservative reach limit
        dist_to_supp = np.sqrt((step_x - supp_x)**2 + (step_y - supp_y)**2)
        
        if dist_to_supp > max_reach:
            # Scale step to within reach
            scale_factor = max_reach / dist_to_supp
            step_x = supp_x + (step_x - supp_x) * scale_factor
            step_y = supp_y + (step_y - supp_y) * scale_factor
        
        return step_x, step_y, step_theta

    def is_step_balanced(self, supporting_foot, new_moving_foot):
        """
        Check if a step maintains balance
        """
        supp_x, supp_y, _ = supporting_foot
        new_x, new_y, _ = new_moving_foot
        
        # Calculate support polygon (simplified as line between feet)
        # In reality, this would be a more complex polygon
        support_min_x = min(supp_x, new_x) - self.support_polygon_margin
        support_max_x = max(supp_x, new_x) + self.support_polygon_margin
        support_min_y = min(supp_y, new_y) - self.support_polygon_margin
        support_max_y = max(supp_y, new_y) + self.support_polygon_margin
        
        # Calculate approximate CoM position (between feet)
        com_x = (supp_x + new_x) / 2
        com_y = (supp_y + new_y) / 2
        
        # Check if CoM is within support polygon
        is_balanced = (
            support_min_x <= com_x <= support_max_x and
            support_min_y <= com_y <= support_max_y
        )
        
        return is_balanced

# Example usage
planner = HumanoidFootstepPlanner()

# Define a simple path
path = [
    (0.0, 0.0),
    (1.0, 0.0),
    (2.0, 0.5),
    (3.0, 1.0),
    (4.0, 1.0)
]

# Starting pose
start_pose = (0.0, 0.0, 0.0)

# Plan footsteps
footsteps = planner.plan_footsteps(path, start_pose)

print(f"Planned {len(footsteps)} footsteps:")
for i, step in enumerate(footsteps):
    print(f"Step {i}: {step.foot_type} foot at ({step.x:.2f}, {step.y:.2f}, {step.theta:.2f})")
```

These exercises and solutions cover the key concepts from Modules 3 and 4, providing hands-on experience with Isaac ROS packages, VSLAM, Nav2 navigation, and humanoid-specific path planning. Each exercise includes practical implementation tasks with detailed solutions to help learners understand and apply the concepts effectively.