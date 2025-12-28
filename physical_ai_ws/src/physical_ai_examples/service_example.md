# Service Example for Physical AI & Humanoid Robotics

## Overview
This example demonstrates how to create and use services in ROS 2 using Python.

## Service Server
```python
# service_server.py
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class MinimalService(Node):
    def __init__(self):
        super().__init__('minimal_service')
        self.srv = self.create_service(AddTwoInts, 'add_two_ints', self.add_callback)

    def add_callback(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info(f'{request.a} + {request.b} = {response.sum}')
        return response

def main(args=None):
    rclpy.init(args=args)
    minimal_service = MinimalService()
    rclpy.spin(minimal_service)
    minimal_service.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Service Client
```python
# service_client.py
import sys
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class MinimalClient(Node):
    def __init__(self):
        super().__init__('minimal_client')
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
    minimal_client = MinimalClient()
    
    if len(sys.argv) != 3:
        minimal_client.get_logger().info('Usage: ros2 run my_package service_client.py <int1> <int2>')
        return
    
    future = minimal_client.send_request(int(sys.argv[1]), int(sys.argv[2]))
    rclpy.spin_until_future_complete(minimal_client, future)
    
    if future.result() is not None:
        response = future.result()
        minimal_client.get_logger().info(f'Result: {response.sum}')
    else:
        minimal_client.get_logger().error('Exception while calling service: %r' % future.exception())
    
    minimal_client.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## How to Run
1. Source your ROS 2 environment:
   ```bash
   source /opt/ros/humble/setup.bash  # or your ROS 2 distro
   ```

2. Run the service server in one terminal:
   ```bash
   python3 service_server.py
   ```

3. Run the service client in another terminal with two integers as arguments:
   ```bash
   python3 service_client.py 2 3
   ```

You should see the server compute and return the sum of the two integers.