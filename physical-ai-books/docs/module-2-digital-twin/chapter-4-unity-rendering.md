# Chapter 4: Unity for High-Fidelity Rendering

## Overview

Unity is a powerful game engine that has found increasing applications in robotics simulation, particularly for high-fidelity rendering and photorealistic environments. This chapter explores how to integrate Unity with ROS 2 for humanoid robotics simulation, focusing on photorealistic rendering, VR/AR capabilities, and synthetic data generation.

## Unity in Robotics Context

Unity offers several advantages for robotics simulation:

- **Photorealistic Rendering**: High-quality graphics that closely match real-world appearance
- **VR/AR Support**: Immersive environments for teleoperation and training
- **Asset Library**: Extensive collection of 3D models and environments
- **Physics Engine**: Realistic physics simulation
- **Cross-Platform**: Deploy to multiple platforms including mobile and VR headsets

## Unity Robotics Setup

### Installing Unity Robotics Tools

1. Install Unity Hub and Unity Editor (2021.3 LTS or later recommended)
2. Install the Unity Robotics Hub package
3. Install ROS# for ROS communication
4. Set up the Unity-Rosbridge connection

### Basic Unity-ROS Integration

Unity can communicate with ROS through several methods:

1. **Rosbridge**: WebSocket-based communication
2. **ROS#**: Direct integration with ROS/ROS2
3. **Custom TCP/UDP**: For specialized applications

## Setting up Unity for Robotics

### Creating a Basic Robot in Unity

```csharp
using UnityEngine;
using RosSharp;

public class UnityRobotController : MonoBehaviour
{
    // Robot joint transforms
    public Transform headJoint;
    public Transform leftShoulderJoint;
    public Transform rightShoulderJoint;
    public Transform leftElbowJoint;
    public Transform rightElbowJoint;
    
    // ROS communication
    private RosBridgeClient.RosSocket rosSocket;
    
    void Start()
    {
        // Initialize ROS connection
        ConnectToRos();
    }
    
    void ConnectToRos()
    {
        // Connect to ROS bridge
        RosBridgeClient.Protocols.WebSocketNetProtocol protocol = 
            new RosBridgeClient.Protocols.WebSocketNetProtocol("ws://localhost:9090");
        
        rosSocket = new RosBridgeClient.RosSocket(protocol);
        
        // Subscribe to joint state topic
        rosSocket.Subscribe<RosSharp.Messages.Sensor.JointState>(
            "/joint_states", 
            ReceiveJointStates, 
            10
        );
    }
    
    void ReceiveJointStates(RosSharp.Messages.Sensor.JointState jointState)
    {
        // Update robot joints based on received joint states
        for (int i = 0; i < jointState.name.Count; i++)
        {
            string jointName = jointState.name[i];
            float jointPosition = (float)jointState.position[i];
            
            switch (jointName)
            {
                case "head_joint":
                    if (headJoint != null)
                        headJoint.localRotation = Quaternion.Euler(0, 0, jointPosition * Mathf.Rad2Deg);
                    break;
                case "left_shoulder_joint":
                    if (leftShoulderJoint != null)
                        leftShoulderJoint.localRotation = Quaternion.Euler(0, jointPosition * Mathf.Rad2Deg, 0);
                    break;
                // Add more joints as needed
            }
        }
    }
    
    void OnDestroy()
    {
        if (rosSocket != null)
            rosSocket.Close();
    }
}
```

## Unity-Rosbridge Integration

### Setting up Rosbridge

1. Install rosbridge_suite:
```bash
sudo apt install ros-humble-rosbridge-suite
```

2. Launch rosbridge:
```bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
```

### Unity Rosbridge Client

```csharp
using UnityEngine;
using RosBridgeClient;
using RosBridgeClient.Messages.Geometry;

public class UnityRosPublisher : MonoBehaviour
{
    private RosSocket rosSocket;
    private float publishRate = 10f; // 10 Hz
    private float lastPublishTime;
    
    void Start()
    {
        ConnectToRos();
        lastPublishTime = Time.time;
    }
    
    void ConnectToRos()
    {
        RosBridgeClient.Protocols.WebSocketNetProtocol protocol = 
            new RosBridgeClient.Protocols.WebSocketNetProtocol("ws://localhost:9090");
        
        rosSocket = new RosSocket(protocol);
    }
    
    void Update()
    {
        if (Time.time - lastPublishTime > 1.0f / publishRate)
        {
            PublishTransform();
            lastPublishTime = Time.time;
        }
    }
    
    void PublishTransform()
    {
        // Create and publish a transform
        TransformStamped transformStamped = new TransformStamped();
        transformStamped.header.frame_id = "world";
        transformStamped.header.stamp = new TimeStamp();
        transformStamped.child_frame_id = "unity_robot";
        
        // Set position and rotation
        transformStamped.transform.translation.x = transform.position.x;
        transformStamped.transform.translation.y = transform.position.y;
        transformStamped.transform.translation.z = transform.position.z;
        
        transformStamped.transform.rotation.x = transform.rotation.x;
        transformStamped.transform.rotation.y = transform.rotation.y;
        transformStamped.transform.rotation.z = transform.rotation.z;
        transformStamped.transform.rotation.w = transform.rotation.w;
        
        // Publish the transform
        rosSocket.Publish("/tf", transformStamped);
    }
    
    void OnDestroy()
    {
        if (rosSocket != null)
            rosSocket.Close();
    }
}
```

## High-Fidelity Rendering Techniques

### Physically-Based Rendering (PBR)

Unity's PBR materials provide realistic lighting and material properties:

```csharp
using UnityEngine;

public class MaterialChanger : MonoBehaviour
{
    public Material[] robotMaterials;
    private Renderer robotRenderer;
    
    void Start()
    {
        robotRenderer = GetComponent<Renderer>();
        if (robotRenderer != null && robotMaterials.Length > 0)
        {
            robotRenderer.material = robotMaterials[0];
        }
    }
    
    public void ChangeMaterial(int index)
    {
        if (robotRenderer != null && index < robotMaterials.Length)
        {
            robotRenderer.material = robotMaterials[index];
        }
    }
}
```

### Realistic Lighting

For photorealistic rendering, proper lighting is crucial:

```csharp
using UnityEngine;

public class DynamicLighting : MonoBehaviour
{
    public Light mainLight;
    public AnimationCurve intensityCurve;
    public Gradient colorGradient;
    
    [Range(0, 1)]
    public float timeOfDay = 0.5f; // 0 = midnight, 0.5 = noon, 1 = midnight
    
    void Update()
    {
        // Update light intensity based on time of day
        float intensity = intensityCurve.Evaluate(timeOfDay);
        mainLight.intensity = intensity;
        
        // Update light color based on time of day
        Color color = colorGradient.Evaluate(timeOfDay);
        mainLight.color = color;
    }
}
```

## Synthetic Data Generation

Unity is excellent for generating synthetic training data for machine learning:

### Semantic Segmentation

```csharp
using UnityEngine;
using System.Collections;

public class SemanticSegmentation : MonoBehaviour
{
    public Camera segmentationCamera;
    public Material segmentationMaterial;
    private RenderTexture segmentationTexture;
    
    void Start()
    {
        // Create render texture for segmentation
        segmentationTexture = new RenderTexture(640, 480, 24);
        segmentationCamera.targetTexture = segmentationTexture;
        segmentationCamera.SetReplacementShader(segmentationMaterial.shader, "RenderType");
    }
    
    public Texture2D GetSegmentationImage()
    {
        // Render and capture segmentation image
        RenderTexture.active = segmentationTexture;
        Texture2D tex = new Texture2D(segmentationTexture.width, segmentationTexture.height, TextureFormat.RGB24, false);
        tex.ReadPixels(new Rect(0, 0, segmentationTexture.width, segmentationTexture.height), 0, 0);
        tex.Apply();
        RenderTexture.active = null;
        
        return tex;
    }
}
```

### Depth Map Generation

```csharp
using UnityEngine;

public class DepthMapGenerator : MonoBehaviour
{
    public Camera depthCamera;
    private RenderTexture depthTexture;
    
    void Start()
    {
        // Create render texture for depth
        depthTexture = new RenderTexture(640, 480, 24, RenderTextureFormat.RFloat);
        depthCamera.targetTexture = depthTexture;
    }
    
    public Texture2D GetDepthMap()
    {
        // Capture depth information
        RenderTexture.active = depthTexture;
        Texture2D depthTex = new Texture2D(depthTexture.width, depthTexture.height, TextureFormat.RFloat, false);
        depthTex.ReadPixels(new Rect(0, 0, depthTexture.width, depthTexture.height), 0, 0);
        depthTex.Apply();
        RenderTexture.active = null;
        
        return depthTex;
    }
}
```

## VR/AR Integration for Humanoid Robotics

### VR Teleoperation Interface

```csharp
using UnityEngine;
using UnityEngine.XR;

public class VRTeleoperation : MonoBehaviour
{
    public Transform robotModel;
    public Transform leftController;
    public Transform rightController;
    
    void Update()
    {
        // Map VR controller movements to robot movements
        if (leftController != null && robotModel != null)
        {
            // Example: Map left controller position to robot left arm
            Vector3 controllerPos = leftController.position;
            // Apply inverse kinematics or direct mapping
            MoveRobotArm("left_arm", controllerPos);
        }
        
        if (rightController != null && robotModel != null)
        {
            // Example: Map right controller position to robot right arm
            Vector3 controllerPos = rightController.position;
            MoveRobotArm("right_arm", controllerPos);
        }
    }
    
    void MoveRobotArm(string armName, Vector3 targetPos)
    {
        // Implement arm movement logic
        // This could involve inverse kinematics or direct joint control
    }
}
```

## Unity-ROS Perception Pipeline

### Creating a Perception Pipeline

```csharp
using UnityEngine;
using System.Collections;
using RosBridgeClient;
using RosSharp.Messages.Sensor;

public class UnityPerceptionPipeline : MonoBehaviour
{
    public Camera rgbCamera;
    public Camera depthCamera;
    private RosSocket rosSocket;
    
    void Start()
    {
        ConnectToRos();
    }
    
    void ConnectToRos()
    {
        RosBridgeClient.Protocols.WebSocketNetProtocol protocol = 
            new RosBridgeClient.Protocols.WebSocketNetProtocol("ws://localhost:9090");
        
        rosSocket = new RosSocket(protocol);
    }
    
    public void CaptureAndPublishPerceptionData()
    {
        // Capture RGB image
        Texture2D rgbImage = CaptureCameraImage(rgbCamera);
        PublishImage(rgbImage, "/unity_camera/rgb/image_raw");
        
        // Capture depth image
        Texture2D depthImage = CaptureCameraImage(depthCamera);
        PublishImage(depthImage, "/unity_camera/depth/image_raw");
    }
    
    Texture2D CaptureCameraImage(Camera cam)
    {
        RenderTexture currentRT = RenderTexture.active;
        RenderTexture.active = cam.targetTexture;
        
        Texture2D image = new Texture2D(cam.targetTexture.width, cam.targetTexture.height, TextureFormat.RGB24, false);
        image.ReadPixels(new Rect(0, 0, cam.targetTexture.width, cam.targetTexture.height), 0, 0);
        image.Apply();
        
        RenderTexture.active = currentRT;
        return image;
    }
    
    void PublishImage(Texture2D image, string topic)
    {
        // Convert Texture2D to ROS Image message and publish
        Image rosImage = new Image();
        rosImage.header.frame_id = "unity_camera";
        rosImage.header.stamp = new TimeStamp();
        rosImage.height = (uint)image.height;
        rosImage.width = (uint)image.width;
        rosImage.encoding = "rgb8";
        rosImage.is_bigendian = 0;
        rosImage.step = (uint)(image.width * 3); // 3 bytes per pixel for RGB
        
        // Convert texture data to byte array
        byte[] imageData = image.EncodeToPNG();
        rosImage.data = imageData;
        
        rosSocket.Publish(topic, rosImage);
    }
    
    void OnDestroy()
    {
        if (rosSocket != null)
            rosSocket.Close();
    }
}
```

## Performance Optimization

### Level of Detail (LOD) System

```csharp
using UnityEngine;

[CreateAssetMenu(fileName = "LODSettings", menuName = "Robotics/LOD Settings")]
public class LODSettings : ScriptableObject
{
    [Header("LOD Distances")]
    public float lod1Distance = 10f;
    public float lod2Distance = 30f;
    public float lod3Distance = 100f;
    
    [Header("Performance Settings")]
    public int maxTriangles = 10000;
    public int maxLights = 4;
    public ShadowQuality shadowQuality = ShadowQuality.All;
}

public class RobotLODController : MonoBehaviour
{
    public LODSettings lodSettings;
    public Transform[] lodGroups; // Different LOD levels
    
    void Update()
    {
        float distanceToMainCamera = Vector3.Distance(Camera.main.transform.position, transform.position);
        
        // Activate appropriate LOD based on distance
        for (int i = 0; i < lodGroups.Length; i++)
        {
            float lodDistance = GetLODDistance(i);
            bool shouldActivate = distanceToMainCamera <= lodDistance;
            lodGroups[i].gameObject.SetActive(shouldActivate);
        }
    }
    
    float GetLODDistance(int lodIndex)
    {
        switch (lodIndex)
        {
            case 0: return lodSettings.lod1Distance;
            case 1: return lodSettings.lod2Distance;
            case 2: return lodSettings.lod3Distance;
            default: return float.MaxValue;
        }
    }
}
```

## Best Practices for Unity Robotics

### 1. Scene Organization
- Use clear naming conventions for robot parts
- Organize objects in logical hierarchies
- Use tags and layers appropriately

### 2. Performance
- Optimize meshes and textures for real-time performance
- Use occlusion culling for large environments
- Implement LOD systems for complex models

### 3. Realism vs Performance
- Balance visual fidelity with simulation performance
- Use appropriate polygon counts for real-time simulation
- Consider using simplified collision meshes

### 4. Integration
- Maintain consistent coordinate systems between Unity and ROS
- Use standard ROS message types where possible
- Implement proper error handling for network communication

## Troubleshooting Common Issues

### 1. Coordinate System Mismatches
- Unity uses left-handed coordinate system (Y-up)
- ROS uses right-handed coordinate system (Z-up)
- Implement proper coordinate transformations

### 2. Network Communication Issues
- Check firewall settings
- Verify WebSocket connections
- Monitor network bandwidth usage

### 3. Performance Problems
- Profile your Unity application
- Optimize materials and lighting
- Consider using Unity's built-in profiler

## Unity vs Gazebo Comparison

| Aspect | Unity | Gazebo |
|--------|-------|--------|
| Rendering Quality | High (photorealistic) | Moderate |
| Physics Accuracy | Good | Excellent |
| ROS Integration | Via Rosbridge | Native |
| Performance | Can be heavy | Optimized for robotics |
| Asset Library | Extensive | Limited |
| VR/AR Support | Excellent | Limited |

## Summary

In this chapter, we've explored how to use Unity for high-fidelity rendering in robotics simulation. We've covered Unity-ROS integration, photorealistic rendering techniques, synthetic data generation, and VR/AR applications for humanoid robotics. Unity provides excellent capabilities for creating visually realistic environments and generating synthetic training data, complementing the physics-focused simulation of Gazebo. In the next chapter, we'll explore human-robot interaction in digital twin environments.