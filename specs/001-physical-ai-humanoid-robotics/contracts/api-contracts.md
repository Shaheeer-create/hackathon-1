# API Contracts: Physical AI & Humanoid Robotics

## Overview

This document defines the API contracts for the Physical AI & Humanoid Robotics book project. These contracts represent the interfaces that will be demonstrated and used throughout the book examples.

## ROS 2 Service Definitions

### 1. Navigation Service

**Service Type**: `physical_ai_interfaces/srv/NavigateToPose`

**Request**:
```yaml
geometry_msgs/PoseStamped pose:  # Target pose for navigation
string behavior_tree:           # Optional behavior tree to use
```

**Response**:
```yaml
bool success:      # Whether navigation was successful
string message:    # Additional information about the result
int32 error_code:  # Error code if navigation failed
```

### 2. Object Detection Service

**Service Type**: `physical_ai_interfaces/srv/DetectObjects`

**Request**:
```yaml
sensor_msgs/RegionOfInterest roi:  # Region to search in, empty for full image
string camera_name:               # Name of the camera to use
bool use_segmentation:            # Whether to use instance segmentation
```

**Response**:
```yaml
bool success:                    # Whether detection was successful
string message:                  # Additional information
physical_ai_interfaces/Object[] objects:  # Detected objects
```

### 3. Grasping Service

**Service Type**: `physical_ai_interfaces/srv/GraspObject`

**Request**:
```yaml
physical_ai_interfaces/Object object:  # Object to grasp
geometry_msgs/PoseStamped approach_pose:  # Approach pose for grasping
float32 grasp_width:                    # Desired grasp width
```

**Response**:
```yaml
bool success:      # Whether grasping was successful
string message:    # Additional information
bool grasped:      # Whether object is confirmed grasped
```

## ROS 2 Message Definitions

### 1. Object Message

**Message Type**: `physical_ai_interfaces/msg/Object`

```yaml
string name:           # Name of the object
string class_name:     # Class of the object (e.g., "cube", "bottle")
float32 confidence:    # Detection confidence (0.0 to 1.0)
geometry_msgs/Pose pose:  # Pose of the object in the world
geometry_msgs/Vector3 dimensions:  # Size of the object (x, y, z)
sensor_msgs/RegionOfInterest roi:  # Region in the image where object was detected
```

### 2. Task Plan Message

**Message Type**: `physical_ai_interfaces/msg/TaskPlan`

```yaml
string plan_id:                    # Unique identifier for the plan
string description:                # Human-readable description of the plan
physical_ai_interfaces/TaskAction[] actions:  # Sequence of actions
builtin_interfaces/Time created_at:  # Timestamp when plan was created
string source:                     # Source of the plan (e.g., "LLM", "Human")
```

### 3. Task Action Message

**Message Type**: `physical_ai_interfaces/msg/TaskAction`

```yaml
string action_type:     # Type of action (e.g., "navigate", "grasp", "speak")
string description:     # Human-readable description of the action
string[] parameters:    # Action-specific parameters
geometry_msgs/Pose target_pose:  # Target pose if action involves movement
string target_object:   # Name of target object if applicable
```

## REST API for LLM Integration

### 1. Process Voice Command

**Endpoint**: `POST /api/v1/voice-command`

**Request**:
```json
{
  "audio_data": "base64_encoded_audio",
  "user_context": {
    "experience_level": "intermediate",
    "robot_model": "humanoid_v1"
  }
}
```

**Response**:
```json
{
  "command_id": "uuid",
  "interpreted_command": "natural_language_interpretation",
  "robot_actions": [
    {
      "action_type": "navigate",
      "parameters": {"x": 1.0, "y": 2.0, "theta": 0.0}
    }
  ],
  "confidence": 0.85,
  "processing_time_ms": 1200
}
```

### 2. Get Task Plan

**Endpoint**: `POST /api/v1/task-plan`

**Request**:
```json
{
  "goal": "Pick up the red cube and place it on the table",
  "environment_context": {
    "objects": [
      {"name": "red_cube", "pose": {"x": 1.0, "y": 1.0, "z": 0.0}},
      {"name": "table", "pose": {"x": 2.0, "y": 0.0, "z": 0.0}}
    ],
    "robot_pose": {"x": 0.0, "y": 0.0, "z": 0.0}
  }
}
```

**Response**:
```json
{
  "plan_id": "uuid",
  "actions": [
    {
      "action_type": "navigate",
      "parameters": {"target_x": 1.0, "target_y": 1.0},
      "description": "Move to the red cube"
    },
    {
      "action_type": "grasp",
      "parameters": {"object_name": "red_cube"},
      "description": "Grasp the red cube"
    },
    {
      "action_type": "navigate",
      "parameters": {"target_x": 2.0, "target_y": 0.0},
      "description": "Move to the table"
    },
    {
      "action_type": "place",
      "parameters": {"object_name": "red_cube"},
      "description": "Place the red cube on the table"
    }
  ],
  "estimated_time_seconds": 120,
  "confidence": 0.92
}
```

## WebSocket API for Real-time Updates

### 1. Robot Status Stream

**Endpoint**: `ws://localhost:8080/api/v1/robot-status`

**Message Format**:
```json
{
  "timestamp": "2025-12-27T10:00:00Z",
  "robot_id": "humanoid_001",
  "status": {
    "battery_level": 0.85,
    "current_action": "navigating",
    "position": {"x": 1.0, "y": 2.0, "theta": 1.57},
    "gripper_status": "open",
    "active_plan_id": "plan_123"
  }
}
```

## Validation Rules

### 1. Service Response Time
- All ROS 2 services must respond within 5 seconds under normal conditions
- Services should provide intermediate feedback for long-running operations

### 2. API Rate Limits
- Voice command API: 10 requests per minute per client
- Task planning API: 5 requests per minute per client
- Status streaming: Up to 10 updates per second per robot

### 3. Error Handling
- All services must return appropriate error codes
- Error messages should be descriptive but not expose internal system details
- Failed operations should leave the system in a consistent state