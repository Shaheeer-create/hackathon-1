# Module 4: Vision-Language-Action (VLA) - Exercises

## Chapter 13: Vision-Language-Action Overview

### Exercise 13.1: VLA Architecture Implementation
**Objective**: Implement a basic Vision-Language-Action pipeline that processes visual input, interprets language commands, and generates robot actions.

**Steps**:
1. Set up the basic VLA architecture with vision, language, and action components
2. Implement a simple vision-language model interface
3. Create a basic action generation module
4. Test the pipeline with simple commands and visual inputs

**Deliverables**:
- VLA architecture implementation
- Test results with simple scenarios
- Performance metrics for each component

### Exercise 13.2: Multi-Modal Fusion Techniques
**Objective**: Implement and compare different multi-modal fusion techniques for VLA systems.

**Steps**:
1. Implement early fusion approach (fusion at feature level)
2. Implement late fusion approach (fusion at decision level)
3. Implement cross-attention fusion approach
4. Compare performance and accuracy of each approach

**Deliverables**:
- Three fusion implementations
- Comparative analysis of approaches
- Recommendations for humanoid robotics applications

## Chapter 14: Voice Commands with Whisper

### Exercise 14.1: Whisper Integration for Robot Commands
**Objective**: Integrate OpenAI Whisper for voice command processing in a humanoid robot system.

**Steps**:
1. Set up Whisper model for real-time speech recognition
2. Implement voice activity detection
3. Create command parsing from transcribed text
4. Integrate with robot action system

**Deliverables**:
- Whisper integration implementation
- Command parsing system
- Test results with various voice commands

### Exercise 14.2: Robust Voice Command Processing
**Objective**: Enhance voice command processing with noise reduction and command validation.

**Steps**:
1. Implement noise reduction preprocessing
2. Add acoustic environment adaptation
3. Create command validation and error handling
4. Test in noisy environments

**Deliverables**:
- Noise-robust voice processing system
- Validation and error handling implementation
- Performance comparison in different acoustic conditions

## Chapter 15: LLM-Based Task Planning

### Exercise 15.1: LLM Integration for Task Planning
**Objective**: Integrate a large language model for high-level task planning in humanoid robotics.

**Steps**:
1. Set up LLM API connection (OpenAI, Claude, or local model)
2. Implement prompt engineering for robotics tasks
3. Create task decomposition and sequencing
4. Integrate with robot execution system

**Deliverables**:
- LLM integration for task planning
- Prompt templates for robotics tasks
- Task decomposition examples

### Exercise 15.2: Safety-Constrained Task Planning
**Objective**: Implement safety constraints in LLM-based task planning.

**Steps**:
1. Define safety rules and constraints
2. Implement safety validation layer
3. Create fallback behaviors for unsafe plans
4. Test with potentially unsafe command scenarios

**Deliverables**:
- Safety-constrained task planning system
- Safety validation implementation
- Test results with safety scenarios

## Chapter 16: Language to ROS 2 Actions

### Exercise 16.1: Natural Language to ROS 2 Command Mapping
**Objective**: Implement a system that translates natural language commands to ROS 2 actions.

**Steps**:
1. Create command vocabulary and parsing rules
2. Implement semantic mapping to ROS 2 actions
3. Handle complex multi-step commands
4. Integrate with ROS 2 action servers

**Deliverables**:
- Language-to-ROS mapping system
- Command parsing implementation
- Integration with ROS 2 action system

### Exercise 16.2: Context-Aware Command Interpretation
**Objective**: Implement context-aware interpretation of natural language commands.

**Steps**:
1. Create context tracking system
2. Implement contextual command interpretation
3. Handle ambiguous commands based on context
4. Test with complex, context-dependent scenarios

**Deliverables**:
- Context-aware command interpretation system
- Context tracking implementation
- Test results with ambiguous commands

## Chapter 17: Object Detection & Scene Understanding

### Exercise 17.1: Real-Time Object Detection for Humanoids
**Objective**: Implement real-time object detection optimized for humanoid robot applications.

**Steps**:
1. Set up real-time object detection pipeline
2. Optimize for humanoid robot's computational constraints
3. Implement 3D object localization from 2D detections
4. Integrate with robot perception system

**Deliverables**:
- Real-time object detection system
- Performance optimization implementation
- 3D localization from 2D detections

### Exercise 17.2: Scene Understanding and Spatial Reasoning
**Objective**: Implement scene understanding and spatial reasoning for humanoid navigation.

**Steps**:
1. Create spatial relationship understanding system
2. Implement affordance detection for objects
3. Develop scene context interpretation
4. Integrate with navigation and manipulation planning

**Deliverables**:
- Scene understanding system
- Affordance detection implementation
- Spatial reasoning examples

## Chapter 18: Safety & Action Validation

### Exercise 18.1: Action Safety Validation System
**Objective**: Implement a comprehensive safety validation system for robot actions.

**Steps**:
1. Define safety criteria for humanoid actions
2. Implement real-time action validation
3. Create safety monitoring and intervention
4. Test with potentially unsafe action sequences

**Deliverables**:
- Action safety validation system
- Safety monitoring implementation
- Test results with safety scenarios

### Exercise 18.2: Human-Robot Safety Interaction
**Objective**: Implement safety protocols for human-robot interaction scenarios.

**Steps**:
1. Create human detection and tracking system
2. Implement personal space and safety zone management
3. Develop safe interaction protocols
4. Test with human interaction scenarios

**Deliverables**:
- Human-robot safety system
- Personal space management implementation
- Interaction safety test results

## Solutions

### Solution to Exercise 13.1: VLA Architecture Implementation

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, CameraInfo
from std_msgs.msg import String
from geometry_msgs.msg import Twist, Pose
from vision_msgs.msg import Detection2DArray
from std_srvs.srv import Trigger
import torch
import numpy as np
from transformers import CLIPProcessor, CLIPModel
from openai import OpenAI

class VisionLanguageActionNode(Node):
    def __init__(self):
        super().__init__('vla_node')
        
        # Initialize components
        self.clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        
        # OpenAI client for language processing
        self.openai_client = OpenAI(api_key=self.get_parameter('openai_api_key').value)
        
        # Subscriptions
        self.image_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )
        
        self.command_sub = self.create_subscription(
            String,
            '/voice_command',
            self.command_callback,
            10
        )
        
        # Publishers
        self.action_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        self.status_pub = self.create_publisher(String, '/vla_status', 10)
        
        # Internal state
        self.current_image = None
        self.pending_command = None
        
        self.get_logger().info('VLA node initialized')

    def image_callback(self, msg):
        """Process incoming camera image"""
        # Convert ROS image to PIL Image
        cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='rgb8')
        self.current_image = Image.fromarray(cv_image)

    def command_callback(self, msg):
        """Process incoming voice command"""
        self.pending_command = msg.data
        if self.current_image is not None:
            self.process_vla_request()

    def process_vla_request(self):
        """Process vision-language-action request"""
        if not self.pending_command or not self.current_image:
            return
        
        try:
            # Encode image using CLIP
            inputs = self.clip_processor(images=self.current_image, return_tensors="pt")
            image_features = self.clip_model.get_image_features(**inputs)
            
            # Process command with LLM
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a robot command interpreter. Convert natural language commands to robot actions. Respond with JSON: {action_type: 'move|grasp|speak', parameters: {...}}"},
                    {"role": "user", "content": f"Image context: {self.encode_image_context(self.current_image)}, Command: {self.pending_command}"}
                ],
                temperature=0.1
            )
            
            # Parse LLM response
            action_json = json.loads(response.choices[0].message.content)
            
            # Execute action
            self.execute_robot_action(action_json)
            
            # Update status
            status_msg = String()
            status_msg.data = f"Executed: {action_json['action_type']}"
            self.status_pub.publish(status_msg)
            
        except Exception as e:
            self.get_logger().error(f'Error processing VLA request: {e}')
        
        # Clear pending command
        self.pending_command = None

    def encode_image_context(self, image):
        """Encode image context for LLM"""
        # This would implement image captioning or feature extraction
        # For simplicity, returning a placeholder
        return "Image contains a humanoid robot in a room with objects"

    def execute_robot_action(self, action_json):
        """Execute robot action based on parsed command"""
        action_type = action_json.get('action_type', '')
        
        if action_type == 'move':
            params = action_json.get('parameters', {})
            cmd_vel = Twist()
            cmd_vel.linear.x = params.get('linear_speed', 0.0)
            cmd_vel.angular.z = params.get('angular_speed', 0.0)
            self.action_pub.publish(cmd_vel)
        
        elif action_type == 'grasp':
            # Implement grasp action
            pass
        
        elif action_type == 'speak':
            # Implement speech action
            pass

def main(args=None):
    rclpy.init(args=args)
    vla_node = VisionLanguageActionNode()
    
    try:
        rclpy.spin(vla_node)
    except KeyboardInterrupt:
        pass
    finally:
        vla_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Solution to Exercise 14.1: Whisper Integration for Robot Commands

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String, Bool
from audio_common_msgs.msg import AudioData
from geometry_msgs.msg import Twist
import openai
import numpy as np
import pyaudio
import wave
import threading
import queue

class WhisperVoiceCommandNode(Node):
    def __init__(self):
        super().__init__('whisper_voice_command_node')
        
        # Initialize Whisper client
        self.openai_client = openai.OpenAI(api_key=self.get_parameter('openai_api_key').value)
        
        # Audio parameters
        self.audio_format = pyaudio.paInt16
        self.channels = 1
        self.rate = 16000
        self.chunk = 1024
        self.record_seconds = 5
        
        # Audio queue for processing
        self.audio_queue = queue.Queue()
        
        # Subscriptions and publishers
        self.voice_command_pub = self.create_publisher(String, '/parsed_voice_command', 10)
        self.status_pub = self.create_publisher(String, '/voice_status', 10)
        
        # Voice activity detection
        self.vad_threshold = 0.01
        self.is_listening = False
        
        # Start audio recording thread
        self.audio_thread = threading.Thread(target=self.audio_recording_loop, daemon=True)
        self.audio_thread.start()
        
        # Timer for periodic processing
        self.process_timer = self.create_timer(1.0, self.process_audio_queue)
        
        self.get_logger().info('Whisper Voice Command node initialized')

    def audio_recording_loop(self):
        """Continuously record audio and detect voice activity"""
        p = pyaudio.PyAudio()
        
        stream = p.open(
            format=self.audio_format,
            channels=self.channels,
            rate=self.rate,
            input=True,
            frames_per_buffer=self.chunk
        )
        
        while rclpy.ok():
            # Read audio data
            data = stream.read(self.chunk)
            audio_array = np.frombuffer(data, dtype=np.int16).astype(np.float32) / 32768.0
            
            # Simple VAD: check if amplitude exceeds threshold
            if np.max(np.abs(audio_array)) > self.vad_threshold:
                # Add to processing queue
                self.audio_queue.put(data)
                
                # Publish status
                status_msg = String()
                status_msg.data = 'Voice activity detected'
                self.status_pub.publish(status_msg)
        
        stream.stop_stream()
        stream.close()
        p.terminate()

    def process_audio_queue(self):
        """Process accumulated audio data"""
        if not self.audio_queue.empty():
            # Collect audio chunks
            audio_chunks = []
            while not self.audio_queue.empty():
                chunk = self.audio_queue.get()
                audio_chunks.append(chunk)
            
            if audio_chunks:
                # Combine audio chunks
                full_audio = b''.join(audio_chunks)
                
                # Save to temporary file for Whisper API
                temp_filename = '/tmp/temp_audio.wav'
                wf = wave.open(temp_filename, 'wb')
                wf.setnchannels(self.channels)
                wf.setsampwidth(pyaudio.PyAudio().get_sample_size(self.audio_format))
                wf.setframerate(self.rate)
                wf.writeframes(full_audio)
                wf.close()
                
                # Process with Whisper
                try:
                    with open(temp_filename, 'rb') as audio_file:
                        transcription = self.openai_client.audio.transcriptions.create(
                            model="whisper-1",
                            file=audio_file
                        )
                    
                    # Parse and validate command
                    command = self.parse_robot_command(transcription.text)
                    if command:
                        cmd_msg = String()
                        cmd_msg.data = command
                        self.voice_command_pub.publish(cmd_msg)
                        
                        self.get_logger().info(f'Parsed command: {command}')
                
                except Exception as e:
                    self.get_logger().error(f'Error processing audio with Whisper: {e}')
                
                # Clean up temp file
                import os
                os.remove(temp_filename)

    def parse_robot_command(self, text):
        """Parse and validate robot command from transcribed text"""
        # Convert to lowercase for easier processing
        text_lower = text.lower().strip()
        
        # Define valid commands
        valid_commands = [
            'move forward', 'move backward', 'turn left', 'turn right',
            'stop', 'go', 'halt', 'come here', 'follow me', 'pick up',
            'put down', 'wave', 'dance', 'sit', 'stand', 'walk'
        ]
        
        # Find the closest matching command
        for cmd in valid_commands:
            if cmd in text_lower:
                return cmd
        
        # If no exact match, try fuzzy matching
        import difflib
        closest_matches = difflib.get_close_matches(text_lower, valid_commands, n=1, cutoff=0.6)
        if closest_matches:
            return closest_matches[0]
        
        return None  # Invalid command

def main(args=None):
    rclpy.init(args=args)
    whisper_node = WhisperVoiceCommandNode()
    
    try:
        rclpy.spin(whisper_node)
    except KeyboardInterrupt:
        pass
    finally:
        whisper_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Solution to Exercise 15.1: LLM Integration for Task Planning

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import PoseStamped
from action_msgs.msg import GoalStatus
from openai import OpenAI
import json
import re

class LLMTaskPlannerNode(Node):
    def __init__(self):
        super().__init__('llm_task_planner_node')
        
        # Initialize OpenAI client
        self.openai_client = OpenAI(api_key=self.get_parameter('openai_api_key').value)
        
        # Subscriptions
        self.high_level_command_sub = self.create_subscription(
            String,
            '/high_level_command',
            self.command_callback,
            10
        )
        
        # Publishers
        self.task_plan_pub = self.create_publisher(String, '/task_plan', 10)
        self.low_level_command_pub = self.create_publisher(String, '/low_level_command', 10)
        self.status_pub = self.create_publisher(String, '/planner_status', 10)
        
        # Task planning parameters
        self.max_tasks_per_plan = 10
        self.planning_timeout = 30.0  # seconds
        
        self.get_logger().info('LLM Task Planner node initialized')

    def command_callback(self, msg):
        """Process high-level command and generate task plan"""
        command = msg.data
        
        self.get_logger().info(f'Received high-level command: {command}')
        
        try:
            # Generate task plan using LLM
            task_plan = self.generate_task_plan(command)
            
            if task_plan:
                # Publish task plan
                plan_msg = String()
                plan_msg.data = json.dumps(task_plan)
                self.task_plan_pub.publish(plan_msg)
                
                # Execute the plan
                self.execute_task_plan(task_plan)
                
                # Publish status
                status_msg = String()
                status_msg.data = f'Executed plan with {len(task_plan)} tasks'
                self.status_pub.publish(status_msg)
            else:
                self.get_logger().error('Failed to generate task plan')
                
        except Exception as e:
            self.get_logger().error(f'Error processing command: {e}')

    def generate_task_plan(self, command):
        """Generate task plan using LLM"""
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": """You are a humanoid robot task planner. Convert high-level commands into sequences of low-level actions. 
                    Each action should be executable by a humanoid robot in simulation. 
                    Return JSON with 'tasks' array containing objects with 'action_type' and 'parameters'.
                    Action types: 'navigate_to', 'grasp_object', 'place_object', 'speak', 'wave', 'turn', 'move'.
                    Example: {'tasks': [{'action_type': 'navigate_to', 'parameters': {'x': 1.0, 'y': 2.0}}, {'action_type': 'grasp_object', 'parameters': {'object_name': 'red_cube'}}]}"""}, 
                    {"role": "user", "content": f"Command: {command}"}
                ],
                temperature=0.1,
                max_tokens=500
            )
            
            # Extract and parse the response
            content = response.choices[0].message.content
            
            # Clean up the response (remove markdown formatting if present)
            content = re.sub(r'^```json\s*', '', content)
            content = re.sub(r'```$', '', content)
            
            plan = json.loads(content.strip())
            return plan.get('tasks', [])
            
        except Exception as e:
            self.get_logger().error(f'Error generating task plan: {e}')
            return []

    def execute_task_plan(self, task_plan):
        """Execute the generated task plan"""
        for i, task in enumerate(task_plan):
            self.get_logger().info(f'Executing task {i+1}/{len(task_plan)}: {task["action_type"]}')
            
            # Convert task to low-level command
            low_level_cmd = self.convert_task_to_command(task)
            
            if low_level_cmd:
                cmd_msg = String()
                cmd_msg.data = low_level_cmd
                self.low_level_command_pub.publish(cmd_msg)
                
                # Wait for task completion (simplified)
                self.wait_for_task_completion(task)
            else:
                self.get_logger().warn(f'Could not convert task to command: {task}')

    def convert_task_to_command(self, task):
        """Convert high-level task to low-level command"""
        action_type = task.get('action_type', '')
        params = task.get('parameters', {})
        
        if action_type == 'navigate_to':
            x = params.get('x', 0.0)
            y = params.get('y', 0.0)
            return f"NAVIGATE_TO {x} {y}"
        
        elif action_type == 'grasp_object':
            obj_name = params.get('object_name', '')
            return f"GRASP_OBJECT {obj_name}"
        
        elif action_type == 'place_object':
            obj_name = params.get('object_name', '')
            x = params.get('x', 0.0)
            y = params.get('y', 0.0)
            return f"PLACE_OBJECT {obj_name} AT {x} {y}"
        
        elif action_type == 'speak':
            text = params.get('text', '')
            return f"SPEAK \"{text}\""
        
        elif action_type == 'wave':
            return "WAVE"
        
        elif action_type == 'turn':
            angle = params.get('angle', 0.0)
            return f"TURN {angle}"
        
        elif action_type == 'move':
            direction = params.get('direction', 'forward')
            distance = params.get('distance', 1.0)
            return f"MOVE {direction} {distance}"
        
        return None

    def wait_for_task_completion(self, task):
        """Wait for task completion (simplified implementation)"""
        # In a real implementation, this would wait for action server feedback
        import time
        time.sleep(1.0)  # Simulate task execution time

def main(args=None):
    rclpy.init(args=args)
    planner_node = LLMTaskPlannerNode()
    
    try:
        rclpy.spin(planner_node)
    except KeyboardInterrupt:
        pass
    finally:
        planner_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Solution to Exercise 16.1: Natural Language to ROS 2 Command Mapping

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import Twist, PoseStamped
from sensor_msgs.msg import JointState
from action_msgs.msg import GoalStatus
import re
import spacy
from typing import Dict, List, Tuple

class NaturalLanguageCommandMapperNode(Node):
    def __init__(self):
        super().__init__('nl_command_mapper_node')
        
        # Load spaCy model for NLP processing
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            self.get_logger().warn("spaCy model not found. Install with: python -m spacy download en_core_web_sm")
            self.nlp = None
        
        # Command vocabulary and mappings
        self.command_mappings = {
            # Movement commands
            'move': ['move', 'go', 'walk', 'step', 'advance', 'proceed'],
            'turn': ['turn', 'rotate', 'pivot', 'face'],
            'stop': ['stop', 'halt', 'pause', 'freeze'],
            'approach': ['approach', 'come', 'get', 'reach', 'move_to'],
            
            # Manipulation commands
            'grasp': ['grasp', 'grab', 'take', 'pick', 'hold', 'catch'],
            'release': ['release', 'drop', 'let_go', 'place', 'put'],
            'wave': ['wave', 'greet', 'hello', 'salute'],
            
            # Navigation commands
            'navigate': ['navigate', 'go_to', 'travel', 'head_to', 'move_to'],
            'follow': ['follow', 'track', 'accompany', 'escort'],
            
            # Interaction commands
            'speak': ['say', 'speak', 'tell', 'announce', 'communicate'],
            'listen': ['listen', 'hear', 'pay_attention'],
        }
        
        # Direction mappings
        self.direction_mappings = {
            'forward': ['forward', 'ahead', 'straight', 'front'],
            'backward': ['backward', 'back', 'reverse'],
            'left': ['left', 'port'],
            'right': ['right', 'starboard'],
            'up': ['up', 'above', 'raise'],
            'down': ['down', 'below', 'lower'],
        }
        
        # Object mappings
        self.object_keywords = {
            'red_cube': ['red cube', 'red block', 'red object'],
            'blue_sphere': ['blue sphere', 'blue ball', 'blue object'],
            'green_pyramid': ['green pyramid', 'green object'],
            'table': ['table', 'desk', 'surface'],
            'chair': ['chair', 'seat'],
        }
        
        # Subscriptions
        self.nl_command_sub = self.create_subscription(
            String,
            '/natural_language_command',
            self.nl_command_callback,
            10
        )
        
        # Publishers
        self.ros_command_pub = self.create_publisher(String, '/ros_command', 10)
        self.status_pub = self.create_publisher(String, '/nl_mapper_status', 10)
        
        self.get_logger().info('Natural Language Command Mapper node initialized')

    def nl_command_callback(self, msg):
        """Process natural language command and map to ROS command"""
        command_text = msg.data
        
        self.get_logger().info(f'Received NL command: {command_text}')
        
        try:
            # Parse the command
            parsed_command = self.parse_natural_language_command(command_text)
            
            if parsed_command:
                # Convert to ROS command
                ros_command = self.convert_to_ros_command(parsed_command)
                
                if ros_command:
                    # Publish ROS command
                    cmd_msg = String()
                    cmd_msg.data = ros_command
                    self.ros_command_pub.publish(cmd_msg)
                    
                    # Publish status
                    status_msg = String()
                    status_msg.data = f'Mapped: "{command_text}" -> "{ros_command}"'
                    self.status_pub.publish(status_msg)
                    
                    self.get_logger().info(f'Mapped to ROS command: {ros_command}')
                else:
                    self.get_logger().warn(f'Could not convert to ROS command: {parsed_command}')
            else:
                self.get_logger().warn(f'Could not parse command: {command_text}')
                
        except Exception as e:
            self.get_logger().error(f'Error processing NL command: {e}')

    def parse_natural_language_command(self, command_text: str) -> Dict:
        """Parse natural language command using NLP techniques"""
        # Preprocess the command
        command_lower = command_text.lower().strip()
        
        # Use spaCy for more sophisticated parsing if available
        if self.nlp:
            doc = self.nlp(command_lower)
            
            # Extract entities and dependencies
            action = None
            direction = None
            distance = None
            target_object = None
            location = None
            
            for token in doc:
                # Identify action verbs
                if token.pos_ == "VERB":
                    for action_type, keywords in self.command_mappings.items():
                        if token.lemma_ in [keyword.split()[0] for keyword in keywords]:
                            action = action_type
                            break
                
                # Identify direction adverbs/prepositions
                if token.pos_ in ["ADV", "ADP"]:
                    for dir_type, keywords in self.direction_mappings.items():
                        if token.text in keywords:
                            direction = dir_type
                            break
                
                # Look for object nouns
                if token.pos_ == "NOUN":
                    for obj_name, keywords in self.object_keywords.items():
                        if token.text in [kw.split()[0] for kw in keywords]:
                            target_object = obj_name
                            break
            
            # Extract numeric values (potential distances)
            for ent in doc.ents:
                if ent.label_ == "CARDINAL" or ent.label_ == "MONEY":
                    try:
                        distance = float(ent.text)
                    except ValueError:
                        pass
            
            # Extract location information
            for ent in doc.ents:
                if ent.label_ in ["LOC", "GPE", "FAC"]:
                    location = ent.text
                    break
        
        else:
            # Simple keyword-based parsing
            action = self.extract_action(command_lower)
            direction = self.extract_direction(command_lower)
            distance = self.extract_distance(command_lower)
            target_object = self.extract_object(command_lower)
            location = self.extract_location(command_lower)
        
        return {
            'action': action,
            'direction': direction,
            'distance': distance,
            'target_object': target_object,
            'location': location,
            'original_command': command_text
        }

    def extract_action(self, command: str) -> str:
        """Extract action from command using keyword matching"""
        for action_type, keywords in self.command_mappings.items():
            for keyword in keywords:
                if keyword in command:
                    return action_type
        return None

    def extract_direction(self, command: str) -> str:
        """Extract direction from command"""
        for dir_type, keywords in self.direction_mappings.items():
            for keyword in keywords:
                if keyword in command:
                    return dir_type
        return None

    def extract_distance(self, command: str) -> float:
        """Extract distance from command"""
        # Look for numeric values followed by distance units
        distance_pattern = r'(\d+(?:\.\d+)?)\s*(m(?:eter)?s?|cm|mm|ft|feet|in|inch)'
        match = re.search(distance_pattern, command)
        
        if match:
            value = float(match.group(1))
            unit = match.group(2)
            
            # Convert to meters
            if 'cm' in unit:
                return value / 100.0
            elif 'mm' in unit:
                return value / 1000.0
            elif 'ft' in unit or 'foot' in unit or 'feet' in unit:
                return value * 0.3048
            elif 'in' in unit or 'inch' in unit:
                return value * 0.0254
            else:  # meters
                return value
        
        # Look for simple numbers (assume meters)
        numbers = re.findall(r'(\d+(?:\.\d+)?)', command)
        if numbers:
            return float(numbers[0])
        
        return None

    def extract_object(self, command: str) -> str:
        """Extract target object from command"""
        for obj_name, keywords in self.object_keywords.items():
            for keyword in keywords:
                if keyword in command:
                    return obj_name
        return None

    def extract_location(self, command: str) -> str:
        """Extract location from command"""
        # Look for location indicators
        location_indicators = ['to', 'at', 'in', 'on', 'near', 'by', 'beside', 'next_to']
        
        for indicator in location_indicators:
            if indicator in command:
                # Extract text after location indicator
                parts = command.split(indicator)
                if len(parts) > 1:
                    location_part = parts[1].strip()
                    # Remove common words
                    location_words = location_part.split()
                    if len(location_words) > 0:
                        # Return the first meaningful location term
                        return location_words[0]
        
        return None

    def convert_to_ros_command(self, parsed_command: Dict) -> str:
        """Convert parsed command to ROS command format"""
        action = parsed_command.get('action')
        direction = parsed_command.get('direction')
        distance = parsed_command.get('distance')
        target_object = parsed_command.get('target_object')
        location = parsed_command.get('location')
        
        if action == 'move':
            if direction:
                if distance:
                    return f"MOVE_{direction.upper()} {distance}"
                else:
                    return f"MOVE_{direction.upper()}"
            else:
                return "MOVE_FORWARD 0.5"  # Default move forward
        
        elif action == 'navigate':
            if location:
                return f"NAVIGATE_TO {location}"
            elif distance and direction:
                return f"MOVE_{direction.upper()} {distance}"
            else:
                return "STOP"
        
        elif action == 'grasp':
            if target_object:
                return f"GRASP_OBJECT {target_object}"
            else:
                return "GRASP_DEFAULT"
        
        elif action == 'turn':
            if direction:
                angle = 90.0  # Default turn angle
                if distance:  # If distance specified, treat as angle
                    angle = distance
                return f"TURN_{direction.upper()} {angle}"
            else:
                return "TURN_LEFT 90.0"
        
        elif action == 'speak':
            # Extract what should be spoken from original command
            original = parsed_command.get('original_command', '')
            # Remove action words to get the speech content
            speech_content = original
            for action_words in self.command_mappings.values():
                for word in action_words:
                    speech_content = speech_content.replace(word, '', 1)
            speech_content = speech_content.strip()
            return f"SPEAK \"{speech_content}\""
        
        elif action == 'stop':
            return "STOP"
        
        elif action == 'wave':
            return "WAVE"
        
        elif action == 'follow':
            return "FOLLOW_HUMAN"
        
        else:
            return "STOP"  # Default to stop for unrecognized commands

def main(args=None):
    rclpy.init(args=args)
    mapper_node = NaturalLanguageCommandMapperNode()
    
    try:
        rclpy.spin(mapper_node)
    except KeyboardInterrupt:
        pass
    finally:
        mapper_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Solution to Exercise 17.1: Real-Time Object Detection for Humanoids

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, CameraInfo
from vision_msgs.msg import Detection2DArray, ObjectHypothesisWithPose
from geometry_msgs.msg import PointStamped
from cv_bridge import CvBridge
import cv2
import numpy as np
import torch
from torchvision import transforms
from ultralytics import YOLO
import time

class RealTimeObjectDetectionNode(Node):
    def __init__(self):
        super().__init__('real_time_object_detection_node')
        
        # Initialize OpenCV bridge
        self.cv_bridge = CvBridge()
        
        # Initialize YOLO model
        self.model = YOLO('yolov8n.pt')  # Use smaller model for real-time performance
        
        # Check for GPU availability
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        self.model.conf = 0.5  # Confidence threshold
        self.model.iou = 0.5   # IoU threshold
        
        # Camera parameters (will be updated from camera info)
        self.camera_matrix = None
        self.distortion_coeffs = None
        self.camera_info_received = False
        
        # Subscriptions
        self.image_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )
        
        self.camera_info_sub = self.create_subscription(
            CameraInfo,
            '/camera/camera_info',
            self.camera_info_callback,
            10
        )
        
        # Publishers
        self.detection_pub = self.create_publisher(Detection2DArray, '/object_detections', 10)
        self.debug_image_pub = self.create_publisher(Image, '/debug_image', 10)
        self.status_pub = self.create_publisher(String, '/detection_status', 10)
        
        # Performance tracking
        self.frame_count = 0
        self.start_time = time.time()
        
        self.get_logger().info('Real-time Object Detection node initialized')

    def camera_info_callback(self, msg):
        """Update camera parameters from camera info"""
        self.camera_matrix = np.array(msg.k).reshape(3, 3)
        self.distortion_coeffs = np.array(msg.d)
        self.camera_info_received = True
        
        self.get_logger().info('Camera info received')

    def image_callback(self, msg):
        """Process incoming image for object detection"""
        try:
            # Convert ROS image to OpenCV
            cv_image = self.cv_bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')
            
            # Perform object detection
            results = self.model(cv_image)
            
            # Process detections
            detections_msg = self.process_detections(results, cv_image, msg.header)
            
            # Publish detections
            self.detection_pub.publish(detections_msg)
            
            # Publish debug image if requested
            if self.debug_image_pub.get_subscription_count() > 0:
                debug_image = self.draw_detections(cv_image, results)
                debug_msg = self.cv_bridge.cv2_to_imgmsg(debug_image, encoding='bgr8')
                debug_msg.header = msg.header
                self.debug_image_pub.publish(debug_msg)
            
            # Update performance metrics
            self.frame_count += 1
            elapsed_time = time.time() - self.start_time
            if elapsed_time > 5.0:  # Update every 5 seconds
                fps = self.frame_count / elapsed_time
                self.get_logger().info(f'Detection FPS: {fps:.2f}')
                
                # Publish status
                status_msg = String()
                status_msg.data = f'FPS: {fps:.2f}, Objects detected: {len(detections_msg.detections)}'
                self.status_pub.publish(status_msg)
                
                # Reset counters
                self.frame_count = 0
                self.start_time = time.time()
                
        except Exception as e:
            self.get_logger().error(f'Error processing image: {e}')

    def process_detections(self, results, image, header):
        """Process YOLO results into vision_msgs format"""
        detections_msg = Detection2DArray()
        detections_msg.header = header
        
        # Get image dimensions
        height, width = image.shape[:2]
        
        for result in results:
            if result.boxes is not None:
                for box in result.boxes:
                    # Extract bounding box coordinates
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    
                    # Calculate center and size
                    center_x = (x1 + x2) / 2.0
                    center_y = (y1 + y2) / 2.0
                    size_x = x2 - x1
                    size_y = y2 - y1
                    
                    # Get confidence and class
                    conf = float(box.conf[0])
                    cls = int(box.cls[0])
                    
                    # Create detection message
                    detection = Detection2D()
                    detection.header = header
                    
                    # Set bounding box
                    detection.bbox.center.x = center_x
                    detection.bbox.center.y = center_y
                    detection.bbox.size_x = size_x
                    detection.bbox.size_y = size_y
                    
                    # Add classification result
                    hypothesis = ObjectHypothesisWithPose()
                    hypothesis.id = str(cls)
                    hypothesis.score = conf
                    detection.results.append(hypothesis)
                    
                    # If camera info is available, calculate 3D position
                    if self.camera_info_received:
                        try:
                            # Calculate 3D position using camera parameters
                            depth_estimate = self.estimate_depth_from_size(size_y, cls)
                            if depth_estimate > 0:
                                # Convert 2D pixel coordinates to 3D world coordinates
                                point_3d = self.pixel_to_world(
                                    center_x, center_y, depth_estimate
                                )
                                
                                # Create point message for 3D position
                                point_msg = PointStamped()
                                point_msg.header = header
                                point_msg.point.x = point_3d[0]
                                point_msg.point.y = point_3d[1]
                                point_msg.point.z = point_3d[2]
                                
                                # Add to detection as additional data
                                detection.id = f"{self.model.names[cls]}_{point_3d[0]:.2f}_{point_3d[1]:.2f}"
                        except Exception as e:
                            self.get_logger().debug(f'Could not calculate 3D position: {e}')
                    else:
                        # Just use class name
                        detection.id = self.model.names[cls]
                    
                    detections_msg.detections.append(detection)
        
        return detections_msg

    def estimate_depth_from_size(self, pixel_height, class_id):
        """Estimate depth based on object size in pixels (simplified)"""
        # This is a simplified approach - in practice, you'd use stereo vision or depth sensor
        # For now, use known object sizes to estimate distance
        
        # Known average object heights in meters
        avg_heights = {
            0: 1.7,   # person
            56: 0.5,  # chair
            57: 0.8,  # couch
            62: 0.3,  # potted plant
            63: 0.2,  # bed
            67: 0.1,  # dining table
            7: 2.0,   # truck
            2: 4.0,   # car
        }
        
        if class_id in avg_heights:
            avg_height_m = avg_heights[class_id]
            # Simplified depth estimation using pinhole camera model
            # depth = (actual_height * focal_length) / apparent_height_in_pixels
            # Using approximate focal length of 500 pixels for a typical camera
            focal_length = 500.0
            apparent_height_px = pixel_height
            
            if apparent_height_px > 0:
                estimated_depth = (avg_height_m * focal_length) / apparent_height_px
                # Limit to reasonable range
                return min(10.0, max(0.1, estimated_depth))
        
        return -1.0  # Unknown depth

    def pixel_to_world(self, u, v, depth):
        """Convert pixel coordinates + depth to world coordinates"""
        if self.camera_matrix is None:
            return [0.0, 0.0, depth]
        
        # Camera intrinsic parameters
        fx = self.camera_matrix[0, 0]
        fy = self.camera_matrix[1, 1]
        cx = self.camera_matrix[0, 2]
        cy = self.camera_matrix[1, 2]
        
        # Convert to world coordinates
        x = (u - cx) * depth / fx
        y = (v - cy) * depth / fy
        z = depth
        
        return [x, y, z]

    def draw_detections(self, image, results):
        """Draw detection results on image for debugging"""
        debug_image = image.copy()
        
        for result in results:
            if result.boxes is not None:
                for box in result.boxes:
                    # Extract bounding box coordinates
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    conf = float(box.conf[0])
                    cls = int(box.cls[0])
                    
                    # Draw bounding box
                    cv2.rectangle(debug_image, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                    
                    # Draw label
                    label = f"{self.model.names[cls]} {conf:.2f}"
                    cv2.putText(debug_image, label, (int(x1), int(y1) - 10),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        return debug_image

def main(args=None):
    rclpy.init(args=args)
    detection_node = RealTimeObjectDetectionNode()
    
    try:
        rclpy.spin(detection_node)
    except KeyboardInterrupt:
        pass
    finally:
        detection_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Solution to Exercise 18.1: Action Safety Validation System

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist, Pose, Point
from sensor_msgs.msg import LaserScan, PointCloud2
from std_msgs.msg import Bool, String
from builtin_interfaces.msg import Duration
from visualization_msgs.msg import Marker, MarkerArray
import numpy as np
import math
from typing import List, Tuple

class ActionSafetyValidatorNode(Node):
    def __init__(self):
        super().__init__('action_safety_validator_node')
        
        # Safety parameters
        self.min_distance_to_obstacle = 0.5  # meters
        self.max_linear_velocity = 0.3  # m/s
        self.max_angular_velocity = 0.5  # rad/s
        self.robot_radius = 0.3  # meters
        self.horizon_length = 1.0  # meters ahead to check
        self.safety_timeout = 5.0  # seconds before considering safe again after warning
        
        # State variables
        self.current_pose = Pose()
        self.current_twist = Twist()
        self.laser_data = None
        self.last_safety_check = self.get_clock().now()
        self.safety_violation_active = False
        self.safety_violation_time = None
        
        # Subscriptions
        self.cmd_vel_sub = self.create_subscription(
            Twist,
            '/cmd_vel_unsafe',  # Raw commands before safety validation
            self.cmd_vel_callback,
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
        self.safe_cmd_vel_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        self.safety_status_pub = self.create_publisher(Bool, '/safety_status', 10)
        self.safety_violation_pub = self.create_publisher(String, '/safety_violation', 10)
        self.safety_viz_pub = self.create_publisher(MarkerArray, '/safety_viz', 10)
        
        # Timer for periodic safety checks
        self.safety_timer = self.create_timer(0.1, self.safety_check_callback)  # 10Hz
        
        self.get_logger().info('Action Safety Validator node initialized')

    def cmd_vel_callback(self, msg):
        """Process incoming velocity commands with safety validation"""
        # Validate the command
        safe_cmd = self.validate_command(msg)
        
        # Publish safety status
        safety_status = Bool()
        safety_status.data = not self.safety_violation_active
        self.safety_status_pub.publish(safety_status)
        
        if safe_cmd is not None:
            # Command is safe, publish it
            self.safe_cmd_vel_pub.publish(safe_cmd)
            
            if self.safety_violation_active:
                # Safety violation cleared
                self.safety_violation_active = False
                self.safety_violation_time = None
                
                # Publish status
                status_msg = String()
                status_msg.data = 'SAFETY_CLEAR'
                self.safety_violation_pub.publish(status_msg)
        else:
            # Command is unsafe, stop the robot
            stop_cmd = Twist()
            self.safe_cmd_vel_pub.publish(stop_cmd)
            
            # Publish safety violation
            violation_msg = String()
            violation_msg.data = 'SAFETY_VIOLATION_COMMAND_STOPPED'
            self.safety_violation_pub.publish(violation_msg)

    def laser_callback(self, msg):
        """Update laser scan data"""
        self.laser_data = msg

    def odom_callback(self, msg):
        """Update robot pose and twist"""
        self.current_pose = msg.pose.pose
        self.current_twist = msg.twist.twist

    def validate_command(self, cmd_vel):
        """Validate command against safety constraints"""
        if self.laser_data is None:
            # No sensor data, assume unsafe
            self.safety_violation_active = True
            self.safety_violation_time = self.get_clock().now()
            return None
        
        # Check velocity limits
        if abs(cmd_vel.linear.x) > self.max_linear_velocity:
            self.get_logger().warn(f'Linear velocity too high: {cmd_vel.linear.x}')
            cmd_vel.linear.x = np.clip(cmd_vel.linear.x, -self.max_linear_velocity, self.max_linear_velocity)
        
        if abs(cmd_vel.angular.z) > self.max_angular_velocity:
            self.get_logger().warn(f'Angular velocity too high: {cmd_vel.angular.z}')
            cmd_vel.angular.z = np.clip(cmd_vel.angular.z, -self.max_angular_velocity, self.max_angular_velocity)
        
        # Check for obstacles in the path
        if self.would_collide(cmd_vel):
            self.get_logger().warn('Command would result in collision')
            self.safety_violation_active = True
            self.safety_violation_time = self.get_clock().now()
            return None
        
        # Check if command is too aggressive for humanoid stability
        if self.is_aggressive_command(cmd_vel):
            self.get_logger().warn('Command is too aggressive for humanoid stability')
            # Instead of stopping, reduce the command
            reduced_cmd = self.reduce_aggressive_command(cmd_vel)
            return reduced_cmd
        
        return cmd_vel

    def would_collide(self, cmd_vel):
        """Check if the command would result in a collision"""
        if self.laser_data is None:
            return True  # Assume collision if no data
        
        # Calculate the robot's projected position after a short time
        dt = 0.5  # 0.5 seconds projection
        projected_x = cmd_vel.linear.x * dt
        projected_y = 0  # Assuming differential drive
        projected_theta = cmd_vel.angular.z * dt
        
        # Check laser ranges in the direction of movement
        angle_increment = self.laser_data.angle_increment
        min_angle = self.laser_data.angle_min
        max_angle = self.laser_data.angle_max
        
        # Check forward sector (for forward movement)
        if cmd_vel.linear.x > 0:
            forward_sector_start = int((0 - 30 - min_angle) / angle_increment)
            forward_sector_end = int((0 + 30 - min_angle) / angle_increment)
            
            if 0 <= forward_sector_start < len(self.laser_data.ranges) and 0 <= forward_sector_end < len(self.laser_data.ranges):
                forward_ranges = self.laser_data.ranges[forward_sector_start:forward_sector_end]
                if forward_ranges and min(forward_ranges) < self.min_distance_to_obstacle + self.robot_radius:
                    return True
        
        # Check sectors for rotation
        if abs(cmd_vel.angular.z) > 0.1:
            if cmd_vel.angular.z > 0:  # Turning left
                left_sector_start = int((90 - 30 - min_angle) / angle_increment)
                left_sector_end = int((90 + 30 - min_angle) / angle_increment)
                
                if 0 <= left_sector_start < len(self.laser_data.ranges) and 0 <= left_sector_end < len(self.laser_data.ranges):
                    left_ranges = self.laser_data.ranges[left_sector_start:left_sector_end]
                    if left_ranges and min(left_ranges) < self.min_distance_to_obstacle + self.robot_radius:
                        return True
            else:  # Turning right
                right_sector_start = int((-90 - 30 - min_angle) / angle_increment)
                right_sector_end = int((-90 + 30 - min_angle) / angle_increment)
                
                if 0 <= right_sector_start < len(self.laser_data.ranges) and 0 <= right_sector_end < len(self.laser_data.ranges):
                    right_ranges = self.laser_data.ranges[right_sector_start:right_sector_end]
                    if right_ranges and min(right_ranges) < self.min_distance_to_obstacle + self.robot_radius:
                        return True
        
        return False

    def is_aggressive_command(self, cmd_vel):
        """Check if command is too aggressive for humanoid stability"""
        # For humanoid robots, sudden changes in velocity can cause instability
        acceleration_limit = 0.5  # m/s^2
        
        # Calculate required acceleration
        dt = 0.1  # Assuming 10Hz control loop
        required_ax = (cmd_vel.linear.x - self.current_twist.linear.x) / dt
        required_ay = (cmd_vel.linear.y - self.current_twist.linear.y) / dt
        required_az = (cmd_vel.angular.z - self.current_twist.angular.z) / dt
        
        # Check if acceleration exceeds limits
        if abs(required_ax) > acceleration_limit or abs(required_az) > acceleration_limit:
            return True
        
        return False

    def reduce_aggressive_command(self, cmd_vel):
        """Reduce aggressive command to acceptable levels"""
        # Calculate maximum allowable change based on acceleration limits
        dt = 0.1  # Assuming 10Hz control loop
        max_delta_v = 0.5 * dt  # acceleration_limit * dt
        max_delta_w = 0.5 * dt  # acceleration_limit * dt
        
        # Limit the change in velocity
        new_vx = self.current_twist.linear.x + np.clip(
            cmd_vel.linear.x - self.current_twist.linear.x,
            -max_delta_v,
            max_delta_v
        )
        
        new_wz = self.current_twist.angular.z + np.clip(
            cmd_vel.angular.z - self.current_twist.angular.z,
            -max_delta_w,
            max_delta_w
        )
        
        # Create new command with limited changes
        limited_cmd = Twist()
        limited_cmd.linear.x = np.clip(new_vx, -self.max_linear_velocity, self.max_linear_velocity)
        limited_cmd.angular.z = np.clip(new_wz, -self.max_angular_velocity, self.max_angular_velocity)
        
        return limited_cmd

    def safety_check_callback(self):
        """Periodic safety check"""
        current_time = self.get_clock().now()
        
        # Check if we should clear safety violation after timeout
        if (self.safety_violation_active and 
            self.safety_violation_time and
            (current_time - self.safety_violation_time).nanoseconds / 1e9 > self.safety_timeout):
            
            self.safety_violation_active = False
            self.safety_violation_time = None
            
            # Publish status
            status_msg = String()
            status_msg.data = 'SAFETY_TIMEOUT_CLEARED'
            self.safety_violation_pub.publish(status_msg)

    def publish_safety_visualization(self):
        """Publish visualization markers for safety zones"""
        if self.laser_data is None:
            return
        
        marker_array = MarkerArray()
        
        # Create safety zone marker
        safety_marker = Marker()
        safety_marker.header.frame_id = 'base_link'
        safety_marker.header.stamp = self.get_clock().now().to_msg()
        safety_marker.ns = 'safety_zone'
        safety_marker.id = 0
        safety_marker.type = Marker.SPHERE
        safety_marker.action = Marker.ADD
        
        # Set size based on safety distance
        safety_marker.scale.x = self.min_distance_to_obstacle * 2
        safety_marker.scale.y = self.min_distance_to_obstacle * 2
        safety_marker.scale.z = 0.1  # Flat marker
        
        # Color based on safety status
        if self.safety_violation_active:
            safety_marker.color.r = 1.0  # Red for unsafe
            safety_marker.color.g = 0.0
            safety_marker.color.b = 0.0
        else:
            safety_marker.color.r = 0.0  # Green for safe
            safety_marker.color.g = 1.0
            safety_marker.color.b = 0.0
        
        safety_marker.color.a = 0.3  # Semi-transparent
        safety_marker.pose.orientation.w = 1.0
        
        marker_array.markers.append(safety_marker)
        self.safety_viz_pub.publish(marker_array)

def main(args=None):
    rclpy.init(args=args)
    safety_node = ActionSafetyValidatorNode()
    
    try:
        rclpy.spin(safety_node)
    except KeyboardInterrupt:
        pass
    finally:
        safety_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Best Practices for Nav2 Implementation

### 1. Configuration Management
- Use separate parameter files for different environments
- Implement parameter validation
- Document parameter meanings and ranges
- Use appropriate QoS settings for real-time performance

### 2. Safety Considerations
- Implement velocity limiting
- Use appropriate safety margins
- Monitor robot state continuously
- Implement emergency stops

### 3. Performance Optimization
- Tune controller frequencies appropriately
- Optimize costmap resolution
- Use appropriate planner algorithms
- Monitor computational resources

### 4. Debugging and Monitoring
- Enable Nav2's built-in monitoring tools
- Use RViz for visualization
- Monitor navigation performance metrics
- Log navigation events for analysis

## Troubleshooting Common Issues

### 1. Localization Problems
- Verify TF tree integrity
- Check sensor data quality
- Validate initial pose estimation
- Monitor particle filter performance

### 2. Path Planning Issues
- Verify costmap configuration
- Check map quality and resolution
- Validate robot footprint
- Monitor planner performance

### 3. Control Problems
- Verify controller parameters
- Check robot kinematics
- Monitor control frequency
- Validate velocity commands

## Summary

In this chapter, we've explored the Nav2 navigation stack and its integration with humanoid robots. We've covered the architecture, configuration, and implementation of navigation systems that leverage both traditional approaches and VSLAM for enhanced localization. Nav2 provides a robust and flexible framework for autonomous navigation, with the ability to adapt to humanoid-specific requirements. In the next chapter, we'll explore path planning techniques specifically tailored for humanoid robots.