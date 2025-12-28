# Capstone: Autonomous Humanoid - Exercises

## Chapter 19: Capstone Project Overview

### Exercise 19.1: System Integration Challenge
**Objective**: Integrate all modules (ROS 2, Digital Twin, AI Brain, VLA) into a cohesive autonomous humanoid system.

**Steps**:
1. Set up the complete system architecture connecting all modules
2. Implement inter-module communication protocols
3. Create unified state management system
4. Test basic functionality of integrated system

**Deliverables**:
- Integrated system architecture diagram
- Communication protocol implementation
- Unified state management system
- Basic functionality test results

### Exercise 19.2: End-to-End Autonomous Task Execution
**Objective**: Implement and test an end-to-end autonomous task from voice command to completion.

**Steps**:
1. Create a complete task scenario (e.g., "Go to kitchen and bring me the red cup")
2. Implement the full pipeline: voice → NLP → task planning → navigation → manipulation → return
3. Test the complete pipeline in simulation
4. Document success rate and failure modes

**Deliverables**:
- Complete task implementation
- Test results with success/failure analysis
- Performance metrics
- Failure mode analysis

## Chapter 20: Voice Command to Autonomous Action Pipeline

### Exercise 20.1: Voice Command Processing Pipeline
**Objective**: Create a complete pipeline from voice command to robot action execution.

**Steps**:
1. Implement voice command recognition using Whisper
2. Create NLP processing to extract intent and parameters
3. Implement task planning based on extracted intent
4. Execute planned actions on the humanoid robot
5. Provide feedback to the user

**Deliverables**:
- Complete voice-to-action pipeline
- Test results with various voice commands
- Performance metrics (accuracy, latency)
- Error handling implementation

### Exercise 20.2: Multi-Modal Command Processing
**Objective**: Extend the system to handle commands that combine voice and visual input.

**Steps**:
1. Implement object reference resolution (e.g., "pick up that red object")
2. Create visual attention mechanism to identify referred objects
3. Integrate visual and linguistic information
4. Test with ambiguous commands requiring visual context

**Deliverables**:
- Multi-modal command processing system
- Object reference resolution implementation
- Test results with ambiguous commands
- Performance comparison with text-only commands

## Chapter 21: Autonomous Navigation & Manipulation

### Exercise 21.1: Complex Navigation Task
**Objective**: Implement navigation in a complex environment with multiple rooms and obstacles.

**Steps**:
1. Create a complex simulation environment with multiple rooms
2. Implement multi-floor navigation (if applicable)
3. Handle dynamic obstacles and moving humans
4. Test navigation robustness and safety

**Deliverables**:
- Complex environment implementation
- Multi-floor navigation system (if applicable)
- Dynamic obstacle handling
- Navigation performance metrics

### Exercise 21.2: Dual-Arm Manipulation Task
**Objective**: Implement coordinated dual-arm manipulation tasks.

**Steps**:
1. Create dual-arm manipulation scenarios (e.g., opening doors, lifting heavy objects)
2. Implement coordination between arms
3. Handle object weight distribution
4. Test manipulation success rate

**Deliverables**:
- Dual-arm manipulation implementation
- Coordination algorithm
- Manipulation success metrics
- Safety validation results

## Chapter 22: Human-Robot Interaction

### Exercise 22.1: Social Navigation
**Objective**: Implement navigation that considers social norms and human comfort.

**Steps**:
1. Implement personal space maintenance around humans
2. Create polite navigation behaviors (yielding, waiting)
3. Handle group navigation scenarios
4. Test with human subjects (simulation or real)

**Deliverables**:
- Social navigation implementation
- Personal space maintenance system
- Polite navigation behaviors
- Human interaction test results

### Exercise 22.2: Collaborative Task Execution
**Objective**: Implement tasks that require human-robot collaboration.

**Steps**:
1. Create collaborative scenarios (e.g., carrying large objects together)
2. Implement intent recognition for human actions
3. Create shared task planning
4. Test collaboration effectiveness

**Deliverables**:
- Collaborative task implementation
- Human intent recognition system
- Shared task planning algorithm
- Collaboration effectiveness metrics

## Chapter 23: Safety & Validation

### Exercise 23.1: Comprehensive Safety System
**Objective**: Implement a comprehensive safety system for all autonomous behaviors.

**Steps**:
1. Create safety monitoring for all robot actions
2. Implement emergency stop procedures
3. Create safety validation for all modules
4. Test safety system under various failure conditions

**Deliverables**:
- Comprehensive safety system
- Emergency stop implementation
- Safety validation procedures
- Safety test results

### Exercise 23.2: Failure Recovery System
**Objective**: Implement robust failure recovery for autonomous humanoid operation.

**Steps**:
1. Identify potential failure modes for each module
2. Create recovery procedures for each failure mode
3. Implement graceful degradation strategies
4. Test recovery system effectiveness

**Deliverables**:
- Failure mode analysis
- Recovery procedures implementation
- Degradation strategies
- Recovery effectiveness test results

## Chapter 24: Performance Optimization

### Exercise 24.1: Real-Time Performance Optimization
**Objective**: Optimize the complete system for real-time performance.

**Steps**:
1. Profile each module for computational bottlenecks
2. Implement optimizations (multi-threading, GPU acceleration, etc.)
3. Optimize memory usage and data structures
4. Test real-time performance with full system

**Deliverables**:
- Performance profiling results
- Optimized system implementation
- Real-time performance metrics
- Resource utilization analysis

### Exercise 24.2: Energy Efficiency Optimization
**Objective**: Optimize the system for energy-efficient operation.

**Steps**:
1. Analyze energy consumption of different behaviors
2. Implement energy-efficient motion planning
3. Optimize sensor usage for power savings
4. Test energy efficiency improvements

**Deliverables**:
- Energy consumption analysis
- Energy-efficient motion planning
- Power-optimized sensor usage
- Energy efficiency metrics

## Solutions

### Solution to Exercise 19.1: System Integration Implementation

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String, Bool
from geometry_msgs.msg import Twist, PoseStamped
from sensor_msgs.msg import Image, LaserScan
from nav_msgs.msg import Odometry
from builtin_interfaces.msg import Duration
import threading
import time
from typing import Dict, Any

class AutonomousHumanoidSystemNode(Node):
    def __init__(self):
        super().__init__('autonomous_humanoid_system')
        
        # System state management
        self.system_state = {
            'initialized': False,
            'modules_connected': False,
            'ready_for_commands': False,
            'current_task': None,
            'task_status': 'idle',
            'safety_status': 'normal',
            'localization_confidence': 0.0,
            'battery_level': 1.0,
            'balance_state': 1.0
        }
        
        # Module status tracking
        self.module_status = {
            'ros2_architecture': False,
            'digital_twin': False,
            'ai_brain': False,
            'vla_system': False
        }
        
        # Subscriptions for all modules
        self.voice_command_sub = self.create_subscription(
            String,
            '/voice_command',
            self.voice_command_callback,
            10
        )
        
        self.odom_sub = self.create_subscription(
            Odometry,
            '/odom',
            self.odom_callback,
            10
        )
        
        self.laser_sub = self.create_subscription(
            LaserScan,
            '/scan',
            self.laser_callback,
            10
        )
        
        self.camera_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.camera_callback,
            10
        )
        
        self.module_status_sub = self.create_subscription(
            String,
            '/module_status',
            self.module_status_callback,
            10
        )
        
        # Publishers for system-wide communication
        self.system_status_pub = self.create_publisher(String, '/system_status', 10)
        self.task_command_pub = self.create_publisher(String, '/task_command', 10)
        self.safety_override_pub = self.create_publisher(Bool, '/safety_override', 10)
        
        # Timer for system health checks
        self.health_check_timer = self.create_timer(1.0, self.system_health_check)
        
        # Initialize modules
        self.initialize_modules()
        
        self.get_logger().info('Autonomous Humanoid System initialized')

    def initialize_modules(self):
        """Initialize and connect all system modules"""
        self.get_logger().info('Initializing system modules...')
        
        # Initialize each module in separate threads for parallel startup
        init_threads = []
        
        # Initialize ROS 2 Architecture module
        ros2_thread = threading.Thread(target=self.initialize_ros2_module, daemon=True)
        init_threads.append(ros2_thread)
        
        # Initialize Digital Twin module
        dt_thread = threading.Thread(target=self.initialize_digital_twin_module, daemon=True)
        init_threads.append(dt_thread)
        
        # Initialize AI Brain module
        ai_thread = threading.Thread(target=self.initialize_ai_brain_module, daemon=True)
        init_threads.append(ai_thread)
        
        # Initialize VLA module
        vla_thread = threading.Thread(target=self.initialize_vla_module, daemon=True)
        init_threads.append(vla_thread)
        
        # Start all initialization threads
        for thread in init_threads:
            thread.start()
        
        # Wait for all modules to initialize
        for thread in init_threads:
            thread.join(timeout=30.0)  # 30 second timeout
        
        # Check if all modules are ready
        all_initialized = all(self.module_status.values())
        
        if all_initialized:
            self.system_state['initialized'] = True
            self.system_state['modules_connected'] = True
            self.system_state['ready_for_commands'] = True
            
            self.get_logger().info('All modules initialized successfully')
            
            # Publish system ready status
            status_msg = String()
            status_msg.data = 'SYSTEM_READY'
            self.system_status_pub.publish(status_msg)
        else:
            self.get_logger().error('Not all modules initialized successfully')
            missing_modules = [mod for mod, status in self.module_status.items() if not status]
            self.get_logger().error(f'Missing modules: {missing_modules}')

    def initialize_ros2_module(self):
        """Initialize ROS 2 architecture module"""
        try:
            # Simulate module initialization
            time.sleep(2.0)  # Simulate initialization time
            
            # Check if ROS 2 services are available
            # In real implementation, this would check for required services/parameters
            self.module_status['ros2_architecture'] = True
            self.get_logger().info('ROS 2 Architecture module initialized')
        except Exception as e:
            self.get_logger().error(f'Failed to initialize ROS 2 module: {e}')
            self.module_status['ros2_architecture'] = False

    def initialize_digital_twin_module(self):
        """Initialize Digital Twin module"""
        try:
            # Simulate module initialization
            time.sleep(3.0)  # Simulate initialization time
            
            # Check if simulation services are available
            self.module_status['digital_twin'] = True
            self.get_logger().info('Digital Twin module initialized')
        except Exception as e:
            self.get_logger().error(f'Failed to initialize Digital Twin module: {e}')
            self.module_status['digital_twin'] = False

    def initialize_ai_brain_module(self):
        """Initialize AI Brain module"""
        try:
            # Simulate module initialization
            time.sleep(4.0)  # Simulate initialization time
            
            # Check if AI services are available
            self.module_status['ai_brain'] = True
            self.get_logger().info('AI Brain module initialized')
        except Exception as e:
            self.get_logger().error(f'Failed to initialize AI Brain module: {e}')
            self.module_status['ai_brain'] = False

    def initialize_vla_module(self):
        """Initialize VLA module"""
        try:
            # Simulate module initialization
            time.sleep(3.5)  # Simulate initialization time
            
            # Check if VLA services are available
            self.module_status['vla_system'] = True
            self.get_logger().info('VLA System module initialized')
        except Exception as e:
            self.get_logger().error(f'Failed to initialize VLA module: {e}')
            self.module_status['vla_system'] = False

    def voice_command_callback(self, msg):
        """Process voice commands through the integrated system"""
        if not self.system_state['ready_for_commands']:
            self.get_logger().warn('System not ready for commands')
            return
        
        command = msg.data
        self.get_logger().info(f'Received voice command: {command}')
        
        # Update system state
        self.system_state['current_task'] = command
        self.system_state['task_status'] = 'processing'
        
        # Publish to task planner (VLA module)
        task_msg = String()
        task_msg.data = command
        self.task_command_pub.publish(task_msg)
        
        # Update status
        status_msg = String()
        status_msg.data = f'PROCESSING: {command}'
        self.system_status_pub.publish(status_msg)

    def module_status_callback(self, msg):
        """Update module status from individual modules"""
        try:
            # Parse status message (format: "MODULE_NAME: STATUS")
            parts = msg.data.split(': ')
            if len(parts) >= 2:
                module_name = parts[0].lower().replace(' ', '_')
                status = parts[1].lower()
                
                if module_name in self.module_status:
                    self.module_status[module_name] = status == 'ready'
                    
                    self.get_logger().info(f'Updated {module_name} status: {status}')
        except Exception as e:
            self.get_logger().error(f'Error parsing module status: {e}')

    def system_health_check(self):
        """Periodic system health check"""
        # Check if all modules are still responsive
        all_modules_responsive = all(self.module_status.values())
        
        if not all_modules_responsive:
            self.get_logger().warn('One or more modules are not responsive')
            
            # Check which modules are down
            down_modules = [mod for mod, status in self.module_status.items() if not status]
            self.get_logger().warn(f'Down modules: {down_modules}')
            
            # Update system state
            self.system_state['ready_for_commands'] = False
            self.system_state['task_status'] = 'system_down'
            
            # Publish alert
            status_msg = String()
            status_msg.data = f'SYSTEM_ALERT: Modules down - {down_modules}'
            self.system_status_pub.publish(status_msg)
        else:
            # System is healthy
            if not self.system_state['ready_for_commands']:
                # Restore system to ready state if it was down
                self.system_state['ready_for_commands'] = True
                self.system_state['task_status'] = 'idle'
                
                status_msg = String()
                status_msg.data = 'SYSTEM_RESTORED'
                self.system_status_pub.publish(status_msg)

    def odom_callback(self, msg):
        """Update system state with odometry information"""
        self.current_pose = msg.pose.pose
        self.current_twist = msg.twist.twist

    def laser_callback(self, msg):
        """Update system state with laser information"""
        self.laser_data = msg

    def camera_callback(self, msg):
        """Update system state with camera information"""
        self.camera_data = msg

def main(args=None):
    rclpy.init(args=args)
    system_node = AutonomousHumanoidSystemNode()
    
    try:
        rclpy.spin(system_node)
    except KeyboardInterrupt:
        system_node.get_logger().info('Shutting down Autonomous Humanoid System')
    finally:
        system_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Solution to Exercise 20.1: Voice Command Processing Pipeline

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String, Bool
from geometry_msgs.msg import Twist, PoseStamped
from sensor_msgs.msg import Image
from audio_common_msgs.msg import AudioData
from openai import OpenAI
import numpy as np
import json
import threading
import queue
import time

class VoiceToActionPipelineNode(Node):
    def __init__(self):
        super().__init__('voice_to_action_pipeline')
        
        # Initialize OpenAI client
        self.openai_client = OpenAI(api_key=self.get_parameter('openai_api_key').value)
        
        # Audio processing queue
        self.audio_queue = queue.Queue(maxsize=10)
        
        # Subscriptions
        self.audio_sub = self.create_subscription(
            AudioData,
            '/audio_input',
            self.audio_callback,
            10
        )
        
        self.voice_text_sub = self.create_subscription(
            String,
            '/transcribed_text',
            self.text_callback,
            10
        )
        
        # Publishers
        self.action_command_pub = self.create_publisher(String, '/action_command', 10)
        self.navigation_goal_pub = self.create_publisher(PoseStamped, '/goal_pose', 10)
        self.manipulation_command_pub = self.create_publisher(String, '/manipulation_command', 10)
        self.system_status_pub = self.create_publisher(String, '/system_status', 10)
        
        # State management
        self.current_task = None
        self.task_queue = queue.Queue()
        self.is_processing = False
        
        # Start processing thread
        self.processing_thread = threading.Thread(target=self.process_task_queue, daemon=True)
        self.processing_thread.start()
        
        self.get_logger().info('Voice-to-Action Pipeline initialized')

    def audio_callback(self, msg):
        """Handle raw audio input"""
        try:
            if not self.audio_queue.full():
                self.audio_queue.put(msg)
                self.get_logger().debug(f'Added audio to queue, size: {self.audio_queue.qsize()}')
        except queue.Full:
            self.get_logger().warn('Audio queue is full, dropping audio packet')

    def text_callback(self, msg):
        """Process transcribed text through NLP pipeline"""
        command_text = msg.data
        self.get_logger().info(f'Received transcribed command: {command_text}')
        
        # Process the command through NLP pipeline
        try:
            # Parse the command using LLM
            parsed_command = self.parse_command_with_llm(command_text)
            
            if parsed_command:
                # Add to task queue for execution
                self.task_queue.put(parsed_command)
                
                # Update system status
                status_msg = String()
                status_msg.data = f'PARSED_COMMAND: {command_text} -> {parsed_command.get("action_type", "unknown")}'
                self.system_status_pub.publish(status_msg)
                
                self.get_logger().info(f'Parsed command: {parsed_command}')
            else:
                self.get_logger().error(f'Failed to parse command: {command_text}')
                
        except Exception as e:
            self.get_logger().error(f'Error processing command: {e}')
            
            # Publish error status
            status_msg = String()
            status_msg.data = f'COMMAND_ERROR: {str(e)}'
            self.system_status_pub.publish(status_msg)

    def parse_command_with_llm(self, command_text):
        """Parse command using LLM to extract intent and parameters"""
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": """You are a humanoid robot command parser. Convert natural language commands to structured robot actions. 
                    Respond with JSON containing: action_type, parameters, priority, and confidence.
                    Action types: 'navigate', 'grasp', 'manipulate', 'speak', 'gesture', 'wait', 'follow'.
                    Example: {"action_type": "navigate", "parameters": {"x": 1.0, "y": 2.0, "theta": 0.0}, "priority": "high", "confidence": 0.85}"""},
                    {"role": "user", "content": f"Command: {command_text}"}
                ],
                temperature=0.1,
                max_tokens=300
            )
            
            # Extract and parse the response
            content = response.choices[0].message.content
            
            # Clean up the response (remove markdown formatting if present)
            content = re.sub(r'^```json\s*', '', content)
            content = re.sub(r'```$', '', content)
            
            parsed_command = json.loads(content.strip())
            return parsed_command
            
        except Exception as e:
            self.get_logger().error(f'Error parsing command with LLM: {e}')
            return None

    def process_task_queue(self):
        """Process tasks from the queue in a separate thread"""
        while rclpy.ok():
            try:
                # Get task from queue with timeout
                task = self.task_queue.get(timeout=1.0)
                
                self.is_processing = True
                self.current_task = task
                
                # Execute the task
                success = self.execute_task(task)
                
                # Update status
                status_msg = String()
                if success:
                    status_msg.data = f'TASK_COMPLETED: {task.get("action_type", "unknown")}'
                else:
                    status_msg.data = f'TASK_FAILED: {task.get("action_type", "unknown")}'
                
                self.system_status_pub.publish(status_msg)
                
                # Mark task as done
                self.task_queue.task_done()
                self.is_processing = False
                self.current_task = None
                
            except queue.Empty:
                # Queue is empty, continue loop
                continue
            except Exception as e:
                self.get_logger().error(f'Error processing task: {e}')
                self.is_processing = False
                self.current_task = None

    def execute_task(self, task):
        """Execute a parsed task"""
        action_type = task.get('action_type', 'unknown')
        parameters = task.get('parameters', {})
        
        self.get_logger().info(f'Executing task: {action_type} with params: {parameters}')
        
        try:
            if action_type == 'navigate':
                return self.execute_navigation_task(parameters)
            elif action_type == 'grasp':
                return self.execute_grasp_task(parameters)
            elif action_type == 'manipulate':
                return self.execute_manipulation_task(parameters)
            elif action_type == 'speak':
                return self.execute_speak_task(parameters)
            elif action_type == 'gesture':
                return self.execute_gesture_task(parameters)
            elif action_type == 'follow':
                return self.execute_follow_task(parameters)
            elif action_type == 'wait':
                return self.execute_wait_task(parameters)
            else:
                self.get_logger().warn(f'Unknown action type: {action_type}')
                return False
                
        except Exception as e:
            self.get_logger().error(f'Error executing task {action_type}: {e}')
            return False

    def execute_navigation_task(self, params):
        """Execute navigation task"""
        x = params.get('x', 0.0)
        y = params.get('y', 0.0)
        theta = params.get('theta', 0.0)
        
        # Create navigation goal
        goal_pose = PoseStamped()
        goal_pose.header.frame_id = 'map'
        goal_pose.header.stamp = self.get_clock().now().to_msg()
        goal_pose.pose.position.x = x
        goal_pose.pose.position.y = y
        goal_pose.pose.position.z = 0.0
        
        # Convert theta to quaternion
        from tf_transformations import quaternion_from_euler
        quat = quaternion_from_euler(0, 0, theta)
        goal_pose.pose.orientation.x = quat[0]
        goal_pose.pose.orientation.y = quat[1]
        goal_pose.pose.orientation.z = quat[2]
        goal_pose.pose.orientation.w = quat[3]
        
        # Publish navigation goal
        self.navigation_goal_pub.publish(goal_pose)
        
        self.get_logger().info(f'Published navigation goal to ({x}, {y}, {theta})')
        return True

    def execute_grasp_task(self, params):
        """Execute grasp task"""
        object_name = params.get('object_name', 'unknown')
        approach_pose = params.get('approach_pose', {})
        
        # Create grasp command
        grasp_cmd = String()
        grasp_cmd.data = json.dumps({
            'action': 'grasp',
            'object': object_name,
            'approach_pose': approach_pose
        })
        
        self.manipulation_command_pub.publish(grasp_cmd)
        
        self.get_logger().info(f'Published grasp command for {object_name}')
        return True

    def execute_speak_task(self, params):
        """Execute speak task"""
        text = params.get('text', '')
        
        # In a real system, this would interface with TTS
        self.get_logger().info(f'Robot would speak: {text}')
        
        # For now, just log the command
        return True

    def execute_gesture_task(self, params):
        """Execute gesture task"""
        gesture_type = params.get('gesture_type', 'wave')
        
        # Create gesture command
        gesture_cmd = String()
        gesture_cmd.data = json.dumps({
            'action': 'gesture',
            'type': gesture_type
        })
        
        self.manipulation_command_pub.publish(gesture_cmd)
        
        self.get_logger().info(f'Published gesture command: {gesture_type}')
        return True

def main(args=None):
    rclpy.init(args=args)
    pipeline_node = VoiceToActionPipelineNode()
    
    try:
        rclpy.spin(pipeline_node)
    except KeyboardInterrupt:
        pipeline_node.get_logger().info('Shutting down Voice-to-Action Pipeline')
    finally:
        pipeline_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Solution to Exercise 21.1: Complex Navigation Task Implementation

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import PoseStamped, Twist
from nav_msgs.msg import Odometry, Path
from sensor_msgs.msg import LaserScan
from std_msgs.msg import String, Bool
from action_msgs.msg import GoalStatus
from nav2_msgs.action import NavigateToPose
from geometry_msgs.msg import Point
import numpy as np
import math
from typing import List, Tuple
import threading

class ComplexNavigationNode(Node):
    def __init__(self):
        super().__init__('complex_navigation_node')
        
        # Action client for navigation
        self.nav_to_pose_client = ActionClient(self, NavigateToPose, 'navigate_to_pose')
        
        # Subscriptions
        self.odom_sub = self.create_subscription(Odometry, '/odom', self.odom_callback, 10)
        self.laser_sub = self.create_subscription(LaserScan, '/scan', self.laser_callback, 10)
        
        # Publishers
        self.cmd_vel_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        self.status_pub = self.create_publisher(String, '/navigation_status', 10)
        self.path_pub = self.create_publisher(Path, '/navigation_path', 10)
        
        # State variables
        self.current_pose = None
        self.laser_data = None
        self.navigation_active = False
        self.waypoints = []
        self.current_waypoint_index = 0
        self.navigation_goal = None
        
        # Navigation parameters
        self.min_distance_to_waypoint = 0.3  # meters
        self.rotation_threshold = 0.1  # radians
        self.max_linear_speed = 0.3  # m/s
        self.max_angular_speed = 0.5  # rad/s
        self.safety_distance = 0.5  # meters to obstacles
        
        # Dynamic obstacle avoidance
        self.dynamic_obstacle_detected = False
        self.obstacle_avoidance_active = False
        self.avoidance_counter = 0
        
        # Timer for navigation control
        self.navigation_timer = self.create_timer(0.1, self.navigation_control_loop)
        
        self.get_logger().info('Complex Navigation System initialized')

    def navigate_to_waypoints(self, waypoints: List[Tuple[float, float]]):
        """Navigate through a series of waypoints"""
        if not waypoints:
            self.get_logger().warn('No waypoints provided')
            return False
        
        self.waypoints = waypoints
        self.current_waypoint_index = 0
        self.navigation_active = True
        
        # Start with first waypoint
        return self.navigate_to_current_waypoint()

    def navigate_to_current_waypoint(self):
        """Navigate to the current waypoint in the sequence"""
        if self.current_waypoint_index >= len(self.waypoints):
            self.get_logger().info('All waypoints reached')
            self.navigation_active = False
            return True
        
        target_x, target_y = self.waypoints[self.current_waypoint_index]
        
        # Create navigation goal
        goal_msg = NavigateToPose.Goal()
        goal_msg.pose.header.frame_id = 'map'
        goal_msg.pose.header.stamp = self.get_clock().now().to_msg()
        
        goal_msg.pose.pose.position.x = target_x
        goal_msg.pose.pose.position.y = target_y
        goal_msg.pose.pose.position.z = 0.0
        
        # Set orientation to face the next waypoint (if available)
        if self.current_waypoint_index + 1 < len(self.waypoints):
            next_x, next_y = self.waypoints[self.current_waypoint_index + 1]
            target_angle = math.atan2(next_y - target_y, next_x - target_x)
        else:
            # Last waypoint - maintain current orientation
            if self.current_pose:
                target_angle = self.get_yaw_from_quaternion(self.current_pose.orientation)
            else:
                target_angle = 0.0
        
        # Convert angle to quaternion
        from tf_transformations import quaternion_from_euler
        quat = quaternion_from_euler(0, 0, target_angle)
        goal_msg.pose.pose.orientation.x = quat[0]
        goal_msg.pose.pose.orientation.y = quat[1]
        goal_msg.pose.pose.orientation.z = quat[2]
        goal_msg.pose.pose.orientation.w = quat[3]
        
        # Send navigation goal
        self.get_logger().info(f'Sending navigation goal to ({target_x:.2f}, {target_y:.2f})')
        
        # Wait for server
        if not self.nav_to_pose_client.wait_for_server(timeout_sec=5.0):
            self.get_logger().error('Navigation server not available')
            return False
        
        # Send goal
        self.navigation_goal = goal_msg
        send_goal_future = self.nav_to_pose_client.send_goal_async(
            goal_msg,
            feedback_callback=self.navigation_feedback_callback
        )
        
        send_goal_future.add_done_callback(self.goal_response_callback)
        
        return True

    def goal_response_callback(self, future):
        """Handle goal response"""
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.get_logger().error('Navigation goal rejected')
            self.navigation_active = False
            return
        
        self.get_logger().info('Navigation goal accepted')
        
        # Get result
        get_result_future = goal_handle.get_result_async()
        get_result_future.add_done_callback(self.get_result_callback)

    def navigation_feedback_callback(self, feedback_msg):
        """Handle navigation feedback"""
        # Process feedback if needed
        pass

    def get_result_callback(self, future):
        """Handle navigation result"""
        result = future.result().result
        status = future.result().status
        
        if status == GoalStatus.STATUS_SUCCEEDED:
            self.get_logger().info('Navigation to waypoint succeeded')
            
            # Move to next waypoint
            self.current_waypoint_index += 1
            if self.current_waypoint_index < len(self.waypoints):
                # Navigate to next waypoint
                self.navigate_to_current_waypoint()
            else:
                # All waypoints completed
                self.get_logger().info('All waypoints completed successfully')
                self.navigation_active = False
                
                # Publish completion status
                status_msg = String()
                status_msg.data = 'NAVIGATION_COMPLETE'
                self.status_pub.publish(status_msg)
        else:
            self.get_logger().error(f'Navigation failed with status: {status}')
            self.navigation_active = False
            
            # Publish failure status
            status_msg = String()
            status_msg.data = f'NAVIGATION_FAILED_STATUS_{status}'
            self.status_pub.publish(status_msg)

    def navigation_control_loop(self):
        """Main navigation control loop with obstacle avoidance"""
        if not self.navigation_active or not self.current_pose or not self.laser_data:
            return
        
        # Check for dynamic obstacles
        if self.detect_dynamic_obstacles():
            self.get_logger().warn('Dynamic obstacle detected, initiating avoidance')
            self.execute_obstacle_avoidance()
            return
        
        # Continue normal navigation
        current_x = self.current_pose.position.x
        current_y = self.current_pose.position.y
        
        if self.current_waypoint_index < len(self.waypoints):
            target_x, target_y = self.waypoints[self.current_waypoint_index]
            
            # Calculate distance to current waypoint
            distance_to_waypoint = math.sqrt((target_x - current_x)**2 + (target_y - current_y)**2)
            
            if distance_to_waypoint < self.min_distance_to_waypoint:
                self.get_logger().info(f'Reached waypoint {self.current_waypoint_index}')
                # Continue to next waypoint will be handled by result callback
            else:
                # Calculate navigation command
                cmd_vel = self.calculate_navigation_command(current_x, current_y, target_x, target_y)
                
                # Check safety before publishing
                if self.is_safe_to_execute_command(cmd_vel):
                    self.cmd_vel_pub.publish(cmd_vel)
                else:
                    # Stop robot if unsafe
                    stop_cmd = Twist()
                    self.cmd_vel_pub.publish(stop_cmd)
                    self.get_logger().warn('Unsafe command detected, stopping robot')

    def detect_dynamic_obstacles(self):
        """Detect dynamic obstacles using laser scan analysis"""
        if not self.laser_data:
            return False
        
        # Simple dynamic obstacle detection based on scan changes
        # In a real system, this would use more sophisticated techniques
        ranges = np.array(self.laser_data.ranges)
        
        # Filter out invalid ranges
        valid_ranges = ranges[np.isfinite(ranges)]
        
        if len(valid_ranges) == 0:
            return False
        
        # Check for obstacles within safety distance
        min_range = np.min(valid_ranges) if len(valid_ranges) > 0 else float('inf')
        
        if min_range < self.safety_distance:
            # Potential obstacle detected, check if it's dynamic
            # This is a simplified check - in practice, you'd track objects over time
            return True
        
        return False

    def execute_obstacle_avoidance(self):
        """Execute obstacle avoidance behavior"""
        self.obstacle_avoidance_active = True
        self.avoidance_counter += 1
        
        # Simple avoidance: stop and rotate to find clear path
        cmd_vel = Twist()
        
        if self.avoidance_counter % 10 < 5:  # Alternate between stop and rotate
            # Stop briefly
            cmd_vel.linear.x = 0.0
            cmd_vel.angular.z = 0.0
        else:
            # Rotate to scan for clear path
            cmd_vel.linear.x = 0.0
            cmd_vel.angular.z = 0.3  # Rotate slowly
        
        self.cmd_vel_pub.publish(cmd_vel)
        
        # Reset counter periodically
        if self.avoidance_counter > 100:
            self.avoidance_counter = 0
        
        # Check if obstacle is cleared
        if not self.detect_dynamic_obstacles():
            self.obstacle_avoidance_active = False
            self.get_logger().info('Dynamic obstacle cleared, resuming navigation')

    def calculate_navigation_command(self, current_x, current_y, target_x, target_y):
        """Calculate navigation command to reach target"""
        cmd_vel = Twist()
        
        # Calculate direction to target
        dx = target_x - current_x
        dy = target_y - current_y
        distance = math.sqrt(dx**2 + dy**2)
        
        if distance > 0.1:  # If not very close to target
            # Calculate target angle
            target_angle = math.atan2(dy, dx)
            
            # Get current robot angle
            if self.current_pose:
                current_angle = self.get_yaw_from_quaternion(self.current_pose.orientation)
                
                # Calculate angle difference
                angle_diff = target_angle - current_angle
                # Normalize angle to [-π, π]
                while angle_diff > math.pi:
                    angle_diff -= 2 * math.pi
                while angle_diff < -math.pi:
                    angle_diff += 2 * math.pi
                
                # Set angular velocity proportional to angle error
                cmd_vel.angular.z = max(-self.max_angular_speed, 
                                       min(self.max_angular_speed, angle_diff * 1.0))
                
                # Set linear velocity based on distance (slow down when close)
                cmd_vel.linear.x = max(0.05, min(self.max_linear_speed, distance * 0.5))
            else:
                # Default behavior if no orientation available
                cmd_vel.linear.x = min(self.max_linear_speed, distance * 0.5)
        
        return cmd_vel

    def is_safe_to_execute_command(self, cmd_vel):
        """Check if navigation command is safe to execute"""
        if not self.laser_data:
            return False  # No sensor data, not safe
        
        # Check if command would result in collision
        # This is a simplified check - in practice, you'd use more sophisticated prediction
        
        # Check forward direction for obstacles
        ranges = np.array(self.laser_data.ranges)
        valid_ranges = ranges[np.isfinite(ranges)]
        
        if len(valid_ranges) == 0:
            return False
        
        min_range = np.min(valid_ranges)
        
        # If moving forward and obstacle is too close
        if cmd_vel.linear.x > 0 and min_range < self.safety_distance:
            return False
        
        # If turning and obstacle is in turning direction
        if cmd_vel.angular.z > 0:  # Turning left
            # Check left side (approximate)
            left_ranges_start = len(ranges) // 2 - len(ranges) // 8
            left_ranges_end = len(ranges) // 2 + len(ranges) // 8
            left_ranges = ranges[left_ranges_start:left_ranges_end]
            left_ranges = left_ranges[np.isfinite(left_ranges)]
            if len(left_ranges) > 0 and np.min(left_ranges) < self.safety_distance * 0.7:
                return False
        elif cmd_vel.angular.z < 0:  # Turning right
            # Check right side (approximate)
            right_ranges_start = 3 * len(ranges) // 4 - len(ranges) // 8
            right_ranges_end = 3 * len(ranges) // 4 + len(ranges) // 8
            # Handle wrap-around
            if right_ranges_end > len(ranges):
                right_ranges = np.concatenate([ranges[right_ranges_start:], ranges[:right_ranges_end % len(ranges)]])
            else:
                right_ranges = ranges[right_ranges_start:right_ranges_end]
            right_ranges = right_ranges[np.isfinite(right_ranges)]
            if len(right_ranges) > 0 and np.min(right_ranges) < self.safety_distance * 0.7:
                return False
        
        return True

    def odom_callback(self, msg):
        """Update current pose from odometry"""
        self.current_pose = msg.pose.pose

    def laser_callback(self, msg):
        """Update laser data"""
        self.laser_data = msg

    def get_yaw_from_quaternion(self, quaternion):
        """Extract yaw angle from quaternion"""
        import tf_transformations
        euler = tf_transformations.euler_from_quaternion([
            quaternion.x,
            quaternion.y,
            quaternion.z,
            quaternion.w
        ])
        return euler[2]  # Yaw is the third element

def main(args=None):
    rclpy.init(args=args)
    nav_node = ComplexNavigationNode()
    
    # Example: Navigate through a sequence of waypoints
    # This would typically be triggered by a higher-level task
    waypoints = [
        (1.0, 0.0),
        (2.0, 1.0),
        (3.0, 0.5),
        (4.0, 2.0),
        (5.0, 1.5)
    ]
    
    # Start navigation in a separate thread to avoid blocking
    def start_navigation():
        time.sleep(2.0)  # Wait for systems to initialize
        nav_node.navigate_to_waypoints(waypoints)
    
    nav_thread = threading.Thread(target=start_navigation, daemon=True)
    nav_thread.start()
    
    try:
        rclpy.spin(nav_node)
    except KeyboardInterrupt:
        nav_node.get_logger().info('Shutting down Complex Navigation System')
    finally:
        nav_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Solution to Exercise 22.1: Social Navigation Implementation

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import PoseStamped, Twist, Point
from sensor_msgs.msg import LaserScan, PointCloud2
from people_msgs.msg import People, Person
from std_msgs.msg import String
from visualization_msgs.msg import Marker, MarkerArray
from tf2_ros import TransformException
import tf2_ros
import numpy as np
import math
from typing import List, Tuple

class SocialNavigationNode(Node):
    def __init__(self):
        super().__init__('social_navigation_node')
        
        # TF2 setup
        self.tf_buffer = tf2_ros.Buffer()
        self.tf_listener = tf2_ros.TransformListener(self.tf_buffer, self)
        
        # Subscriptions
        self.people_sub = self.create_subscription(
            People,
            '/people',
            self.people_callback,
            10
        )
        
        self.laser_sub = self.create_subscription(
            LaserScan,
            '/scan',
            self.laser_callback,
            10
        )
        
        self.odom_sub = self.create_subscription(
            Odometry,
            '/odom',
            self.odom_callback,
            10
        )
        
        # Publishers
        self.cmd_vel_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        self.social_status_pub = self.create_publisher(String, '/social_status', 10)
        self.social_viz_pub = self.create_publisher(MarkerArray, '/social_viz', 10)
        
        # State variables
        self.people_list = []
        self.current_pose = None
        self.laser_data = None
        self.social_navigation_active = False
        
        # Social navigation parameters
        self.personal_space_radius = 0.8  # meters
        self.social_zone_radius = 1.5    # meters
        self.comfort_zone_radius = 2.0   # meters
        self.min_approach_distance = 1.0 # minimum distance to approach people
        self.yield_distance = 1.2        # distance at which to yield to people
        self.follow_distance = 2.0       # distance to maintain when following
        self.max_human_speed = 1.5       # maximum human walking speed to consider
        
        # Social behaviors
        self.yielding_to_person = None
        self.yield_start_time = None
        self.yield_duration = 3.0  # seconds to yield
        
        # Timer for social navigation control
        self.social_nav_timer = self.create_timer(0.1, self.social_navigation_control)
        
        self.get_logger().info('Social Navigation System initialized')

    def people_callback(self, msg):
        """Update detected people list"""
        self.people_list = msg.people

    def laser_callback(self, msg):
        """Update laser data"""
        self.laser_data = msg

    def odom_callback(self, msg):
        """Update current pose"""
        self.current_pose = msg.pose.pose

    def social_navigation_control(self):
        """Main social navigation control loop"""
        if not self.current_pose or not self.people_list:
            return
        
        # Get robot position
        robot_x = self.current_pose.position.x
        robot_y = self.current_pose.position.y
        
        # Check for nearby people and adjust navigation
        closest_person_dist = float('inf')
        closest_person = None
        
        for person in self.people_list:
            # Transform person position to robot's frame if needed
            try:
                # Calculate distance to person
                dx = person.position.x - robot_x
                dy = person.position.y - robot_y
                dist = math.sqrt(dx**2 + dy**2)
                
                if dist < closest_person_dist:
                    closest_person_dist = dist
                    closest_person = person
            except TransformException:
                # If transform fails, use positions directly
                dx = person.position.x - robot_x
                dy = person.position.y - robot_y
                dist = math.sqrt(dx**2 + dy**2)
                
                if dist < closest_person_dist:
                    closest_person_dist = dist
                    closest_person = person
        
        # Determine social navigation behavior based on closest person
        cmd_vel = Twist()
        
        if closest_person_dist < self.yield_distance:
            # Person is too close, implement social behavior
            cmd_vel = self.social_behavior_for_close_person(
                robot_x, robot_y, closest_person, closest_person_dist
            )
        else:
            # No close people, proceed with normal navigation
            # This would typically come from higher-level navigation system
            cmd_vel.linear.x = 0.0  # Wait for navigation command
            cmd_vel.angular.z = 0.0
        
        # Publish command
        self.cmd_vel_pub.publish(cmd_vel)
        
        # Publish social status
        status_msg = String()
        if closest_person_dist < self.yield_distance:
            status_msg.data = f'SOCIAL_NAVIGATION_ACTIVE: Person at {closest_person_dist:.2f}m'
        else:
            status_msg.data = 'NORMAL_NAVIGATION: No close people detected'
        
        self.social_status_pub.publish(status_msg)
        
        # Publish visualization
        self.publish_social_visualization(robot_x, robot_y, self.people_list)

    def social_behavior_for_close_person(self, robot_x, robot_y, person, distance):
        """Implement social behavior when person is close"""
        cmd_vel = Twist()
        
        # Calculate relative position
        dx = person.position.x - robot_x
        dy = person.position.y - robot_y
        person_angle = math.atan2(dy, dx)
        
        # Get current robot orientation
        robot_angle = self.get_yaw_from_quaternion(self.current_pose.orientation)
        
        # Calculate angle difference
        angle_diff = person_angle - robot_angle
        while angle_diff > math.pi:
            angle_diff -= 2 * math.pi
        while angle_diff < -math.pi:
            angle_diff += 2 * math.pi
        
        if distance < self.personal_space_radius:
            # Too close to personal space - move away
            self.get_logger().info(f'Too close to person ({distance:.2f}m), moving away')
            
            # Move away from person
            cmd_vel.linear.x = -0.2  # Move backward
            cmd_vel.angular.z = -angle_diff * 0.5  # Turn away from person
            
        elif distance < self.social_zone_radius:
            # In social zone - yield and be polite
            self.get_logger().info(f'In social zone ({distance:.2f}m), yielding to person')
            
            # Slow down and give space
            cmd_vel.linear.x = 0.1  # Move slowly
            cmd_vel.angular.z = -angle_diff * 0.2  # Gentle turn away
            
            # If moving toward person, stop
            if abs(angle_diff) < math.pi / 4:  # Moving roughly toward person
                cmd_vel.linear.x = 0.0
                cmd_vel.angular.z = -0.1 if angle_diff > 0 else 0.1  # Gentle turn aside
        
        elif distance < self.comfort_zone_radius:
            # In comfort zone - acknowledge but continue
            self.get_logger().info(f'In comfort zone ({distance:.2f}m), acknowledging person')
            
            # Continue with caution
            cmd_vel.linear.x = 0.2  # Slow speed
            # Don't turn away unless necessary for navigation
            
        return cmd_vel

    def publish_social_visualization(self, robot_x, robot_y, people_list):
        """Publish visualization markers for social zones"""
        marker_array = MarkerArray()
        
        # Create robot marker
        robot_marker = Marker()
        robot_marker.header.frame_id = 'map'
        robot_marker.header.stamp = self.get_clock().now().to_msg()
        robot_marker.ns = 'social_navigation'
        robot_marker.id = 0
        robot_marker.type = Marker.CYLINDER
        robot_marker.action = Marker.ADD
        
        robot_marker.pose.position.x = robot_x
        robot_marker.pose.position.y = robot_y
        robot_marker.pose.position.z = 0.5
        robot_marker.pose.orientation.w = 1.0
        
        robot_marker.scale.x = self.personal_space_radius * 2
        robot_marker.scale.y = self.personal_space_radius * 2
        robot_marker.scale.z = 1.0
        
        robot_marker.color.r = 1.0
        robot_marker.color.g = 0.0
        robot_marker.color.b = 0.0
        robot_marker.color.a = 0.2  # Semi-transparent
        
        marker_array.markers.append(robot_marker)
        
        # Create markers for each person's social zones
        for i, person in enumerate(people_list):
            # Personal space
            personal_marker = Marker()
            personal_marker.header.frame_id = 'map'
            personal_marker.header.stamp = self.get_clock().now().to_msg()
            personal_marker.ns = 'social_navigation'
            personal_marker.id = i + 1
            personal_marker.type = Marker.CYLINDER
            personal_marker.action = Marker.ADD
            
            personal_marker.pose.position.x = person.position.x
            personal_marker.pose.position.y = person.position.y
            personal_marker.pose.position.z = 0.5
            personal_marker.pose.orientation.w = 1.0
            
            personal_marker.scale.x = self.personal_space_radius * 2
            personal_marker.scale.y = self.personal_space_radius * 2
            personal_marker.scale.z = 1.0
            
            personal_marker.color.r = 0.0
            personal_marker.color.g = 0.0
            personal_marker.color.b = 1.0
            personal_marker.color.a = 0.2  # Semi-transparent
            
            marker_array.markers.append(personal_marker)
            
            # Social zone
            social_marker = Marker()
            social_marker.header = personal_marker.header
            social_marker.ns = 'social_navigation'
            social_marker.id = i + 100  # Different ID range
            social_marker.type = Marker.CYLINDER
            social_marker.action = Marker.ADD
            
            social_marker.pose = personal_marker.pose
            social_marker.scale.x = self.social_zone_radius * 2
            social_marker.scale.y = self.social_zone_radius * 2
            social_marker.scale.z = 0.5
            
            social_marker.color.r = 0.0
            social_marker.color.g = 1.0
            social_marker.color.b = 0.0
            social_marker.color.a = 0.1  # More transparent
            
            marker_array.markers.append(social_marker)
        
        self.social_viz_pub.publish(marker_array)

    def get_yaw_from_quaternion(self, quaternion):
        """Extract yaw angle from quaternion"""
        import tf_transformations
        euler = tf_transformations.euler_from_quaternion([
            quaternion.x,
            quaternion.y,
            quaternion.z,
            quaternion.w
        ])
        return euler[2]  # Yaw is the third element

def main(args=None):
    rclpy.init(args=args)
    social_nav_node = SocialNavigationNode()
    
    try:
        rclpy.spin(social_nav_node)
    except KeyboardInterrupt:
        social_nav_node.get_logger().info('Shutting down Social Navigation System')
    finally:
        social_nav_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Solution to Exercise 23.1: Comprehensive Safety System

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Bool, String, Float32
from geometry_msgs.msg import Twist, Pose, Point
from sensor_msgs.msg import LaserScan, Imu, JointState
from nav_msgs.msg import Odometry
from builtin_interfaces.msg import Duration
from visualization_msgs.msg import MarkerArray
from tf2_ros import TransformException
import tf2_ros
import numpy as np
import math
from enum import Enum
from typing import Dict, List

class SafetyLevel(Enum):
    NORMAL = 0
    WARNING = 1
    ALERT = 2
    EMERGENCY = 3

class SafetySystemNode(Node):
    def __init__(self):
        super().__init__('safety_system_node')
        
        # TF2 setup
        self.tf_buffer = tf2_ros.Buffer()
        self.tf_listener = tf2_ros.TransformListener(self.tf_buffer, self)
        
        # Subscriptions
        self.cmd_vel_sub = self.create_subscription(
            Twist,
            '/cmd_vel',
            self.cmd_vel_callback,
            10
        )
        
        self.odom_sub = self.create_subscription(
            Odometry,
            '/odom',
            self.odom_callback,
            10
        )
        
        self.laser_sub = self.create_subscription(
            LaserScan,
            '/scan',
            self.laser_callback,
            10
        )
        
        self.imu_sub = self.create_subscription(
            Imu,
            '/imu/data',
            self.imu_callback,
            10
        )
        
        self.joint_state_sub = self.create_subscription(
            JointState,
            '/joint_states',
            self.joint_state_callback,
            10
        )
        
        # Publishers
        self.safety_cmd_pub = self.create_publisher(Twist, '/safety_cmd_vel', 10)
        self.safety_status_pub = self.create_publisher(String, '/safety_status', 10)
        self.emergency_stop_pub = self.create_publisher(Bool, '/emergency_stop', 10)
        self.safety_viz_pub = self.create_publisher(MarkerArray, '/safety_viz', 10)
        
        # State variables
        self.current_cmd_vel = Twist()
        self.current_odom = None
        self.laser_data = None
        self.imu_data = None
        self.joint_states = None
        
        # Safety state
        self.safety_level = SafetyLevel.NORMAL
        self.safety_violations = []
        self.emergency_active = False
        self.last_safety_check = self.get_clock().now()
        
        # Safety parameters
        self.min_obstacle_distance = 0.3  # meters
        self.max_linear_velocity = 0.5    # m/s
        self.max_angular_velocity = 0.8   # rad/s
        self.max_angular_acceleration = 1.0  # rad/s^2
        self.max_linear_acceleration = 1.0   # m/s^2
        self.max_tilt_angle = 0.3  # radians (~17 degrees)
        self.max_joint_velocity = 2.0  # rad/s
        self.max_joint_effort = 50.0  # N*m
        
        # Velocity tracking for acceleration limits
        self.prev_linear_vel = 0.0
        self.prev_angular_vel = 0.0
        self.prev_time = None
        
        # Timer for safety checks
        self.safety_timer = self.create_timer(0.05, self.safety_check)  # 20Hz
        
        self.get_logger().info('Comprehensive Safety System initialized')

    def cmd_vel_callback(self, msg):
        """Receive and validate velocity commands"""
        self.current_cmd_vel = msg
        
        # Validate command against safety constraints
        if not self.emergency_active:
            validated_cmd = self.validate_command(msg)
            self.safety_cmd_pub.publish(validated_cmd)

    def odom_callback(self, msg):
        """Update odometry information"""
        self.current_odom = msg

    def laser_callback(self, msg):
        """Update laser scan information"""
        self.laser_data = msg

    def imu_callback(self, msg):
        """Update IMU information"""
        self.imu_data = msg

    def joint_state_callback(self, msg):
        """Update joint state information"""
        self.joint_states = msg

    def safety_check(self):
        """Perform comprehensive safety check"""
        current_time = self.get_clock().now()
        
        # Reset safety violations
        self.safety_violations = []
        
        # Check various safety aspects
        self.check_collision_risk()
        self.check_dynamic_stability()
        self.check_joint_limits()
        self.check_command_validity()
        
        # Determine overall safety level
        new_safety_level = self.determine_safety_level()
        
        # Update safety status if level changed
        if new_safety_level != self.safety_level:
            self.safety_level = new_safety_level
            self.publish_safety_status()
        
        # Handle emergency if needed
        if self.safety_level == SafetyLevel.EMERGENCY:
            self.activate_emergency_stop()
        else:
            if self.emergency_active:
                self.deactivate_emergency_stop()
        
        # Update previous time for acceleration calculations
        self.prev_time = current_time
        
        # Publish visualization
        self.publish_safety_visualization()

    def check_collision_risk(self):
        """Check for collision risk based on laser data"""
        if not self.laser_data:
            return
        
        ranges = np.array(self.laser_data.ranges)
        valid_ranges = ranges[np.isfinite(ranges)]
        
        if len(valid_ranges) > 0:
            min_range = np.min(valid_ranges)
            
            if min_range < self.min_obstacle_distance:
                self.safety_violations.append(f'COLLISION_RISK: Obstacle at {min_range:.2f}m (threshold: {self.min_obstacle_distance}m)')
                
                # If very close, escalate to emergency
                if min_range < self.min_obstacle_distance * 0.5:
                    self.safety_level = SafetyLevel.EMERGENCY

    def check_dynamic_stability(self):
        """Check robot stability using IMU data"""
        if not self.imu_data:
            return
        
        # Extract orientation from IMU
        orientation = self.imu_data.orientation
        import tf_transformations
        euler = tf_transformations.euler_from_quaternion([
            orientation.x,
            orientation.y,
            orientation.z,
            orientation.w
        ])
        
        roll, pitch, yaw = euler
        
        # Check tilt angles
        tilt_angle = math.sqrt(roll**2 + pitch**2)
        
        if tilt_angle > self.max_tilt_angle:
            self.safety_violations.append(f'STABILITY_RISK: Tilt angle {tilt_angle:.2f}rad exceeds limit {self.max_tilt_angle:.2f}rad')

    def check_joint_limits(self):
        """Check joint state limits"""
        if not self.joint_states:
            return
        
        # Check joint velocities and efforts
        if self.joint_states.velocity:
            for vel in self.joint_states.velocity:
                if abs(vel) > self.max_joint_velocity:
                    self.safety_violations.append(f'JOINT_VELOCITY_EXCEEDED: {abs(vel):.2f} > {self.max_joint_velocity:.2f}')
        
        if self.joint_states.effort:
            for effort in self.joint_states.effort:
                if abs(effort) > self.max_joint_effort:
                    self.safety_violations.append(f'JOINT_EFFORT_EXCEEDED: {abs(effort):.2f} > {self.max_joint_effort:.2f}')

    def check_command_validity(self):
        """Check if current command is valid"""
        cmd = self.current_cmd_vel
        
        # Check velocity limits
        if abs(cmd.linear.x) > self.max_linear_velocity:
            self.safety_violations.append(f'LINEAR_VELOCITY_EXCEEDED: {abs(cmd.linear.x):.2f} > {self.max_linear_velocity:.2f}')
        
        if abs(cmd.angular.z) > self.max_angular_velocity:
            self.safety_violations.append(f'ANGULAR_VELOCITY_EXCEEDED: {abs(cmd.angular.z):.2f} > {self.max_angular_velocity:.2f}')
        
        # Check acceleration limits if we have previous data
        if self.prev_time and self.current_odom:
            dt = (self.get_clock().now() - self.prev_time).nanoseconds / 1e9  # Convert to seconds
            
            if dt > 0:
                # Calculate accelerations
                linear_acc = abs(cmd.linear.x - self.prev_linear_vel) / dt
                angular_acc = abs(cmd.angular.z - self.prev_angular_vel) / dt
                
                if linear_acc > self.max_linear_acceleration:
                    self.safety_violations.append(f'LINEAR_ACCELERATION_EXCEEDED: {linear_acc:.2f} > {self.max_linear_acceleration:.2f}')
                
                if angular_acc > self.max_angular_acceleration:
                    self.safety_violations.append(f'ANGULAR_ACCELERATION_EXCEEDED: {angular_acc:.2f} > {self.max_angular_acceleration:.2f}')
        
        # Update previous values
        self.prev_linear_vel = cmd.linear.x
        self.prev_angular_vel = cmd.angular.z

    def validate_command(self, cmd_vel):
        """Validate and potentially modify command to ensure safety"""
        validated_cmd = Twist()
        
        # Limit linear velocity
        validated_cmd.linear.x = max(-self.max_linear_velocity, 
                                   min(self.max_linear_velocity, cmd_vel.linear.x))
        
        # Limit angular velocity
        validated_cmd.angular.z = max(-self.max_angular_velocity, 
                                    min(self.max_angular_velocity, cmd_vel.angular.z))
        
        # If in collision risk, reduce speed
        for violation in self.safety_violations:
            if 'COLLISION_RISK' in violation:
                validated_cmd.linear.x *= 0.3  # Reduce to 30% speed
                validated_cmd.angular.z *= 0.5  # Reduce angular speed moderately
        
        # If in stability risk, be more conservative
        for violation in self.safety_violations:
            if 'STABILITY_RISK' in violation:
                validated_cmd.linear.x *= 0.5  # Reduce to 50% speed
                validated_cmd.angular.z *= 0.3  # More conservative turning
        
        return validated_cmd

    def determine_safety_level(self):
        """Determine overall safety level based on violations"""
        if not self.safety_violations:
            return SafetyLevel.NORMAL
        
        # Check for emergency conditions
        for violation in self.safety_violations:
            if 'COLLISION_RISK' in violation and float(violation.split()[2]) < self.min_obstacle_distance * 0.3:
                return SafetyLevel.EMERGENCY
            if 'STABILITY_RISK' in violation:
                return SafetyLevel.EMERGENCY
        
        # Check for alert conditions
        for violation in self.safety_violations:
            if 'EXCEEDED' in violation:
                return SafetyLevel.ALERT
        
        # Default to warning for other violations
        return SafetyLevel.WARNING

    def activate_emergency_stop(self):
        """Activate emergency stop"""
        if not self.emergency_active:
            self.emergency_active = True
            
            # Publish emergency stop command
            stop_cmd = Twist()
            self.safety_cmd_pub.publish(stop_cmd)
            
            # Publish emergency stop signal
            emergency_msg = Bool()
            emergency_msg.data = True
            self.emergency_stop_pub.publish(emergency_msg)
            
            self.get_logger().error('EMERGENCY STOP ACTIVATED')
            
            # Publish status
            status_msg = String()
            status_msg.data = 'EMERGENCY_STOP_ACTIVATED'
            self.safety_status_pub.publish(status_msg)

    def deactivate_emergency_stop(self):
        """Deactivate emergency stop"""
        if self.emergency_active:
            self.emergency_active = False
            
            # Publish emergency stop released signal
            emergency_msg = Bool()
            emergency_msg.data = False
            self.emergency_stop_pub.publish(emergency_msg)
            
            self.get_logger().info('EMERGENCY STOP RELEASED')
            
            # Publish status
            status_msg = String()
            status_msg.data = 'EMERGENCY_STOP_RELEASED'
            self.safety_status_pub.publish(status_msg)

    def publish_safety_status(self):
        """Publish current safety status"""
        status_msg = String()
        
        if self.safety_level == SafetyLevel.NORMAL:
            status_msg.data = 'SAFETY_NORMAL'
        elif self.safety_level == SafetyLevel.WARNING:
            status_msg.data = f'SAFETY_WARNING: {"; ".join(self.safety_violations[:3])}'  # Limit to first 3 violations
        elif self.safety_level == SafetyLevel.ALERT:
            status_msg.data = f'SAFETY_ALERT: {"; ".join(self.safety_violations[:3])}'
        elif self.safety_level == SafetyLevel.EMERGENCY:
            status_msg.data = f'SAFETY_EMERGENCY: {"; ".join(self.safety_violations[:3])}'
        
        self.safety_status_pub.publish(status_msg)

    def publish_safety_visualization(self):
        """Publish safety visualization markers"""
        marker_array = MarkerArray()
        
        # Create markers based on safety level
        safety_marker = Marker()
        safety_marker.header.frame_id = 'map'
        safety_marker.header.stamp = self.get_clock().now().to_msg()
        safety_marker.ns = 'safety_system'
        safety_marker.id = 0
        safety_marker.type = Marker.TEXT_VIEW_FACING
        safety_marker.action = Marker.ADD
        
        # Position at robot location if available
        if self.current_odom:
            safety_marker.pose.position = self.current_odom.pose.pose.position
            safety_marker.pose.position.z += 1.0  # Above robot
        else:
            safety_marker.pose.position.z = 1.0
        
        safety_marker.pose.orientation.w = 1.0
        
        safety_marker.scale.z = 0.3  # Text size
        
        # Color based on safety level
        if self.safety_level == SafetyLevel.NORMAL:
            safety_marker.color.r = 0.0
            safety_marker.color.g = 1.0
            safety_marker.color.b = 0.0
            safety_marker.color.a = 1.0
            safety_marker.text = 'SAFE'
        elif self.safety_level == SafetyLevel.WARNING:
            safety_marker.color.r = 1.0
            safety_marker.color.g = 1.0
            safety_marker.color.b = 0.0
            safety_marker.color.a = 1.0
            safety_marker.text = 'CAUTION'
        elif self.safety_level == SafetyLevel.ALERT:
            safety_marker.color.r = 1.0
            safety_marker.color.g = 0.5
            safety_marker.color.b = 0.0
            safety_marker.color.a = 1.0
            safety_marker.text = 'WARNING'
        elif self.safety_level == SafetyLevel.EMERGENCY:
            safety_marker.color.r = 1.0
            safety_marker.color.g = 0.0
            safety_marker.color.b = 0.0
            safety_marker.color.a = 1.0
            safety_marker.text = 'EMERGENCY'
        
        marker_array.markers.append(safety_marker)
        
        # Add obstacle risk visualization if applicable
        if self.laser_data and self.current_odom:
            ranges = np.array(self.laser_data.ranges)
            angles = np.linspace(
                self.laser_data.angle_min,
                self.laser_data.angle_max,
                len(ranges)
            )
            
            # Find points that are too close
            close_indices = np.where(ranges < self.min_obstacle_distance)[0]
            
            for i, idx in enumerate(close_indices[:10]):  # Limit to first 10 points
                obstacle_marker = Marker()
                obstacle_marker.header.frame_id = 'base_link'  # Robot-centered
                obstacle_marker.header.stamp = self.get_clock().now().to_msg()
                obstacle_marker.ns = 'obstacle_risk'
                obstacle_marker.id = i + 1
                obstacle_marker.type = Marker.SPHERE
                obstacle_marker.action = Marker.ADD
                
                # Calculate position in robot frame
                angle = angles[idx]
                distance = ranges[idx]
                
                obstacle_marker.pose.position.x = distance * math.cos(angle)
                obstacle_marker.pose.position.y = distance * math.sin(angle)
                obstacle_marker.pose.position.z = 0.3  # Height above ground
                
                obstacle_marker.pose.orientation.w = 1.0
                
                obstacle_marker.scale.x = 0.1
                obstacle_marker.scale.y = 0.1
                obstacle_marker.scale.z = 0.1
                
                obstacle_marker.color.r = 1.0
                obstacle_marker.color.g = 0.0
                obstacle_marker.color.b = 0.0
                obstacle_marker.color.a = 0.8
                
                marker_array.markers.append(obstacle_marker)
        
        self.safety_viz_pub.publish(marker_array)

def main(args=None):
    rclpy.init(args=args)
    safety_node = SafetySystemNode()
    
    try:
        rclpy.spin(safety_node)
    except KeyboardInterrupt:
        safety_node.get_logger().info('Shutting down Safety System')
    finally:
        safety_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Best Practices for Capstone Implementation

### 1. System Integration
- Use proper lifecycle management
- Implement robust error handling
- Design modular, testable components
- Follow ROS 2 best practices

### 2. Performance Optimization
- Optimize for real-time performance
- Use appropriate data structures
- Implement efficient algorithms
- Monitor resource usage

### 3. Safety First
- Implement comprehensive safety checks
- Design graceful degradation
- Include emergency procedures
- Validate all safety-critical functions

### 4. Testing and Validation
- Test each module independently
- Validate integrated system behavior
- Test edge cases and failure modes
- Include human-in-the-loop testing

## Troubleshooting Common Issues

### 1. Integration Problems
- Verify all nodes are on the same ROS domain
- Check TF tree completeness
- Validate message type compatibility
- Monitor network connectivity for distributed systems

### 2. Performance Issues
- Profile computational bottlenecks
- Optimize critical path algorithms
- Use appropriate threading models
- Monitor memory usage

### 3. Safety System Issues
- Verify sensor data quality
- Check safety parameter tuning
- Validate emergency procedures
- Test recovery behaviors

## Summary

In this capstone chapter, we've implemented a complete autonomous humanoid system that integrates all the modules we've developed throughout this book. The system includes:

1. **System Integration**: Connecting all modules with proper communication protocols
2. **End-to-End Pipeline**: Complete flow from voice command to action execution
3. **Complex Navigation**: Multi-waypoint navigation with obstacle avoidance
4. **Social Navigation**: Human-aware navigation respecting personal space
5. **Safety System**: Comprehensive safety monitoring and emergency procedures

The capstone project demonstrates how all the individual components work together to create a capable humanoid robot system. Each module contributes to the overall functionality while maintaining the safety and reliability required for humanoid robotics applications.

This concludes our exploration of Physical AI & Humanoid Robotics. The knowledge and skills gained throughout this book provide a solid foundation for developing advanced humanoid robotics applications using ROS 2, simulation environments, AI integration, and safe navigation systems.