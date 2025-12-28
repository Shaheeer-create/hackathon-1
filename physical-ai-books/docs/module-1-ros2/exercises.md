# Exercises and Solutions: Module 1 - The Robotic Nervous System (ROS 2)

## Exercise 1: Basic Publisher-Subscriber

### Problem
Create a ROS 2 publisher that publishes the current time in seconds since epoch to a topic called "current_time". Create a subscriber that listens to this topic and prints the received time.

### Solution
Publisher code:
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float64
import time

class TimePublisher(Node):
    def __init__(self):
        super().__init__('time_publisher')
        self.publisher = self.create_publisher(Float64, 'current_time', 10)
        timer_period = 1  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)

    def timer_callback(self):
        msg = Float64()
        msg.data = time.time()
        self.publisher.publish(msg)
        self.get_logger().info(f'Publishing: {msg.data}')

def main(args=None):
    rclpy.init(args=args)
    time_publisher = TimePublisher()
    rclpy.spin(time_publisher)
    time_publisher.destroy_node()
    rclpy.shutdown()
```

Subscriber code:
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float64

class TimeSubscriber(Node):
    def __init__(self):
        super().__init__('time_subscriber')
        self.subscription = self.create_subscription(
            Float64,
            'current_time',
            self.listener_callback,
            10)
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        self.get_logger().info(f'Received time: {msg.data}')

def main(args=None):
    rclpy.init(args=args)
    time_subscriber = TimeSubscriber()
    rclpy.spin(time_subscriber)
    time_subscriber.destroy_node()
    rclpy.shutdown()
```

## Exercise 2: Simple Service

### Problem
Create a ROS 2 service that takes two integers as input and returns their sum. The service should be named "add_two_ints".

### Solution
Service server:
```python
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class AddService(Node):
    def __init__(self):
        super().__init__('add_service')
        self.srv = self.create_service(AddTwoInts, 'add_two_ints', self.add_callback)

    def add_callback(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info(f'{request.a} + {request.b} = {response.sum}')
        return response

def main(args=None):
    rclpy.init(args=args)
    add_service = AddService()
    rclpy.spin(add_service)
    add_service.destroy_node()
    rclpy.shutdown()
```

Service client:
```python
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class AddClient(Node):
    def __init__(self):
        super().__init__('add_client')
        self.cli = self.create_client(AddTwoInts, 'add_two_ints')
        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Service not available, waiting again...')
        self.req = AddTwoInts.Request()

    def send_request(self, a, b):
        self.req.a = a
        self.req.b = b
        future = self.cli.call_async(self.req)
        return future

def main(args=None):
    rclpy.init(args=args)
    add_client = AddClient()
    
    future = add_client.send_request(2, 3)
    rclpy.spin_until_future_complete(add_client, future)
    
    if future.result() is not None:
        response = future.result()
        add_client.get_logger().info(f'Result: {response.sum}')
    else:
        add_client.get_logger().error('Exception while calling service: %r' % future.exception())
    
    add_client.destroy_node()
    rclpy.shutdown()
```

## Exercise 3: URDF Model

### Problem
Create a URDF file for a simple robot with a base, a single rotating joint, and a box-shaped end-effector. The base should be a cylinder, the joint should be revolute (rotating around Z-axis), and the end-effector should be a box.

### Solution
```xml
<?xml version="1.0"?>
<robot name="simple_robot">
  <material name="blue">
    <color rgba="0 0 1 1"/>
  </material>
  
  <link name="base_link">
    <visual>
      <geometry>
        <cylinder radius="0.1" length="0.2"/>
      </geometry>
      <material name="blue"/>
      <origin xyz="0 0 0.1" rpy="0 0 0"/>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.1" length="0.2"/>
      </geometry>
      <origin xyz="0 0 0.1" rpy="0 0 0"/>
    </collision>
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.01" ixy="0" ixz="0" iyy="0.01" iyz="0" izz="0.005"/>
    </inertial>
  </link>

  <joint name="rotating_joint" type="revolute">
    <parent link="base_link"/>
    <child link="end_effector"/>
    <origin xyz="0 0 0.2" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-3.14" upper="3.14" effort="100" velocity="1"/>
  </joint>

  <link name="end_effector">
    <visual>
      <geometry>
        <box size="0.05 0.05 0.05"/>
      </geometry>
      <material name="blue"/>
    </visual>
    <collision>
      <geometry>
        <box size="0.05 0.05 0.05"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="0.1"/>
      <inertia ixx="0.0001" ixy="0" ixz="0" iyy="0.0001" iyz="0" izz="0.0001"/>
    </inertial>
  </link>
</robot>
```

## Exercise 4: Forward Kinematics

### Problem
Implement forward kinematics for a 2-DOF planar manipulator with link lengths of 1.0 and 0.8 units. The function should take joint angles (in radians) and return the end-effector position (x, y).

### Solution
```python
import math

def forward_kinematics(joint_angles):
    """
    Calculate end-effector position for a 2-DOF planar manipulator
    joint_angles: [theta1, theta2] in radians
    Returns: (x, y) position of end-effector
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

# Test the function
joint_angles = [math.pi/4, math.pi/6]  # 45 and 30 degrees
end_effector_pos = forward_kinematics(joint_angles)
print(f"End-effector position: ({end_effector_pos[0]:.2f}, {end_effector_pos[1]:.2f})")
```

## Exercise 5: Inverse Kinematics

### Problem
Implement inverse kinematics for the same 2-DOF planar manipulator. The function should take an end-effector position (x, y) and return the required joint angles (theta1, theta2).

### Solution
```python
import math

def inverse_kinematics(x, y):
    """
    Calculate joint angles for a 2-DOF planar manipulator
    x, y: desired end-effector position
    Returns: [theta1, theta2] joint angles in radians
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
    # Clamp to avoid numerical errors
    cos_theta2 = max(-1, min(1, cos_theta2))
    theta2 = math.acos(cos_theta2)
    
    # Calculate theta1
    k1 = l1 + l2 * math.cos(theta2)
    k2 = l2 * math.sin(theta2)
    theta1 = math.atan2(y, x) - math.atan2(k2, k1)
    
    return [theta1, theta2]

# Test the function
try:
    desired_pos = [1.2, 0.8]
    joint_angles = inverse_kinematics(desired_pos[0], desired_pos[1])
    print(f"Required joint angles: [{joint_angles[0]:.2f}, {joint_angles[1]:.2f}] radians")
    
    # Verify with forward kinematics
    x_calc, y_calc = forward_kinematics(joint_angles)
    print(f"Verification - calculated position: ({x_calc:.2f}, {y_calc:.2f})")
except ValueError as e:
    print(f"Error: {e}")
```

## Exercise 6: TF2 Transformations

### Problem
Create a ROS 2 node that publishes a transform from "base_link" to "sensor_frame" where the sensor is positioned 0.1m forward, 0.2m left, and 0.5m up from the base, with a 90-degree rotation around the Z-axis.

### Solution
```python
import rclpy
from rclpy.node import Node
from tf2_ros import TransformBroadcaster
from geometry_msgs.msg import TransformStamped
import math

class TransformPublisher(Node):
    def __init__(self):
        super().__init__('transform_publisher')
        
        # Create transform broadcaster
        self.tf_broadcaster = TransformBroadcaster(self)
        
        # Timer to publish transforms
        self.timer = self.create_timer(0.1, self.publish_transforms)

    def publish_transforms(self):
        # Create a transform from base_link to sensor_frame
        t = TransformStamped()
        
        # Set header
        t.header.stamp = self.get_clock().now().to_msg()
        t.header.frame_id = 'base_link'
        t.child_frame_id = 'sensor_frame'
        
        # Set translation (0.1m forward, 0.2m left, 0.5m up)
        t.transform.translation.x = 0.1
        t.transform.translation.y = 0.2
        t.transform.translation.z = 0.5
        
        # Set rotation (90-degree rotation around Z-axis)
        # For 90-degree rotation around Z: w=cos(θ/2), z=sin(θ/2)
        angle = math.pi / 2  # 90 degrees in radians
        t.transform.rotation.x = 0.0
        t.transform.rotation.y = 0.0
        t.transform.rotation.z = math.sin(angle / 2)
        t.transform.rotation.w = math.cos(angle / 2)
        
        # Publish the transform
        self.tf_broadcaster.sendTransform(t)

def main(args=None):
    rclpy.init(args=args)
    transform_publisher = TransformPublisher()
    
    try:
        rclpy.spin(transform_publisher)
    except KeyboardInterrupt:
        pass
    finally:
        transform_publisher.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Exercise 7: Robot Controller

### Problem
Create a ROS 2 node that subscribes to "cmd_vel" (geometry_msgs/Twist) and publishes appropriate joint commands to move a differential drive robot. Assume the robot has left_wheel and right_wheel joints.

### Solution
```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from std_msgs.msg import Float64
import math

class DiffDriveController(Node):
    def __init__(self):
        super().__init__('diff_drive_controller')
        
        # Robot parameters
        self.wheel_radius = 0.05  # meters
        self.wheel_base = 0.3     # meters (distance between wheels)
        
        # Publishers for wheel commands
        self.left_wheel_pub = self.create_publisher(Float64, 'left_wheel_cmd', 10)
        self.right_wheel_pub = self.create_publisher(Float64, 'right_wheel_cmd', 10)
        
        # Subscriber for velocity commands
        self.cmd_vel_sub = self.create_subscription(
            Twist,
            'cmd_vel',
            self.cmd_vel_callback,
            10
        )
        
        self.get_logger().info('Differential Drive Controller initialized')

    def cmd_vel_callback(self, msg):
        # Extract linear and angular velocities
        linear_vel = msg.linear.x
        angular_vel = msg.angular.z
        
        # Calculate wheel velocities for differential drive
        # v_left = v - (w * L/2)
        # v_right = v + (w * L/2)
        # where v is linear velocity, w is angular velocity, L is wheel base
        left_wheel_vel = linear_vel - (angular_vel * self.wheel_base / 2.0)
        right_wheel_vel = linear_vel + (angular_vel * self.wheel_base / 2.0)
        
        # Convert linear wheel velocities to angular velocities (rad/s)
        left_wheel_ang_vel = left_wheel_vel / self.wheel_radius
        right_wheel_ang_vel = right_wheel_vel / self.wheel_radius
        
        # Publish wheel commands
        left_msg = Float64()
        left_msg.data = left_wheel_ang_vel
        self.left_wheel_pub.publish(left_msg)
        
        right_msg = Float64()
        right_msg.data = right_wheel_ang_vel
        self.right_wheel_pub.publish(right_msg)

def main(args=None):
    rclpy.init(args=args)
    controller = DiffDriveController()
    
    try:
        rclpy.spin(controller)
    except KeyboardInterrupt:
        pass
    finally:
        controller.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Exercise 8: AI-ROS Bridge

### Problem
Create a simple bridge node that receives natural language commands (as strings), converts them to simple robot actions (e.g., "move forward" → linear velocity), and publishes the appropriate ROS messages.

### Solution
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import Twist

class SimpleAIBridge(Node):
    def __init__(self):
        super().__init__('simple_ai_bridge')
        
        # Publisher for velocity commands
        self.cmd_vel_pub = self.create_publisher(Twist, 'cmd_vel', 10)
        
        # Subscriber for natural language commands
        self.command_sub = self.create_subscription(
            String,
            'natural_language_commands',
            self.command_callback,
            10
        )
        
        self.get_logger().info('Simple AI Bridge initialized')

    def command_callback(self, msg):
        command = msg.data.lower()
        self.get_logger().info(f'Received command: {command}')
        
        # Simple command parsing
        twist_msg = Twist()
        
        if 'forward' in command or 'move' in command:
            twist_msg.linear.x = 0.5  # Move forward at 0.5 m/s
        elif 'backward' in command:
            twist_msg.linear.x = -0.5  # Move backward at 0.5 m/s
        elif 'left' in command:
            twist_msg.angular.z = 0.5  # Turn left at 0.5 rad/s
        elif 'right' in command:
            twist_msg.angular.z = -0.5  # Turn right at 0.5 rad/s
        elif 'stop' in command or 'halt' in command:
            # Already zero, but being explicit
            twist_msg.linear.x = 0.0
            twist_msg.angular.z = 0.0
        else:
            self.get_logger().warn(f'Unknown command: {command}')
            return
        
        # Publish the command
        self.cmd_vel_pub.publish(twist_msg)
        self.get_logger().info(f'Published velocity command: linear.x={twist_msg.linear.x}, angular.z={twist_msg.angular.z}')

def main(args=None):
    rclpy.init(args=args)
    ai_bridge = SimpleAIBridge()
    
    try:
        rclpy.spin(ai_bridge)
    except KeyboardInterrupt:
        pass
    finally:
        ai_bridge.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

These exercises cover the fundamental concepts of ROS 2, including topics, services, URDF, kinematics, transformations, and AI integration. Each exercise builds on the concepts introduced in the chapters and provides practical implementation experience.