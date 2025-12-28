# Chapter 2: DDS Communication Model

## Overview

The Data Distribution Service (DDS) is the underlying communication middleware that powers ROS 2. Understanding DDS is crucial for developing robust and efficient robotic systems. This chapter explores the DDS communication model and how it enables reliable communication between robot components.

## What is DDS?

DDS (Data Distribution Service) is a middleware specification that provides a standardized API for machine-to-machine communication. It implements a publish-subscribe pattern and provides quality of service (QoS) policies that allow fine-tuning of communication behavior.

## DDS Architecture

### Data-Centricity

Unlike traditional communication systems that focus on connecting applications, DDS is data-centric. This means that communication is centered around data rather than connections between applications. Publishers and subscribers interact with data samples in a global data space called the DDS Global Data Space.

### DDS Entities

The DDS model includes several key entities:

- **Domain**: A communication plane that isolates DDS applications from each other
- **DomainParticipant**: An application's participation in a domain
- **Topic**: A named data channel with a specific data type
- **Publisher**: An entity that sends data to topics
- **Subscriber**: An entity that receives data from topics
- **DataWriter**: An endpoint that writes data to a specific topic
- **DataReader**: An endpoint that reads data from a specific topic

## Quality of Service (QoS) Policies

DDS provides a rich set of QoS policies that allow fine-tuning of communication behavior:

### Reliability Policy
- **Reliable**: All messages are delivered, potentially with retries
- **Best Effort**: Messages are sent once without guarantee of delivery

### Durability Policy
- **Transient Local**: Data is available to late-joining subscribers
- **Volatile**: Data is only available to currently connected subscribers

### History Policy
- **Keep Last**: Only the most recent samples are kept
- **Keep All**: All samples are kept (subject to resource limits)

### Deadline Policy
Defines the maximum time between sample updates.

### Lifespan Policy
Defines how long a sample is considered valid.

## ROS 2 Implementation

ROS 2 maps its concepts to DDS entities:
- ROS 2 Nodes contain DomainParticipants
- ROS 2 Topics map to DDS Topics
- ROS 2 Publishers map to DDS DataWriters
- ROS 2 Subscribers map to DDS DataReaders

## Practical Example

Here's how to configure QoS policies in ROS 2:

```python
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy
from std_msgs.msg import String

class QoSPublisher(Node):
    def __init__(self):
        super().__init__('qos_publisher')
        
        # Create a QoS profile with specific policies
        qos_profile = QoSProfile(
            depth=10,
            reliability=ReliabilityPolicy.RELIABLE,
            durability=DurabilityPolicy.TRANSIENT_LOCAL
        )
        
        self.publisher = self.create_publisher(String, 'qos_topic', qos_profile)
        self.timer = self.create_timer(1.0, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = f'QoS Message: {self.i}'
        self.publisher.publish(msg)
        self.get_logger().info(f'Published: "{msg.data}"')
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    qos_publisher = QoSPublisher()
    rclpy.spin(qos_publisher)
    qos_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Summary

The DDS communication model provides a robust foundation for ROS 2 applications. By understanding QoS policies, you can configure your robotic systems to meet specific performance and reliability requirements. In the next chapter, we'll explore how to implement robot controllers using the rclpy library.