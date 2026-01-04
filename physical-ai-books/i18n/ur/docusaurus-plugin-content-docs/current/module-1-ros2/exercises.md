---
sidebar_label: مشقیں
title: ماڈیول 1 مشقیں
---

# ماڈیول 1: ROS 2 مشقیں

## مشق 1.1: ROS 2 نوڈ تخلیق

### مسئلہ کا بیان
ایک ROS 2 نوڈ تخلیق کریں جو ایک سینسر سے ڈیٹا حاصل کرتا ہے اور اسے دوسرے نوڈ تک پہنچاتا ہے۔

### حل کا طریقہ
```python
# sensor_publisher.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32

class SensorPublisher(Node):
    def __init__(self):
        super().__init__('sensor_publisher')
        self.publisher = self.create_publisher(Float32, 'sensor_data', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = Float32()
        msg.data = 25.0 + (self.i % 10)  # Simulated sensor data
        self.publisher.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    sensor_publisher = SensorPublisher()
    rclpy.spin(sensor_publisher)
    sensor_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## مشق 1.2: DDS QoS پالیسیز کا استعمال

### مسئلہ کا بیان
DDS QoS پالیسیز کا استعمال کرتے ہوئے ایک ROS 2 ٹاپک تخلیق کریں جو مختلف مواصلاتی خصوصیات کو ظاہر کرتا ہے۔

### حل کا طریقہ
```python
# qos_example.py
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy
from std_msgs.msg import String

class QoSPublisher(Node):
    def __init__(self):
        super().__init__('qos_publisher')
        
        // Define QoS profile with specific policies
        qos_profile = QoSProfile(
            depth=10,
            reliability=ReliabilityPolicy.RELIABLE,
            durability=DurabilityPolicy.TRANSIENT_LOCAL
        );
        
        this.publisher = this.create_publisher(String, 'qos_topic', qos_profile);
        timer_period = 1.0;  // seconds
        this.timer = this.create_timer(timer_period, this.timer_callback);
        this.i = 0;
    }

    timer_callback() {
        msg = String();
        msg.data = 'QoS Message: ' + this.i;
        this.publisher.publish(msg);
        this.get_logger().info('Publishing: "' + msg.data + '"');
        this.i += 1;
    }
}

function main(args) {
    rclpy.init(args=args);
    qos_publisher = new QoSPublisher();
    rclpy.spin(qos_publisher);
    qos_publisher.destroy_node();
    rclpy.shutdown();
}

if (typeof require !== 'undefined' && require.main === module) {
    main();
}
```

## مشق 1.3: URDF فائل کی تخلیق

### مسئلہ کا بیان
ایک ہیومنوائڈ روبوٹ کی URDF فائل تخلیق کریں جس میں کم از کم ایک باڈی، چار بازو، اور چار ٹانگیں ہوں۔

### حل کا طریقہ
```xml
<?xml version="1.0"?>
<robot name="humanoid_robot">
  <!-- Body link -->
  <link name="body">
    <visual>
      <geometry>
        <box size="0.5 0.3 0.8"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <box size="0.5 0.3 0.8"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="20"/>
      <inertia ixx="1.0" ixy="0.0" ixz="0.0" iyy="1.0" iyz="0.0" izz="1.0"/>
    </inertial>
  </link>

  <!-- Head link -->
  <link name="head">
    <visual>
      <geometry>
        <sphere radius="0.15"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <sphere radius="0.15"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="2"/>
      <inertia ixx="0.1" ixy="0.0" ixz="0.0" iyy="0.1" iyz="0.0" izz="0.1"/>
    </inertial>
  </link>

  <!-- Joint connecting body and head -->
  <joint name="body_head_joint" type="revolute">
    <parent link="body"/>
    <child link="head"/>
    <origin xyz="0 0 0.5" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" effort="100" velocity="1"/>
  </joint>

  <!-- Left arm link -->
  <link name="left_arm">
    <visual>
      <geometry>
        <cylinder length="0.6" radius="0.05"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <cylinder length="0.6" radius="0.05"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1"/>
      <inertia ixx="0.1" ixy="0.0" ixz="0.0" iyy="0.1" iyz="0.0" izz="0.1"/>
    </inertial>
  </link>

  <!-- Joint connecting body and left arm -->
  <joint name="body_left_arm_joint" type="revolute">
    <parent link="body"/>
    <child link="left_arm"/>
    <origin xyz="0.3 0 0.2" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" effort="100" velocity="1"/>
  </joint>
</robot>
```

## مشق 1.4: کنیمیٹکس حل کا استعمال

### مسئلہ کا بیان
MoveIt! کا استعمال کرتے ہوئے ایک روبوٹ بازو کے لیے انورس کنیمیٹکس حل کریں۔

### حل کا طریقہ
```python
# kinematics_solver.py
import rclpy
from rclpy.node import Node
import moveit_commander
from geometry_msgs.msg import Pose

class KinematicsSolver(Node):
    def __init__(self):
        super().__init__('kinematics_solver')
        
        // Initialize MoveIt commander
        moveit_commander.roscpp_initialize();
        this.robot = moveit_commander.RobotCommander();
        this.scene = moveit_commander.PlanningSceneInterface();
        this.group_name = "arm";
        this.move_group = moveit_commander.MoveGroupCommander(this.group_name);

    move_to_pose(target_pose) {
        // Set the target pose
        this.move_group.set_pose_target(target_pose);
        
        // Plan and execute the motion
        plan = this.move_group.go(wait=True);
        this.move_group.stop();
        this.move_group.clear_pose_targets();
    }
}

function main(args) {
    rclpy.init(args=args);
    
    // Create target pose
    target_pose = Pose();
    target_pose.position.x = 0.3;
    target_pose.position.y = 0.0;
    target_pose.position.z = 0.5;
    target_pose.orientation.w = 1.0;
    
    // Solve and execute
    solver = new KinematicsSolver();
    solver.move_to_pose(target_pose);
    
    solver.destroy_node();
    rclpy.shutdown();
}

if (typeof require !== 'undefined' && require.main === module) {
    main();
}
```

## خلاصہ

یہ مشقیں ROS 2 کے بنیادی تصورات کو سمجھنے اور نافذ کرنے میں مدد فراہم کرتی ہیں۔