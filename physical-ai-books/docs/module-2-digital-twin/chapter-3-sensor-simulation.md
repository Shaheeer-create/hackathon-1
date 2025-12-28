# Chapter 3: Sensor Simulation

## Overview

Sensor simulation is a critical component of realistic robotics simulation. In this chapter, we'll explore how to simulate various types of sensors in Gazebo, including cameras, LiDAR, IMU, and other sensors commonly used in humanoid robotics. We'll cover the configuration of these sensors, their properties, and how to integrate them with ROS 2.

## Types of Sensors in Robotics

### 1. Vision Sensors
- RGB cameras
- Depth cameras
- Stereo cameras
- Thermal cameras

### 2. Range Sensors
- LiDAR (2D and 3D)
- Sonar
- Infrared sensors

### 3. Inertial Sensors
- IMU (Inertial Measurement Unit)
- Accelerometer
- Gyroscope

### 4. Force/Torque Sensors
- Force-torque sensors
- Tactile sensors

### 5. Other Sensors
- GPS
- Magnetometer
- Barometer

## Camera Simulation

### Basic Camera Configuration

```xml
<gazebo reference="camera_link">
  <sensor type="camera" name="camera1">
    <update_rate>30.0</update_rate>
    <camera name="head">
      <horizontal_fov>1.3962634</horizontal_fov>
      <image>
        <width>800</width>
        <height>600</height>
        <format>R8G8B8</format>
      </image>
      <clip>
        <near>0.02</near>
        <far>300</far>
      </clip>
    </camera>
    <plugin name="camera_controller" filename="libgazebo_ros_camera.so">
      <frame_name>camera_link</frame_name>
      <topic_name>/humanoid_robot/camera/image_raw</topic_name>
      <camera_info_topic_name>/humanoid_robot/camera/camera_info</camera_info_topic_name>
    </plugin>
  </sensor>
</gazebo>
```

### Depth Camera Configuration

```xml
<gazebo reference="depth_camera_link">
  <sensor type="depth" name="depth_camera">
    <update_rate>30.0</update_rate>
    <camera name="depth_cam">
      <horizontal_fov>1.047</horizontal_fov>
      <image>
        <width>640</width>
        <height>480</height>
        <format>R8G8B8</format>
      </image>
      <clip>
        <near>0.1</near>
        <far>10</far>
      </clip>
    </camera>
    <plugin name="depth_camera_controller" filename="libgazebo_ros_openni_kinect.so">
      <baseline>0.2</baseline>
      <alwaysOn>true</alwaysOn>
      <updateRate>30.0</updateRate>
      <cameraName>depth_camera</cameraName>
      <imageTopicName>/humanoid_robot/depth_camera/image_raw</imageTopicName>
      <depthImageTopicName>/humanoid_robot/depth_camera/depth/image_raw</depthImageTopicName>
      <pointCloudTopicName>/humanoid_robot/depth_camera/points</pointCloudTopicName>
      <cameraInfoTopicName>/humanoid_robot/depth_camera/camera_info</cameraInfoTopicName>
      <frameName>depth_camera_optical_frame</frameName>
      <pointCloudCutoff>0.5</pointCloudCutoff>
      <pointCloudCutoffMax>5.0</pointCloudCutoffMax>
      <distortion_k1>0.0</distortion_k1>
      <distortion_k2>0.0</distortion_k2>
      <distortion_k3>0.0</distortion_k3>
      <distortion_t1>0.0</distortion_t1>
      <distortion_t2>0.0</distortion_t2>
      <CxPrime>0.0</CxPrime>
      <Cx>0.0</Cx>
      <Cy>0.0</Cy>
      <focalLength>0.0</focalLength>
      <hackBaseline>0.0</hackBaseline>
    </plugin>
  </sensor>
</gazebo>
```

## LiDAR Simulation

### 2D LiDAR (Hokuyo-style)

```xml
<gazebo reference="laser_link">
  <sensor type="ray" name="laser_2d">
    <pose>0 0 0 0 0 0</pose>
    <visualize>true</visualize>
    <update_rate>10</update_rate>
    <ray>
      <scan>
        <horizontal>
          <samples>720</samples>
          <resolution>1</resolution>
          <min_angle>-1.570796</min_angle>
          <max_angle>1.570796</max_angle>
        </horizontal>
      </scan>
      <range>
        <min>0.10</min>
        <max>30.0</max>
        <resolution>0.01</resolution>
      </range>
      <noise>
        <type>gaussian</type>
        <mean>0.0</mean>
        <stddev>0.01</stddev>
      </noise>
    </ray>
    <plugin name="laser_scan" filename="libgazebo_ros_ray_sensor.so">
      <ros>
        <namespace>/humanoid_robot</namespace>
        <remapping>~/out:=scan</remapping>
      </ros>
      <output_type>sensor_msgs/LaserScan</output_type>
      <frame_name>laser_link</frame_name>
    </plugin>
  </sensor>
</gazebo>
```

### 3D LiDAR (Velodyne-style)

```xml
<gazebo reference="velodyne_link">
  <sensor type="ray" name="velodyne_VLP_16">
    <pose>0 0 0 0 0 0</pose>
    <visualize>false</visualize>
    <update_rate>10</update_rate>
    <ray>
      <scan>
        <horizontal>
          <samples>1800</samples>
          <resolution>1</resolution>
          <min_angle>-3.141592653589793</min_angle>
          <max_angle>3.141592653589793</max_angle>
        </horizontal>
        <vertical>
          <samples>16</samples>
          <resolution>1</resolution>
          <min_angle>-0.2617993877991494</min_angle>
          <max_angle>0.2617993877991494</max_angle>
        </vertical>
      </scan>
      <range>
        <min>0.1</min>
        <max>100</max>
        <resolution>0.01</resolution>
      </range>
    </ray>
    <plugin name="gazebo_ros_laser" filename="libgazebo_ros_velodyne_gpu_laser.so">
      <ros>
        <namespace>/humanoid_robot</namespace>
        <remapping>~/out:=points</remapping>
      </ros>
      <output_type>sensor_msgs/PointCloud2</output_type>
      <frame_name>velodyne_link</frame_name>
      <min_range>0.1</min_range>
      <max_range>100</max_range>
      <gaussian_noise>0.008</gaussian_noise>
    </plugin>
  </sensor>
</gazebo>
```

## IMU Simulation

```xml
<gazebo reference="imu_link">
  <sensor name="imu_sensor" type="imu">
    <always_on>true</always_on>
    <update_rate>100</update_rate>
    <visualize>false</visualize>
    <imu>
      <angular_velocity>
        <x>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>2e-4</stddev>
            <bias_mean>0.0000075</bias_mean>
            <bias_stddev>0.0000008</bias_stddev>
          </noise>
        </x>
        <y>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>2e-4</stddev>
            <bias_mean>0.0000075</bias_mean>
            <bias_stddev>0.0000008</bias_stddev>
          </noise>
        </y>
        <z>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>2e-4</stddev>
            <bias_mean>0.0000075</bias_mean>
            <bias_stddev>0.0000008</bias_stddev>
          </noise>
        </z>
      </angular_velocity>
      <linear_acceleration>
        <x>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>1.7e-2</stddev>
            <bias_mean>0.1</bias_mean>
            <bias_stddev>0.001</bias_stddev>
          </noise>
        </x>
        <y>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>1.7e-2</stddev>
            <bias_mean>0.1</bias_mean>
            <bias_stddev>0.001</bias_stddev>
          </noise>
        </y>
        <z>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>1.7e-2</stddev>
            <bias_mean>0.1</bias_mean>
            <bias_stddev>0.001</bias_stddev>
          </noise>
        </z>
      </linear_acceleration>
    </imu>
    <plugin name="imu_plugin" filename="libgazebo_ros_imu.so">
      <ros>
        <namespace>/humanoid_robot</namespace>
        <remapping>~/out:=imu</remapping>
      </ros>
      <frame_name>imu_link</frame_name>
      <body_name>imu_link</body_name>
      <update_rate>100</update_rate>
      <gaussian_noise>0.0017</gaussian_noise>
      <accel_gaussian_noise>0.017</accel_gaussian_noise>
      <rate_gaussian_noise>0.00017</rate_gaussian_noise>
      <topic_name>imu/data</topic_name>
    </plugin>
  </sensor>
</gazebo>
```

## Force/Torque Sensor Simulation

```xml
<gazebo>
  <joint name="force_torque_joint">
    <sensor name="force_torque_sensor" type="force_torque">
      <always_on>true</always_on>
      <update_rate>100</update_rate>
      <force_torque>
        <frame>sensor</frame>
        <measure_direction>child_to_parent</measure_direction>
      </force_torque>
      <plugin name="ft_sensor_plugin" filename="libgazebo_ros_ft_sensor.so">
        <ros>
          <namespace>/humanoid_robot</namespace>
          <remapping>~/out:=wrench</remapping>
        </ros>
        <frame_name>force_torque_link</frame_name>
        <topic_name>ft_sensor/wrench</topic_name>
      </plugin>
    </sensor>
  </joint>
</gazebo>
```

## Sensor Noise and Realism

### Adding Realistic Noise

Realistic sensor noise is crucial for developing robust algorithms:

```xml
<camera name="noisy_camera">
  <noise>
    <type>gaussian</type>
    <mean>0.0</mean>
    <stddev>0.007</stddev>
  </noise>
</camera>

<ray name="noisy_laser">
  <noise>
    <type>gaussian</type>
    <mean>0.0</mean>
    <stddev>0.01</stddev>
  </noise>
</ray>
```

### Sensor Accuracy Parameters

Different sensors have different accuracy characteristics:

- **Cameras**: Focus on resolution, field of view, and noise
- **LiDAR**: Focus on range accuracy, resolution, and noise
- **IMU**: Focus on bias, drift, and noise characteristics
- **GPS**: Focus on position accuracy and update rate

## Sensor Integration with ROS 2

### Creating a Sensor Node

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, LaserScan, Imu, PointCloud2
from cv_bridge import CvBridge
import numpy as np

class SensorProcessor(Node):
    def __init__(self):
        super().__init__('sensor_processor')
        
        # Initialize CV bridge
        self.cv_bridge = CvBridge()
        
        # Create subscribers for different sensor types
        self.image_sub = self.create_subscription(
            Image,
            '/humanoid_robot/camera/image_raw',
            self.image_callback,
            10
        )
        
        self.laser_sub = self.create_subscription(
            LaserScan,
            '/humanoid_robot/scan',
            self.laser_callback,
            10
        )
        
        self.imu_sub = self.create_subscription(
            Imu,
            '/humanoid_robot/imu/data',
            self.imu_callback,
            10
        )
        
        self.pc_sub = self.create_subscription(
            PointCloud2,
            '/humanoid_robot/depth_camera/points',
            self.pointcloud_callback,
            10
        )
        
        self.get_logger().info('Sensor processor initialized')

    def image_callback(self, msg):
        # Process image data
        cv_image = self.cv_bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')
        # Add your image processing code here
        self.get_logger().info(f'Received image: {msg.width}x{msg.height}')

    def laser_callback(self, msg):
        # Process laser scan data
        ranges = np.array(msg.ranges)
        # Add your laser processing code here
        self.get_logger().info(f'Laser scan: {len(msg.ranges)} points')

    def imu_callback(self, msg):
        # Process IMU data
        orientation = msg.orientation
        angular_velocity = msg.angular_velocity
        linear_acceleration = msg.linear_acceleration
        # Add your IMU processing code here
        self.get_logger().info(f'IMU orientation: ({orientation.x}, {orientation.y}, {orientation.z}, {orientation.w})')

    def pointcloud_callback(self, msg):
        # Process point cloud data
        # Add your point cloud processing code here
        self.get_logger().info(f'Point cloud: {msg.width}x{msg.height} points')

def main(args=None):
    rclpy.init(args=args)
    sensor_processor = SensorProcessor()
    
    try:
        rclpy.spin(sensor_processor)
    except KeyboardInterrupt:
        pass
    finally:
        sensor_processor.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Sensor Fusion

Combining data from multiple sensors can provide more robust perception:

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Imu, LaserScan
from geometry_msgs.msg import PoseWithCovarianceStamped
from tf2_ros import TransformListener
import numpy as np

class SensorFusionNode(Node):
    def __init__(self):
        super().__init__('sensor_fusion')
        
        # Subscribers for different sensors
        self.imu_sub = self.create_subscription(Imu, '/humanoid_robot/imu/data', self.imu_callback, 10)
        self.laser_sub = self.create_subscription(LaserScan, '/humanoid_robot/scan', self.laser_callback, 10)
        
        # Publisher for fused estimate
        self.pose_pub = self.create_publisher(PoseWithCovarianceStamped, '/humanoid_robot/fused_pose', 10)
        
        # Store sensor data
        self.imu_data = None
        self.laser_data = None
        
        self.get_logger().info('Sensor fusion node initialized')

    def imu_callback(self, msg):
        self.imu_data = msg
        self.fuse_sensors()

    def laser_callback(self, msg):
        self.laser_data = msg
        self.fuse_sensors()

    def fuse_sensors(self):
        if self.imu_data is not None and self.laser_data is not None:
            # Implement sensor fusion algorithm (e.g., Kalman filter)
            # This is a simplified example
            fused_pose = PoseWithCovarianceStamped()
            fused_pose.header.stamp = self.get_clock().now().to_msg()
            fused_pose.header.frame_id = 'map'
            
            # Publish fused estimate
            self.pose_pub.publish(fused_pose)

def main(args=None):
    rclpy.init(args=args)
    fusion_node = SensorFusionNode()
    
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

## Best Practices for Sensor Simulation

### 1. Match Real Hardware Characteristics
- Use the same resolution, field of view, and update rates as your real sensors
- Add realistic noise models based on sensor specifications
- Consider latency characteristics of real sensors

### 2. Performance Optimization
- Use appropriate update rates (not too high to impact simulation performance)
- Simplify sensor models when possible
- Consider computational cost of sensor processing

### 3. Validation
- Compare simulated sensor data with real sensor data
- Validate that algorithms work with both simulated and real data
- Test edge cases and failure modes

### 4. Documentation
- Document sensor parameters and noise characteristics
- Keep simulation parameters synchronized with real hardware
- Maintain clear mappings between simulated and real topics

## Troubleshooting Common Issues

### 1. Sensor Not Publishing Data
- Check that the sensor plugin is loaded correctly
- Verify frame names match TF tree
- Ensure the physics engine is running

### 2. Incorrect Data
- Verify sensor pose and orientation
- Check for coordinate frame mismatches
- Validate noise parameters

### 3. Performance Issues
- Reduce update rates if not needed
- Simplify sensor models
- Check for plugin conflicts

## Summary

In this chapter, we've explored the simulation of various types of sensors in Gazebo for humanoid robotics. We've covered camera, LiDAR, IMU, and force/torque sensors, including their configuration, noise modeling, and integration with ROS 2. Understanding sensor simulation is crucial for developing and testing perception algorithms for humanoid robots. In the next chapter, we'll explore Unity integration for high-fidelity rendering.