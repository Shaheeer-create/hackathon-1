# Module 3: The AI Brain - Exercises and Solutions

## Exercise 1: Isaac ROS Package Implementation

### Problem Statement
Implement a complete Isaac ROS pipeline that processes RGB-D data to detect and localize objects in 3D space. The pipeline should:
1. Subscribe to synchronized RGB and depth image streams
2. Perform object detection on the RGB image
3. Map 2D detections to 3D world coordinates using depth information
4. Publish 3D object poses as ROS messages
5. Include GPU acceleration for all processing steps

### Solution

```python
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, HistoryPolicy
from sensor_msgs.msg import Image, CameraInfo
from geometry_msgs.msg import PointStamped, PoseStamped
from vision_msgs.msg import Detection2DArray, ObjectHypothesisWithPose
from std_msgs.msg import Header
from cv_bridge import CvBridge
import cv2
import numpy as np
import torch
import torchvision.transforms as transforms
from message_filters import ApproximateTimeSynchronizer, Subscriber

class IsaacObjectDetectionNode(Node):
    def __init__(self):
        super().__init__('isaac_object_detection_node')
        
        # Initialize CV bridge
        self.cv_bridge = CvBridge()
        
        # Initialize YOLO model (using TorchVision's pre-trained model as example)
        self.model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
        self.model.eval()
        
        # Check for GPU availability
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        
        # Camera parameters (will be populated from camera_info)
        self.camera_matrix = None
        self.distortion_coeffs = None
        self.camera_info_received = False
        
        # Create QoS profile for image synchronization
        qos_profile = QoSProfile(
            reliability=ReliabilityPolicy.BEST_EFFORT,
            history=HistoryPolicy.KEEP_LAST,
            depth=1
        )
        
        # Create synchronized subscribers for RGB and depth images
        self.rgb_sub = Subscriber(self, Image, '/camera/rgb/image_rect_color', qos_profile=qos_profile)
        self.depth_sub = Subscriber(self, Image, '/camera/depth/image_rect_raw', qos_profile=qos_profile)
        self.info_sub = self.create_subscription(CameraInfo, '/camera/rgb/camera_info', self.camera_info_callback, 10)
        
        # Synchronize RGB and depth images
        self.ts = ApproximateTimeSynchronizer(
            [self.rgb_sub, self.depth_sub], 
            queue_size=10, 
            slop=0.1
        )
        self.ts.registerCallback(self.images_callback)
        
        # Publishers
        self.detection_2d_pub = self.create_publisher(Detection2DArray, '/isaac_ros/detections_2d', 10)
        self.detection_3d_pub = self.create_publisher(PoseStamped, '/isaac_ros/detections_3d', 10)
        self.debug_image_pub = self.create_publisher(Image, '/isaac_ros/debug_image', 10)
        
        self.get_logger().info('Isaac Object Detection Node initialized')

    def camera_info_callback(self, msg):
        """Store camera intrinsic parameters"""
        self.camera_matrix = np.array(msg.k).reshape(3, 3)
        self.distortion_coeffs = np.array(msg.d)
        self.camera_info_received = True
        self.get_logger().info('Camera info received')

    def images_callback(self, rgb_msg, depth_msg):
        """Process synchronized RGB and depth images"""
        if not self.camera_info_received:
            self.get_logger().warn('Waiting for camera info...')
            return
        
        try:
            # Convert ROS images to OpenCV
            rgb_image = self.cv_bridge.imgmsg_to_cv2(rgb_msg, desired_encoding='bgr8')
            depth_image = self.cv_bridge.imgmsg_to_cv2(depth_msg, desired_encoding='passthrough')
            
            # Perform object detection
            detections_2d = self.perform_object_detection(rgb_image)
            
            # Process detections and convert to 3D
            for detection in detections_2d.detections:
                bbox = detection.bbox
                center_x = int(bbox.center.x)
                center_y = int(bbox.center.y)
                
                # Get depth at detection center
                if center_y < depth_image.shape[0] and center_x < depth_image.shape[1]:
                    depth_value = depth_image[center_y, center_x]
                    
                    if depth_value > 0:  # Valid depth
                        # Convert 2D pixel coordinates to 3D world coordinates
                        world_point = self.pixel_to_world(
                            center_x, center_y, depth_value
                        )
                        
                        # Create and publish 3D pose
                        pose_3d = PoseStamped()
                        pose_3d.header = rgb_msg.header  # Use same timestamp and frame
                        pose_3d.pose.position.x = world_point[0]
                        pose_3d.pose.position.y = world_point[1]
                        pose_3d.pose.position.z = world_point[2]
                        pose_3d.pose.orientation.w = 1.0  # No rotation
                        
                        self.detection_3d_pub.publish(pose_3d)
            
            # Publish 2D detections
            self.detection_2d_pub.publish(detections_2d)
            
            # Publish debug image with detections
            debug_image = self.draw_detections(rgb_image, detections_2d)
            debug_msg = self.cv_bridge.cv2_to_imgmsg(debug_image, encoding='bgr8')
            debug_msg.header = rgb_msg.header
            self.debug_image_pub.publish(debug_msg)
            
        except Exception as e:
            self.get_logger().error(f'Error processing images: {str(e)}')

    def perform_object_detection(self, image):
        """Perform object detection using YOLO"""
        # Convert image for model input
        img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Run inference
        results = self.model(img_rgb)
        
        # Convert results to vision_msgs format
        detections_msg = Detection2DArray()
        detections_msg.header.stamp = self.get_clock().now().to_msg()
        detections_msg.header.frame_id = 'camera_rgb_optical_frame'  # Will be set properly
        
        for *xyxy, conf, cls in results.xyxy[0].tolist():  # xyxy format: [x1, y1, x2, y2]
            detection = Detection2D()
            
            # Convert to center + size format
            x1, y1, x2, y2 = map(int, xyxy)
            center_x = (x1 + x2) / 2.0
            center_y = (y1 + y2) / 2.0
            width = x2 - x1
            height = y2 - y1
            
            detection.bbox.center.x = center_x
            detection.bbox.center.y = center_y
            detection.bbox.size_x = width
            detection.bbox.size_y = height
            
            # Add detection result
            hypothesis = ObjectHypothesisWithPose()
            hypothesis.id = str(int(cls))
            hypothesis.score = float(conf)
            detection.results.append(hypothesis)
            
            detections_msg.detections.append(detection)
        
        return detections_msg

    def pixel_to_world(self, u, v, depth):
        """Convert pixel coordinates + depth to world coordinates"""
        # Camera intrinsic parameters
        fx = self.camera_matrix[0, 0]
        fy = self.camera_matrix[1, 1]
        cx = self.camera_matrix[0, 2]
        cy = self.camera_matrix[1, 2]
        
        # Convert to world coordinates
        x = (u - cx) * depth / fx
        y = (v - cy) * depth / fy
        z = depth
        
        return [x, y, z]

    def draw_detections(self, image, detections_array):
        """Draw detection rectangles on image"""
        output_image = image.copy()
        
        for detection in detections_array.detections:
            bbox = detection.bbox
            x = int(bbox.center.x - bbox.size_x / 2)
            y = int(bbox.center.y - bbox.size_y / 2)
            w = int(bbox.size_x)
            h = int(bbox.size_y)
            
            # Draw rectangle
            cv2.rectangle(output_image, (x, y), (x + w, y + h), (0, 255, 0), 2)
            
            # Add label if available
            if detection.results:
                label = f"{detection.results[0].id}: {detection.results[0].score:.2f}"
                cv2.putText(output_image, label, (x, y - 10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        return output_image

def main(args=None):
    rclpy.init(args=args)
    node = IsaacObjectDetectionNode()
    
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

### Launch File

```xml
<!-- launch/isaac_object_detection.launch.py -->
from launch import LaunchDescription
from launch_ros.actions import Node
from ament_index_python.packages import get_package_share_directory
import os

def generate_launch_description():
    config = os.path.join(
        get_package_share_directory('your_robot_package'),
        'config',
        'isaac_detection_config.yaml'
    )
    
    isaac_detection_node = Node(
        package='your_robot_perception',
        executable='isaac_object_detection_node',
        name='isaac_object_detection',
        parameters=[config],
        remappings=[
            ('/camera/rgb/image_rect_color', '/camera/color/image_raw'),
            ('/camera/depth/image_rect_raw', '/camera/depth/image_rect_raw'),
            ('/camera/rgb/camera_info', '/camera/color/camera_info'),
        ],
        output='screen'
    )
    
    return LaunchDescription([
        isaac_detection_node
    ])
```

### Configuration File

```yaml
# config/isaac_detection_config.yaml
isaac_object_detection:
  ros__parameters:
    # Processing parameters
    detection_threshold: 0.5
    max_objects: 10
    enable_gpu_acceleration: true
    gpu_device_id: 0
    
    # Camera parameters (if not available from camera_info)
    camera_fx: 554.25  # Focal length x
    camera_fy: 554.25  # Focal length y
    camera_cx: 320.5   # Principal point x
    camera_cy: 240.5   # Principal point y
    
    # Topic remappings
    rgb_topic: "/camera/color/image_raw"
    depth_topic: "/camera/depth/image_rect_raw"
    camera_info_topic: "/camera/color/camera_info"
    detections_2d_topic: "/isaac_ros/detections_2d"
    detections_3d_topic: "/isaac_ros/detections_3d"
    debug_image_topic: "/isaac_ros/debug_image"
```

## Exercise 2: Isaac Sim Humanoid Environment

### Problem Statement
Create an Isaac Sim environment for training a humanoid robot to walk using reinforcement learning. The environment should include:
1. A humanoid robot model with proper articulation
2. Physics simulation with realistic dynamics
3. Reward function for stable walking
4. Observation space including joint states and IMU data
5. Action space for joint torques

### Solution

```python
import omni
from omni.isaac.core import World
from omni.isaac.core.utils.stage import add_reference_to_stage
from omni.isaac.core.utils.prims import get_prim_at_path
from omni.isaac.core.articulations import ArticulationView
from omni.isaac.core.utils.nucleus import get_assets_root_path
from omni.isaac.core.utils.torch.maths import torch
import numpy as np
import gym
from gym import spaces

class IsaacHumanoidEnv(gym.Env):
    def __init__(self, num_envs=1024, device="cuda"):
        super().__init__()
        
        # Initialize Isaac Sim world
        self.world = World(stage_units_in_meters=1.0)
        
        # Environment parameters
        self.num_envs = num_envs
        self.device = device
        
        # Humanoid parameters
        self.max_episode_length = 1000
        self.dt = 1/60.0  # 60 Hz physics update
        
        # Get assets root path
        self.assets_root_path = get_assets_root_path()
        if self.assets_root_path is None:
            raise Exception("Could not find Isaac Sim assets folder")
        
        # Setup humanoid robots
        self.humanoid_handles = []
        self.humanoid_views = []
        self.setup_humanoids()
        
        # RL spaces
        self.action_space = spaces.Box(
            low=-1.0, high=1.0, 
            shape=(21,),  # 21 actuated joints in typical humanoid
            dtype=np.float32
        )
        
        # Observation space: joint positions, velocities, body poses, velocities, commands
        obs_dim = 21*2 + 13*3 + 13*4 + 13*3 + 13*3 + 3  # 133 dimensions
        self.observation_space = spaces.Box(
            low=-np.inf, high=np.inf,
            shape=(obs_dim,),
            dtype=np.float32
        )
        
        # Episode tracking
        self.episode_lengths = torch.zeros(self.num_envs, device=self.device, dtype=torch.long)
        self.episode_rewards = torch.zeros(self.num_envs, device=self.device, dtype=torch.float32)
        
        # Initialize world
        self.world.reset()
        
        print(f"Isaac Humanoid Environment initialized with {self.num_envs} environments")

    def setup_humanoids(self):
        """Setup multiple humanoid robots in the environment"""
        for i in range(self.num_envs):
            # Define environment position
            env_pos = np.array([i // 32, i % 32, 0]) * 2.0  # Spread environments
            
            # Create unique prim path for each environment
            env_path = f"/World/envs/env_{i}"
            humanoid_path = f"{env_path}/Humanoid"
            
            # Add humanoid to this environment
            # Using a standard humanoid model from Isaac Sim assets
            add_reference_to_stage(
                usd_path=self.assets_root_path + "/Isaac/Robots/Humanoid/humanoid_instanceable.usd",
                prim_path=humanoid_path
            )
            
            # Create articulation view for this humanoid
            humanoid_view = ArticulationView(
                prim_path=humanoid_path,
                name=f"humanoid_view_{i}",
                reset_xform_properties=False
            )
            
            # Add to world scene
            self.world.scene.add(humanoid_view)
            self.humanoid_views.append(humanoid_view)
        
        # Reset the world to initialize all environments
        self.world.reset()

    def reset(self):
        """Reset the environment"""
        # Reset episode counters
        self.episode_lengths = torch.zeros(self.num_envs, device=self.device, dtype=torch.long)
        self.episode_rewards = torch.zeros(self.num_envs, device=self.device, dtype=torch.float32)
        
        # Reset humanoid poses to default
        for humanoid_view in self.humanoid_views:
            # Reset joint positions to default
            default_positions = humanoid_view.get_default_joint_positions()
            humanoid_view.set_joint_positions(default_positions)
            
            # Reset joint velocities to zero
            zero_velocities = torch.zeros_like(humanoid_view.get_joint_velocities())
            humanoid_view.set_joint_velocities(zero_velocities)
        
        # Step the world to apply resets
        self.world.step(render=False)
        
        # Return initial observations
        return self.get_observations()

    def step(self, actions):
        """Execute one step in the environment"""
        # Apply actions to all humanoids
        for i, humanoid_view in enumerate(self.humanoid_views):
            # Scale actions to torque limits
            scaled_actions = torch.clamp(actions[i], -1.0, 1.0) * 100.0  # Scale to reasonable torque values
            humanoid_view.set_applied_torques(scaled_actions)
        
        # Step the simulation
        self.world.step(render=False)
        
        # Get observations, rewards, dones, and info
        obs = self.get_observations()
        rew = self.compute_rewards()
        done = self.check_termination()
        info = self.get_extras()
        
        # Update episode counters
        self.episode_lengths += 1
        self.episode_rewards += rew
        
        return obs, rew, done, info

    def get_observations(self):
        """Get observations from all environments"""
        obs_list = []
        
        for humanoid_view in self.humanoid_views:
            # Get joint positions and velocities
            joint_pos = humanoid_view.get_joint_positions()
            joint_vel = humanoid_view.get_joint_velocities()
            
            # Get body poses, velocities, and angular velocities
            body_pos = humanoid_view.get_body_positions()
            body_rot = humanoid_view.get_body_rotations()
            body_lin_vel = humanoid_view.get_body_linear_velocities()
            body_ang_vel = humanoid_view.get_body_angular_velocities()
            
            # Get base (pelvis) information for reference
            base_pos = body_pos[0]  # Assuming pelvis is first body
            base_rot = body_rot[0]
            base_lin_vel = body_lin_vel[0]
            base_ang_vel = body_ang_vel[0]
            
            # Normalize body velocities relative to base
            rel_lin_vel = body_lin_vel - base_lin_vel.unsqueeze(1).repeat(1, 3)
            rel_ang_vel = body_ang_vel - base_ang_vel.unsqueeze(1).repeat(1, 3)
            
            # Create observation vector
            obs = torch.cat([
                joint_pos.flatten(),           # Joint positions
                joint_vel.flatten(),           # Joint velocities  
                rel_lin_vel.flatten(),         # Body linear velocities (relative to base)
                rel_ang_vel.flatten(),         # Body angular velocities (relative to base)
                base_pos[:2],                  # Base horizontal position
                base_rot[2:].unsqueeze(0),     # Base orientation (yaw component)
                base_lin_vel[:2],              # Base horizontal velocity
                base_ang_vel[2:].unsqueeze(0), # Base angular velocity (yaw component)
                torch.tensor([0.5, 0.0, 0.0], device=self.device)  # Target velocity command [vx, vy, vz]
            ])
            
            obs_list.append(obs)
        
        return torch.stack(obs_list)

    def compute_rewards(self):
        """Compute rewards for all environments"""
        rewards = torch.zeros(self.num_envs, device=self.device, dtype=torch.float32)
        
        for i, humanoid_view in enumerate(self.humanoid_views):
            # Get base information
            base_pos = humanoid_view.get_body_positions()[0]
            base_lin_vel = humanoid_view.get_body_linear_velocities()[0]
            base_ang_vel = humanoid_view.get_body_angular_velocities()[0]
            
            # Reward forward movement (in x direction)
            forward_vel_reward = base_lin_vel[0] * 2.0  # Weight for forward velocity
            
            # Penalty for excessive energy consumption (joint velocity magnitude)
            joint_velocities = humanoid_view.get_joint_velocities()
            energy_penalty = torch.sum(torch.abs(joint_velocities)) * 0.01
            
            # Reward for staying upright (base height should be around 0.9m for typical humanoid)
            height_reward = torch.exp(-(base_pos[2] - 0.9) ** 2) * 1.0
            
            # Penalty for excessive body lean
            base_rot = humanoid_view.get_body_rotations()[0]
            # Convert quaternion to Euler and penalize roll/pitch
            _, pitch, roll = self.quat_to_euler(base_rot)
            lean_penalty = (abs(pitch) + abs(roll)) * 2.0
            
            # Penalty for excessive angular velocity
            angular_vel_penalty = torch.norm(base_ang_vel) * 0.5
            
            # Combine rewards
            total_reward = (
                forward_vel_reward - 
                energy_penalty + 
                height_reward - 
                lean_penalty - 
                angular_vel_penalty
            )
            
            rewards[i] = torch.clamp(total_reward, -10.0, 10.0)
        
        return rewards

    def check_termination(self):
        """Check if episodes are terminated"""
        dones = torch.zeros(self.num_envs, device=self.device, dtype=torch.bool)
        
        for i, humanoid_view in enumerate(self.humanoid_views):
            # Get base position
            base_pos = humanoid_view.get_body_positions()[0]
            
            # Terminate if humanoid falls (base too low)
            if base_pos[2] < 0.5:  # Fell below 0.5m
                dones[i] = True
            
            # Terminate if episode is too long
            if self.episode_lengths[i] >= self.max_episode_length:
                dones[i] = True
        
        return dones

    def get_extras(self):
        """Get extra information"""
        extras = {}
        return extras

    def quat_to_euler(self, quat):
        """Convert quaternion to Euler angles (roll, pitch, yaw)"""
        # Convert quaternion to rotation matrix first, then to Euler
        w, x, y, z = quat[0], quat[1], quat[2], quat[3]
        
        # Roll (x-axis rotation)
        sinr_cosp = 2 * (w * x + y * z)
        cosr_cosp = 1 - 2 * (x * x + y * y)
        roll = torch.atan2(sinr_cosp, cosr_cosp)
        
        # Pitch (y-axis rotation)
        sinp = 2 * (w * y - z * x)
        pitch = torch.where(
            torch.abs(sinp) >= 1,
            torch.sign(sinp) * np.pi / 2,
            torch.asin(sinp)
        )
        
        # Yaw (z-axis rotation)
        siny_cosp = 2 * (w * z + x * y)
        cosy_cosp = 1 - 2 * (y * y + z * z)
        yaw = torch.atan2(siny_cosp, cosy_cosp)
        
        return roll, pitch, yaw

    def close(self):
        """Close the environment"""
        self.world.clear()
        print("Isaac Humanoid Environment closed")

# Example training loop
def train_humanoid_walking():
    """Example training loop for humanoid walking"""
    env = IsaacHumanoidEnv(num_envs=1024, device="cuda")
    
    # Simple random policy for demonstration
    for episode in range(1000):
        obs = env.reset()
        episode_returns = []
        episode_lengths = []
        
        for step in range(500):  # 500 steps per episode
            # Random actions for demonstration
            actions = torch.randn(env.num_envs, 21, device=env.device) * 0.5
            
            # Step environment
            next_obs, rewards, dones, info = env.step(actions)
            
            # Print average reward every 100 steps
            if step % 100 == 0:
                avg_reward = torch.mean(rewards).item()
                print(f"Episode {episode}, Step {step}, Avg Reward: {avg_reward:.3f}")
        
        # Calculate episode statistics
        avg_return = torch.mean(env.episode_rewards).item()
        avg_length = torch.mean(env.episode_lengths).item()
        
        print(f"Episode {episode} completed - Avg Return: {avg_return:.3f}, Avg Length: {avg_length:.1f}")
    
    env.close()

if __name__ == "__main__":
    train_humanoid_walking()
```

## Exercise 3: Nav2 Integration with VSLAM

### Problem Statement
Create a ROS 2 node that integrates VSLAM pose estimates with Nav2 for improved localization. The node should:
1. Subscribe to VSLAM pose estimates
2. Fuse VSLAM data with robot's odometry
3. Provide enhanced pose estimates to Nav2
4. Handle VSLAM failures gracefully

### Solution

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import PoseWithCovarianceStamped, Twist
from nav_msgs.msg import Odometry
from sensor_msgs.msg import Imu
from std_msgs.msg import Float32
from tf2_ros import TransformBroadcaster, TransformStamped
import tf2_geometry_msgs
import tf2_ros
import numpy as np
from scipy.spatial.transform import Rotation as R
import message_filters

class VSLAMNav2FusionNode(Node):
    def __init__(self):
        super().__init__('vs_lam_nav2_fusion_node')
        
        # Parameters
        self.vslam_weight = self.declare_parameter('vslam_weight', 0.8).get_parameter_value().double_value
        self.odom_weight = self.declare_parameter('odom_weight', 0.2).get_parameter_value().double_value
        self.max_vslam_error = self.declare_parameter('max_vslam_error', 0.5).get_parameter_value().double_value
        self.fallback_timeout = self.declare_parameter('fallback_timeout', 2.0).get_parameter_value().double_value
        
        # TF2 setup
        self.tf_buffer = tf2_ros.Buffer()
        self.tf_listener = tf2_ros.TransformListener(self.tf_buffer, self)
        self.tf_broadcaster = TransformBroadcaster(self)
        
        # Subscriptions
        self.odom_sub = self.create_subscription(
            Odometry,
            'odom',
            self.odom_callback,
            10
        )
        
        self.vs_lam_pose_sub = self.create_subscription(
            PoseWithCovarianceStamped,
            'vslam_pose',
            self.vs_lam_pose_callback,
            10
        )
        
        self.imu_sub = self.create_subscription(
            Imu,
            'imu/data',
            self.imu_callback,
            10
        )
        
        # Publishers
        self.fused_pose_pub = self.create_publisher(
            PoseWithCovarianceStamped, 
            'fused_pose', 
            10
        )
        
        self.amcl_pose_pub = self.create_publisher(
            PoseWithCovarianceStamped,
            'amcl_pose',
            10
        )
        
        self.status_pub = self.create_publisher(
            Float32,
            'localization_confidence',
            10
        )
        
        # State variables
        self.current_odom = None
        self.current_vs_lam_pose = None
        self.current_imu = None
        self.last_vslam_time = self.get_clock().now()
        self.localization_confidence = 0.0
        
        # Fallback timer
        self.fallback_timer = self.create_timer(
            self.fallback_timeout,
            self.check_fallback_mode
        )
        
        self.get_logger().info('VSLAM-Nav2 Fusion Node initialized')

    def odom_callback(self, msg):
        """Handle odometry messages"""
        self.current_odom = msg
        self.process_fusion()

    def vs_lam_pose_callback(self, msg):
        """Handle VSLAM pose estimates"""
        self.current_vs_lam_pose = msg
        self.last_vslam_time = self.get_clock().now()
        
        # Update localization confidence based on VSLAM quality
        # (Assuming VSLAM provides some measure of quality in covariance)
        max_covariance = max(msg.pose.covariance[:2])  # Position covariance
        self.localization_confidence = max(0.0, min(1.0, 1.0 - max_covariance / self.max_vslam_error))
        
        self.process_fusion()

    def imu_callback(self, msg):
        """Handle IMU data for orientation correction"""
        self.current_imu = msg
        # Could be used for additional sensor fusion

    def process_fusion(self):
        """Fuse VSLAM and odometry data"""
        if self.current_odom is None:
            return  # Need odometry to start
        
        # Create fused pose
        fused_pose_msg = PoseWithCovarianceStamped()
        fused_pose_msg.header.frame_id = 'map'
        fused_pose_msg.header.stamp = self.get_clock().now().to_msg()
        
        if self.current_vs_lam_pose is not None:
            # We have VSLAM data, perform fusion
            vs_lam_pos = self.current_vs_lam_pose.pose.pose.position
            vs_lam_orient = self.current_vs_lam_pose.pose.pose.orientation
            vs_lam_cov = self.current_vs_lam_pose.pose.covariance
            
            odom_pos = self.current_odom.pose.pose.position
            odom_orient = self.current_odom.pose.pose.orientation
            odom_cov = self.current_odom.pose.covariance
            
            # Simple weighted fusion (in practice, use proper Kalman filtering)
            fused_pose_msg.pose.pose.position.x = (
                self.vslam_weight * vs_lam_pos.x + 
                self.odom_weight * odom_pos.x
            )
            fused_pose_msg.pose.pose.position.y = (
                self.vslam_weight * vs_lam_pos.y + 
                self.odom_weight * odom_pos.y
            )
            fused_pose_msg.pose.pose.position.z = (
                self.vslam_weight * vs_lam_pos.z + 
                self.odom_weight * odom_pos.z
            )
            
            # For orientation, we'll use VSLAM when available (more globally consistent)
            # but fall back to odometry integration for short-term accuracy
            fused_pose_msg.pose.pose.orientation = vs_lam_orient
            
            # Combine covariances (simplified)
            for i in range(36):
                fused_pose_msg.pose.covariance[i] = (
                    self.vslam_weight * vs_lam_cov[i] + 
                    self.odom_weight * odom_cov[i]
                )
        else:
            # No VSLAM available, use odometry with increased uncertainty
            fused_pose_msg.pose = self.current_odom.pose
            # Inflate covariance to indicate lower confidence
            for i in range(36):
                fused_pose_msg.pose.covariance[i] *= 5.0  # Increase uncertainty significantly
        
        # Publish fused pose
        self.fused_pose_pub.publish(fused_pose_msg)
        
        # Also publish in AMCL format for Nav2
        amcl_pose_msg = PoseWithCovarianceStamped()
        amcl_pose_msg.header = fused_pose_msg.header
        amcl_pose_msg.pose = fused_pose_msg.pose
        self.amcl_pose_pub.publish(amcl_pose_msg)
        
        # Publish localization confidence
        confidence_msg = Float32()
        confidence_msg.data = self.localization_confidence
        self.status_pub.publish(confidence_msg)

    def check_fallback_mode(self):
        """Check if we need to switch to fallback mode"""
        current_time = self.get_clock().now()
        time_since_vslam = (current_time - self.last_vslam_time).nanoseconds / 1e9
        
        if time_since_vslam > self.fallback_timeout:
            self.get_logger().warn(
                f'VSLAM data timeout ({time_since_vslam:.2f}s), switching to odometry-only mode'
            )
            # In a real implementation, you might want to notify other nodes
            # or switch to a different localization mode

def main(args=None):
    rclpy.init(args=args)
    fusion_node = VSLAMNav2FusionNode()
    
    try:
        rclpy.spin(fusion_node)
    except KeyboardInterrupt:
        pass
    finally:
        fusion_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Launch File for Fusion Node

```xml
<!-- launch/vslam_nav2_fusion.launch.py -->
from launch import LaunchDescription
from launch_ros.actions import Node
from ament_index_python.packages import get_package_share_directory
import os

def generate_launch_description():
    config = os.path.join(
        get_package_share_directory('your_robot_localization'),
        'config',
        'vslam_nav2_fusion.yaml'
    )
    
    fusion_node = Node(
        package='your_robot_localization',
        executable='vslam_nav2_fusion_node',
        name='vslam_nav2_fusion',
        parameters=[config],
        remappings=[
            ('/odom', '/wheel_odom'),
            ('/vslam_pose', '/visual_slam/pose'),
            ('/imu/data', '/imu/data_raw'),
            ('/fused_pose', '/fused_pose'),
            ('/amcl_pose', '/amcl_pose'),
        ],
        output='screen'
    )
    
    return LaunchDescription([
        fusion_node
    ])
```

### Configuration File

```yaml
# config/vslam_nav2_fusion.yaml
vslam_nav2_fusion:
  ros__parameters:
    # Fusion weights
    vslam_weight: 0.8
    odom_weight: 0.2
    
    # VSLAM quality parameters
    max_vslam_error: 0.5  # meters
    fallback_timeout: 2.0  # seconds
    
    # Topic remappings
    odom_topic: "/wheel_odom"
    vslam_pose_topic: "/visual_slam/pose"
    imu_topic: "/imu/data_raw"
    fused_pose_topic: "/fused_pose"
    amcl_pose_topic: "/amcl_pose"
    localization_confidence_topic: "/localization_confidence"
```

## Exercise 4: Humanoid Path Planning with Balance Constraints

### Problem Statement
Implement a path planner that considers humanoid balance constraints when planning footstep sequences. The planner should:
1. Take a global path as input
2. Generate stable footstep placements
3. Consider balance constraints (ZMP, support polygon)
4. Output a sequence of footstep poses

### Solution

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.spatial.distance import euclidean
from scipy.optimize import minimize
from dataclasses import dataclass
from typing import List, Tuple

@dataclass
class FootStep:
    """Represents a single footstep"""
    x: float
    y: float
    theta: float
    foot_type: str  # 'left' or 'right'
    step_time: float

class HumanoidPathPlanner:
    def __init__(self, step_length=0.3, step_width=0.2, max_step_height=0.15):
        self.step_length = step_length  # Forward step length
        self.step_width = step_width    # Lateral step width (distance between feet)
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
    
    def optimize_footsteps(self, footsteps: List[FootStep]) -> List[FootStep]:
        """
        Optimize footstep sequence for better balance and smoother motion
        """
        if len(footsteps) < 3:
            return footsteps
        
        optimized_steps = [footsteps[0]]  # Keep first step
        
        for i in range(1, len(footsteps) - 1):
            prev_step = footsteps[i-1]
            curr_step = footsteps[i]
            next_step = footsteps[i+1]
            
            # Optimize current step position considering previous and next steps
            optimized_x, optimized_y, optimized_theta = self.optimize_single_step(
                prev_step, curr_step, next_step
            )
            
            optimized_step = FootStep(
                x=optimized_x,
                y=optimized_y,
                theta=optimized_theta,
                foot_type=curr_step.foot_type,
                step_time=curr_step.step_time
            )
            
            optimized_steps.append(optimized_step)
        
        # Add last step
        if len(footsteps) > 1:
            optimized_steps.append(footsteps[-1])
        
        return optimized_steps
    
    def optimize_single_step(self, prev_step: FootStep, curr_step: FootStep, next_step: FootStep):
        """
        Optimize a single step considering adjacent steps
        """
        # Calculate optimal position based on smooth transition
        # This is a simplified optimization - in practice, would use more sophisticated methods
        
        # Weighted average of desired positions
        target_x = (prev_step.x + next_step.x) / 2
        target_y = (prev_step.y + next_step.y) / 2
        target_theta = (prev_step.theta + next_step.theta) / 2
        
        # Ensure step is still balanced
        supporting_foot = prev_step  # Simplified assumption
        if not self.is_step_balanced(
            (supporting_foot.x, supporting_foot.y, supporting_foot.theta),
            (target_x, target_y, target_theta)
        ):
            # If not balanced, keep original position
            return curr_step.x, curr_step.y, curr_step.theta
        
        return target_x, target_y, target_theta

# Example usage and testing
def test_humanoid_path_planner():
    """Test the humanoid path planner"""
    planner = HumanoidPathPlanner()
    
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
    
    # Optimize footsteps
    optimized_footsteps = planner.optimize_footsteps(footsteps)
    
    print(f"\nOptimized to {len(optimized_footsteps)} footsteps:")
    for i, step in enumerate(optimized_footsteps):
        print(f"Step {i}: {step.foot_type} foot at ({step.x:.2f}, {step.y:.2f}, {step.theta:.2f})")
    
    # Visualization
    plt.figure(figsize=(12, 8))
    
    # Plot original path
    path_x = [p[0] for p in path]
    path_y = [p[1] for p in path]
    plt.plot(path_x, path_y, 'b-', linewidth=2, label='Original Path', alpha=0.7)
    
    # Plot footsteps
    left_x = [step.x for step in optimized_footsteps if step.foot_type == 'left']
    left_y = [step.y for step in optimized_footsteps if step.foot_type == 'left']
    plt.scatter(left_x, left_y, c='red', s=100, label='Left Foot', marker='^')
    
    right_x = [step.x for step in optimized_footsteps if step.foot_type == 'right']
    right_y = [step.y for step in optimized_footsteps if step.foot_type == 'right']
    plt.scatter(right_x, right_y, c='blue', s=100, label='Right Foot', marker='v')
    
    plt.xlabel('X (m)')
    plt.ylabel('Y (m)')
    plt.title('Humanoid Footstep Planning with Balance Constraints')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.axis('equal')
    plt.show()
    
    return footsteps, optimized_footsteps

if __name__ == "__main__":
    test_humanoid_path_planner()
```

## Exercise 5: Complete Navigation System Integration

### Problem Statement
Create a complete navigation system that integrates all components: VSLAM, Nav2, and humanoid-specific path planning. The system should:
1. Use VSLAM for localization when available
2. Fall back to odometry-based localization when VSLAM fails
3. Plan humanoid-appropriate paths using footstep planning
4. Execute navigation with balance-aware control

### Solution

```python
import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient
from rclpy.qos import QoSProfile, ReliabilityPolicy, HistoryPolicy
from geometry_msgs.msg import PoseStamped, Twist
from nav_msgs.msg import Odometry, Path
from sensor_msgs.msg import Imu
from std_msgs.msg import Float32, String
from nav2_msgs.action import NavigateToPose
from tf2_ros import TransformException
import tf2_ros
import numpy as np
from scipy.spatial.transform import Rotation as R

class HumanoidNavigationSystemNode(Node):
    def __init__(self):
        super().__init__('humanoid_navigation_system')
        
        # Parameters
        self.localization_mode = self.declare_parameter('localization_mode', 'vslam_fallback').get_parameter_value().string_value
        self.max_navigation_speed = self.declare_parameter('max_navigation_speed', 0.3).get_parameter_value().double_value
        self.min_step_size = self.declare_parameter('min_step_size', 0.1).get_parameter_value().double_value
        self.balance_threshold = self.declare_parameter('balance_threshold', 0.7).get_parameter_value().double_value
        
        # TF2 setup
        self.tf_buffer = tf2_ros.Buffer()
        self.tf_listener = tf2_ros.TransformListener(self.tf_buffer, self)
        
        # Subscriptions
        self.odom_sub = self.create_subscription(
            Odometry,
            'odom',
            self.odom_callback,
            QoSProfile(depth=10, reliability=ReliabilityPolicy.BEST_EFFORT)
        )
        
        self.vs_lam_pose_sub = self.create_subscription(
            PoseStamped,
            'vslam_pose',
            self.vs_lam_pose_callback,
            QoSProfile(depth=10, reliability=ReliabilityPolicy.BEST_EFFORT)
        )
        
        self.imu_sub = self.create_subscription(
            Imu,
            'imu/data',
            self.imu_callback,
            10
        )
        
        self.balance_sub = self.create_subscription(
            Float32,
            'balance_state',
            self.balance_callback,
            10
        )
        
        # Publishers
        self.cmd_vel_pub = self.create_publisher(Twist, 'cmd_vel', 10)
        self.path_pub = self.create_publisher(Path, 'planned_path', 10)
        self.status_pub = self.create_publisher(String, 'navigation_status', 10)
        self.footstep_pub = self.create_publisher(Path, 'footstep_plan', 10)
        
        # Action clients
        self.nav_to_pose_client = ActionClient(self, NavigateToPose, 'navigate_to_pose')
        
        # State variables
        self.current_pose = None
        self.current_odom = None
        self.current_vs_lam_pose = None
        self.current_imu = None
        self.balance_state = 1.0  # 1.0 = perfectly balanced, 0.0 = fallen
        self.localization_confidence = 0.0
        self.navigation_active = False
        self.goal_pose = None
        
        # Navigation timers
        self.navigation_timer = self.create_timer(0.1, self.navigation_control_loop)
        self.localization_check_timer = self.create_timer(1.0, self.check_localization_quality)
        
        # Footstep planner
        self.footstep_planner = HumanoidPathPlanner()
        
        self.get_logger().info('Humanoid Navigation System initialized')

    def odom_callback(self, msg):
        """Handle odometry messages"""
        self.current_odom = msg
        self.update_current_pose_from_odom()

    def vs_lam_pose_callback(self, msg):
        """Handle VSLAM pose estimates"""
        self.current_vs_lam_pose = msg
        # Use VSLAM pose as primary if confidence is high
        if self.localization_confidence > 0.5:
            self.current_pose = msg.pose

    def imu_callback(self, msg):
        """Handle IMU data for balance monitoring"""
        self.current_imu = msg
        
        # Calculate balance from IMU data
        # This is a simplified calculation - in practice, would use more sophisticated methods
        linear_acc = np.array([msg.linear_acceleration.x, msg.linear_acceleration.y, msg.linear_acceleration.z])
        gravity_norm = np.linalg.norm(linear_acc)
        
        # Balance is related to how close measured acceleration is to gravity
        expected_gravity = 9.81
        balance_measure = 1.0 - abs(gravity_norm - expected_gravity) / expected_gravity
        self.balance_state = max(0.0, min(1.0, balance_measure))

    def balance_callback(self, msg):
        """Handle direct balance state messages"""
        self.balance_state = max(0.0, min(1.0, msg.data))

    def update_current_pose_from_odom(self):
        """Update current pose from odometry"""
        if self.current_odom is not None:
            if self.current_pose is None or self.localization_confidence < 0.3:
                # Use odometry when VSLAM is unreliable
                self.current_pose = self.current_odom.pose.pose

    def check_localization_quality(self):
        """Check and update localization quality"""
        if self.current_vs_lam_pose is not None:
            # Estimate quality from covariance
            cov = self.current_vs_lam_pose.pose.covariance
            pos_uncertainty = np.sqrt(cov[0] + cov[7] + cov[14])  # Position uncertainty
            self.localization_confidence = max(0.0, min(1.0, 1.0 - pos_uncertainty / 2.0))
        else:
            self.localization_confidence = 0.0

    def navigate_to_pose(self, x, y, theta, frame_id='map'):
        """Navigate to specified pose"""
        if not self.nav_to_pose_client.wait_for_server(timeout_sec=5.0):
            self.get_logger().error('Navigation server not available')
            return False
        
        goal_msg = NavigateToPose.Goal()
        goal_msg.pose.header.frame_id = frame_id
        goal_msg.pose.header.stamp = self.get_clock().now().to_msg()
        
        # Set position
        goal_msg.pose.pose.position.x = x
        goal_msg.pose.pose.position.y = y
        goal_msg.pose.pose.position.z = 0.0
        
        # Convert theta to quaternion
        quat = R.from_euler('z', theta).as_quat()
        goal_msg.pose.pose.orientation.x = quat[0]
        goal_msg.pose.pose.orientation.y = quat[1]
        goal_msg.pose.pose.orientation.z = quat[2]
        goal_msg.pose.pose.orientation.w = quat[3]
        
        self.goal_pose = goal_msg.pose.pose
        
        # Send goal
        self.get_logger().info(f'Sending navigation goal: ({x:.2f}, {y:.2f}, {theta:.2f})')
        
        self.navigation_active = True
        self.nav_to_pose_client.send_goal_async(
            goal_msg,
            feedback_callback=self.navigation_feedback_callback
        )
        
        return True

    def navigation_feedback_callback(self, feedback_msg):
        """Handle navigation feedback"""
        # Process feedback if needed
        pass

    def navigation_control_loop(self):
        """Main navigation control loop"""
        if not self.navigation_active or self.current_pose is None:
            return
        
        # Check balance - if too low, stop navigation
        if self.balance_state < self.balance_threshold:
            self.get_logger().warn(f'Balance too low ({self.balance_state:.2f}), stopping navigation')
            self.stop_navigation()
            return
        
        # Check localization quality
        if self.localization_confidence < 0.2:
            self.get_logger().warn(f'Localization confidence too low ({self.localization_confidence:.2f})')
            # Could implement recovery behavior here
            return
        
        # Calculate navigation command
        cmd_vel = self.calculate_navigation_command()
        
        # Publish command with safety checks
        if self.is_safe_to_move(cmd_vel):
            self.cmd_vel_pub.publish(cmd_vel)
        else:
            self.get_logger().warn('Navigation command unsafe, stopping')
            self.stop_navigation()

    def calculate_navigation_command(self):
        """Calculate navigation command based on current state and goal"""
        if self.goal_pose is None or self.current_pose is None:
            cmd = Twist()
            return cmd
        
        # Calculate error to goal
        dx = self.goal_pose.position.x - self.current_pose.position.x
        dy = self.goal_pose.position.y - self.current_pose.position.y
        
        # Calculate distance and angle to goal
        distance_to_goal = np.sqrt(dx**2 + dy**2)
        angle_to_goal = np.arctan2(dy, dx)
        
        # Get current robot orientation
        current_quat = [
            self.current_pose.orientation.x,
            self.current_pose.orientation.y,
            self.current_pose.orientation.z,
            self.current_pose.orientation.w
        ]
        current_rpy = R.from_quat(current_quat).as_euler('xyz')
        current_yaw = current_rpy[2]
        
        # Calculate angle difference
        angle_diff = angle_to_goal - current_yaw
        # Normalize angle to [-pi, pi]
        while angle_diff > np.pi:
            angle_diff -= 2 * np.pi
        while angle_diff < -np.pi:
            angle_diff += 2 * np.pi
        
        cmd = Twist()
        
        # Proportional controller for navigation
        if distance_to_goal > 0.2:  # Goal not reached
            # Turn toward goal
            cmd.angular.z = max(-1.0, min(1.0, angle_diff * 1.0))
            
            # Move forward if roughly facing the right direction
            if abs(angle_diff) < np.pi / 4:  # Within 45 degrees
                cmd.linear.x = max(0.05, min(self.max_navigation_speed, distance_to_goal * 0.5))
        else:
            # Close to goal, try to align orientation
            cmd.angular.z = max(-0.5, min(0.5, angle_diff * 1.0))
        
        return cmd

    def is_safe_to_move(self, cmd_vel):
        """Check if movement command is safe considering balance"""
        # Check if command would compromise balance
        if abs(cmd_vel.linear.x) > self.max_navigation_speed:
            return False
        
        # Check if robot is currently unstable
        if self.balance_state < self.balance_threshold:
            return False
        
        return True

    def stop_navigation(self):
        """Stop navigation and clear goal"""
        # Publish zero velocity
        stop_cmd = Twist()
        self.cmd_vel_pub.publish(stop_cmd)
        
        # Clear navigation state
        self.navigation_active = False
        self.goal_pose = None
        
        # Publish status
        status_msg = String()
        status_msg.data = 'Navigation stopped'
        self.status_pub.publish(status_msg)

def main(args=None):
    rclpy.init(args=args)
    nav_system = HumanoidNavigationSystemNode()
    
    try:
        rclpy.spin(nav_system)
    except KeyboardInterrupt:
        nav_system.stop_navigation()
    finally:
        nav_system.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Summary

This chapter covered the implementation of Nav2 navigation for humanoid robots, including:

1. **Isaac ROS Package Implementation**: Complete pipeline for object detection and 3D localization
2. **Isaac Sim Humanoid Environment**: Reinforcement learning environment for humanoid walking
3. **Nav2 Integration with VSLAM**: Sensor fusion for improved localization
4. **Humanoid Path Planning**: Balance-aware footstep planning
5. **Complete Navigation System**: Integration of all components

The exercises demonstrate practical implementation of navigation systems for humanoid robots, considering their unique requirements for balance, kinematic constraints, and multi-modal locomotion. Each exercise builds on the previous ones to create a comprehensive navigation solution.

These implementations provide a solid foundation for developing advanced humanoid navigation capabilities that can operate in real-world environments with the stability and safety required for humanoid robots.