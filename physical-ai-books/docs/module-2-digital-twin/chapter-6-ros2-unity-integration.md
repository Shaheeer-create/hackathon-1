# Chapter 6: ROS 2 ↔ Unity Integration

## Overview

Integrating ROS 2 with Unity enables the creation of sophisticated digital twin environments for humanoid robotics. This chapter covers the technical aspects of connecting these two powerful platforms, including communication protocols, data synchronization, and best practices for creating seamless ROS-Unity integration.

## Communication Protocols

### 1. Rosbridge Protocol

Rosbridge is the most common method for connecting ROS to external systems like Unity. It uses WebSocket communication to transmit ROS messages in JSON format.

#### Setting up Rosbridge Server

```bash
# Install rosbridge
sudo apt install ros-humble-rosbridge-suite

# Launch the websocket server
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
```

#### Unity Rosbridge Client

```csharp
using UnityEngine;
using RosBridgeClient;
using RosSharp.Messages.Sensor;
using RosSharp.Messages.Geometry;

public class UnityRosConnector : MonoBehaviour
{
    [Header("Connection Settings")]
    public string rosBridgeUri = "ws://localhost:9090";
    
    [Header("Robot Configuration")]
    public string robotNamespace = "/humanoid_robot";
    
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
            
            // Wait for connection
            Invoke("InitializeSubscribers", 1.0f);
            
            Debug.Log("Attempting to connect to ROS bridge...");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to connect to ROS: {e.Message}");
        }
    }
    
    void InitializeSubscribers()
    {
        try
        {
            // Subscribe to joint states
            rosSocket.Subscribe<JointState>(
                robotNamespace + "/joint_states", 
                ReceiveJointStates, 
                10
            );
            
            // Subscribe to IMU data
            rosSocket.Subscribe<Imu>(
                robotNamespace + "/imu/data", 
                ReceiveImuData, 
                10
            );
            
            // Subscribe to camera images
            rosSocket.Subscribe<Image>(
                robotNamespace + "/camera/image_raw", 
                ReceiveCameraImage, 
                10
            );
            
            isConnected = true;
            Debug.Log("Connected to ROS and initialized subscribers");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to initialize subscribers: {e.Message}");
        }
    }
    
    void ReceiveJointStates(JointState jointState)
    {
        // Update robot joints in Unity
        for (int i = 0; i < jointState.name.Count; i++)
        {
            string jointName = jointState.name[i];
            float jointPosition = (float)jointState.position[i];
            
            UpdateRobotJoint(jointName, jointPosition);
        }
    }
    
    void ReceiveImuData(Imu imuData)
    {
        // Process IMU data for Unity physics or visualization
        Vector3 linearAcceleration = new Vector3(
            (float)imuData.linear_acceleration.x,
            (float)imuData.linear_acceleration.y,
            (float)imuData.linear_acceleration.z
        );
        
        Vector3 angularVelocity = new Vector3(
            (float)imuData.angular_velocity.x,
            (float)imuData.angular_velocity.y,
            (float)imuData.angular_velocity.z
        );
        
        // Use the data for Unity physics or visualization
        ProcessImuData(linearAcceleration, angularVelocity);
    }
    
    void ReceiveCameraImage(Image imageData)
    {
        // Process camera image for Unity display
        // This would typically involve converting the ROS image to a Unity texture
        ProcessCameraImage(imageData);
    }
    
    void UpdateRobotJoint(string jointName, float position)
    {
        // Find the joint in the Unity robot model and update its position
        Transform jointTransform = FindJointByName(jointName);
        if (jointTransform != null)
        {
            // Apply the joint position (this is a simplified example)
            // In practice, you'd need to handle different joint types (revolute, prismatic, etc.)
            jointTransform.localRotation = Quaternion.Euler(0, position * Mathf.Rad2Deg, 0);
        }
    }
    
    Transform FindJointByName(string name)
    {
        // Search for a joint by name in the robot hierarchy
        Transform[] allChildren = GetComponentsInChildren<Transform>();
        foreach (Transform child in allChildren)
        {
            if (child.name == name)
                return child;
        }
        return null;
    }
    
    void ProcessImuData(Vector3 linearAccel, Vector3 angularVel)
    {
        // Use IMU data for Unity physics or visualization
        // For example, you could use this to make the Unity robot shake slightly
        // to match the physical robot's movements
    }
    
    void ProcessCameraImage(Image imageData)
    {
        // Convert ROS image to Unity texture and display
        // This is a simplified example - real implementation would be more complex
    }
    
    void OnDestroy()
    {
        if (rosSocket != null)
        {
            rosSocket.Close();
        }
    }
    
    // Publisher methods
    public void PublishJointCommand(string jointName, double position)
    {
        if (!isConnected) return;
        
        JointState jointCmd = new JointState();
        jointCmd.name.Add(jointName);
        jointCmd.position.Add(position);
        jointCmd.header.stamp = new TimeStamp();
        jointCmd.header.frame_id = "base_link";
        
        rosSocket.Publish(robotNamespace + "/joint_commands", jointCmd);
    }
    
    public void PublishTwistCommand(double linearX, double angularZ)
    {
        if (!isConnected) return;
        
        Twist cmdVel = new Twist();
        cmdVel.linear = new Vector3(linearX, 0, 0);
        cmdVel.angular = new Vector3(0, 0, angularZ);
        
        rosSocket.Publish(robotNamespace + "/cmd_vel", cmdVel);
    }
}
```

### 2. Direct TCP/IP Communication

For higher-performance applications, direct TCP/IP communication can be used:

```csharp
using UnityEngine;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

public class DirectTcpConnector : MonoBehaviour
{
    private TcpClient tcpClient;
    private NetworkStream stream;
    
    [Header("TCP Connection")]
    public string ipAddress = "127.0.0.1";
    public int port = 5555;
    
    void Start()
    {
        ConnectToTcpServer();
    }
    
    async void ConnectToTcpServer()
    {
        try
        {
            tcpClient = new TcpClient();
            await tcpClient.ConnectAsync(ipAddress, port);
            stream = tcpClient.GetStream();
            
            Debug.Log("Connected to TCP server");
            
            // Start receiving messages
            ReceiveMessages();
        }
        catch (System.Exception e)
        {
            Debug.LogError($"TCP connection failed: {e.Message}");
        }
    }
    
    async void ReceiveMessages()
    {
        byte[] buffer = new byte[1024];
        
        while (tcpClient.Connected)
        {
            try
            {
                int bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length);
                if (bytesRead > 0)
                {
                    string message = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                    ProcessTcpMessage(message);
                }
            }
            catch (System.Exception e)
            {
                Debug.LogError($"Error receiving TCP message: {e.Message}");
                break;
            }
        }
    }
    
    void ProcessTcpMessage(string message)
    {
        // Parse and process the incoming TCP message
        // This could be custom protocol data for robot control
        Debug.Log($"Received TCP message: {message}");
    }
    
    public void SendTcpMessage(string message)
    {
        if (stream != null && tcpClient.Connected)
        {
            byte[] data = Encoding.UTF8.GetBytes(message);
            stream.Write(data, 0, data.Length);
        }
    }
    
    void OnDestroy()
    {
        if (tcpClient != null)
        {
            tcpClient.Close();
        }
    }
}
```

## Data Synchronization

### Time Synchronization

Maintaining synchronized time between ROS and Unity is crucial for accurate simulation:

```csharp
using UnityEngine;
using System.Collections;
using RosBridgeClient;
using RosSharp.Messages.Std;

public class TimeSynchronizer : MonoBehaviour
{
    private RosSocket rosSocket;
    private double rosTimeOffset = 0.0;
    private bool timeSynced = false;
    
    void Start()
    {
        ConnectToRos();
    }
    
    void ConnectToRos()
    {
        RosBridgeClient.Protocols.WebSocketNetProtocol protocol = 
            new RosBridgeClient.Protocols.WebSocketNetProtocol("ws://localhost:9090");
        
        rosSocket = new RosSocket(protocol);
        
        // Subscribe to ROS time
        rosSocket.Subscribe<Clock>(
            "/clock", 
            ReceiveClock, 
            10
        );
    }
    
    void ReceiveClock(Clock clockMsg)
    {
        if (!timeSynced)
        {
            // Calculate time offset between ROS and Unity
            double unityTime = Time.timeAsDouble;
            double rosTime = clockMsg.clock.secs + clockMsg.clock.nsecs * 1e-9;
            
            rosTimeOffset = rosTime - unityTime;
            timeSynced = true;
            
            Debug.Log($"Time synchronized. Offset: {rosTimeOffset}");
        }
    }
    
    public double GetRosTime()
    {
        if (timeSynced)
        {
            return Time.timeAsDouble + rosTimeOffset;
        }
        else
        {
            // Fallback to Unity time if not synced
            return Time.timeAsDouble;
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

### Transform Synchronization

Keeping transforms synchronized between ROS TF tree and Unity:

```csharp
using UnityEngine;
using System.Collections.Generic;
using RosBridgeClient;
using RosSharp.Messages.Tf2;

public class TransformSynchronizer : MonoBehaviour
{
    private RosSocket rosSocket;
    private Dictionary<string, Transform> unityTransforms;
    private Dictionary<string, Vector3> rosPositions;
    private Dictionary<string, Quaternion> rosRotations;
    
    void Start()
    {
        unityTransforms = new Dictionary<string, Transform>();
        rosPositions = new Dictionary<string, Vector3>();
        rosRotations = new Dictionary<string, Quaternion>();
        
        ConnectToRos();
    }
    
    void ConnectToRos()
    {
        RosBridgeClient.Protocols.WebSocketNetProtocol protocol = 
            new RosBridgeClient.Protocols.WebSocketNetProtocol("ws://localhost:9090");
        
        rosSocket = new RosSocket(protocol);
        
        // Subscribe to TF transforms
        rosSocket.Subscribe<TFMessage>(
            "/tf", 
            ReceiveTransforms, 
            10
        );
    }
    
    void ReceiveTransforms(TFMessage tfMsg)
    {
        foreach (var transform in tfMsg.transforms)
        {
            string childFrame = transform.child_frame_id;
            
            // Convert ROS transform to Unity coordinates
            Vector3 position = RosToUnityPosition(transform.transform.translation);
            Quaternion rotation = RosToUnityRotation(transform.transform.rotation);
            
            rosPositions[childFrame] = position;
            rosRotations[childFrame] = rotation;
            
            // Update Unity transform if it exists
            if (unityTransforms.ContainsKey(childFrame))
            {
                unityTransforms[childFrame].position = position;
                unityTransforms[childFrame].rotation = rotation;
            }
        }
    }
    
    Vector3 RosToUnityPosition(RosSharp.Messages.Geometry.Vector3 rosPos)
    {
        // ROS: X-forward, Y-left, Z-up
        // Unity: X-right, Y-up, Z-forward
        return new Vector3((float)rosPos.y, (float)rosPos.z, (float)rosPos.x);
    }
    
    Quaternion RosToUnityRotation(RosSharp.Messages.Geometry.Quaternion rosQuat)
    {
        // Convert ROS quaternion to Unity quaternion
        // This conversion accounts for the different coordinate systems
        return new Quaternion(
            (float)rosQuat.y,  // x in Unity
            (float)rosQuat.z,  // y in Unity
            (float)rosQuat.x,  // z in Unity
            (float)rosQuat.w   // w in Unity
        );
    }
    
    public void RegisterUnityTransform(string frameId, Transform unityTransform)
    {
        unityTransforms[frameId] = unityTransform;
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

## Unity Robot Model Integration

### Creating a Robot Model Controller

```csharp
using UnityEngine;
using System.Collections.Generic;

public class UnityRobotController : MonoBehaviour
{
    [System.Serializable]
    public class JointMapping
    {
        public string rosJointName;
        public Transform unityJoint;
        public JointType jointType;
        public float minAngle = -180f;
        public float maxAngle = 180f;
    }
    
    public enum JointType
    {
        Revolute,
        Prismatic,
        Fixed
    }
    
    [Header("Joint Mappings")]
    public List<JointMapping> jointMappings = new List<JointMapping>();
    
    private Dictionary<string, JointMapping> jointMap;
    
    void Start()
    {
        InitializeJointMap();
    }
    
    void InitializeJointMap()
    {
        jointMap = new Dictionary<string, JointMapping>();
        foreach (var mapping in jointMappings)
        {
            jointMap[mapping.rosJointName] = mapping;
        }
    }
    
    public void UpdateJointPosition(string jointName, float position)
    {
        if (jointMap.ContainsKey(jointName))
        {
            JointMapping mapping = jointMap[jointName];
            
            switch (mapping.jointType)
            {
                case JointType.Revolute:
                    UpdateRevoluteJoint(mapping, position);
                    break;
                case JointType.Prismatic:
                    UpdatePrismaticJoint(mapping, position);
                    break;
                case JointType.Fixed:
                    // Fixed joints don't move
                    break;
            }
        }
    }
    
    void UpdateRevoluteJoint(JointMapping mapping, float angleRad)
    {
        float angleDeg = angleRad * Mathf.Rad2Deg;
        
        // Clamp to joint limits
        angleDeg = Mathf.Clamp(angleDeg, mapping.minAngle, mapping.maxAngle);
        
        // Apply rotation based on joint axis
        // This assumes the joint rotates around its local Y-axis
        mapping.unityJoint.localRotation = Quaternion.Euler(0, angleDeg, 0);
    }
    
    void UpdatePrismaticJoint(JointMapping mapping, float position)
    {
        // Clamp to joint limits if needed
        position = Mathf.Clamp(position, mapping.minAngle, mapping.maxAngle);
        
        // Apply translation along the joint axis
        // This assumes the joint moves along its local Z-axis
        Vector3 newPosition = mapping.unityJoint.localPosition;
        newPosition.z = position;
        mapping.unityJoint.localPosition = newPosition;
    }
    
    public void UpdateAllJoints(Dictionary<string, float> jointPositions)
    {
        foreach (var kvp in jointPositions)
        {
            UpdateJointPosition(kvp.Key, kvp.Value);
        }
    }
}
```

## Unity Scene Management for Robotics

### Scene Loading and Robot Spawning

```csharp
using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections;
using RosBridgeClient;
using RosSharp.Messages.Std;

public class UnitySceneManager : MonoBehaviour
{
    [Header("Robot Prefabs")]
    public GameObject[] robotPrefabs;
    
    [Header("Environment Settings")]
    public string[] environmentScenes;
    
    private RosSocket rosSocket;
    private UnityRobotController activeRobot;
    
    void Start()
    {
        ConnectToRos();
    }
    
    void ConnectToRos()
    {
        RosBridgeClient.Protocols.WebSocketNetProtocol protocol = 
            new RosBridgeClient.Protocols.WebSocketNetProtocol("ws://localhost:9090");
        
        rosSocket = new RosSocket(protocol);
        
        // Subscribe to robot spawn commands
        rosSocket.Subscribe<std_msgs.String>(
            "/spawn_robot", 
            SpawnRobot, 
            10
        );
        
        // Subscribe to scene change commands
        rosSocket.Subscribe<std_msgs.String>(
            "/change_scene", 
            ChangeScene, 
            10
        );
    }
    
    void SpawnRobot(std_msgs.String robotInfo)
    {
        // Parse robot information and spawn the appropriate robot
        string[] parts = robotInfo.data.Split(',');
        if (parts.Length >= 4)
        {
            string robotType = parts[0];
            float x = float.Parse(parts[1]);
            float y = float.Parse(parts[2]);
            float z = float.Parse(parts[3]);
            
            SpawnRobotOfType(robotType, new Vector3(x, y, z));
        }
    }
    
    void SpawnRobotOfType(string robotType, Vector3 position)
    {
        GameObject robotPrefab = FindRobotPrefab(robotType);
        if (robotPrefab != null)
        {
            GameObject robotInstance = Instantiate(robotPrefab, position, Quaternion.identity);
            activeRobot = robotInstance.GetComponent<UnityRobotController>();
            
            Debug.Log($"Spawned robot of type: {robotType} at {position}");
        }
        else
        {
            Debug.LogError($"Robot prefab not found: {robotType}");
        }
    }
    
    GameObject FindRobotPrefab(string robotType)
    {
        foreach (GameObject prefab in robotPrefabs)
        {
            if (prefab.name.ToLower().Contains(robotType.ToLower()))
            {
                return prefab;
            }
        }
        return null;
    }
    
    void ChangeScene(std_msgs.String sceneInfo)
    {
        string sceneName = sceneInfo.data;
        
        // Check if scene exists in our environment scenes
        foreach (string envScene in environmentScenes)
        {
            if (envScene.ToLower() == sceneName.ToLower())
            {
                StartCoroutine(LoadSceneAsync(sceneName));
                return;
            }
        }
        
        Debug.LogError($"Scene not found: {sceneName}");
    }
    
    IEnumerator LoadSceneAsync(string sceneName)
    {
        Debug.Log($"Loading scene: {sceneName}");
        
        // Unload current scene if needed
        if (SceneManager.GetActiveScene().name != "DontDestroyOnLoad")
        {
            yield return SceneManager.UnloadSceneAsync(SceneManager.GetActiveScene());
        }
        
        // Load new scene
        AsyncOperation asyncLoad = SceneManager.LoadSceneAsync(sceneName, LoadSceneMode.Additive);
        
        while (!asyncLoad.isDone)
        {
            float progress = Mathf.Clamp01(asyncLoad.progress / 0.9f);
            Debug.Log($"Scene load progress: {progress * 100}%");
            yield return null;
        }
        
        Debug.Log($"Scene loaded: {sceneName}");
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

## Performance Optimization

### Efficient Data Transmission

```csharp
using UnityEngine;
using System.Collections.Generic;

public class EfficientDataTransmitter : MonoBehaviour
{
    [Header("Transmission Settings")]
    public float transmissionRate = 30.0f; // Hz
    public bool compressData = true;
    
    private float lastTransmissionTime;
    private Dictionary<string, float> lastJointPositions;
    
    void Start()
    {
        lastJointPositions = new Dictionary<string, float>();
    }
    
    void Update()
    {
        if (Time.time - lastTransmissionTime > 1.0f / transmissionRate)
        {
            TransmitData();
            lastTransmissionTime = Time.time;
        }
    }
    
    void TransmitData()
    {
        // Only transmit data that has changed significantly
        var changedJoints = GetChangedJoints();
        
        if (changedJoints.Count > 0)
        {
            // Send only changed joint data
            SendJointData(changedJoints);
        }
    }
    
    Dictionary<string, float> GetChangedJoints()
    {
        var currentJoints = GetCurrentJointPositions();
        var changedJoints = new Dictionary<string, float>();
        
        float threshold = 0.01f; // 1cm or 0.57 degrees
        
        foreach (var kvp in currentJoints)
        {
            string jointName = kvp.Key;
            float currentPosition = kvp.Value;
            
            if (!lastJointPositions.ContainsKey(jointName) ||
                Mathf.Abs(lastJointPositions[jointName] - currentPosition) > threshold)
            {
                changedJoints[jointName] = currentPosition;
                lastJointPositions[jointName] = currentPosition;
            }
        }
        
        return changedJoints;
    }
    
    Dictionary<string, float> GetCurrentJointPositions()
    {
        // This would interface with your robot controller to get current positions
        var positions = new Dictionary<string, float>();
        
        // Example implementation - replace with actual joint position retrieval
        if (GetComponent<UnityRobotController>() != null)
        {
            // Get positions from robot controller
        }
        
        return positions;
    }
    
    void SendJointData(Dictionary<string, float> jointData)
    {
        // Send the joint data via ROS or other communication method
        // Implementation depends on your specific communication setup
    }
}
```

## Best Practices for ROS-Unity Integration

### 1. Architecture Considerations

1. **Modular Design**: Separate ROS communication from Unity game logic
2. **Asynchronous Operations**: Use async/await for network operations
3. **Error Handling**: Implement robust error handling for network disconnections
4. **Data Validation**: Validate all incoming data before applying to Unity objects

### 2. Performance Tips

1. **Throttle Updates**: Don't update at full Unity frame rate unless necessary
2. **Selective Updates**: Only transmit data that has changed
3. **Efficient Serialization**: Use compact data representations
4. **Resource Management**: Properly dispose of network connections

### 3. Debugging and Monitoring

```csharp
using UnityEngine;
using System.Collections;

public class IntegrationDebugger : MonoBehaviour
{
    [Header("Debug Settings")]
    public bool showDebugInfo = true;
    public float debugUpdateInterval = 1.0f;
    
    private float lastDebugUpdate;
    private int messageCount = 0;
    private float lastMessageTime;
    
    void Update()
    {
        if (showDebugInfo && Time.time - lastDebugUpdate > debugUpdateInterval)
        {
            DisplayDebugInfo();
            lastDebugUpdate = Time.time;
        }
    }
    
    void DisplayDebugInfo()
    {
        // Calculate message rate
        float currentTime = Time.time;
        float timeDiff = currentTime - lastMessageTime;
        float messageRate = timeDiff > 0 ? messageCount / timeDiff : 0;
        
        Debug.Log($"ROS-Unity Integration Stats:\n" +
                  $"Message Rate: {messageRate:F2} Hz\n" +
                  $"Total Messages: {messageCount}\n" +
                  $"Update Interval: {debugUpdateInterval}s");
        
        lastMessageTime = currentTime;
        messageCount = 0;
    }
    
    public void IncrementMessageCount()
    {
        messageCount++;
    }
}
```

## Troubleshooting Common Issues

### 1. Coordinate System Mismatches

ROS uses a right-handed coordinate system (X-forward, Y-left, Z-up) while Unity uses a left-handed system (X-right, Y-up, Z-forward). Always implement proper coordinate transformations.

### 2. Network Latency

Monitor network latency and implement prediction algorithms for smoother visualization of fast-moving robots.

### 3. Message Serialization Issues

Ensure proper serialization/deserialization of complex message types, especially for images and point clouds.

## Summary

In this chapter, we've explored the integration of ROS 2 with Unity for creating digital twin environments for humanoid robotics. We've covered communication protocols, data synchronization techniques, robot model integration, and performance optimization strategies. The ROS-Unity integration enables the creation of sophisticated simulation environments that can accurately mirror the behavior of physical robots, facilitating safer and more efficient development of humanoid robotics applications. This integration is a key component of the digital twin concept, allowing for comprehensive testing and validation before deploying to physical hardware.