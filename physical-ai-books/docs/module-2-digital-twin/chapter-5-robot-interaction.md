# Chapter 5: Human-Robot Interaction

## Overview

Human-robot interaction (HRI) is a critical aspect of humanoid robotics, especially in applications where robots work alongside humans. This chapter explores how to design, simulate, and implement effective human-robot interaction in digital twin environments. We'll cover communication modalities, interaction design principles, and safety considerations for humanoid robots.

## Fundamentals of Human-Robot Interaction

### Definition and Scope

Human-robot interaction encompasses all forms of communication and collaboration between humans and robots. For humanoid robots, this includes:

- **Verbal communication**: Speech recognition and synthesis
- **Non-verbal communication**: Gestures, facial expressions, body language
- **Physical interaction**: Safe physical contact and collaboration
- **Social interaction**: Understanding social norms and context

### Key Principles of HRI

1. **Predictability**: The robot's behavior should be understandable and predictable
2. **Transparency**: The robot should communicate its intentions clearly
3. **Safety**: All interactions must be physically and socially safe
4. **Efficiency**: Interactions should be effective and time-efficient
5. **Naturalness**: Interactions should feel intuitive to humans

## Communication Modalities

### 1. Speech-Based Interaction

Speech is one of the most natural forms of human communication. For humanoid robots, this involves:

#### Speech Recognition
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
import speech_recognition as sr

class SpeechRecognitionNode(Node):
    def __init__(self):
        super().__init__('speech_recognition_node')
        self.publisher = self.create_publisher(String, 'recognized_speech', 10)
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        
        # Calibrate for ambient noise
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source)
        
        # Timer for continuous listening
        self.timer = self.create_timer(1.0, self.listen_callback)
        
        self.get_logger().info('Speech recognition node initialized')

    def listen_callback(self):
        try:
            with self.microphone as source:
                self.get_logger().info('Listening...')
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=5)
            
            # Recognize speech using Google Web Speech API
            text = self.recognizer.recognize_google(audio)
            self.get_logger().info(f'Recognized: {text}')
            
            # Publish recognized text
            msg = String()
            msg.data = text
            self.publisher.publish(msg)
            
        except sr.WaitTimeoutError:
            self.get_logger().info('Timeout: No speech detected')
        except sr.UnknownValueError:
            self.get_logger().info('Could not understand audio')
        except sr.RequestError as e:
            self.get_logger().error(f'Error with speech recognition service: {e}')

def main(args=None):
    rclpy.init(args=args)
    speech_node = SpeechRecognitionNode()
    
    try:
        rclpy.spin(speech_node)
    except KeyboardInterrupt:
        pass
    finally:
        speech_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

#### Text-to-Speech Synthesis
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
import pyttsx3

class TextToSpeechNode(Node):
    def __init__(self):
        super().__init__('text_to_speech_node')
        self.subscription = self.create_subscription(
            String,
            'tts_input',
            self.tts_callback,
            10
        )
        
        # Initialize text-to-speech engine
        self.tts_engine = pyttsx3.init()
        
        # Configure voice properties
        voices = self.tts_engine.getProperty('voices')
        if voices:
            self.tts_engine.setProperty('voice', voices[0].id)  # Use first available voice
        self.tts_engine.setProperty('rate', 150)  # Speed of speech
        self.tts_engine.setProperty('volume', 0.9)  # Volume level
        
        self.get_logger().info('Text-to-speech node initialized')

    def tts_callback(self, msg):
        text = msg.data
        self.get_logger().info(f'Speaking: {text}')
        
        # Speak the text
        self.tts_engine.say(text)
        self.tts_engine.runAndWait()

def main(args=None):
    rclpy.init(args=args)
    tts_node = TextToSpeechNode()
    
    try:
        rclpy.spin(tts_node)
    except KeyboardInterrupt:
        pass
    finally:
        tts_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 2. Gesture-Based Interaction

Gestures are an important part of human communication. For humanoid robots, this involves both recognizing human gestures and expressing robot intentions through gestures.

#### Gesture Recognition
```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from std_msgs.msg import String
from cv_bridge import CvBridge
import cv2
import mediapipe as mp

class GestureRecognitionNode(Node):
    def __init__(self):
        super().__init__('gesture_recognition_node')
        
        # Initialize OpenCV bridge
        self.cv_bridge = CvBridge()
        
        # Initialize MediaPipe for hand tracking
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        self.mp_drawing = mp.solutions.drawing_utils
        
        # Subscribers and publishers
        self.image_sub = self.create_subscription(
            Image,
            'camera/image_raw',
            self.image_callback,
            10
        )
        
        self.gesture_pub = self.create_publisher(String, 'recognized_gesture', 10)
        
        self.get_logger().info('Gesture recognition node initialized')

    def image_callback(self, msg):
        try:
            # Convert ROS Image message to OpenCV image
            cv_image = self.cv_bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')
            
            # Process image for hand detection
            rgb_image = cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB)
            results = self.hands.process(rgb_image)
            
            gesture = "unknown"
            
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    # Draw hand landmarks
                    self.mp_drawing.draw_landmarks(
                        cv_image, 
                        hand_landmarks, 
                        self.mp_hands.HAND_CONNECTIONS
                    )
                    
                    # Analyze hand pose to determine gesture
                    gesture = self.analyze_gesture(hand_landmarks)
                    
                    # Publish recognized gesture
                    gesture_msg = String()
                    gesture_msg.data = gesture
                    self.gesture_pub.publish(gesture_msg)
                    
                    self.get_logger().info(f'Recognized gesture: {gesture}')
            
        except Exception as e:
            self.get_logger().error(f'Error processing image: {str(e)}')

    def analyze_gesture(self, hand_landmarks):
        # Simple gesture recognition based on finger positions
        # This is a simplified example - real implementation would be more complex
        landmarks = hand_landmarks.landmark
        
        # Check if thumb is extended
        thumb_extended = landmarks[4].x < landmarks[3].x  # Simplified check
        
        # Check if index finger is extended
        index_extended = landmarks[8].y < landmarks[6].y  # Y decreases upward
        
        # Check if other fingers are folded
        middle_folded = landmarks[12].y > landmarks[10].y
        ring_folded = landmarks[16].y > landmarks[14].y
        pinky_folded = landmarks[20].y > landmarks[18].y
        
        if index_extended and middle_folded and ring_folded and pinky_folded:
            if thumb_extended:
                return "thumb_up"
            else:
                return "pointing"
        elif index_extended and middle_extended and not ring_extended:
            return "peace_sign"
        elif not index_extended and not middle_extended and not ring_extended and not pinky_extended:
            return "fist"
        else:
            return "unknown"

def main(args=None):
    rclpy.init(args=args)
    gesture_node = GestureRecognitionNode()
    
    try:
        rclpy.spin(gesture_node)
    except KeyboardInterrupt:
        pass
    finally:
        gesture_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 3. Visual Communication

Humanoid robots can communicate through visual elements like facial expressions, LED indicators, and screen displays.

#### Facial Expression Control
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
import time

class FacialExpressionNode(Node):
    def __init__(self):
        super().__init__('facial_expression_node')
        self.subscription = self.create_subscription(
            String,
            'robot_emotion',
            self.emotion_callback,
            10
        )
        
        # Simulate facial expression control
        self.current_expression = "neutral"
        self.get_logger().info('Facial expression node initialized')

    def emotion_callback(self, msg):
        emotion = msg.data.lower()
        self.get_logger().info(f'Setting facial expression to: {emotion}')
        
        # In a real robot, this would control actual facial servos or displays
        self.current_expression = emotion
        
        # Simulate the expression change
        self.display_expression(emotion)

    def display_expression(self, emotion):
        # This would control actual hardware in a real robot
        if emotion == "happy":
            self.get_logger().info("Displaying happy expression: ^_^")
        elif emotion == "sad":
            self.get_logger().info("Displaying sad expression: :_(")
        elif emotion == "surprised":
            self.get_logger().info("Displaying surprised expression: :O")
        elif emotion == "angry":
            self.get_logger().info("Displaying angry expression: >_<")
        else:
            self.get_logger().info(f"Displaying {emotion} expression")

def main(args=None):
    rclpy.init(args=args)
    face_node = FacialExpressionNode()
    
    try:
        rclpy.spin(face_node)
    except KeyboardInterrupt:
        pass
    finally:
        face_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Interaction Design Principles

### 1. Social Cues and Norms

Humanoid robots should follow social norms to make interactions feel natural:

#### Gaze Behavior
```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import PointStamped
from std_msgs.msg import String
import math

class GazeControlNode(Node):
    def __init__(self):
        super().__init__('gaze_control_node')
        
        # Subscribers for person detection and interaction commands
        self.person_sub = self.create_subscription(
            PointStamped,
            'person_location',
            self.person_callback,
            10
        )
        
        self.interaction_sub = self.create_subscription(
            String,
            'interaction_state',
            self.interaction_callback,
            10
        )
        
        # Publisher for head movement commands
        self.head_pub = self.create_publisher(PointStamped, 'head_target', 10)
        
        self.interacting = False
        self.person_location = None
        
        self.get_logger().info('Gaze control node initialized')

    def person_callback(self, msg):
        # Update person location for gaze tracking
        self.person_location = msg.point
        
        if self.interacting:
            self.look_at_person()

    def interaction_callback(self, msg):
        # Update interaction state
        if msg.data == "start":
            self.interacting = True
        elif msg.data == "stop":
            self.interacting = False
            self.look_forward()  # Look forward when interaction ends

    def look_at_person(self):
        if self.person_location:
            # Create head target message to look at person
            target_msg = PointStamped()
            target_msg.header.stamp = self.get_clock().now().to_msg()
            target_msg.header.frame_id = 'base_link'
            target_msg.point = self.person_location
            
            self.head_pub.publish(target_msg)
            self.get_logger().info(f'Looking at person at {self.person_location}')

    def look_forward(self):
        # Look forward (default position)
        target_msg = PointStamped()
        target_msg.header.stamp = self.get_clock().now().to_msg()
        target_msg.header.frame_id = 'base_link'
        target_msg.point.x = 1.0  # Look 1m ahead
        target_msg.point.y = 0.0
        target_msg.point.z = 1.5  # Look at eye level
        
        self.head_pub.publish(target_msg)
        self.get_logger().info('Looking forward')

def main(args=None):
    rclpy.init(args=args)
    gaze_node = GazeControlNode()
    
    try:
        rclpy.spin(gaze_node)
    except KeyboardInterrupt:
        pass
    finally:
        gaze_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 2. Proxemics

Proxemics is the study of personal space and how people use space in communication. Humanoid robots should respect human spatial preferences:

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import PointStamped, Twist
from sensor_msgs.msg import LaserScan
import math

class ProxemicsControlNode(Node):
    def __init__(self):
        super().__init__('proxemics_control_node')
        
        # Subscribers
        self.scan_sub = self.create_subscription(
            LaserScan,
            'scan',
            self.scan_callback,
            10
        )
        
        self.person_sub = self.create_subscription(
            PointStamped,
            'person_location',
            self.person_callback,
            10
        )
        
        # Publisher for movement commands
        self.cmd_vel_pub = self.create_publisher(Twist, 'cmd_vel', 10)
        
        # Spatial zones (in meters)
        self.intimate_zone = 0.45   # 0-45cm
        self.personal_zone = 1.2    # 45cm-1.2m
        self.social_zone = 3.6      # 1.2-3.6m
        self.public_zone = 7.6      # 3.6-7.6m
        
        self.closest_person_dist = float('inf')
        self.person_angle = 0.0
        
        self.get_logger().info('Proxemics control node initialized')

    def scan_callback(self, msg):
        # Process laser scan to detect closest obstacle
        min_distance = min(msg.ranges)
        min_index = msg.ranges.index(min_distance)
        
        # Calculate angle to closest obstacle
        angle_increment = msg.angle_increment
        angle = msg.angle_min + min_index * angle_increment
        
        if min_distance < self.closest_person_dist:
            self.closest_person_dist = min_distance
            self.person_angle = angle

    def person_callback(self, msg):
        # Calculate distance to person
        dist = math.sqrt(msg.point.x**2 + msg.point.y**2)
        self.closest_person_dist = dist
        
        # Calculate angle to person
        self.person_angle = math.atan2(msg.point.y, msg.point.x)

    def maintain_personal_space(self):
        cmd_msg = Twist()
        
        if self.closest_person_dist < self.personal_zone:
            # Too close, move away
            cmd_msg.linear.x = -0.2  # Move backward
            cmd_msg.angular.z = 0.0
            self.get_logger().info(f'Too close to person ({self.closest_person_dist:.2f}m), moving back')
        elif self.closest_person_dist > self.social_zone:
            # Too far, move closer (if interaction is desired)
            cmd_msg.linear.x = 0.2  # Move forward
            cmd_msg.angular.z = 0.0
            self.get_logger().info(f'Too far from person ({self.closest_person_dist:.2f}m), moving closer')
        else:
            # In appropriate zone, maintain position
            cmd_msg.linear.x = 0.0
            cmd_msg.angular.z = 0.0
            self.get_logger().info(f'In appropriate distance ({self.closest_person_dist:.2f}m)')
        
        # Add some angular movement to approach person if needed
        if abs(self.person_angle) > 0.2:  # 0.2 rad = ~11 degrees
            cmd_msg.angular.z = -self.person_angle * 0.5  # Turn toward person
        
        self.cmd_vel_pub.publish(cmd_msg)

def main(args=None):
    rclpy.init(args=args)
    proxemics_node = ProxemicsControlNode()
    
    # Timer to periodically adjust position
    timer = proxemics_node.create_timer(0.5, proxemics_node.maintain_personal_space)
    
    try:
        rclpy.spin(proxemics_node)
    except KeyboardInterrupt:
        pass
    finally:
        proxemics_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Safety in Human-Robot Interaction

### 1. Physical Safety

Physical safety is paramount in HRI, especially for humanoid robots that may operate in close proximity to humans.

#### Collision Avoidance
```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan, PointCloud2
from geometry_msgs.msg import Twist
from std_msgs.msg import Bool
import numpy as np

class SafetyControllerNode(Node):
    def __init__(self):
        super().__init__('safety_controller_node')
        
        # Subscribers
        self.scan_sub = self.create_subscription(
            LaserScan,
            'scan',
            self.scan_callback,
            10
        )
        
        self.cmd_vel_sub = self.create_subscription(
            Twist,
            'cmd_vel_input',
            self.cmd_vel_input_callback,
            10
        )
        
        # Publishers
        self.safety_cmd_pub = self.create_publisher(Twist, 'cmd_vel', 10)
        self.emergency_stop_pub = self.create_publisher(Bool, 'emergency_stop', 10)
        
        # Safety parameters
        self.safety_distance = 0.5  # meters
        self.emergency_distance = 0.2  # meters
        self.safe_to_move = True
        
        self.last_cmd_vel = Twist()
        
        self.get_logger().info('Safety controller node initialized')

    def scan_callback(self, msg):
        # Check for obstacles in critical zones
        min_distance = min(msg.ranges)
        
        if min_distance < self.emergency_distance:
            # Emergency stop
            self.safe_to_move = False
            self.trigger_emergency_stop()
            self.get_logger().warn(f'EMERGENCY: Obstacle too close! Distance: {min_distance:.2f}m')
        elif min_distance < self.safety_distance:
            # Reduce speed or stop
            self.safe_to_move = False
            self.get_logger().warn(f'Safety limit reached. Distance: {min_distance:.2f}m')
        else:
            # Safe to move normally
            self.safe_to_move = True
            self.get_logger().info(f'Clear path. Distance: {min_distance:.2f}m')

    def cmd_vel_input_callback(self, msg):
        # Store the input command but apply safety modifications
        self.last_cmd_vel = msg

    def trigger_emergency_stop(self):
        # Publish emergency stop command
        stop_msg = Twist()
        stop_msg.linear.x = 0.0
        stop_msg.linear.y = 0.0
        stop_msg.linear.z = 0.0
        stop_msg.angular.x = 0.0
        stop_msg.angular.y = 0.0
        stop_msg.angular.z = 0.0
        
        self.safety_cmd_pub.publish(stop_msg)
        
        # Publish emergency stop flag
        emergency_msg = Bool()
        emergency_msg.data = True
        self.emergency_stop_pub.publish(emergency_msg)

    def get_safe_command(self):
        if not self.safe_to_move:
            # Stop the robot
            safe_cmd = Twist()
            safe_cmd.linear.x = 0.0
            safe_cmd.angular.z = 0.0
            return safe_cmd
        
        # Apply safety modifications to the input command
        safe_cmd = Twist()
        safe_cmd.linear.x = self.last_cmd_vel.linear.x
        safe_cmd.linear.y = self.last_cmd_vel.linear.y
        safe_cmd.linear.z = self.last_cmd_vel.linear.z
        safe_cmd.angular.x = self.last_cmd_vel.angular.x
        safe_cmd.angular.y = self.last_cmd_vel.angular.y
        safe_cmd.angular.z = self.last_cmd_vel.angular.z
        
        # Limit speeds for safety
        max_linear_speed = 0.3  # m/s
        max_angular_speed = 0.5  # rad/s
        
        if abs(safe_cmd.linear.x) > max_linear_speed:
            safe_cmd.linear.x = max_linear_speed if safe_cmd.linear.x > 0 else -max_linear_speed
        
        if abs(safe_cmd.angular.z) > max_angular_speed:
            safe_cmd.angular.z = max_angular_speed if safe_cmd.angular.z > 0 else -max_angular_speed
        
        return safe_cmd

def main(args=None):
    rclpy.init(args=args)
    safety_node = SafetyControllerNode()
    
    # Timer to publish safe commands
    def publish_safe_command():
        if safety_node.safe_to_move:
            safe_cmd = safety_node.get_safe_command()
            safety_node.safety_cmd_pub.publish(safe_cmd)
    
    timer = safety_node.create_timer(0.1, publish_safe_command)
    
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

### 2. Social Safety

Social safety involves respecting human comfort and social norms during interaction.

#### Interaction State Management
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String, Bool
from geometry_msgs.msg import PointStamped
import time

class InteractionStateManagerNode(Node):
    def __init__(self):
        super().__init__('interaction_state_manager')
        
        # Subscribers
        self.speech_sub = self.create_subscription(
            String,
            'recognized_speech',
            self.speech_callback,
            10
        )
        
        self.gesture_sub = self.create_subscription(
            String,
            'recognized_gesture',
            self.gesture_callback,
            10
        )
        
        self.person_proximity_sub = self.create_subscription(
            PointStamped,
            'person_location',
            self.person_proximity_callback,
            10
        )
        
        self.stop_request_sub = self.create_subscription(
            Bool,
            'stop_interaction_request',
            self.stop_request_callback,
            10
        )
        
        # Publishers
        self.state_pub = self.create_publisher(String, 'interaction_state', 10)
        self.response_pub = self.create_publisher(String, 'robot_response', 10)
        
        # Interaction state
        self.current_state = "idle"  # idle, engaged, active, paused, stopped
        self.last_interaction_time = self.get_clock().now().nanoseconds
        self.interaction_timeout = 30.0  # seconds
        
        self.get_logger().info('Interaction state manager initialized')

    def speech_callback(self, msg):
        speech = msg.data.lower()
        
        if self.current_state == "idle":
            if any(word in speech for word in ["hello", "hi", "hey", "robot"]):
                self.start_interaction()
        elif self.current_state in ["engaged", "active"]:
            self.update_interaction_time()
            
            if "stop" in speech or "bye" in speech or "goodbye" in speech:
                self.end_interaction()
            else:
                self.process_speech(speech)

    def gesture_callback(self, msg):
        gesture = msg.data.lower()
        
        if self.current_state in ["engaged", "active"]:
            self.update_interaction_time()
            
            if gesture == "wave":
                self.respond_to_gesture("wave_acknowledge")
            elif gesture == "pointing":
                self.respond_to_gesture("acknowledge_pointing")

    def person_proximity_callback(self, msg):
        # Update interaction based on person's presence
        if self.current_state == "idle":
            # Person approached, consider engaging
            dist = (msg.point.x**2 + msg.point.y**2)**0.5
            if dist < 2.0:  # Person within 2 meters
                self.consider_engagement()
        elif self.current_state in ["engaged", "active"]:
            self.update_interaction_time()

    def stop_request_callback(self, msg):
        if msg.data:
            self.end_interaction()

    def start_interaction(self):
        self.current_state = "active"
        self.update_interaction_time()
        
        state_msg = String()
        state_msg.data = "active"
        self.state_pub.publish(state_msg)
        
        response_msg = String()
        response_msg.data = "Hello! How can I help you today?"
        self.response_pub.publish(response_msg)
        
        self.get_logger().info('Interaction started')

    def end_interaction(self):
        self.current_state = "idle"
        
        state_msg = String()
        state_msg.data = "idle"
        self.state_pub.publish(state_msg)
        
        response_msg = String()
        response_msg.data = "Goodbye! Feel free to come back if you need assistance."
        self.response_pub.publish(response_msg)
        
        self.get_logger().info('Interaction ended')

    def consider_engagement(self):
        # Consider engaging if person stays in proximity
        if self.current_state == "idle":
            # Could implement more sophisticated engagement logic here
            pass

    def process_speech(self, speech):
        # Process the speech and generate appropriate response
        if any(word in speech for word in ["help", "assist", "need"]):
            response_msg = String()
            response_msg.data = "I'm here to help. What do you need assistance with?"
            self.response_pub.publish(response_msg)
        elif any(word in speech for word in ["name", "what", "who"]):
            response_msg = String()
            response_msg.data = "I'm a humanoid robot designed to assist with various tasks."
            self.response_pub.publish(response_msg)

    def respond_to_gesture(self, gesture_type):
        if gesture_type == "wave_acknowledge":
            response_msg = String()
            response_msg.data = "Hello! Nice to meet you."
            self.response_pub.publish(response_msg)
        elif gesture_type == "acknowledge_pointing":
            response_msg = String()
            response_msg.data = "I see what you're pointing at."
            self.response_pub.publish(response_msg)

    def update_interaction_time(self):
        self.last_interaction_time = self.get_clock().now().nanoseconds

    def check_interaction_timeout(self):
        current_time = self.get_clock().now().nanoseconds
        time_diff = (current_time - self.last_interaction_time) / 1e9  # Convert to seconds
        
        if time_diff > self.interaction_timeout and self.current_state != "idle":
            self.get_logger().info(f'Interaction timeout after {time_diff:.1f}s')
            self.end_interaction()

def main(args=None):
    rclpy.init(args=args)
    interaction_node = InteractionStateManagerNode()
    
    # Timer to check for interaction timeouts
    timer = interaction_node.create_timer(1.0, interaction_node.check_interaction_timeout)
    
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

## HRI in Digital Twin Environments

### Simulating Human-Robot Interaction

Digital twin environments allow us to test HRI scenarios safely before deploying to physical robots:

#### Unity HRI Simulation
```csharp
using UnityEngine;
using System.Collections;
using RosBridgeClient;
using RosSharp.Messages.Std;
using RosSharp.Messages.Geometry;

public class UnityHRISimulator : MonoBehaviour
{
    public GameObject humanAvatar;
    public GameObject robotAvatar;
    private RosSocket rosSocket;
    
    // Interaction parameters
    private float interactionDistance = 1.5f; // meters
    private bool isInteracting = false;
    
    void Start()
    {
        ConnectToRos();
    }
    
    void ConnectToRos()
    {
        RosBridgeClient.Protocols.WebSocketNetProtocol protocol = 
            new RosBridgeClient.Protocols.WebSocketNetProtocol("ws://localhost:9090");
        
        rosSocket = new RosSocket(protocol);
        
        // Subscribe to interaction commands
        rosSocket.Subscribe<std_msgs.String>(
            "/interaction_command", 
            ProcessInteractionCommand, 
            10
        );
    }
    
    void Update()
    {
        // Check if human and robot are close enough for interaction
        float distance = Vector3.Distance(humanAvatar.transform.position, robotAvatar.transform.position);
        
        if (distance <= interactionDistance && !isInteracting)
        {
            StartInteraction();
        }
        else if (distance > interactionDistance * 1.5f && isInteracting)
        {
            EndInteraction();
        }
    }
    
    void ProcessInteractionCommand(std_msgs.String command)
    {
        switch (command.data)
        {
            case "greet":
                GreetHuman();
                break;
            case "follow":
                FollowHuman();
                break;
            case "stop":
                StopInteraction();
                break;
        }
    }
    
    void StartInteraction()
    {
        isInteracting = true;
        Debug.Log("Starting interaction with human");
        
        // Publish interaction state
        std_msgs.String stateMsg = new std_msgs.String();
        stateMsg.data = "active";
        rosSocket.Publish("/interaction_state", stateMsg);
        
        // Robot looks at human
        LookAtHuman();
    }
    
    void EndInteraction()
    {
        isInteracting = false;
        Debug.Log("Ending interaction with human");
        
        // Publish interaction state
        std_msgs.String stateMsg = new std_msgs.String();
        stateMsg.data = "idle";
        rosSocket.Publish("/interaction_state", stateMsg);
    }
    
    void GreetHuman()
    {
        Debug.Log("Robot greeting human");
        
        // Animate greeting gesture
        AnimateGreeting();
        
        // Publish speech
        std_msgs.String speechMsg = new std_msgs.String();
        speechMsg.data = "Hello! How can I assist you today?";
        rosSocket.Publish("/robot_speech", speechMsg);
    }
    
    void FollowHuman()
    {
        Debug.Log("Robot following human");
        
        // Simple following behavior
        Vector3 followPosition = humanAvatar.transform.position - 
                                (robotAvatar.transform.position - humanAvatar.transform.position).normalized * 1.0f;
        robotAvatar.transform.position = Vector3.MoveTowards(
            robotAvatar.transform.position, 
            followPosition, 
            Time.deltaTime * 2.0f
        );
    }
    
    void StopInteraction()
    {
        Debug.Log("Stopping interaction");
        EndInteraction();
    }
    
    void LookAtHuman()
    {
        Vector3 direction = humanAvatar.transform.position - robotAvatar.transform.position;
        direction.y = 0; // Keep rotation in x-z plane
        robotAvatar.transform.rotation = Quaternion.LookRotation(direction);
    }
    
    void AnimateGreeting()
    {
        // Simple animation - in real implementation, use Unity's animation system
        StartCoroutine(GreetingAnimation());
    }
    
    IEnumerator GreetingAnimation()
    {
        // Raise right arm
        yield return null;
    }
    
    void OnDestroy()
    {
        if (rosSocket != null)
            rosSocket.Close();
    }
}
```

## Best Practices for HRI

### 1. Design Guidelines

1. **Consistency**: Maintain consistent behavior patterns
2. **Feedback**: Provide clear feedback for all actions
3. **Predictability**: Make robot behavior predictable
4. **Error Handling**: Gracefully handle misunderstandings
5. **Cultural Sensitivity**: Consider cultural differences in interaction

### 2. Testing and Validation

1. **Simulation First**: Test interactions in digital twin environments
2. **Gradual Deployment**: Start with simple interactions, increase complexity
3. **User Studies**: Conduct studies with real users
4. **Safety Validation**: Ensure all safety measures work correctly

## Summary

In this chapter, we've explored the critical aspects of human-robot interaction for humanoid robots. We've covered multiple communication modalities, interaction design principles, safety considerations, and how to simulate HRI in digital twin environments. Effective HRI is essential for humanoid robots to work safely and effectively alongside humans. In the next chapter, we'll explore ROS 2 to Unity integration for creating comprehensive digital twin environments.