# Chapter 3: Python Robot Controllers with rclpy

## Overview

This chapter focuses on implementing robot controllers using the rclpy library, which is the Python client library for ROS 2. We'll explore how to create nodes, handle different types of communication (topics, services, actions), and implement basic control algorithms for our humanoid robot.

## Introduction to rclpy

rclpy is the Python client library for ROS 2, providing Python bindings for the ROS 2 client library (rcl). It allows Python developers to create ROS 2 nodes, publish and subscribe to topics, provide and call services, and work with actions.

## Creating a Basic Node

Let's start with the basic structure of a ROS 2 node in Python:

```python
import rclpy
from rclpy.node import Node

class RobotController(Node):
    def __init__(self):
        super().__init__('robot_controller')
        self.get_logger().info('Robot Controller node initialized')

def main(args=None):
    rclpy.init(args=args)
    robot_controller = RobotController()
    
    try:
        rclpy.spin(robot_controller)
    except KeyboardInterrupt:
        pass
    finally:
        robot_controller.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Implementing Publishers and Subscribers

Here's an example of a node that both publishes and subscribes to topics:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float64
from sensor_msgs.msg import JointState

class JointController(Node):
    def __init__(self):
        super().__init__('joint_controller')
        
        # Create publisher for joint commands
        self.joint_cmd_publisher = self.create_publisher(
            Float64, 
            'joint_command', 
            10
        )
        
        # Create subscriber for joint states
        self.joint_state_subscriber = self.create_subscription(
            JointState,
            'joint_states',
            self.joint_state_callback,
            10
        )
        
        # Timer for control loop
        self.timer = self.create_timer(0.1, self.control_loop)
        
        self.get_logger().info('Joint Controller initialized')

    def joint_state_callback(self, msg):
        self.get_logger().info(f'Received joint states: {msg.name}')

    def control_loop(self):
        # Simple control logic
        cmd_msg = Float64()
        cmd_msg.data = 1.0  # Example command
        self.joint_cmd_publisher.publish(cmd_msg)

def main(args=None):
    rclpy.init(args=args)
    joint_controller = JointController()
    
    try:
        rclpy.spin(joint_controller)
    except KeyboardInterrupt:
        pass
    finally:
        joint_controller.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Implementing Services

Services provide synchronous request-response communication:

```python
import rclpy
from rclpy.node import Node
from example_interfaces.srv import SetBool

class RobotService(Node):
    def __init__(self):
        super().__init__('robot_service')
        
        self.srv = self.create_service(
            SetBool, 
            'robot_enable', 
            self.enable_callback
        )
        
        self.enabled = False

    def enable_callback(self, request, response):
        self.enabled = request.data
        response.success = True
        response.message = f'Robot {"enabled" if self.enabled else "disabled"}'
        
        self.get_logger().info(response.message)
        return response

def main(args=None):
    rclpy.init(args=args)
    robot_service = RobotService()
    
    try:
        rclpy.spin(robot_service)
    except KeyboardInterrupt:
        pass
    finally:
        robot_service.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Implementing Actions

Actions are used for long-running tasks with feedback:

```python
import rclpy
from rclpy.action import ActionServer, CancelResponse, GoalResponse
from rclpy.node import Node
from example_interfaces.action import Fibonacci

class RobotActionServer(Node):
    def __init__(self):
        super().__init__('robot_action_server')
        self._action_server = ActionServer(
            self,
            Fibonacci,
            'fibonacci',
            execute_callback=self.execute_callback,
            callback_group=rclpy.callback_groups.ReentrantCallbackGroup(),
            goal_callback=self.goal_callback,
            cancel_callback=self.cancel_callback
        )

    def goal_callback(self, goal_request):
        self.get_logger().info('Received goal request')
        return GoalResponse.ACCEPT

    def cancel_callback(self, goal_handle):
        self.get_logger().info('Received cancel request')
        return CancelResponse.ACCEPT

    async def execute_callback(self, goal_handle):
        self.get_logger().info('Executing goal...')
        
        feedback_msg = Fibonacci.Feedback()
        feedback_msg.sequence = [0, 1]
        
        for i in range(1, goal_handle.request.order):
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                self.get_logger().info('Goal canceled')
                return Fibonacci.Result()

            feedback_msg.sequence.append(
                feedback_msg.sequence[i] + feedback_msg.sequence[i-1]
            )
            
            self.get_logger().info(f'Publishing feedback: {feedback_msg.sequence}')
            goal_handle.publish_feedback(feedback_msg)

        goal_handle.succeed()
        result = Fibonacci.Result()
        result.sequence = feedback_msg.sequence
        self.get_logger().info(f'Goal succeeded with result: {result.sequence}')
        
        return result

def main(args=None):
    rclpy.init(args=args)
    robot_action_server = RobotActionServer()
    
    try:
        rclpy.spin(robot_action_server)
    except KeyboardInterrupt:
        pass
    finally:
        robot_action_server.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Practical Robot Controller Example

Here's a more complete example of a robot controller that combines multiple communication patterns:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float64
from sensor_msgs.msg import JointState
from geometry_msgs.msg import Twist
import math

class HumanoidController(Node):
    def __init__(self):
        super().__init__('humanoid_controller')
        
        # Publishers for joint commands
        self.left_hip_publisher = self.create_publisher(Float64, 'left_hip_cmd', 10)
        self.right_hip_publisher = self.create_publisher(Float64, 'right_hip_cmd', 10)
        self.left_knee_publisher = self.create_publisher(Float64, 'left_knee_cmd', 10)
        self.right_knee_publisher = self.create_publisher(Float64, 'right_knee_cmd', 10)
        
        # Subscriber for velocity commands
        self.cmd_vel_subscriber = self.create_subscription(
            Twist,
            'cmd_vel',
            self.cmd_vel_callback,
            10
        )
        
        # Timer for control loop
        self.timer = self.create_timer(0.05, self.control_loop)  # 20 Hz
        
        # Robot state
        self.cmd_vel = Twist()
        self.joint_positions = {'left_hip': 0.0, 'right_hip': 0.0, 'left_knee': 0.0, 'right_knee': 0.0}
        
        self.get_logger().info('Humanoid Controller initialized')

    def cmd_vel_callback(self, msg):
        self.cmd_vel = msg

    def control_loop(self):
        # Simple inverse kinematics for walking
        linear_vel = self.cmd_vel.linear.x
        angular_vel = self.cmd_vel.angular.z
        
        # Calculate joint angles based on desired velocity
        left_hip_angle = linear_vel * 0.1 + angular_vel * 0.05
        right_hip_angle = linear_vel * 0.1 - angular_vel * 0.05
        left_knee_angle = abs(linear_vel) * 0.05
        right_knee_angle = abs(linear_vel) * 0.05
        
        # Publish joint commands
        self.publish_joint_command(self.left_hip_publisher, left_hip_angle)
        self.publish_joint_command(self.right_hip_publisher, right_hip_angle)
        self.publish_joint_command(self.left_knee_publisher, left_knee_angle)
        self.publish_joint_command(self.right_knee_publisher, right_knee_angle)

    def publish_joint_command(self, publisher, value):
        msg = Float64()
        msg.data = value
        publisher.publish(msg)

def main(args=None):
    rclpy.init(args=args)
    humanoid_controller = HumanoidController()
    
    try:
        rclpy.spin(humanoid_controller)
    except KeyboardInterrupt:
        pass
    finally:
        humanoid_controller.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Summary

In this chapter, we've explored how to implement robot controllers using rclpy. We've covered the basic patterns for publishers, subscribers, services, and actions, and created a practical example of a humanoid controller. In the next chapter, we'll explore how to bridge AI agents to ROS 2 for intelligent robot control.