# Chapter 6: Joints, Frames, and Kinematics

## Overview

This chapter explores the mathematical foundations of robot motion, focusing on joints, reference frames, and kinematics. Understanding these concepts is crucial for controlling humanoid robots, as they form the basis for motion planning, control, and perception. We'll cover forward and inverse kinematics with practical examples for humanoid robots.

## Reference Frames and Transformations

### Coordinate Systems

In robotics, we use coordinate systems (frames) to describe the position and orientation of objects in space. ROS uses the right-handed Cartesian coordinate system where:
- X-axis points forward
- Y-axis points left
- Z-axis points up

### Transformations

A transformation describes the position and orientation of one frame relative to another. In ROS, transformations are managed by the `tf2` library.

```python
import rclpy
from rclpy.node import Node
from tf2_ros import TransformBroadcaster
from geometry_msgs.msg import TransformStamped
import math

class FramePublisher(Node):
    def __init__(self):
        super().__init__('frame_publisher')
        
        # Create transform broadcaster
        self.tf_broadcaster = TransformBroadcaster(self)
        
        # Timer to publish transforms
        self.timer = self.create_timer(0.1, self.publish_transforms)
        
        self.time = 0.0

    def publish_transforms(self):
        # Create a transform from base_link to a moving frame
        t = TransformStamped()
        
        # Set header
        t.header.stamp = self.get_clock().now().to_msg()
        t.header.frame_id = 'base_link'
        t.child_frame_id = 'moving_frame'
        
        # Set translation (moving in a circle)
        self.time += 0.1
        radius = 1.0
        t.transform.translation.x = radius * math.cos(self.time)
        t.transform.translation.y = radius * math.sin(self.time)
        t.transform.translation.z = 0.5
        
        # Set rotation (no rotation in this example)
        t.transform.rotation.x = 0.0
        t.transform.rotation.y = 0.0
        t.transform.rotation.z = 0.0
        t.transform.rotation.w = 1.0
        
        # Publish the transform
        self.tf_broadcaster.sendTransform(t)

def main(args=None):
    rclpy.init(args=args)
    frame_publisher = FramePublisher()
    
    try:
        rclpy.spin(frame_publisher)
    except KeyboardInterrupt:
        pass
    finally:
        frame_publisher.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Joint Types in ROS

### Revolute Joint
A joint that rotates around a single axis, with limited rotation range.

### Continuous Joint
A joint that rotates around a single axis, with unlimited rotation range.

### Prismatic Joint
A joint that slides along a single axis, with limited translation range.

### Fixed Joint
A joint that does not move, used to connect two links rigidly.

### Floating Joint
A joint that allows motion in all 6 degrees of freedom (3 translation, 3 rotation).

### Planar Joint
A joint that allows motion in a plane (2 translation, 1 rotation).

## Forward Kinematics

Forward kinematics calculates the end-effector position and orientation given joint angles. For a simple 2-DOF planar manipulator:

```python
import math

def forward_kinematics(joint_angles):
    """
    Calculate end-effector position for a 2-DOF planar manipulator
    joint_angles: [theta1, theta2] in radians
    """
    # Link lengths
    l1 = 1.0  # length of first link
    l2 = 0.8  # length of second link
    
    # Joint angles
    theta1 = joint_angles[0]
    theta2 = joint_angles[1]
    
    # Calculate end-effector position
    x = l1 * math.cos(theta1) + l2 * math.cos(theta1 + theta2)
    y = l1 * math.sin(theta1) + l2 * math.sin(theta1 + theta2)
    
    return x, y

# Example usage
joint_angles = [math.pi/4, math.pi/6]  # 45 and 30 degrees
end_effector_pos = forward_kinematics(joint_angles)
print(f"End-effector position: ({end_effector_pos[0]:.2f}, {end_effector_pos[1]:.2f})")
```

## Inverse Kinematics

Inverse kinematics calculates the joint angles needed to achieve a desired end-effector position. For a 2-DOF planar manipulator:

```python
import math

def inverse_kinematics(x, y):
    """
    Calculate joint angles for a 2-DOF planar manipulator
    x, y: desired end-effector position
    """
    # Link lengths
    l1 = 1.0  # length of first link
    l2 = 0.8  # length of second link
    
    # Check if position is reachable
    distance = math.sqrt(x**2 + y**2)
    if distance > l1 + l2:
        raise ValueError("Position is out of reach")
    if distance < abs(l1 - l2):
        raise ValueError("Position is too close")
    
    # Calculate theta2
    cos_theta2 = (x**2 + y**2 - l1**2 - l2**2) / (2 * l1 * l2)
    sin_theta2 = math.sqrt(1 - cos_theta2**2)  # Take positive solution
    theta2 = math.atan2(sin_theta2, cos_theta2)
    
    # Calculate theta1
    k1 = l1 + l2 * math.cos(theta2)
    k2 = l2 * math.sin(theta2)
    theta1 = math.atan2(y, x) - math.atan2(k2, k1)
    
    return [theta1, theta2]

# Example usage
try:
    desired_pos = [1.2, 0.8]
    joint_angles = inverse_kinematics(desired_pos[0], desired_pos[1])
    print(f"Required joint angles: [{joint_angles[0]:.2f}, {joint_angles[1]:.2f}] radians")
except ValueError as e:
    print(f"Error: {e}")
```

## Kinematics for Humanoid Robots

For humanoid robots, we typically need to solve kinematics for arms and legs separately. Here's an example for a humanoid arm:

```python
import numpy as np
import math

class HumanoidArmKinematics:
    def __init__(self, shoulder_pos=[0, 0, 0], link_lengths=[0.3, 0.3]):
        """
        Initialize humanoid arm kinematics
        shoulder_pos: position of shoulder joint in torso frame
        link_lengths: [upper_arm_length, lower_arm_length]
        """
        self.shoulder_pos = np.array(shoulder_pos)
        self.l1 = link_lengths[0]  # upper arm
        self.l2 = link_lengths[1]  # lower arm
    
    def forward_kinematics(self, joint_angles):
        """
        Calculate end-effector position for humanoid arm
        joint_angles: [shoulder_angle, elbow_angle] in radians
        """
        theta1, theta2 = joint_angles
        
        # Calculate position relative to shoulder
        x_rel = self.l1 * math.cos(theta1) + self.l2 * math.cos(theta1 + theta2)
        y_rel = self.l1 * math.sin(theta1) + self.l2 * math.sin(theta1 + theta2)
        
        # Add shoulder offset to get absolute position
        x_abs = self.shoulder_pos[0] + x_rel
        y_abs = self.shoulder_pos[1] + y_rel
        z_abs = self.shoulder_pos[2]  # Assuming planar motion for simplicity
        
        return [x_abs, y_abs, z_abs]
    
    def inverse_kinematics(self, target_pos):
        """
        Calculate joint angles for desired end-effector position
        target_pos: [x, y, z] desired end-effector position
        """
        # Calculate position relative to shoulder
        x_rel = target_pos[0] - self.shoulder_pos[0]
        y_rel = target_pos[1] - self.shoulder_pos[1]
        # z component ignored for planar solution
        
        # Calculate distance from shoulder to target
        distance = math.sqrt(x_rel**2 + y_rel**2)
        
        # Check reachability
        if distance > self.l1 + self.l2:
            raise ValueError("Target position is out of reach")
        if distance < abs(self.l1 - self.l2):
            raise ValueError("Target position is too close")
        
        # Calculate elbow angle (theta2)
        cos_theta2 = (x_rel**2 + y_rel**2 - self.l1**2 - self.l2**2) / (2 * self.l1 * self.l2)
        # Clamp to avoid numerical errors
        cos_theta2 = max(-1, min(1, cos_theta2))
        theta2 = math.acos(cos_theta2)
        
        # Calculate shoulder angle (theta1)
        k1 = self.l1 + self.l2 * math.cos(theta2)
        k2 = self.l2 * math.sin(theta2)
        theta1 = math.atan2(y_rel, x_rel) - math.atan2(k2, k1)
        
        return [theta1, theta2]

# Example usage
arm_kin = HumanoidArmKinematics(shoulder_pos=[0.2, 0, 0.8])  # Shoulder at [0.2, 0, 0.8]

# Test forward kinematics
joint_angles = [math.pi/4, math.pi/6]  # [shoulder, elbow]
end_pos = arm_kin.forward_kinematics(joint_angles)
print(f"End-effector position: [{end_pos[0]:.2f}, {end_pos[1]:.2f}, {end_pos[2]:.2f}]")

# Test inverse kinematics
target_pos = [0.8, 0.5, 0.8]
try:
    angles = arm_kin.inverse_kinematics(target_pos)
    print(f"Required joint angles: [{angles[0]:.2f}, {angles[1]:.2f}] radians")
    
    # Verify with forward kinematics
    verify_pos = arm_kin.forward_kinematics(angles)
    print(f"Verification - calculated position: [{verify_pos[0]:.2f}, {verify_pos[1]:.2f}, {verify_pos[2]:.2f}]")
except ValueError as e:
    print(f"Error: {e}")
```

## Using KDL for Complex Kinematics

The Kinematics and Dynamics Library (KDL) provides more sophisticated kinematic solutions:

```python
# Note: This is pseudocode as KDL requires specific ROS packages
# In a real implementation, you would use python_orocos_kdl or similar

class KDLKinematics:
    def __init__(self, urdf_file, base_link, tip_link):
        """
        Initialize KDL kinematics solver
        urdf_file: path to robot URDF file
        base_link: name of base link
        tip_link: name of end-effector link
        """
        # Load robot model from URDF
        self.chain = self.load_chain_from_urdf(urdf_file, base_link, tip_link)
        
        # Initialize solvers
        self.fk_solver = self.create_forward_kinematics_solver(self.chain)
        self.ik_solver = self.create_inverse_kinematics_solver(self.chain)
    
    def forward_kinematics(self, joint_angles):
        """Calculate end-effector pose from joint angles"""
        # Implementation using KDL
        pass
    
    def inverse_kinematics(self, target_pose):
        """Calculate joint angles from end-effector pose"""
        # Implementation using KDL
        pass
```

## Kinematics in ROS with MoveIt

MoveIt is the standard motion planning framework for ROS, which includes sophisticated kinematic solvers:

```python
import rclpy
from rclpy.node import Node
from moveit_msgs.srv import GetPositionFK, GetPositionIK

class MoveItKinematicsNode(Node):
    def __init__(self):
        super().__init__('moveit_kinematics_node')
        
        # Create clients for forward and inverse kinematics services
        self.fk_client = self.create_client(GetPositionFK, 'compute_fk')
        self.ik_client = self.create_client(GetPositionIK, 'compute_ik')
        
        # Wait for services to be available
        while not self.fk_client.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('FK service not available, waiting again...')
        
        while not self.ik_client.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('IK service not available, waiting again...')
    
    def compute_forward_kinematics(self, joint_angles, link_names):
        """Compute forward kinematics using MoveIt"""
        request = GetPositionFK.Request()
        request.header.frame_id = 'base_link'
        request.fk_link_names = link_names
        request.robot_state.joint_state.name = ['joint1', 'joint2', 'joint3']  # Replace with actual joint names
        request.robot_state.joint_state.position = joint_angles
        
        future = self.fk_client.call_async(request)
        rclpy.spin_until_future_complete(self, future)
        
        return future.result()
    
    def compute_inverse_kinematics(self, target_pose, link_name, seed_state):
        """Compute inverse kinematics using MoveIt"""
        request = GetPositionIK.Request()
        request.ik_request.group_name = 'arm'  # Replace with actual group name
        request.ik_request.pose_stamped.header.frame_id = 'base_link'
        request.ik_request.pose_stamped.pose = target_pose
        request.ik_request.ik_link_name = link_name
        request.ik_request.robot_state.joint_state = seed_state
        
        future = self.ik_client.call_async(request)
        rclpy.spin_until_future_complete(self, future)
        
        return future.result()

def main(args=None):
    rclpy.init(args=args)
    kinematics_node = MoveItKinematicsNode()
    
    # Example usage would go here
    # Note: This is a simplified example - actual implementation requires
    # a running MoveIt setup with configured robot
    
    kinematics_node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Practical Application: Walking Pattern Generation

Here's a practical example of using kinematics for humanoid walking:

```python
import numpy as np
import math

class WalkingPatternGenerator:
    def __init__(self, step_length=0.3, step_height=0.1, step_time=1.0):
        """
        Initialize walking pattern generator
        step_length: distance of each step
        step_height: height of foot during step
        step_time: time to complete one step
        """
        self.step_length = step_length
        self.step_height = step_height
        self.step_time = step_time
        
        # Initialize phase (0 to 1, where 1 is complete step)
        self.phase = 0.0
    
    def generate_foot_trajectory(self, start_pos, end_pos, phase):
        """
        Generate smooth trajectory for foot movement
        start_pos: starting position of foot [x, y, z]
        end_pos: ending position of foot [x, y, z]
        phase: current phase of step (0.0 to 1.0)
        """
        # Calculate intermediate position
        x = start_pos[0] + (end_pos[0] - start_pos[0]) * phase
        y = start_pos[1] + (end_pos[1] - start_pos[1]) * phase
        
        # Calculate z position with arc for step
        if phase < 0.5:
            # Rising phase
            z = start_pos[2] + self.step_height * math.sin(phase * math.pi)
        else:
            # Falling phase
            z = start_pos[2] + self.step_height * math.sin(phase * math.pi)
        
        return [x, y, z]
    
    def update_walking_phase(self, dt):
        """Update walking phase based on time step"""
        self.phase += dt / self.step_time
        if self.phase > 1.0:
            self.phase = 0.0  # Reset for next step

# Example usage for humanoid walking
def example_walking():
    walker = WalkingPatternGenerator(step_length=0.3, step_height=0.1, step_time=1.0)
    
    # Define step positions (simplified for one foot)
    left_foot_start = [0.0, 0.1, 0.0]   # Starting position
    left_foot_end = [0.3, 0.1, 0.0]     # Ending position after step
    
    # Simulate walking over time
    dt = 0.05  # 20 Hz update rate
    for t in np.arange(0, 2.0, dt):  # 2 seconds of walking
        foot_pos = walker.generate_foot_trajectory(
            left_foot_start, 
            left_foot_end, 
            walker.phase
        )
        
        print(f"Time: {t:.2f}s, Phase: {walker.phase:.2f}, Foot position: [{foot_pos[0]:.2f}, {foot_pos[1]:.2f}, {foot_pos[2]:.2f}]")
        
        walker.update_walking_phase(dt)

if __name__ == '__main__':
    example_walking()
```

## Summary

In this chapter, we've explored the fundamental concepts of joints, reference frames, and kinematics for humanoid robots. We've covered both forward and inverse kinematics with practical examples, and discussed how these concepts apply to humanoid robot control. Understanding these principles is essential for implementing motion planning, control algorithms, and perception systems for humanoid robots. In the next module, we'll explore simulation environments for testing our kinematic solutions.