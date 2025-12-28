# Chapter 4: Bridging AI Agents to ROS 2

## Overview

This chapter explores how to integrate AI agents with ROS 2, creating a bridge between high-level artificial intelligence and low-level robot control. We'll examine patterns for connecting language models, computer vision systems, and planning algorithms to ROS 2-based robotic platforms.

## The AI-ROS Bridge Pattern

The AI-ROS bridge pattern involves creating intermediate nodes that translate between AI system outputs and ROS 2 messages/services/actions. This pattern allows AI systems to operate independently while still controlling the robot through ROS 2's communication infrastructure.

## Architecture Components

### AI Interface Node

The AI Interface Node serves as the primary bridge between AI systems and ROS 2:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import PoseStamped
from nav2_msgs.action import NavigateToPose
from rclpy.action import ActionClient

class AIInterfaceNode(Node):
    def __init__(self):
        super().__init__('ai_interface')
        
        # Subscribers for AI commands
        self.ai_command_sub = self.create_subscription(
            String,
            'ai_commands',
            self.ai_command_callback,
            10
        )
        
        # Publishers for AI status
        self.ai_status_pub = self.create_publisher(String, 'ai_status', 10)
        
        # Action client for navigation
        self.nav_client = ActionClient(self, NavigateToPose, 'navigate_to_pose')
        
        self.get_logger().info('AI Interface Node initialized')

    def ai_command_callback(self, msg):
        command = msg.data
        self.get_logger().info(f'Received AI command: {command}')
        
        # Process the command and execute appropriate ROS 2 action
        if 'navigate to' in command.lower():
            self.handle_navigation_command(command)
        elif 'stop' in command.lower():
            self.handle_stop_command()
        else:
            self.get_logger().warn(f'Unknown command: {command}')

    def handle_navigation_command(self, command):
        # Extract target location from command (simplified)
        # In a real system, you'd use NLP to extract meaningful locations
        target_pose = PoseStamped()
        target_pose.header.frame_id = 'map'
        target_pose.pose.position.x = 1.0  # Example coordinates
        target_pose.pose.position.y = 2.0
        target_pose.pose.orientation.w = 1.0
        
        goal_msg = NavigateToPose.Goal()
        goal_msg.pose = target_pose
        
        # Wait for action server
        self.nav_client.wait_for_server()
        
        # Send navigation goal
        self.nav_client.send_goal_async(goal_msg)
        self.get_logger().info('Sent navigation goal to Nav2')

    def handle_stop_command(self):
        self.get_logger().info('Stop command received - stopping robot')

def main(args=None):
    rclpy.init(args=args)
    ai_interface = AIInterfaceNode()
    
    try:
        rclpy.spin(ai_interface)
    except KeyboardInterrupt:
        pass
    finally:
        ai_interface.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Integration with Language Models

### OpenAI API Integration

Here's how to integrate with OpenAI's API to process natural language commands:

```python
import rclpy
from rclpy.node import Node
import openai
from std_msgs.msg import String
import json

class LLMInterfaceNode(Node):
    def __init__(self):
        super().__init__('llm_interface')
        
        # Initialize OpenAI API (requires API key in environment)
        openai.api_key = self.get_parameter_or('openai_api_key', 'your-api-key-here')
        
        # Subscribers and publishers
        self.voice_command_sub = self.create_subscription(
            String,
            'voice_commands',
            self.voice_command_callback,
            10
        )
        
        self.robot_command_pub = self.create_publisher(String, 'robot_commands', 10)
        self.ai_response_pub = self.create_publisher(String, 'ai_responses', 10)
        
        self.get_logger().info('LLM Interface Node initialized')

    def voice_command_callback(self, msg):
        user_command = msg.data
        self.get_logger().info(f'Received voice command: {user_command}')
        
        # Process command with LLM
        robot_command = self.process_with_llm(user_command)
        
        if robot_command:
            # Publish command to robot
            cmd_msg = String()
            cmd_msg.data = robot_command
            self.robot_command_pub.publish(cmd_msg)
            
            # Publish AI response
            response_msg = String()
            response_msg.data = f"I'll do {robot_command} for you."
            self.ai_response_pub.publish(response_msg)

    def process_with_llm(self, user_command):
        try:
            # Define the system context for the LLM
            system_prompt = """
            You are a robot command interpreter. Convert natural language commands 
            into specific robot actions. Respond with a JSON object containing:
            {
                "action": "action_type",
                "parameters": {"param1": "value1", ...}
            }
            
            Available actions: navigate, grasp, speak, detect_object, stop
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_command}
                ],
                max_tokens=150,
                temperature=0.3
            )
            
            # Extract and parse the response
            llm_response = response.choices[0].message['content'].strip()
            
            # Extract JSON from response (in case it's wrapped in markdown)
            import re
            json_match = re.search(r'\{.*\}', llm_response, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                command_data = json.loads(json_str)
                
                # Convert to ROS 2 command format
                action = command_data.get('action', 'unknown')
                params = command_data.get('parameters', {})
                
                # Format command for ROS 2
                formatted_command = f"{action} " + " ".join([f"{k}={v}" for k, v in params.items()])
                return formatted_command
            else:
                self.get_logger().error(f'Could not extract JSON from LLM response: {llm_response}')
                return None
                
        except Exception as e:
            self.get_logger().error(f'Error processing command with LLM: {str(e)}')
            return None

def main(args=None):
    rclpy.init(args=args)
    llm_interface = LLMInterfaceNode()
    
    try:
        rclpy.spin(llm_interface)
    except KeyboardInterrupt:
        pass
    finally:
        llm_interface.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Computer Vision Integration

### Object Detection Bridge

Connecting computer vision models to ROS 2:

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from vision_msgs.msg import Detection2DArray, ObjectHypothesisWithPose
from cv_bridge import CvBridge
import cv2
import numpy as np

class VisionBridgeNode(Node):
    def __init__(self):
        super().__init__('vision_bridge')
        
        # Initialize OpenCV bridge
        self.cv_bridge = CvBridge()
        
        # Subscribe to camera feed
        self.image_sub = self.create_subscription(
            Image,
            'camera/image_raw',
            self.image_callback,
            10
        )
        
        # Publish object detections
        self.detection_pub = self.create_publisher(Detection2DArray, 'object_detections', 10)
        
        self.get_logger().info('Vision Bridge Node initialized')

    def image_callback(self, msg):
        try:
            # Convert ROS Image message to OpenCV image
            cv_image = self.cv_bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')
            
            # Perform object detection (using a pre-trained model)
            detections = self.detect_objects(cv_image)
            
            # Publish detections as ROS message
            detection_msg = self.create_detection_message(detections, msg.header)
            self.detection_pub.publish(detection_msg)
            
        except Exception as e:
            self.get_logger().error(f'Error processing image: {str(e)}')

    def detect_objects(self, image):
        # This is a simplified example
        # In practice, you'd use a model like YOLO, SSD, or similar
        # For this example, we'll use OpenCV's built-in HOG descriptor for people detection
        
        hog = cv2.HOGDescriptor()
        hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
        
        # Detect people in the image
        boxes, weights = hog.detectMultiScale(image, winStride=(8,8))
        
        detections = []
        for (x, y, w, h) in boxes:
            detection = {
                'class': 'person',
                'confidence': float(weights[list(boxes).index([x, y, w, h])][0]) if len(weights) > 0 else 0.8,
                'bbox': [x, y, w, h]
            }
            detections.append(detection)
        
        return detections

    def create_detection_message(self, detections, header):
        detection_array = Detection2DArray()
        detection_array.header = header
        
        for detection in detections:
            detection_2d = Detection2D()
            detection_2d.header = header
            
            # Set bounding box
            bbox = detection['bbox']
            detection_2d.bbox.center.x = bbox[0] + bbox[2] / 2
            detection_2d.bbox.center.y = bbox[1] + bbox[3] / 2
            detection_2d.bbox.size_x = bbox[2]
            detection_2d.bbox.size_y = bbox[3]
            
            # Set hypothesis
            hypothesis = ObjectHypothesisWithPose()
            hypothesis.id = detection['class']
            hypothesis.score = detection['confidence']
            detection_2d.results.append(hypothesis)
            
            detection_array.detections.append(detection_2d)
        
        return detection_array

def main(args=None):
    rclpy.init(args=args)
    vision_bridge = VisionBridgeNode()
    
    try:
        rclpy.spin(vision_bridge)
    except KeyboardInterrupt:
        pass
    finally:
        vision_bridge.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Planning and Decision Making

### Task Planning Bridge

Connecting high-level planners to ROS 2:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import PoseStamped
from action_msgs.msg import GoalStatus
import json

class PlanningBridgeNode(Node):
    def __init__(self):
        super().__init__('planning_bridge')
        
        # Subscribers for high-level goals
        self.goal_sub = self.create_subscription(
            String,
            'high_level_goals',
            self.goal_callback,
            10
        )
        
        # Publishers for low-level commands
        self.nav_goal_pub = self.create_publisher(PoseStamped, 'move_base_simple/goal', 10)
        self.status_pub = self.create_publisher(String, 'planning_status', 10)
        
        self.current_plan = []
        self.current_step = 0
        
        self.get_logger().info('Planning Bridge Node initialized')

    def goal_callback(self, msg):
        goal_data = json.loads(msg.data)
        self.get_logger().info(f'Received high-level goal: {goal_data}')
        
        # Generate plan based on goal
        plan = self.generate_plan(goal_data)
        
        if plan:
            self.execute_plan(plan)

    def generate_plan(self, goal_data):
        # This is a simplified example
        # In practice, you'd use a more sophisticated planner
        # like PDDL planners, behavior trees, or hierarchical task networks
        
        goal_type = goal_data.get('type', '')
        goal_location = goal_data.get('location', {})
        
        if goal_type == 'fetch_object':
            # Plan: navigate to object location -> detect object -> grasp object -> return
            plan = [
                {'action': 'navigate', 'params': goal_location},
                {'action': 'detect_object', 'params': goal_data.get('object', '')},
                {'action': 'grasp_object', 'params': goal_data.get('object', '')},
                {'action': 'navigate', 'params': goal_data.get('return_location', {})}
            ]
        elif goal_type == 'go_to_location':
            plan = [
                {'action': 'navigate', 'params': goal_location}
            ]
        else:
            self.get_logger().warn(f'Unknown goal type: {goal_type}')
            return []
        
        return plan

    def execute_plan(self, plan):
        self.current_plan = plan
        self.current_step = 0
        self.get_logger().info(f'Starting execution of plan with {len(plan)} steps')
        
        # Execute first step
        if self.current_plan:
            self.execute_next_step()

    def execute_next_step(self):
        if self.current_step < len(self.current_plan):
            step = self.current_plan[self.current_step]
            self.get_logger().info(f'Executing step {self.current_step + 1}: {step["action"]}')
            
            # Execute the action based on type
            if step['action'] == 'navigate':
                self.execute_navigation(step['params'])
            elif step['action'] == 'detect_object':
                self.execute_detection(step['params'])
            elif step['action'] == 'grasp_object':
                self.execute_grasp(step['params'])
            
            self.current_step += 1
        else:
            # Plan completed
            status_msg = String()
            status_msg.data = 'Plan completed successfully'
            self.status_pub.publish(status_msg)
            self.get_logger().info('Plan execution completed')

    def execute_navigation(self, params):
        # Create and publish navigation goal
        goal_msg = PoseStamped()
        goal_msg.header.frame_id = 'map'
        goal_msg.header.stamp = self.get_clock().now().to_msg()
        goal_msg.pose.position.x = params.get('x', 0.0)
        goal_msg.pose.position.y = params.get('y', 0.0)
        goal_msg.pose.position.z = params.get('z', 0.0)
        goal_msg.pose.orientation.w = 1.0  # Default orientation
        
        self.nav_goal_pub.publish(goal_msg)
        self.get_logger().info(f'Published navigation goal to ({params.get("x", 0)}, {params.get("y", 0)})')

def main(args=None):
    rclpy.init(args=args)
    planning_bridge = PlanningBridgeNode()
    
    try:
        rclpy.spin(planning_bridge)
    except KeyboardInterrupt:
        pass
    finally:
        planning_bridge.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Best Practices for AI-ROS Integration

### 1. Asynchronous Processing

AI processing can be computationally intensive. Use separate threads or processes for AI tasks:

```python
import threading
import queue

class AsyncAIInterfaceNode(Node):
    def __init__(self):
        super().__init__('async_ai_interface')
        
        self.ai_queue = queue.Queue()
        self.ai_thread = threading.Thread(target=self.ai_worker)
        self.ai_thread.start()
        
        # Setup subscribers and publishers
        self.command_sub = self.create_subscription(
            String,
            'commands',
            self.command_callback,
            10
        )
        
        self.result_pub = self.create_publisher(String, 'ai_results', 10)

    def command_callback(self, msg):
        # Add command to processing queue
        self.ai_queue.put(msg.data)

    def ai_worker(self):
        # This runs in a separate thread
        while rclpy.ok():
            try:
                command = self.ai_queue.get(timeout=1.0)
                result = self.process_command(command)
                
                # Publish result back to ROS
                result_msg = String()
                result_msg.data = result
                self.result_pub.publish(result_msg)
                
            except queue.Empty:
                continue
            except Exception as e:
                self.get_logger().error(f'AI worker error: {str(e)}')

    def process_command(self, command):
        # Simulate AI processing
        # In practice, this would call your AI model
        return f"Processed: {command}"
```

### 2. Error Handling and Fallbacks

Always implement error handling and fallback behaviors:

```python
def safe_ai_ros_bridge():
    try:
        # AI processing
        result = ai_model.process(input_data)
        
        # Validate result before sending to robot
        if is_valid_robot_command(result):
            send_command_to_robot(result)
        else:
            self.get_logger().warn('Invalid command from AI, using fallback')
            send_fallback_command()
            
    except AIModelError as e:
        self.get_logger().error(f'AI model error: {str(e)}, using fallback')
        send_fallback_command()
    except RobotCommunicationError as e:
        self.get_logger().error(f'Robot communication error: {str(e)}')
        # Stop robot safely
        send_stop_command()
```

## Summary

In this chapter, we've explored how to bridge AI agents to ROS 2, creating interfaces for language models, computer vision, and planning systems. We've covered architectural patterns, implementation examples, and best practices for robust AI-ROS integration. In the next chapter, we'll dive into humanoid modeling with URDF.