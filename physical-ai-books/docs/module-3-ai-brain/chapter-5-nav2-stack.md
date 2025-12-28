# Chapter 5: Nav2 Navigation Stack

## Overview

The Navigation Stack 2 (Nav2) is the next-generation navigation framework for ROS 2, designed to provide robust, reliable, and flexible navigation capabilities for mobile robots. This chapter explores how to integrate Nav2 with humanoid robots, leveraging its advanced planning, control, and recovery behaviors to enable autonomous navigation in complex environments.

## Introduction to Nav2

Nav2 is a complete rewrite of the ROS 1 navigation stack, built from the ground up for ROS 2. It provides:

- **Behavior Trees**: Flexible task orchestration for navigation
- **Advanced Path Planning**: State-of-the-art global and local planners
- **Robust Control**: Adaptive control algorithms for smooth navigation
- **Recovery Behaviors**: Automatic recovery from navigation failures
- **Lifecycle Management**: Proper state management for navigation components
- **Extensibility**: Plugin-based architecture for customization

### Key Components of Nav2

1. **Global Planner**: Creates a path from start to goal
2. **Local Planner**: Controls robot motion along the path
3. **Controller Server**: Manages local planning and control
4. **Planner Server**: Manages global planning
5. **Recovery Server**: Handles navigation recovery behaviors
6. **BT Navigator**: Executes navigation using behavior trees
7. **Lifecycle Manager**: Manages lifecycle of navigation components

## Nav2 Architecture

### Behavior Tree Navigation

Nav2 uses behavior trees to orchestrate navigation tasks:

```xml
<!-- navigation_tree.xml -->
<root main_tree_to_execute="MainTree">
  <BehaviorTree ID="MainTree">
    <Sequence name="NavigateWithReplanning">
      <RateController hz="1.0">
        <RecoveryNode number_of_retries="6" name="ComputeAndFollowPathRecovery">
          <PipelineSequence name="ComputeAndFollowPath">
            <RecoveryNode number_of_retries="2" name="PlanRecovery">
              <PlanPath />
              <ReinitializeGlobalCostmap />
            </RecoveryNode>
            <RecoveryNode number_of_retries="4" name="FollowPathRecovery">
              <FollowPath />
              <TruncatePath />
              <UpdateGlobalCostmap />
            </RecoveryNode>
          </PipelineSequence>
          <ComputePathToPose goal="{goal}" path="{path}" planner_id="GridBased"/>
          <FollowPath path="{path}" controller_id="FollowPath"/>
        </RecoveryNode>
      </RateController>
    </Sequence>
  </BehaviorTree>
</root>
```

### Lifecycle Management

Nav2 components follow the ROS 2 lifecycle pattern:

```python
import rclpy
from rclpy.lifecycle import LifecycleNode, TransitionCallbackReturn
from nav2_msgs.srv import LoadMap
from nav2_msgs.action import NavigateToPose
from geometry_msgs.msg import PoseStamped
from lifecycle_msgs.msg import Transition

class Nav2LifecycleManager(LifecycleNode):
    def __init__(self):
        super().__init__('nav2_lifecycle_manager')
        
        # Create lifecycle service clients
        self.map_loader_client = self.create_client(LoadMap, '/map_server/load_map')
        self.nav_to_pose_client = self.create_client(NavigateToPose, '/navigate_to_pose')
        
        self.get_logger().info('Nav2 Lifecycle Manager initialized')

    def on_configure(self, state):
        """Configure the lifecycle node"""
        self.get_logger().info('Configuring Nav2 components')
        
        # Configure navigation components
        # This would typically call lifecycle services
        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state):
        """Activate the lifecycle node"""
        self.get_logger().info('Activating Nav2 components')
        
        # Activate navigation components
        return TransitionCallbackReturn.SUCCESS

    def on_deactivate(self, state):
        """Deactivate the lifecycle node"""
        self.get_logger().info('Deactivating Nav2 components')
        
        # Deactivate navigation components
        return TransitionCallbackReturn.SUCCESS

    def on_cleanup(self, state):
        """Clean up the lifecycle node"""
        self.get_logger().info('Cleaning up Nav2 components')
        
        # Clean up navigation components
        return TransitionCallbackReturn.SUCCESS

def main(args=None):
    rclpy.init(args=args)
    
    # Create and configure the lifecycle manager
    lifecycle_manager = Nav2LifecycleManager()
    
    # Transition through lifecycle states
    lifecycle_manager.configure()
    lifecycle_manager.activate()
    
    try:
        rclpy.spin(lifecycle_manager)
    except KeyboardInterrupt:
        pass
    finally:
        lifecycle_manager.deactivate()
        lifecycle_manager.cleanup()
        lifecycle_manager.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Nav2 Configuration for Humanoid Robots

### Basic Configuration

```yaml
# config/nav2_params.yaml
amcl:
  ros__parameters:
    use_sim_time: False
    alpha1: 0.2
    alpha2: 0.2
    alpha3: 0.2
    alpha4: 0.2
    alpha5: 0.2
    base_frame_id: "base_footprint"
    beam_skip_distance: 0.5
    beam_skip_error_threshold: 0.9
    beam_skip_threshold: 0.3
    do_beamskip: false
    global_frame_id: "map"
    lambda_short: 0.1
    laser_likelihood_max_dist: 2.0
    laser_max_range: 100.0
    laser_min_range: -1.0
    laser_model_type: "likelihood_field"
    max_beams: 60
    max_particles: 2000
    min_particles: 500
    odom_frame_id: "odom"
    pf_err: 0.05
    pf_z: 0.99
    recovery_alpha_fast: 0.0
    recovery_alpha_slow: 0.0
    resample_interval: 1
    robot_model_type: "nav2_amcl::DifferentialMotionModel"
    save_pose_rate: 0.5
    sigma_hit: 0.2
    tf_broadcast: true
    transform_tolerance: 1.0
    update_min_a: 0.2
    update_min_d: 0.25
    z_hit: 0.5
    z_max: 0.05
    z_rand: 0.5
    z_short: 0.05
    scan_topic: scan

bt_navigator:
  ros__parameters:
    use_sim_time: False
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
    - nav2_compute_path_through_poses_action_bt_node
    - nav2_follow_path_action_bt_node
    - nav2_spin_action_bt_node
    - nav2_wait_action_bt_node
    - nav2_assisted_teleop_action_bt_node
    - nav2_back_up_action_bt_node
    - nav2_drive_on_heading_bt_node
    - nav2_clear_costmap_service_bt_node
    - nav2_is_stuck_condition_bt_node
    - nav2_goal_reached_condition_bt_node
    - nav2_goal_updated_condition_bt_node
    - nav2_initial_pose_received_condition_bt_node
    - nav2_reinitialize_global_costmap_service_bt_node
    - nav2_transform_available_condition_bt_node
    - nav2_is_path_valid_condition_bt_node
    - nav2_remove_passed_goals_action_bt_node
    - nav2_planner_selector_bt_node
    - nav2_controller_selector_bt_node
    - nav2_goal_checker_selector_bt_node
    - nav2_controller_cancel_bt_node
    - nav2_path_longer_on_approach_bt_node
    - nav2_wait_cancel_bt_node
    - nav2_spin_cancel_bt_node
    - nav2_back_up_cancel_bt_node
    - nav2_assisted_teleop_cancel_bt_node
    - nav2_drive_on_heading_cancel_bt_node

controller_server:
  ros__parameters:
    use_sim_time: False
    controller_frequency: 20.0
    min_x_velocity_threshold: 0.001
    min_y_velocity_threshold: 0.5
    min_theta_velocity_threshold: 0.001
    progress_checker_plugin: "progress_checker"
    goal_checker_plugin: "goal_checker"
    controller_plugins: ["FollowPath"]

    # Progress checker parameters
    progress_checker:
      plugin: "nav2_controller::SimpleProgressChecker"
      required_movement_radius: 0.5
      movement_time_allowance: 10.0

    # Goal checker parameters
    goal_checker:
      plugin: "nav2_controller::SimpleGoalChecker"
      xy_goal_tolerance: 0.25
      yaw_goal_tolerance: 0.25
      stateful: True

    # DWB parameters
    FollowPath:
      plugin: "nav2_navfn_planner::NavfnPlanner"
      debug_trajectory_details: False
      min_vel_x: 0.0
      min_vel_y: 0.0
      max_vel_x: 0.3
      max_vel_y: 0.0
      max_vel_theta: 1.0
      min_speed_xy: 0.0
      max_speed_xy: 0.3
      min_speed_theta: 0.0
      acc_lim_x: 2.5
      acc_lim_y: 0.0
      acc_lim_theta: 3.2
      decel_lim_x: -2.5
      decel_lim_y: 0.0
      decel_lim_theta: -3.2
      vx_samples: 20
      vy_samples: 5
      vtheta_samples: 20
      sim_time: 1.7
      linear_granularity: 0.05
      angular_granularity: 0.025
      transform_tolerance: 0.2
      xy_goal_tolerance: 0.25
      yaw_goal_tolerance: 0.25
      stateful: True
      restore_defaults: False
      publish_cost_grid_pc: False
      conservative_reset_dist: 3.0
      controller_frequency: 20.0

local_costmap:
  local_costmap:
    ros__parameters:
      update_frequency: 5.0
      publish_frequency: 2.0
      global_frame: odom
      robot_base_frame: base_link
      use_sim_time: False
      rolling_window: true
      width: 3
      height: 3
      resolution: 0.05
      robot_radius: 0.22
      plugins: ["voxel_layer", "inflation_layer"]
      inflation_layer:
        plugin: "nav2_costmap_2d::InflationLayer"
        cost_scaling_factor: 3.0
        inflation_radius: 0.55
      voxel_layer:
        plugin: "nav2_costmap_2d::VoxelLayer"
        enabled: True
        publish_voxel_map: False
        origin_z: 0.0
        z_resolution: 0.2
        z_voxels: 10
        max_obstacle_height: 2.0
        mark_threshold: 0
        observation_sources: scan
        scan:
          topic: /scan
          max_obstacle_height: 2.0
          clearing: True
          marking: True
          data_type: "LaserScan"
          raytrace_max_range: 3.0
          raytrace_min_range: 0.0
          obstacle_max_range: 2.5
          obstacle_min_range: 0.0
      static_layer:
        map_subscribe_transient_local: True
      always_send_full_costmap: True

global_costmap:
  global_costmap:
    ros__parameters:
      update_frequency: 1.0
      publish_frequency: 0.5
      global_frame: map
      robot_base_frame: base_link
      use_sim_time: False
      robot_radius: 0.22
      resolution: 0.05
      track_unknown_space: true
      plugins: ["static_layer", "obstacle_layer", "inflation_layer"]
      obstacle_layer:
        plugin: "nav2_costmap_2d::ObstacleLayer"
        enabled: True
        observation_sources: scan
        scan:
          topic: /scan
          max_obstacle_height: 2.0
          clearing: True
          marking: True
          data_type: "LaserScan"
          raytrace_max_range: 3.0
          raytrace_min_range: 0.0
          obstacle_max_range: 2.5
          obstacle_min_range: 0.0
      static_layer:
        plugin: "nav2_costmap_2d::StaticLayer"
        map_subscribe_transient_local: True
      inflation_layer:
        plugin: "nav2_costmap_2d::InflationLayer"
        cost_scaling_factor: 3.0
        inflation_radius: 0.55
      always_send_full_costmap: True

planner_server:
  ros__parameters:
    expected_planner_frequency: 20.0
    use_sim_time: False
    planner_plugins: ["GridBased"]
    GridBased:
      plugin: "nav2_navfn_planner::NavfnPlanner"
      tolerance: 0.5
      use_astar: false
      allow_unknown: true

recoveries_server:
  ros__parameters:
    costmap_topic: local_costmap/costmap_raw
    footprint_topic: local_costmap/published_footprint
    cycle_frequency: 10.0
    recovery_plugins: ["spin", "backup", "wait"]
    recovery_plugin_types: ["nav2_recoveries::Spin", "nav2_recoveries::BackUp", "nav2_recoveries::Wait"]
    spin:
      plugin: "nav2_recoveries::Spin"
      spin_dist: 1.57
    backup:
      plugin: "nav2_recoveries::BackUp"
      backup_dist: 0.15
      backup_speed: 0.025
    wait:
      plugin: "nav2_recoveries::Wait"
      wait_duration: 1.0
```

## Humanoid-Specific Nav2 Configuration

### Custom Parameters for Humanoid Robots

```yaml
# config/humanoid_nav2_params.yaml
amcl:
  ros__parameters:
    use_sim_time: False
    alpha1: 0.1  # Reduced for more stable humanoid pose estimation
    alpha2: 0.1
    alpha3: 0.1
    alpha4: 0.1
    alpha5: 0.1
    base_frame_id: "base_footprint"  # Humanoid base frame
    beam_skip_distance: 0.5
    beam_skip_error_threshold: 0.9
    beam_skip_threshold: 0.3
    do_beamskip: false
    global_frame_id: "map"
    lambda_short: 0.1
    laser_likelihood_max_dist: 2.0
    laser_max_range: 100.0
    laser_min_range: -1.0
    laser_model_type: "likelihood_field"
    max_beams: 60
    max_particles: 2000
    min_particles: 500
    odom_frame_id: "odom"
    pf_err: 0.05
    pf_z: 0.99
    recovery_alpha_fast: 0.0
    recovery_alpha_slow: 0.0
    resample_interval: 1
    robot_model_type: "nav2_amcl::OmniMotionModel"  # Omni-directional for humanoid
    save_pose_rate: 0.5
    sigma_hit: 0.2
    tf_broadcast: true
    transform_tolerance: 1.0
    update_min_a: 0.2
    update_min_d: 0.25
    z_hit: 0.5
    z_max: 0.05
    z_rand: 0.5
    z_short: 0.05
    scan_topic: scan

controller_server:
  ros__parameters:
    use_sim_time: False
    controller_frequency: 10.0  # Lower frequency for humanoid stability
    min_x_velocity_threshold: 0.001
    min_y_velocity_threshold: 0.001  # Allow Y movement for humanoid
    min_theta_velocity_threshold: 0.001
    progress_checker_plugin: "progress_checker"
    goal_checker_plugin: "goal_checker"
    controller_plugins: ["FollowPath"]

    # Progress checker parameters
    progress_checker:
      plugin: "nav2_controller::SimpleProgressChecker"
      required_movement_radius: 0.3  # Larger for humanoid stability
      movement_time_allowance: 15.0  # Longer allowance for humanoid

    # Goal checker parameters
    goal_checker:
      plugin: "nav2_controller::SimpleGoalChecker"
      xy_goal_tolerance: 0.3  # Larger tolerance for humanoid
      yaw_goal_tolerance: 0.3
      stateful: True

    # Humanoid-specific controller
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

local_costmap:
  local_costmap:
    ros__parameters:
      update_frequency: 5.0
      publish_frequency: 2.0
      global_frame: odom
      robot_base_frame: base_footprint  # Humanoid base frame
      use_sim_time: False
      rolling_window: true
      width: 4  # Larger window for humanoid
      height: 4
      resolution: 0.05
      robot_radius: 0.3  # Larger radius for humanoid
      plugins: ["voxel_layer", "inflation_layer"]
      inflation_layer:
        plugin: "nav2_costmap_2d::InflationLayer"
        cost_scaling_factor: 2.0  # Reduced for humanoid
        inflation_radius: 0.6  # Larger for humanoid safety
      voxel_layer:
        plugin: "nav2_costmap_2d::VoxelLayer"
        enabled: True
        publish_voxel_map: False
        origin_z: 0.0
        z_resolution: 0.2
        z_voxels: 10
        max_obstacle_height: 2.0
        mark_threshold: 0
        observation_sources: scan
        scan:
          topic: /scan
          max_obstacle_height: 2.0
          clearing: True
          marking: True
          data_type: "LaserScan"
          raytrace_max_range: 3.0
          raytrace_min_range: 0.0
          obstacle_max_range: 2.5
          obstacle_min_range: 0.0
      static_layer:
        map_subscribe_transient_local: True
      always_send_full_costmap: True

global_costmap:
  global_costmap:
    ros__parameters:
      update_frequency: 1.0
      publish_frequency: 0.5
      global_frame: map
      robot_base_frame: base_footprint  # Humanoid base frame
      use_sim_time: False
      robot_radius: 0.3  # Larger radius for humanoid
      resolution: 0.05
      track_unknown_space: true
      plugins: ["static_layer", "obstacle_layer", "inflation_layer"]
      obstacle_layer:
        plugin: "nav2_costmap_2d::ObstacleLayer"
        enabled: True
        observation_sources: scan
        scan:
          topic: /scan
          max_obstacle_height: 2.0
          clearing: True
          marking: True
          data_type: "LaserScan"
          raytrace_max_range: 3.0
          raytrace_min_range: 0.0
          obstacle_max_range: 2.5
          obstacle_min_range: 0.0
      static_layer:
        plugin: "nav2_costmap_2d::StaticLayer"
        map_subscribe_transient_local: True
      inflation_layer:
        plugin: "nav2_costmap_2d::InflationLayer"
        cost_scaling_factor: 2.0  # Reduced for humanoid
        inflation_radius: 0.6  # Larger for humanoid safety
      always_send_full_costmap: True

planner_server:
  ros__parameters:
    expected_planner_frequency: 10.0  # Lower for humanoid
    use_sim_time: False
    planner_plugins: ["GridBased"]
    GridBased:
      plugin: "nav2_navfn_planner::NavfnPlanner"
      tolerance: 0.8  # Higher tolerance for humanoid
      use_astar: true  # A* for better humanoid path planning
      allow_unknown: true
```

## Nav2 Integration with Humanoid Robot

### Navigation Interface Node

```python
import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy
from geometry_msgs.msg import PoseStamped
from nav2_msgs.action import NavigateToPose
from std_msgs.msg import String
from tf2_ros import Buffer, TransformListener
import tf_transformations
import math

class HumanoidNavigationNode(Node):
    def __init__(self):
        super().__init__('humanoid_navigation_node')
        
        # Create action client for navigation
        self.nav_client = ActionClient(self, NavigateToPose, 'navigate_to_pose')
        
        # Create TF buffer and listener
        self.tf_buffer = Buffer()
        self.tf_listener = TransformListener(self.tf_buffer, self)
        
        # Publishers
        self.status_pub = self.create_publisher(String, '/navigation_status', 10)
        
        # Navigation state
        self.is_navigating = False
        self.current_goal = None
        
        # Wait for navigation server
        self.get_logger().info('Waiting for navigation server...')
        self.nav_client.wait_for_server()
        self.get_logger().info('Navigation server available')
        
        self.get_logger().info('Humanoid Navigation Node initialized')

    def navigate_to_pose(self, x, y, theta, frame_id='map'):
        """Send navigation goal to Nav2"""
        # Wait for server
        if not self.nav_client.wait_for_server(timeout_sec=5.0):
            self.get_logger().error('Navigation server not available')
            return False
        
        # Create navigation goal
        goal_msg = NavigateToPose.Goal()
        goal_msg.pose.header.frame_id = frame_id
        goal_msg.pose.header.stamp = self.get_clock().now().to_msg()
        
        # Set position
        goal_msg.pose.pose.position.x = x
        goal_msg.pose.pose.position.y = y
        goal_msg.pose.pose.position.z = 0.0
        
        # Convert theta to quaternion
        quat = tf_transformations.quaternion_from_euler(0, 0, theta)
        goal_msg.pose.pose.orientation.x = quat[0]
        goal_msg.pose.pose.orientation.y = quat[1]
        goal_msg.pose.pose.orientation.z = quat[2]
        goal_msg.pose.pose.orientation.w = quat[3]
        
        self.current_goal = goal_msg.pose
        
        # Send goal
        self.get_logger().info(f'Sending navigation goal: ({x:.2f}, {y:.2f}, {theta:.2f})')
        
        send_goal_future = self.nav_client.send_goal_async(
            goal_msg,
            feedback_callback=self.feedback_callback
        )
        
        send_goal_future.add_done_callback(self.goal_response_callback)
        
        return True

    def goal_response_callback(self, future):
        """Handle goal response"""
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.get_logger().error('Goal rejected by navigation server')
            self.is_navigating = False
            return
        
        self.get_logger().info('Goal accepted by navigation server')
        self.is_navigating = True
        
        # Get result
        get_result_future = goal_handle.get_result_async()
        get_result_future.add_done_callback(self.get_result_callback)

    def feedback_callback(self, feedback_msg):
        """Handle navigation feedback"""
        feedback = feedback_msg.feedback
        remaining_distance = feedback.distance_remaining
        
        self.get_logger().info(f'Distance remaining: {remaining_distance:.2f}m')
        
        # Publish status
        status_msg = String()
        status_msg.data = f'Navigating, {remaining_distance:.2f}m remaining'
        self.status_pub.publish(status_msg)

    def get_result_callback(self, future):
        """Handle navigation result"""
        result = future.result().result
        status = future.result().status
        
        if status == 4:  # SUCCEEDED
            self.get_logger().info('Navigation succeeded')
        else:
            self.get_logger().info(f'Navigation failed with status: {status}')
        
        self.is_navigating = False
        
        # Publish final status
        status_msg = String()
        status_msg.data = f'Navigation completed with status: {status}'
        self.status_pub.publish(status_msg)

    def cancel_navigation(self):
        """Cancel current navigation goal"""
        if self.is_navigating:
            # This would cancel the current goal
            self.get_logger().info('Canceling navigation goal')
            # Implementation would go here

def main(args=None):
    rclpy.init(args=args)
    nav_node = HumanoidNavigationNode()
    
    # Example: Navigate to a specific pose
    # nav_node.navigate_to_pose(2.0, 2.0, 0.0)  # x, y, theta
    
    try:
        rclpy.spin(nav_node)
    except KeyboardInterrupt:
        nav_node.cancel_navigation()
    finally:
        nav_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Advanced Nav2 Features for Humanoid Robots

### Custom Recovery Behaviors

```python
import rclpy
from rclpy.node import Node
from rclpy.action import ActionServer, CancelResponse
from rclpy.callback_groups import ReentrantCallbackGroup
from rclpy.executors import MultiThreadedExecutor
from nav2_msgs.action import BackUp, Spin, Wait
from geometry_msgs.msg import Twist
from std_msgs.msg import String
import threading
import time

class HumanoidRecoveryNode(Node):
    def __init__(self):
        super().__init__('humanoid_recovery_node')
        
        # Create action servers for custom recovery behaviors
        self.backup_server = ActionServer(
            self,
            BackUp,
            'backup_recovery',
            self.backup_callback,
            callback_group=ReentrantCallbackGroup()
        )
        
        self.spin_server = ActionServer(
            self,
            Spin,
            'spin_recovery',
            self.spin_callback,
            callback_group=ReentrantCallbackGroup()
        )
        
        self.wait_server = ActionServer(
            self,
            Wait,
            'wait_recovery',
            self.wait_callback,
            callback_group=ReentrantCallbackGroup()
        )
        
        # Publisher for velocity commands
        self.cmd_vel_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        
        # Publisher for status
        self.status_pub = self.create_publisher(String, '/recovery_status', 10)
        
        self.get_logger().info('Humanoid Recovery Node initialized')

    def backup_callback(self, goal_handle):
        """Handle backup recovery behavior"""
        self.get_logger().info('Executing backup recovery')
        
        # Publish status
        status_msg = String()
        status_msg.data = 'Executing backup recovery'
        self.status_pub.publish(status_msg)
        
        # Get parameters
        backup_dist = goal_handle.request.backup_dist
        backup_speed = goal_handle.request.speed
        
        # Execute backup
        success = self.execute_backup(backup_dist, backup_speed)
        
        # Create result
        result = BackUp.Result()
        result.completed = success
        
        if success:
            goal_handle.succeed()
            self.get_logger().info('Backup recovery succeeded')
        else:
            goal_handle.abort()
            self.get_logger().info('Backup recovery failed')
        
        return result

    def execute_backup(self, distance, speed):
        """Execute backup movement"""
        # Calculate number of iterations
        duration = abs(distance) / abs(speed)
        start_time = time.time()
        
        while time.time() - start_time < duration:
            # Publish backup command
            cmd_vel = Twist()
            cmd_vel.linear.x = -speed  # Negative for backing up
            cmd_vel.angular.z = 0.0
            
            self.cmd_vel_pub.publish(cmd_vel)
            
            # Sleep briefly
            time.sleep(0.1)
            
            # Check for cancellation
            # In a real implementation, you'd check goal_handle.is_cancel_requested
        
        # Stop robot
        cmd_vel = Twist()
        cmd_vel.linear.x = 0.0
        cmd_vel.angular.z = 0.0
        self.cmd_vel_pub.publish(cmd_vel)
        
        return True

    def spin_callback(self, goal_handle):
        """Handle spin recovery behavior"""
        self.get_logger().info('Executing spin recovery')
        
        # Publish status
        status_msg = String()
        status_msg.data = 'Executing spin recovery'
        self.status_pub.publish(status_msg)
        
        # Get parameters
        spin_dist = goal_handle.request.spin_dist
        
        # Execute spin
        success = self.execute_spin(spin_dist)
        
        # Create result
        result = Spin.Result()
        result.completed = success
        
        if success:
            goal_handle.succeed()
            self.get_logger().info('Spin recovery succeeded')
        else:
            goal_handle.abort()
            self.get_logger().info('Spin recovery failed')
        
        return result

    def execute_spin(self, angle_rad):
        """Execute spin movement"""
        # Calculate number of iterations
        duration = abs(angle_rad) / 0.5  # Assuming 0.5 rad/s spin speed
        start_time = time.time()
        
        while time.time() - start_time < duration:
            # Publish spin command
            cmd_vel = Twist()
            cmd_vel.linear.x = 0.0
            cmd_vel.angular.z = 0.5 if angle_rad > 0 else -0.5
            
            self.cmd_vel_pub.publish(cmd_vel)
            
            # Sleep briefly
            time.sleep(0.1)
            
            # Check for cancellation
            # In a real implementation, you'd check goal_handle.is_cancel_requested
        
        # Stop robot
        cmd_vel = Twist()
        cmd_vel.linear.x = 0.0
        cmd_vel.angular.z = 0.0
        self.cmd_vel_pub.publish(cmd_vel)
        
        return True

    def wait_callback(self, goal_handle):
        """Handle wait recovery behavior"""
        self.get_logger().info('Executing wait recovery')
        
        # Publish status
        status_msg = String()
        status_msg.data = 'Executing wait recovery'
        self.status_pub.publish(status_msg)
        
        # Get parameters
        wait_duration = goal_handle.request.time_to_wait
        
        # Execute wait
        success = self.execute_wait(wait_duration)
        
        # Create result
        result = Wait.Result()
        result.completed = success
        
        if success:
            goal_handle.succeed()
            self.get_logger().info('Wait recovery succeeded')
        else:
            goal_handle.abort()
            self.get_logger().info('Wait recovery failed')
        
        return result

    def execute_wait(self, duration):
        """Execute wait behavior"""
        start_time = time.time()
        
        while time.time() - start_time < duration:
            # Publish zero velocity to hold position
            cmd_vel = Twist()
            cmd_vel.linear.x = 0.0
            cmd_vel.angular.z = 0.0
            self.cmd_vel_pub.publish(cmd_vel)
            
            # Sleep briefly
            time.sleep(0.1)
            
            # Check for cancellation
            # In a real implementation, you'd check goal_handle.is_cancel_requested
        
        return True

def main(args=None):
    rclpy.init(args=args)
    recovery_node = HumanoidRecoveryNode()
    
    # Use multi-threaded executor to handle multiple action servers
    executor = MultiThreadedExecutor(num_threads=3)
    executor.add_node(recovery_node)
    
    try:
        executor.spin()
    except KeyboardInterrupt:
        pass
    finally:
        recovery_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Nav2 with VSLAM Integration

### Combining VSLAM and Nav2

```python
import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient
from geometry_msgs.msg import PoseStamped, Twist
from nav2_msgs.action import NavigateToPose
from sensor_msgs.msg import LaserScan
from std_msgs.msg import String
from tf2_ros import Buffer, TransformListener
import tf_transformations
import numpy as np

class VSLAMNav2IntegrationNode(Node):
    def __init__(self):
        super().__init__('vs_lam_nav2_integration_node')
        
        # Create action client for navigation
        self.nav_client = ActionClient(self, NavigateToPose, 'navigate_to_pose')
        
        # Create TF buffer and listener
        self.tf_buffer = Buffer()
        self.tf_listener = TransformListener(self.tf_buffer, self)
        
        # Subscriptions
        self.vs_lam_pose_sub = self.create_subscription(
            PoseStamped,
            '/visual_slam/pose',
            self.vs_lam_pose_callback,
            10
        )
        
        self.laser_sub = self.create_subscription(
            LaserScan,
            '/scan',
            self.laser_callback,
            10
        )
        
        # Publishers
        self.cmd_vel_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        self.status_pub = self.create_publisher(String, '/integration_status', 10)
        
        # Integration state
        self.vs_lam_pose = None
        self.nav_active = False
        self.localization_quality = 1.0
        
        # Navigation parameters
        self.min_localization_quality = 0.5
        self.fallback_navigation_active = False
        
        self.get_logger().info('VSLAM-Nav2 Integration Node initialized')

    def vs_lam_pose_callback(self, msg):
        """Update pose from VSLAM"""
        self.vs_lam_pose = msg.pose
        
        # Estimate localization quality based on VSLAM confidence
        # This is a simplified approach
        self.localization_quality = min(1.0, self.estimate_localization_quality())
        
        self.get_logger().debug(f'VSLAM pose updated, quality: {self.localization_quality:.2f}')

    def laser_callback(self, msg):
        """Process laser scan for navigation"""
        # Check if laser data is valid
        if len(msg.ranges) > 0:
            # Update costmap with laser data if needed
            pass

    def estimate_localization_quality(self):
        """Estimate localization quality based on VSLAM data"""
        # This is a simplified approach
        # In practice, you'd use more sophisticated methods
        # based on feature tracking, loop closure, etc.
        return 0.8  # Placeholder value

    def navigate_with_vs_lam_fallback(self, x, y, theta, frame_id='map'):
        """Navigate with VSLAM as localization fallback"""
        if self.localization_quality > self.min_localization_quality:
            # Use Nav2 with VSLAM localization
            self.use_nav2_navigation(x, y, theta, frame_id)
        else:
            # Use VSLAM-based navigation as fallback
            self.use_vs_lam_navigation(x, y, theta)

    def use_nav2_navigation(self, x, y, theta, frame_id='map'):
        """Use standard Nav2 navigation"""
        if not self.nav_client.wait_for_server(timeout_sec=5.0):
            self.get_logger().error('Navigation server not available')
            return False
        
        # Create navigation goal
        goal_msg = NavigateToPose.Goal()
        goal_msg.pose.header.frame_id = frame_id
        goal_msg.pose.header.stamp = self.get_clock().now().to_msg()
        
        # Set position
        goal_msg.pose.pose.position.x = x
        goal_msg.pose.pose.position.y = y
        goal_msg.pose.pose.position.z = 0.0
        
        # Convert theta to quaternion
        quat = tf_transformations.quaternion_from_euler(0, 0, theta)
        goal_msg.pose.pose.orientation.x = quat[0]
        goal_msg.pose.pose.orientation.y = quat[1]
        goal_msg.pose.pose.orientation.z = quat[2]
        goal_msg.pose.pose.orientation.w = quat[3]
        
        # Send goal
        self.get_logger().info(f'Using Nav2 navigation to: ({x:.2f}, {y:.2f}, {theta:.2f})')
        
        send_goal_future = self.nav_client.send_goal_async(
            goal_msg,
            feedback_callback=self.feedback_callback
        )
        
        send_goal_future.add_done_callback(self.goal_response_callback)
        
        self.nav_active = True
        return True

    def use_vs_lam_navigation(self, x, y, theta):
        """Use VSLAM-based navigation as fallback"""
        self.get_logger().info(f'Using VSLAM-based navigation to: ({x:.2f}, {y:.2f}, {theta:.2f})')
        
        # Implement simple proportional navigation based on VSLAM pose
        self.fallback_navigation_active = True
        
        # Start navigation thread
        import threading
        nav_thread = threading.Thread(target=self.execute_vs_lam_navigation, args=(x, y, theta))
        nav_thread.start()

    def execute_vs_lam_navigation(self, target_x, target_y, target_theta):
        """Execute VSLAM-based navigation"""
        while self.fallback_navigation_active:
            if self.vs_lam_pose:
                # Calculate current position
                current_x = self.vs_lam_pose.position.x
                current_y = self.vs_lam_pose.position.y
                
                # Calculate direction to target
                dx = target_x - current_x
                dy = target_y - current_y
                distance = np.sqrt(dx*dx + dy*dy)
                
                # Check if reached
                if distance < 0.3:  # 30cm threshold
                    self.get_logger().info('Reached target using VSLAM navigation')
                    self.stop_robot()
                    self.fallback_navigation_active = False
                    break
                
                # Calculate control commands
                cmd_vel = Twist()
                
                # Linear velocity proportional to distance
                cmd_vel.linear.x = min(0.3, max(0.05, distance * 0.5))
                
                # Angular velocity to face target
                target_angle = np.arctan2(dy, dx)
                current_yaw = self.get_current_yaw()
                angle_diff = target_angle - current_yaw
                
                # Normalize angle difference
                while angle_diff > np.pi:
                    angle_diff -= 2 * np.pi
                while angle_diff < -np.pi:
                    angle_diff += 2 * np.pi
                
                cmd_vel.angular.z = max(-0.5, min(0.5, angle_diff * 2.0))
                
                # Publish command
                self.cmd_vel_pub.publish(cmd_vel)
            
            # Sleep briefly
            time.sleep(0.1)

    def get_current_yaw(self):
        """Get current yaw from VSLAM pose"""
        if self.vs_lam_pose:
            quat = (
                self.vs_lam_pose.orientation.x,
                self.vs_lam_pose.orientation.y,
                self.vs_lam_pose.orientation.z,
                self.vs_lam_pose.orientation.w
            )
            euler = tf_transformations.euler_from_quaternion(quat)
            return euler[2]  # Yaw
        return 0.0

    def stop_robot(self):
        """Stop the robot"""
        cmd_vel = Twist()
        cmd_vel.linear.x = 0.0
        cmd_vel.angular.z = 0.0
        self.cmd_vel_pub.publish(cmd_vel)

    def feedback_callback(self, feedback_msg):
        """Handle navigation feedback"""
        feedback = feedback_msg.feedback
        remaining_distance = feedback.distance_remaining
        
        self.get_logger().debug(f'Nav2 distance remaining: {remaining_distance:.2f}m')

    def goal_response_callback(self, future):
        """Handle goal response"""
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.get_logger().error('Goal rejected by navigation server')
            self.nav_active = False
            return
        
        self.get_logger().info('Goal accepted by navigation server')
        
        # Get result
        get_result_future = goal_handle.get_result_async()
        get_result_future.add_done_callback(self.get_result_callback)

    def get_result_callback(self, future):
        """Handle navigation result"""
        result = future.result().result
        status = future.result().status
        
        if status == 4:  # SUCCEEDED
            self.get_logger().info('Nav2 navigation succeeded')
        else:
            self.get_logger().info(f'Nav2 navigation failed with status: {status}')
        
        self.nav_active = False

def main(args=None):
    rclpy.init(args=args)
    integration_node = VSLAMNav2IntegrationNode()
    
    # Example: Navigate to a specific pose using integrated system
    # integration_node.navigate_with_vs_lam_fallback(3.0, 3.0, 0.0)
    
    try:
        rclpy.spin(integration_node)
    except KeyboardInterrupt:
        integration_node.stop_robot()
    finally:
        integration_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    import time  # Added import for the execute_vs_lam_navigation method
    main()
```

## Performance Optimization for Humanoid Navigation

### Adaptive Parameter Tuning

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
from geometry_msgs.msg import Twist
from sensor_msgs.msg import LaserScan
import numpy as np

class AdaptiveNavigationTuner(Node):
    def __init__(self):
        super().__init__('adaptive_navigation_tuner')
        
        # Subscriptions
        self.cmd_vel_sub = self.create_subscription(
            Twist,
            '/cmd_vel',
            self.cmd_vel_callback,
            10
        )
        
        self.laser_sub = self.create_subscription(
            LaserScan,
            '/scan',
            self.laser_callback,
            10
        )
        
        self.velocity_scale_pub = self.create_publisher(Float32, '/velocity_scaling', 10)
        
        # Navigation parameters
        self.linear_vel = 0.3
        self.angular_vel = 0.5
        self.obstacle_threshold = 1.0  # meters
        self.velocity_scale = 1.0
        
        # Adaptive tuning parameters
        self.tuning_active = True
        self.tuning_timer = self.create_timer(0.5, self.tune_parameters)
        
        self.get_logger().info('Adaptive Navigation Tuner initialized')

    def cmd_vel_callback(self, msg):
        """Monitor commanded velocities"""
        self.last_cmd_vel = msg

    def laser_callback(self, msg):
        """Process laser scan for obstacle detection"""
        if len(msg.ranges) > 0:
            # Find minimum distance in front of robot
            front_ranges = msg.ranges[len(msg.ranges)//2-30:len(msg.ranges)//2+30]
            self.min_front_dist = min(front_ranges) if front_ranges else float('inf')

    def tune_parameters(self):
        """Adaptively tune navigation parameters"""
        if not self.tuning_active:
            return
        
        # Adjust velocity based on obstacle proximity
        if hasattr(self, 'min_front_dist'):
            if self.min_front_dist < self.obstacle_threshold:
                # Scale velocity based on distance to obstacle
                self.velocity_scale = max(0.1, self.min_front_dist / self.obstacle_threshold)
            else:
                # Normal speed when clear
                self.velocity_scale = 1.0
        
        # Publish velocity scaling factor
        scale_msg = Float32()
        scale_msg.data = self.velocity_scale
        self.velocity_scale_pub.publish(scale_msg)
        
        self.get_logger().debug(f'Velocity scale: {self.velocity_scale:.2f}, '
                               f'Min front dist: {getattr(self, "min_front_dist", "N/A"):.2f}')

def main(args=None):
    rclpy.init(args=args)
    tuner = AdaptiveNavigationTuner()
    
    try:
        rclpy.spin(tuner)
    except KeyboardInterrupt:
        pass
    finally:
        tuner.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Best Practices for Nav2 Implementation

### 1. Configuration Management
- Use separate parameter files for different environments
- Implement parameter validation
- Monitor parameter changes during runtime
- Document parameter meanings and ranges

### 2. Safety Considerations
- Implement velocity limiting
- Use appropriate safety margins
- Monitor robot state continuously
- Implement emergency stops

### 3. Performance Optimization
- Tune controller frequencies appropriately
- Optimize costmap resolution
- Use appropriate planner algorithms
- Monitor computational resources

### 4. Debugging and Monitoring
- Enable Nav2's built-in monitoring tools
- Use RViz for visualization
- Monitor navigation performance metrics
- Log navigation events for analysis

## Troubleshooting Common Issues

### 1. Localization Problems
- Verify TF tree integrity
- Check sensor data quality
- Validate initial pose estimation
- Monitor particle filter performance

### 2. Path Planning Issues
- Verify costmap configuration
- Check map quality and resolution
- Validate robot footprint
- Monitor planner performance

### 3. Control Problems
- Verify controller parameters
- Check robot kinematics
- Monitor control frequency
- Validate velocity commands

## Summary

In this chapter, we've explored the Nav2 navigation stack and its integration with humanoid robots. We've covered the architecture, configuration, and implementation of navigation systems that leverage both traditional approaches and VSLAM for enhanced localization. Nav2 provides a robust and flexible framework for autonomous navigation, with the ability to adapt to humanoid-specific requirements. In the next chapter, we'll explore path planning techniques specifically tailored for humanoid robots.