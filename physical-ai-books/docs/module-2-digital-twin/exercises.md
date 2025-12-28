# Exercises and Solutions: Module 2 - The Digital Twin (Gazebo & Unity)

## Exercise 1: Creating a Gazebo World

### Problem
Create a Gazebo world file that includes a ground plane, a sun light source, and a simple maze environment with walls. The maze should be 10x10 meters with walls 2 meters high.

### Solution
```xml
<?xml version="1.0" ?>
<sdf version="1.7">
  <world name="maze_world">
    <!-- Physics -->
    <physics type="ode">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1</real_time_factor>
      <real_time_update_rate>1000</real_time_update_rate>
    </physics>

    <!-- Gravity -->
    <gravity>0 0 -9.8</gravity>

    <!-- Ground Plane -->
    <include>
      <uri>model://ground_plane</uri>
    </include>

    <!-- Sun Light -->
    <include>
      <uri>model://sun</uri>
    </include>

    <!-- Maze Walls -->
    <!-- Outer walls -->
    <model name="wall_north">
      <pose>0 5 1 0 0 0</pose>
      <link name="link">
        <collision name="collision">
          <geometry>
            <box>
              <size>10 0.2 2</size>
            </box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box>
              <size>10 0.2 2</size>
            </box>
          </geometry>
          <material>
            <ambient>0.5 0.5 0.5 1</ambient>
            <diffuse>0.8 0.8 0.8 1</diffuse>
          </material>
        </visual>
        <inertial>
          <mass>100</mass>
          <inertia>
            <ixx>1.0</ixx>
            <ixy>0.0</ixy>
            <ixz>0.0</ixz>
            <iyy>1.0</iyy>
            <iyz>0.0</iyz>
            <izz>1.0</izz>
          </inertia>
        </inertial>
      </link>
    </model>

    <model name="wall_south">
      <pose>0 -5 1 0 0 0</pose>
      <link name="link">
        <collision name="collision">
          <geometry>
            <box>
              <size>10 0.2 2</size>
            </box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box>
              <size>10 0.2 2</size>
            </box>
          </geometry>
          <material>
            <ambient>0.5 0.5 0.5 1</ambient>
            <diffuse>0.8 0.8 0.8 1</diffuse>
          </material>
        </visual>
        <inertial>
          <mass>100</mass>
          <inertia>
            <ixx>1.0</ixx>
            <ixy>0.0</ixy>
            <ixz>0.0</ixz>
            <iyy>1.0</iyy>
            <iyz>0.0</iyz>
            <izz>1.0</izz>
          </inertia>
        </inertial>
      </link>
    </model>

    <model name="wall_east">
      <pose>5 0 1 0 0 1.5707</pose>
      <link name="link">
        <collision name="collision">
          <geometry>
            <box>
              <size>10 0.2 2</size>
            </box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box>
              <size>10 0.2 2</size>
            </box>
          </geometry>
          <material>
            <ambient>0.5 0.5 0.5 1</ambient>
            <diffuse>0.8 0.8 0.8 1</diffuse>
          </material>
        </visual>
        <inertial>
          <mass>100</mass>
          <inertia>
            <ixx>1.0</ixx>
            <ixy>0.0</ixy>
            <ixz>0.0</ixz>
            <iyy>1.0</iyy>
            <iyz>0.0</iyz>
            <izz>1.0</izz>
          </inertia>
        </inertial>
      </link>
    </model>

    <model name="wall_west">
      <pose>-5 0 1 0 0 1.5707</pose>
      <link name="link">
        <collision name="collision">
          <geometry>
            <box>
              <size>10 0.2 2</size>
            </box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box>
              <size>10 0.2 2</size>
            </box>
          </geometry>
          <material>
            <ambient>0.5 0.5 0.5 1</ambient>
            <diffuse>0.8 0.8 0.8 1</diffuse>
          </material>
        </visual>
        <inertial>
          <mass>100</mass>
          <inertia>
            <ixx>1.0</ixx>
            <ixy>0.0</ixy>
            <ixz>0.0</ixz>
            <iyy>1.0</iyy>
            <iyz>0.0</iyz>
            <izz>1.0</izz>
          </inertia>
        </inertial>
      </link>
    </model>

    <!-- Inner maze walls -->
    <model name="inner_wall_1">
      <pose>-3 3 1 0 0 0</pose>
      <link name="link">
        <collision name="collision">
          <geometry>
            <box>
              <size>4 0.2 2</size>
            </box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box>
              <size>4 0.2 2</size>
            </box>
          </geometry>
          <material>
            <ambient>0.5 0.5 0.5 1</ambient>
            <diffuse>0.6 0.6 0.6 1</diffuse>
          </material>
        </visual>
        <inertial>
          <mass>50</mass>
          <inertia>
            <ixx>1.0</ixx>
            <ixy>0.0</ixy>
            <ixz>0.0</ixz>
            <iyy>1.0</iyy>
            <iyz>0.0</iyz>
            <izz>1.0</izz>
          </inertia>
        </inertial>
      </link>
    </model>

    <model name="inner_wall_2">
      <pose>3 -3 1 0 0 0</pose>
      <link name="link">
        <collision name="collision">
          <geometry>
            <box>
              <size>4 0.2 2</size>
            </box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box>
              <size>4 0.2 2</size>
            </box>
          </geometry>
          <material>
            <ambient>0.5 0.5 0.5 1</ambient>
            <diffuse>0.6 0.6 0.6 1</diffuse>
          </material>
        </visual>
        <inertial>
          <mass>50</mass>
          <inertia>
            <ixx>1.0</ixx>
            <ixy>0.0</ixy>
            <ixz>0.0</ixz>
            <iyy>1.0</iyy>
            <iyz>0.0</iyz>
            <izz>1.0</izz>
          </inertia>
        </inertial>
      </link>
    </model>
  </world>
</sdf>
```

## Exercise 2: Implementing a Camera Sensor in URDF

### Problem
Add a RGB camera sensor to a robot model with the following specifications:
- Position: 0.1m forward, 0.05m left, and 0.8m above the base_link
- Field of view: 1.047 radians (60 degrees)
- Resolution: 640x480 pixels
- Publish to topic: `/robot/camera/image_raw`

### Solution
```xml
<!-- Add this to your robot URDF -->
<link name="camera_link">
  <visual>
    <geometry>
      <box size="0.05 0.05 0.05"/>
    </geometry>
    <material name="black">
      <color rgba="0 0 0 1"/>
    </material>
  </visual>
  <collision>
    <geometry>
      <box size="0.05 0.05 0.05"/>
    </geometry>
  </collision>
  <inertial>
    <mass value="0.1"/>
    <inertia ixx="0.001" ixy="0" ixz="0" iyy="0.001" iyz="0" izz="0.001"/>
  </inertial>
</link>

<joint name="camera_joint" type="fixed">
  <parent link="base_link"/>
  <child link="camera_link"/>
  <origin xyz="0.1 0.05 0.8" rpy="0 0 0"/>
</joint>

<!-- Gazebo plugin for the camera -->
<gazebo reference="camera_link">
  <sensor type="camera" name="camera1">
    <update_rate>30.0</update_rate>
    <camera name="head">
      <horizontal_fov>1.047</horizontal_fov>
      <image>
        <width>640</width>
        <height>480</height>
        <format>R8G8B8</format>
      </image>
      <clip>
        <near>0.02</near>
        <far>300</far>
      </clip>
      <noise>
        <type>gaussian</type>
        <mean>0.0</mean>
        <stddev>0.007</stddev>
      </noise>
    </camera>
    <plugin name="camera_controller" filename="libgazebo_ros_camera.so">
      <frame_name>camera_link</frame_name>
      <topic_name>/robot/camera/image_raw</topic_name>
    </plugin>
  </sensor>
</gazebo>
```

## Exercise 3: Unity-ROS Communication

### Problem
Create a Unity script that subscribes to a ROS topic `/robot/joint_states` and updates the position of joints in a Unity robot model based on the received joint positions.

### Solution
```csharp
using UnityEngine;
using RosBridgeClient;
using RosSharp.Messages.Sensor;

public class JointStateSubscriber : MonoBehaviour
{
    [Header("ROS Connection")]
    public string rosBridgeUri = "ws://localhost:9090";
    public string jointStatesTopic = "/robot/joint_states";
    
    [Header("Joint Mapping")]
    public JointMapping[] jointMappings;
    
    [System.Serializable]
    public class JointMapping
    {
        public string rosJointName;
        public Transform unityJoint;
        public JointType jointType = JointType.Revolute;
    }
    
    public enum JointType
    {
        Revolute,
        Prismatic
    }
    
    private RosSocket rosSocket;
    private bool isConnected = false;
    
    void Start()
    {
        ConnectToRos();
    }
    
    void ConnectToRos()
    {
        try
        {
            RosBridgeClient.Protocols.WebSocketNetProtocol protocol = 
                new RosBridgeClient.Protocols.WebSocketNetProtocol(rosBridgeUri);
            
            rosSocket = new RosSocket(protocol);
            
            // Subscribe to joint states
            rosSocket.Subscribe<JointState>(
                jointStatesTopic, 
                ReceiveJointStates, 
                10
            );
            
            isConnected = true;
            Debug.Log("Connected to ROS and subscribed to joint states");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to connect to ROS: {e.Message}");
        }
    }
    
    void ReceiveJointStates(JointState jointState)
    {
        // Update each joint in the Unity model
        for (int i = 0; i < jointState.name.Count; i++)
        {
            string jointName = jointState.name[i];
            double jointPosition = jointState.position[i];
            
            UpdateUnityJoint(jointName, (float)jointPosition);
        }
    }
    
    void UpdateUnityJoint(string jointName, float position)
    {
        foreach (var mapping in jointMappings)
        {
            if (mapping.rosJointName == jointName)
            {
                switch (mapping.jointType)
                {
                    case JointType.Revolute:
                        // Rotate the joint around its local Y-axis
                        mapping.unityJoint.localRotation = Quaternion.Euler(0, position * Mathf.Rad2Deg, 0);
                        break;
                    case JointType.Prismatic:
                        // Move the joint along its local Z-axis
                        Vector3 newPos = mapping.unityJoint.localPosition;
                        newPos.z = position;
                        mapping.unityJoint.localPosition = newPos;
                        break;
                }
                break; // Exit the loop once we've found and updated the joint
            }
        }
    }
    
    void OnDestroy()
    {
        if (rosSocket != null)
        {
            rosSocket.Close();
        }
    }
}
```

## Exercise 4: Human-Robot Interaction in Simulation

### Problem
Create a ROS node that simulates a simple human-robot interaction scenario where:
1. The robot detects when a person is within 2 meters
2. The robot greets the person with a text message
3. The robot follows the person at a distance of 1 meter

### Solution
```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import PointStamped, Twist
from std_msgs.msg import String
import math

class HumanRobotInteractionNode(Node):
    def __init__(self):
        super().__init__('human_robot_interaction_node')
        
        # Publishers
        self.cmd_vel_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        self.speech_pub = self.create_publisher(String, '/robot_speech', 10)
        
        # Subscribers
        self.person_sub = self.create_subscription(
            PointStamped,
            '/person_position',
            self.person_callback,
            10
        )
        
        # Parameters
        self.follow_distance = 1.0  # meters
        self.detection_distance = 2.0  # meters
        self.has_greeted = False
        
        # Timers
        self.follow_timer = self.create_timer(0.1, self.follow_behavior)
        
        self.person_position = None
        self.distance_to_person = float('inf')
        
        self.get_logger().info('Human-robot interaction node initialized')

    def person_callback(self, msg):
        # Update person position
        self.person_position = msg.point
        
        # Calculate distance to person
        if self.person_position:
            dx = self.person_position.x
            dy = self.person_position.y
            self.distance_to_person = math.sqrt(dx*dx + dy*dy)
            
            # Check if person is in detection range and we haven't greeted yet
            if self.distance_to_person <= self.detection_distance and not self.has_greeted:
                self.greet_person()
                self.has_greeted = True
            elif self.distance_to_person > self.detection_distance:
                # Reset greeting flag if person moves away
                self.has_greeted = False

    def greet_person(self):
        self.get_logger().info('Person detected, greeting them!')
        
        # Publish greeting message
        speech_msg = String()
        speech_msg.data = "Hello! I'm here to assist you."
        self.speech_pub.publish(speech_msg)

    def follow_behavior(self):
        if self.person_position is None:
            return
            
        cmd_msg = Twist()
        
        # Calculate direction to person
        dx = self.person_position.x
        dy = self.person_position.y
        distance = math.sqrt(dx*dx + dy*dy)
        
        if distance > self.follow_distance:
            # Move towards person
            scale = 0.5 * (distance - self.follow_distance)  # Speed based on distance
            cmd_msg.linear.x = min(scale, 0.5)  # Limit max speed
        elif distance < self.follow_distance - 0.2:
            # Move away from person if too close
            cmd_msg.linear.x = -0.2
        else:
            # Maintain distance
            cmd_msg.linear.x = 0.0
        
        # Turn towards person
        angle_to_person = math.atan2(dy, dx)
        cmd_msg.angular.z = -angle_to_person * 2  # Turn towards person
        
        # Publish command
        self.cmd_vel_pub.publish(cmd_msg)
        
        self.get_logger().debug(f'Distance to person: {distance:.2f}m, Command: ({cmd_msg.linear.x:.2f}, {cmd_msg.angular.z:.2f})')

def main(args=None):
    rclpy.init(args=args)
    interaction_node = HumanRobotInteractionNode()
    
    try:
        rclpy.spin(interaction_node)
    except KeyboardInterrupt:
        pass
    finally:
        interaction_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Exercise 5: Unity-ROS Publisher

### Problem
Create a Unity script that publishes the position of a Unity object to a ROS topic `/unity/object_position` as a PointStamped message.

### Solution
```csharp
using UnityEngine;
using RosBridgeClient;
using RosSharp.Messages.Geometry;
using RosSharp.Messages.Std;
using System;

public class UnityObjectPublisher : MonoBehaviour
{
    [Header("ROS Connection")]
    public string rosBridgeUri = "ws://localhost:9090";
    public string topicName = "/unity/object_position";
    public string frameId = "world";
    
    [Header("Publish Settings")]
    public float publishRate = 10.0f; // Hz
    
    private RosSocket rosSocket;
    private bool isConnected = false;
    private float lastPublishTime;
    
    void Start()
    {
        ConnectToRos();
        lastPublishTime = Time.time;
    }
    
    void ConnectToRos()
    {
        try
        {
            RosBridgeClient.Protocols.WebSocketNetProtocol protocol = 
                new RosBridgeClient.Protocols.WebSocketNetProtocol(rosBridgeUri);
            
            rosSocket = new RosSocket(protocol);
            isConnected = true;
            
            Debug.Log($"Connected to ROS, publishing to {topicName}");
        }
        catch (Exception e)
        {
            Debug.LogError($"Failed to connect to ROS: {e.Message}");
        }
    }
    
    void Update()
    {
        if (!isConnected) return;
        
        // Publish at specified rate
        if (Time.time - lastPublishTime > 1.0f / publishRate)
        {
            PublishObjectPosition();
            lastPublishTime = Time.time;
        }
    }
    
    void PublishObjectPosition()
    {
        // Create PointStamped message
        PointStamped pointStamped = new PointStamped();
        
        // Set header
        pointStamped.header = new Header();
        pointStamped.header.frame_id = frameId;
        pointStamped.header.stamp = new TimeStamp(DateTime.UtcNow);
        
        // Convert Unity position to ROS coordinates
        // Unity: X-right, Y-up, Z-forward
        // ROS: X-forward, Y-left, Z-up
        pointStamped.point = new Point();
        pointStamped.point.x = transform.position.z;   // Unity Z -> ROS X
        pointStamped.point.y = -transform.position.x;  // Unity X -> ROS Y (negative because Y-right in Unity becomes Y-left in ROS)
        pointStamped.point.z = transform.position.y;   // Unity Y -> ROS Z
        
        // Publish the message
        rosSocket.Publish(topicName, pointStamped);
    }
    
    void OnDestroy()
    {
        if (rosSocket != null)
        {
            rosSocket.Close();
        }
    }
}
```

## Exercise 6: Gazebo Plugin for Custom Sensor

### Problem
Create a Gazebo plugin that simulates a simple proximity sensor that publishes distance measurements to a ROS topic.

### Solution
```cpp
#include <gazebo/common/Plugin.hh>
#include <gazebo/physics/physics.hh>
#include <gazebo/transport/transport.hh>
#include <gazebo/msgs/msgs.hh>
#include <ros/ros.h>
#include <sensor_msgs/Range.h>
#include <tf/transform_broadcaster.h>

namespace gazebo
{
  class ProximitySensorPlugin : public ModelPlugin
  {
    public: void Load(physics::ModelPtr _model, sdf::ElementPtr _sdf)
    {
      // Store the model pointer for convenience
      this->model = _model;
      
      // Get the world name
      this->world = _model->GetWorld();
      
      // Initialize ROS if not already initialized
      if (!ros::isInitialized())
      {
        int argc = 0;
        char **argv = NULL;
        ros::init(argc, argv, "gazebo_proximity_sensor",
                 ros::init_options::NoSigintHandler);
      }
      
      // Create ROS node handle
      this->rosNode.reset(new ros::NodeHandle("gazebo_proximity_sensor"));
      
      // Create publisher for range data
      this->pub = this->rosNode->advertise<sensor_msgs::Range>("/proximity_sensor/range", 1);
      
      // Get sensor parameters from SDF
      this->sensorRange = 2.0;  // Default range in meters
      if (_sdf->HasElement("range"))
        this->sensorRange = _sdf->Get<double>("range");
      
      this->sensorFieldOfView = 0.1;  // Default field of view in radians
      if (_sdf->HasElement("field_of_view"))
        this->sensorFieldOfView = _sdf->Get<double>("field_of_view");
      
      // Get sensor link name
      std::string sensorLinkName = "sensor_link";
      if (_sdf->HasElement("sensor_link"))
        sensorLinkName = _sdf->Get<std::string>("sensor_link");
      
      // Find the sensor link
      this->sensorLink = this->model->GetLink(sensorLinkName);
      if (!this->sensorLink)
      {
        gzerr << "Unable to find sensor link '" << sensorLinkName << "'\n";
        return;
      }
      
      // Listen to the update event
      this->updateConnection = event::Events::ConnectWorldUpdateBegin(
          std::bind(&ProximitySensorPlugin::OnUpdate, this));
          
      gzmsg << "Proximity sensor plugin loaded\n";
    }

    public: void OnUpdate()
    {
      // Get sensor position and orientation
      ignition::math::Pose3d sensorPose = this->sensorLink->WorldPose();
      ignition::math::Vector3d sensorPos = sensorPose.Pos();
      ignition::math::Quaterniond sensorRot = sensorPose.Rot();
      
      // Calculate sensor direction (forward direction in local frame)
      ignition::math::Vector3d sensorDirection = sensorRot.RotateVector(ignition::math::Vector3d(1, 0, 0));
      
      // Ray query to find closest object
      ignition::math::Vector3d startPoint = sensorPos;
      ignition::math::Vector3d endPoint = sensorPos + sensorDirection * this->sensorRange;
      
      // Perform ray intersection
      double range = this->sensorRange;  // Default to max range if nothing detected
      
      // Use Gazebo's built-in ray query
      auto *ph = this->world->Physics();
      auto ray = ph->Raycast(startPoint, endPoint, 1, this->model->GetName());
      
      if (ray && ray->collisions.size() > 0)
      {
        // Calculate distance to collision point
        ignition::math::Vector3d collisionPoint = ray->pts[0];
        range = (collisionPoint - sensorPos).Length();
      }
      
      // Create and publish ROS message
      sensor_msgs::Range msg;
      msg.header.stamp = ros::Time::now();
      msg.header.frame_id = this->sensorLink->GetName();
      msg.radiation_type = sensor_msgs::Range::INFRARED;  // or ULTRASOUND
      msg.field_of_view = this->sensorFieldOfView;
      msg.min_range = 0.05;  // 5 cm minimum
      msg.max_range = this->sensorRange;
      msg.range = range < this->sensorRange ? range : -1.0;  // -1.0 if out of range
      
      this->pub.publish(msg);
    }

    private: physics::ModelPtr model;
    private: physics::WorldPtr world;
    private: physics::LinkPtr sensorLink;
    private: event::ConnectionPtr updateConnection;
    private: boost::shared_ptr<ros::NodeHandle> rosNode;
    private: ros::Publisher pub;
    private: double sensorRange;
    private: double sensorFieldOfView;
  };

  // Register this plugin with the simulator
  GZ_REGISTER_MODEL_PLUGIN(ProximitySensorPlugin)
}
```

## Exercise 7: Unity Scene Management for Robotics

### Problem
Create a Unity script that manages different scenes for robotics simulation, allowing switching between indoor and outdoor environments based on ROS commands.

### Solution
```csharp
using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections;
using RosBridgeClient;
using RosSharp.Messages.Std;

public class RoboticsSceneManager : MonoBehaviour
{
    [Header("Scene Configuration")]
    public string[] availableScenes;
    public string defaultScene = "default_environment";
    
    [Header("ROS Connection")]
    public string rosBridgeUri = "ws://localhost:9090";
    public string sceneChangeTopic = "/change_scene";
    
    private RosSocket rosSocket;
    private string currentScene;
    
    void Start()
    {
        // Initialize with default scene
        currentScene = SceneManager.GetActiveScene().name;
        
        ConnectToRos();
    }
    
    void ConnectToRos()
    {
        try
        {
            RosBridgeClient.Protocols.WebSocketNetProtocol protocol = 
                new RosBridgeClient.Protocols.WebSocketNetProtocol(rosBridgeUri);
            
            rosSocket = new RosSocket(protocol);
            
            // Subscribe to scene change commands
            rosSocket.Subscribe<std_msgs.String>(
                sceneChangeTopic, 
                ChangeSceneCallback, 
                10
            );
            
            Debug.Log($"Connected to ROS, subscribed to {sceneChangeTopic}");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to connect to ROS: {e.Message}");
        }
    }
    
    void ChangeSceneCallback(std_msgs.String sceneMsg)
    {
        string requestedScene = sceneMsg.data;
        
        // Validate that the requested scene is available
        bool isValidScene = false;
        foreach (string scene in availableScenes)
        {
            if (scene.ToLower() == requestedScene.ToLower())
            {
                isValidScene = true;
                requestedScene = scene;  // Use the correctly capitalized name
                break;
            }
        }
        
        if (!isValidScene)
        {
            Debug.LogWarning($"Requested scene '{requestedScene}' is not available. Available scenes: {string.Join(", ", availableScenes)}");
            return;
        }
        
        if (requestedScene != currentScene)
        {
            Debug.Log($"Changing scene from '{currentScene}' to '{requestedScene}'");
            StartCoroutine(LoadSceneRoutine(requestedScene));
        }
        else
        {
            Debug.Log($"Already in scene '{currentScene}', no change needed");
        }
    }
    
    IEnumerator LoadSceneRoutine(string sceneName)
    {
        // Optional: Show loading screen or transition effect
        Debug.Log($"Starting scene load: {sceneName}");
        
        // Unload current scene (if it's not the default scene)
        if (currentScene != defaultScene && currentScene != "")
        {
            AsyncOperation unloadOp = SceneManager.UnloadSceneAsync(currentScene);
            yield return unloadOp;
        }
        
        // Load new scene
        AsyncOperation loadOp = SceneManager.LoadSceneAsync(sceneName, LoadSceneMode.Additive);
        
        // Monitor loading progress
        while (!loadOp.isDone)
        {
            float progress = Mathf.Clamp01(loadOp.progress / 0.9f);  // Normalize to 0-100%
            Debug.Log($"Scene loading progress: {progress * 100:F1}%");
            yield return null;
        }
        
        // Set the newly loaded scene as active
        Scene newScene = SceneManager.GetSceneByName(sceneName);
        if (newScene.IsValid())
        {
            SceneManager.SetActiveScene(newScene);
            currentScene = sceneName;
            Debug.Log($"Successfully loaded scene: {sceneName}");
        }
        else
        {
            Debug.LogError($"Failed to set scene {sceneName} as active");
        }
    }
    
    // Method to manually change scene from Unity
    public void ChangeScene(string sceneName)
    {
        std_msgs.String sceneMsg = new std_msgs.String();
        sceneMsg.data = sceneName;
        ChangeSceneCallback(sceneMsg);
    }
    
    void OnDestroy()
    {
        if (rosSocket != null)
        {
            rosSocket.Close();
        }
    }
}
```

These exercises cover key aspects of digital twin implementation for robotics, including Gazebo simulation, Unity-ROS integration, sensor simulation, and human-robot interaction. Each exercise builds on the concepts covered in the module chapters and provides practical implementation experience.