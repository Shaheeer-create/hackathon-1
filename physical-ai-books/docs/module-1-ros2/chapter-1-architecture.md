# Chapter 1: ROS 2 Architecture Concepts

## Overview

This chapter introduces the fundamental concepts of ROS 2 (Robot Operating System 2), which serves as the middleware for our humanoid robotics system. ROS 2 provides the communication infrastructure that allows different components of our robot to work together seamlessly.

## What is ROS 2?

ROS 2 is the next generation of the Robot Operating System, designed to address the limitations of ROS 1 and provide a more robust, scalable, and production-ready framework for robotics development. Unlike ROS 1, which was primarily designed for research environments, ROS 2 is built with industrial applications in mind.

## Key Concepts

### Nodes
Nodes are the fundamental building blocks of a ROS 2 system. Each node typically performs a specific function, such as sensor data processing, motion planning, or control. Nodes can be written in different programming languages (C++, Python, etc.) and communicate with each other through topics, services, and actions.

### Topics
Topics enable asynchronous, many-to-many communication between nodes using a publish-subscribe pattern. Publishers send messages to a topic, and subscribers receive messages from that topic. This decouples nodes from each other, allowing for flexible system architectures.

### Services
Services provide synchronous, request-response communication between nodes. A client sends a request to a service, and the service processes the request and returns a response. This is useful for operations that require immediate feedback.

### Actions
Actions are used for long-running tasks that may take a significant amount of time to complete. They provide feedback during execution and can be preempted if needed. Actions are ideal for navigation, manipulation, and other complex robot behaviors.

## DDS Communication Layer

ROS 2 uses DDS (Data Distribution Service) as its underlying communication middleware. DDS provides quality of service (QoS) policies that allow fine-tuning of communication behavior, such as reliability, durability, and deadline requirements.

## Practical Example

Let's create a simple publisher-subscriber example to demonstrate ROS 2 concepts:

```python
# publisher_node.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher = self.create_publisher(String, 'topic', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = f'Hello World: {self.i}'
        self.publisher.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    minimal_publisher = MinimalPublisher()
    rclpy.spin(minimal_publisher)
    minimal_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Summary

In this chapter, we've covered the fundamental concepts of ROS 2 architecture. Understanding these concepts is crucial for building more complex robotic systems. In the next chapter, we'll dive deeper into the DDS communication model that underlies ROS 2's communication infrastructure.