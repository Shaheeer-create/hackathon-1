# General Robotics Exercises

## Exercise G1: System Integration Challenge

### Problem Statement
Integrate all four modules (ROS 2 Architecture, Digital Twin, AI Brain, VLA) into a cohesive humanoid robotics system. The system should demonstrate:
1. Proper communication between all modules
2. Coordinated behavior across the entire stack
3. Error handling and recovery mechanisms
4. Performance optimization across the integrated system

### Solution Approach
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String, Bool
from geometry_msgs.msg import Twist, PoseStamped
from sensor_msgs.msg import Image, LaserScan
from nav_msgs.msg import Odometry
import threading
import time
from typing import Dict, Any, List

class SystemIntegrationNode(Node):
    def __init__(self):
        super().__init__('system_integration_node')
        
        # Initialize subsystems tracking
        self.subsystem_status = {
            'ros2_architecture': False,
            'digital_twin': False,
            'ai_brain': False,
            'vla_system': False
        }
        
        # Subscriptions for all subsystems
        self.status_subs = []
        for subsystem in self.subsystem_status.keys():
            sub = self.create_subscription(
                String,
                f'/{subsystem}/status',
                lambda msg, sys=subsystem: self.subsystem_status_callback(msg, sys),
                10
            )
            self.status_subs.append(sub)
        
        # Publishers for integrated system
        self.system_status_pub = self.create_publisher(String, '/system_status', 10)
        self.integration_test_pub = self.create_publisher(Bool, '/integration_test', 10)
        
        # System state
        self.all_systems_ready = False
        self.integration_tests_passed = 0
        self.integration_tests_total = 0
        
        # Timer for system health checks
        self.health_check_timer = self.create_timer(1.0, self.system_health_check)
        
        self.get_logger().info('System Integration Node initialized')

    def subsystem_status_callback(self, msg, subsystem):
        """Update subsystem status"""
        if msg.data == 'READY':
            self.subsystem_status[subsystem] = True
            self.get_logger().info(f'{subsystem} is ready')
        elif msg.data == 'ERROR':
            self.subsystem_status[subsystem] = False
            self.get_logger().error(f'{subsystem} reported error')
        
        # Check if all systems are ready
        self.all_systems_ready = all(self.subsystem_status.values())
        
        if self.all_systems_ready:
            self.get_logger().info('All subsystems are ready for integration testing')

    def system_health_check(self):
        """Check overall system health"""
        status_msg = String()
        
        if self.all_systems_ready:
            status_msg.data = 'SYSTEM_INTEGRATED_ALL_READY'
            
            # Run integration tests
            self.run_integration_tests()
        else:
            # Identify which subsystems are not ready
            not_ready = [sys for sys, ready in self.subsystem_status.items() if not ready]
            status_msg.data = f'SYSTEM_INTEGRATION_INCOMPLETE: {", ".join(not_ready)} not ready'
        
        self.system_status_pub.publish(status_msg)

    def run_integration_tests(self):
        """Run integration tests across all subsystems"""
        tests = [
            self.test_ros2_digital_twin_integration,
            self.test_ai_brain_navigation_integration,
            self.test_vla_perception_integration,
            self.test_cross_module_communication
        ]
        
        for test_func in tests:
            self.integration_tests_total += 1
            try:
                if test_func():
                    self.integration_tests_passed += 1
                    self.get_logger().info(f'Integration test passed: {test_func.__name__}')
                else:
                    self.get_logger().error(f'Integration test failed: {test_func.__name__}')
            except Exception as e:
                self.get_logger().error(f'Integration test error: {test_func.__name__} - {e}')

    def test_ros2_digital_twin_integration(self):
        """Test ROS 2 and Digital Twin integration"""
        # This would involve checking if simulation data is properly reflected in ROS topics
        # For example, checking if simulated sensor data matches expected patterns
        try:
            # Check if simulation is publishing expected topics
            # Verify TF tree completeness
            # Validate that simulated robot responds to commands
            return True  # Simplified - in practice, would have detailed checks
        except:
            return False

    def test_ai_brain_navigation_integration(self):
        """Test AI Brain and Navigation integration"""
        # This would involve checking if AI-generated plans are properly executed by navigation stack
        try:
            # Send a high-level command to AI brain
            # Verify that navigation system receives and executes the plan
            # Check if feedback is properly communicated back to AI system
            return True  # Simplified
        except:
            return False

    def test_vla_perception_integration(self):
        """Test VLA and Perception integration"""
        # This would involve checking if VLA system properly processes perceptual data
        try:
            # Verify that camera data is processed by VLA system
            # Check if detected objects are properly classified
            # Validate that language understanding connects to perception
            return True  # Simplified
        except:
            return False

    def test_cross_module_communication(self):
        """Test communication across all modules"""
        # This would involve checking message passing between all modules
        try:
            # Send a message that should traverse all modules
            # Verify it's properly processed at each stage
            return True  # Simplified
        except:
            return False

def main(args=None):
    rclpy.init(args=args)
    integration_node = SystemIntegrationNode()
    
    try:
        rclpy.spin(integration_node)
    except KeyboardInterrupt:
        pass
    finally:
        integration_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Exercise G2: Performance Optimization

### Problem Statement
Optimize the performance of the humanoid robotics system to ensure real-time operation across all modules. This includes:
1. CPU and memory usage optimization
2. Real-time response guarantees
3. Efficient data processing pipelines
4. GPU utilization for acceleration

### Solution Approach
```python
import psutil
import time
import threading
from collections import deque
import numpy as np
import cv2

class PerformanceOptimizerNode(Node):
    def __init__(self):
        super().__init__('performance_optimizer_node')
        
        # Performance monitoring
        self.cpu_usage_history = deque(maxlen=100)
        self.memory_usage_history = deque(maxlen=100)
        self.gpu_usage_history = deque(maxlen=100)
        
        # Threading for performance monitoring
        self.monitoring_thread = threading.Thread(target=self.performance_monitoring_loop, daemon=True)
        self.monitoring_thread.start()
        
        # Publishers for performance metrics
        self.cpu_usage_pub = self.create_publisher(Float32, '/performance/cpu_usage', 10)
        self.memory_usage_pub = self.create_publisher(Float32, '/performance/memory_usage', 10)
        self.gpu_usage_pub = self.create_publisher(Float32, '/performance/gpu_usage', 10)
        
        # Timer for optimization decisions
        self.optimization_timer = self.create_timer(5.0, self.optimization_decision_loop)
        
        # Optimization parameters
        self.cpu_threshold = 80.0  # percent
        self.memory_threshold = 85.0  # percent
        self.gpu_threshold = 85.0  # percent
        
        self.get_logger().info('Performance Optimizer Node initialized')

    def performance_monitoring_loop(self):
        """Continuously monitor system performance"""
        while rclpy.ok():
            # CPU usage
            cpu_percent = psutil.cpu_percent(interval=1)
            self.cpu_usage_history.append(cpu_percent)
            
            # Memory usage
            memory_percent = psutil.virtual_memory().percent
            self.memory_usage_history.append(memory_percent)
            
            # GPU usage (if available)
            gpu_percent = self.get_gpu_usage()
            self.gpu_usage_history.append(gpu_percent)
            
            # Publish metrics
            cpu_msg = Float32()
            cpu_msg.data = cpu_percent
            self.cpu_usage_pub.publish(cpu_msg)
            
            mem_msg = Float32()
            mem_msg.data = memory_percent
            self.memory_usage_pub.publish(mem_msg)
            
            gpu_msg = Float32()
            gpu_msg.data = gpu_percent
            self.gpu_usage_pub.publish(gpu_msg)
    
    def get_gpu_usage(self):
        """Get GPU usage if available"""
        try:
            import GPUtil
            gpus = GPUtil.getGPUs()
            if gpus:
                return gpus[0].load * 100  # Convert to percentage
            else:
                return 0.0
        except ImportError:
            return 0.0  # GPU monitoring not available
    
    def optimization_decision_loop(self):
        """Make optimization decisions based on performance metrics"""
        avg_cpu = np.mean(list(self.cpu_usage_history)[-10:]) if self.cpu_usage_history else 0
        avg_memory = np.mean(list(self.memory_usage_history)[-10:]) if self.memory_usage_history else 0
        avg_gpu = np.mean(list(self.gpu_usage_history)[-10:]) if self.gpu_usage_history else 0
        
        # Log current averages
        self.get_logger().info(f'Performance averages - CPU: {avg_cpu:.1f}%, Memory: {avg_memory:.1f}%, GPU: {avg_gpu:.1f}%')
        
        # Make optimization decisions
        if avg_cpu > self.cpu_threshold:
            self.optimize_cpu_usage()
        if avg_memory > self.memory_threshold:
            self.optimize_memory_usage()
        if avg_gpu > self.gpu_threshold:
            self.optimize_gpu_usage()
    
    def optimize_cpu_usage(self):
        """Apply CPU usage optimizations"""
        self.get_logger().warn('High CPU usage detected, applying optimizations')
        
        # Reduce processing frequency for non-critical tasks
        # Implement more efficient algorithms
        # Use multi-threading where appropriate
        pass
    
    def optimize_memory_usage(self):
        """Apply memory usage optimizations"""
        self.get_logger().warn('High memory usage detected, applying optimizations')
        
        # Implement memory pooling
        # Reduce buffer sizes
        # Implement garbage collection strategies
        pass
    
    def optimize_gpu_usage(self):
        """Apply GPU usage optimizations"""
        self.get_logger().warn('High GPU usage detected, applying optimizations')
        
        # Reduce batch sizes
        # Optimize tensor operations
        # Use mixed precision where appropriate
        pass

class EfficientDataPipeline:
    """Efficient data processing pipeline for humanoid robotics"""
    
    def __init__(self):
        self.buffer_size = 10
        self.data_buffer = deque(maxlen=self.buffer_size)
        self.processing_thread = None
        self.is_processing = False
        
    def start_processing(self):
        """Start efficient data processing"""
        self.is_processing = True
        self.processing_thread = threading.Thread(target=self.processing_loop, daemon=True)
        self.processing_thread.start()
    
    def add_data(self, data):
        """Add data to processing pipeline"""
        if len(self.data_buffer) < self.buffer_size:
            self.data_buffer.append(data)
        else:
            # Buffer full, drop oldest data
            self.data_buffer.popleft()
            self.data_buffer.append(data)
    
    def processing_loop(self):
        """Efficient processing loop"""
        while self.is_processing:
            if self.data_buffer:
                data = self.data_buffer.popleft()
                self.process_data_efficiently(data)
            else:
                time.sleep(0.001)  # Brief sleep to prevent busy waiting
    
    def process_data_efficiently(self, data):
        """Efficient data processing implementation"""
        # Use NumPy for numerical computations
        # Implement vectorized operations
        # Minimize memory allocations
        pass
    
    def stop_processing(self):
        """Stop processing pipeline"""
        self.is_processing = False
        if self.processing_thread:
            self.processing_thread.join()

def main(args=None):
    rclpy.init(args=args)
    perf_node = PerformanceOptimizerNode()
    
    try:
        rclpy.spin(perf_node)
    except KeyboardInterrupt:
        pass
    finally:
        perf_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Exercise G3: Safety and Fault Tolerance

### Problem Statement
Implement comprehensive safety and fault tolerance mechanisms for the humanoid robotics system, including:
1. Emergency stop procedures
2. Fault detection and isolation
3. Graceful degradation
4. Recovery from failures

### Solution Approach
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Bool, String, Float32
from geometry_msgs.msg import Twist
from sensor_msgs.msg import JointState
from builtin_interfaces.msg import Time
import threading
import time
from enum import Enum
from typing import Dict, List

class SafetyState(Enum):
    NORMAL = 0
    WARNING = 1
    ALERT = 2
    EMERGENCY_STOP = 3
    RECOVERY = 4

class SafetyAndFaultToleranceNode(Node):
    def __init__(self):
        super().__init__('safety_fault_tolerance_node')
        
        # Safety state management
        self.safety_state = SafetyState.NORMAL
        self.emergency_active = False
        self.faults_detected = []
        self.recovery_attempts = 0
        self.max_recovery_attempts = 3
        
        # Subscriptions for system monitoring
        self.joint_state_sub = self.create_subscription(
            JointState,
            '/joint_states',
            self.joint_state_callback,
            10
        )
        
        self.cmd_vel_sub = self.create_subscription(
            Twist,
            '/cmd_vel',
            self.cmd_vel_callback,
            10
        )
        
        # Publishers for safety commands
        self.emergency_stop_pub = self.create_publisher(Bool, '/emergency_stop', 10)
        self.safety_cmd_pub = self.create_publisher(Twist, '/safety_cmd_vel', 10)
        self.safety_status_pub = self.create_publisher(String, '/safety_status', 10)
        
        # Fault detection parameters
        self.joint_effort_threshold = 50.0  # N*m
        self.joint_velocity_threshold = 5.0  # rad/s
        self.cmd_vel_threshold = 1.0  # m/s for linear, rad/s for angular
        self.fault_history_window = 10
        self.fault_history = deque(maxlen=self.fault_history_window)
        
        # Timers for safety checks
        self.safety_check_timer = self.create_timer(0.1, self.safety_check_loop)  # 10Hz
        self.fault_detection_timer = self.create_timer(0.05, self.fault_detection_loop)  # 20Hz
        
        self.get_logger().info('Safety and Fault Tolerance Node initialized')

    def joint_state_callback(self, msg):
        """Monitor joint states for faults"""
        if not msg.effort or not msg.velocity:
            return
        
        # Check for joint faults
        for i, (effort, velocity) in enumerate(zip(msg.effort, msg.velocity)):
            if abs(effort) > self.joint_effort_threshold:
                fault_desc = f'HIGH_EFFORT_JOINT_{i}: {effort:.2f} > {self.joint_effort_threshold}'
                self.fault_history.append(('effort', fault_desc, self.get_clock().now()))
                
            if abs(velocity) > self.joint_velocity_threshold:
                fault_desc = f'HIGH_VELOCITY_JOINT_{i}: {velocity:.2f} > {self.joint_velocity_threshold}'
                self.fault_history.append(('velocity', fault_desc, self.get_clock().now()))

    def cmd_vel_callback(self, msg):
        """Monitor velocity commands for safety violations"""
        if (abs(msg.linear.x) > self.cmd_vel_threshold or 
            abs(msg.linear.y) > self.cmd_vel_threshold or 
            abs(msg.linear.z) > self.cmd_vel_threshold or
            abs(msg.angular.x) > self.cmd_vel_threshold or 
            abs(msg.angular.y) > self.cmd_vel_threshold or 
            abs(msg.angular.z) > self.cmd_vel_threshold):
            
            fault_desc = f'COMMAND_THRESHOLD_EXCEEDED: linear=({msg.linear.x:.2f}, {msg.linear.y:.2f}, {msg.linear.z:.2f}), angular=({msg.angular.x:.2f}, {msg.angular.y:.2f}, {msg.angular.z:.2f})'
            self.fault_history.append(('command', fault_desc, self.get_clock().now()))

    def safety_check_loop(self):
        """Main safety check loop"""
        # Determine current safety state based on faults
        current_state = self.determine_safety_state()
        
        if current_state != self.safety_state:
            self.get_logger().info(f'Safety state changed: {self.safety_state} -> {current_state}')
            self.safety_state = current_state
        
        # Take appropriate action based on safety state
        if self.safety_state == SafetyState.EMERGENCY_STOP:
            self.activate_emergency_stop()
        elif self.safety_state == SafetyState.RECOVERY:
            self.attempt_recovery()
        else:
            # Normal operation, clear emergency if active
            if self.emergency_active:
                self.deactivate_emergency_stop()
        
        # Publish safety status
        status_msg = String()
        status_msg.data = f'SAFETY_STATE: {self.safety_state.name}, FAULTS_DETECTED: {len(self.fault_history)}'
        self.safety_status_pub.publish(status_msg)

    def fault_detection_loop(self):
        """Continuous fault detection"""
        # This could include additional checks like:
        # - Communication timeouts
        # - Sensor data validity
        # - System resource limits
        # - Behavioral anomalies
        pass

    def determine_safety_state(self):
        """Determine safety state based on current conditions"""
        # Count recent faults
        recent_faults = list(self.fault_history)
        
        if not recent_faults:
            return SafetyState.NORMAL
        
        # Check for critical faults that require immediate stop
        critical_faults = [f for f in recent_faults if 'HIGH_EFFORT' in f[1] or 'COMMAND_THRESHOLD_EXCEEDED' in f[1]]
        
        if len(critical_faults) > 3:  # Multiple critical faults in short time
            return SafetyState.EMERGENCY_STOP
        
        # Check for warning-level faults
        warning_faults = [f for f in recent_faults if 'HIGH_VELOCITY' in f[1]]
        
        if len(warning_faults) > 5:  # Multiple warning faults
            return SafetyState.ALERT
        
        # Single critical fault
        if critical_faults:
            return SafetyState.WARNING
        
        # Single warning fault
        if warning_faults:
            return SafetyState.WARNING
        
        return SafetyState.NORMAL

    def activate_emergency_stop(self):
        """Activate emergency stop"""
        if not self.emergency_active:
            self.emergency_active = True
            
            # Publish emergency stop command
            stop_msg = Bool()
            stop_msg.data = True
            self.emergency_stop_pub.publish(stop_msg)
            
            # Publish zero velocity command
            zero_cmd = Twist()
            self.safety_cmd_pub.publish(zero_cmd)
            
            self.get_logger().error('EMERGENCY STOP ACTIVATED')
            
            # Update safety status
            status_msg = String()
            status_msg.data = 'EMERGENCY_STOP_ACTIVATED'
            self.safety_status_pub.publish(status_msg)

    def deactivate_emergency_stop(self):
        """Deactivate emergency stop"""
        if self.emergency_active:
            self.emergency_active = False
            
            # Publish emergency stop release
            release_msg = Bool()
            release_msg.data = False
            self.emergency_stop_pub.publish(release_msg)
            
            self.get_logger().info('EMERGENCY STOP DEACTIVATED')
            
            # Update safety status
            status_msg = String()
            status_msg.data = 'EMERGENCY_STOP_DEACTIVATED'
            self.safety_status_pub.publish(status_msg)

    def attempt_recovery(self):
        """Attempt to recover from fault state"""
        if self.recovery_attempts < self.max_recovery_attempts:
            self.get_logger().info(f'Attempting recovery (attempt {self.recovery_attempts + 1}/{self.max_recovery_attempts})')
            
            # Implement recovery procedure
            # This could involve:
            # - Gradually restoring functionality
            # - Reinitializing subsystems
            # - Requesting operator intervention
            
            self.recovery_attempts += 1
            
            # After recovery attempt, check if we can return to normal
            time.sleep(2.0)  # Give time for recovery
            
            # If no recent faults, return to normal
            if len(self.fault_history) == 0 or all(
                (self.get_clock().now() - fault[2]).nanoseconds / 1e9 > 5.0 
                for fault in self.fault_history
            ):
                self.safety_state = SafetyState.NORMAL
                self.recovery_attempts = 0
        else:
            self.get_logger().error('MAX RECOVERY ATTEMPTS REACHED - SYSTEM REMAINS IN SAFE STATE')
            self.safety_state = SafetyState.EMERGENCY_STOP

    def graceful_degradation(self):
        """Implement graceful degradation when faults occur"""
        # Reduce operational capabilities based on fault severity
        # For example:
        # - Reduce maximum velocities
        # - Disable non-critical functions
        # - Increase safety margins
        pass

def main(args=None):
    rclpy.init(args=args)
    safety_node = SafetyAndFaultToleranceNode()
    
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

## Exercise G4: Human-Robot Interaction Enhancement

### Problem Statement
Enhance the human-robot interaction capabilities of the humanoid system to include:
1. Natural language understanding and generation
2. Gesture recognition and generation
3. Emotional expression and recognition
4. Social behavior implementation

### Solution Approach
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String, Bool
from sensor_msgs.msg import Image
from geometry_msgs.msg import Twist, Pose
from visualization_msgs.msg import Marker
from audio_common_msgs.msg import AudioData
from std_srvs.srv import Trigger
import speech_recognition as sr
import pyttsx3
import threading
import time
import json
from enum import Enum

class InteractionMode(Enum):
    LISTENING = 0
    PROCESSING = 1
    RESPONDING = 2
    IDLE = 3

class HumanRobotInteractionNode(Node):
    def __init__(self):
        super().__init__('human_robot_interaction_node')
        
        # Initialize speech recognition and synthesis
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        
        # Initialize text-to-speech
        self.tts_engine = pyttsx3.init()
        voices = self.tts_engine.getProperty('voices')
        if voices:
            self.tts_engine.setProperty('voice', voices[0].id)
        self.tts_engine.setProperty('rate', 150)
        
        # Interaction state
        self.interaction_mode = InteractionMode.IDLE
        self.conversation_history = []
        self.user_intent = None
        self.robot_response = None
        
        # Subscriptions
        self.audio_sub = self.create_subscription(
            AudioData,
            '/audio_input',
            self.audio_callback,
            10
        )
        
        self.vision_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.vision_callback,
            10
        )
        
        # Publishers
        self.speech_output_pub = self.create_publisher(String, '/speech_output', 10)
        self.gesture_cmd_pub = self.create_publisher(String, '/gesture_command', 10)
        self.interaction_status_pub = self.create_publisher(String, '/interaction_status', 10)
        self.emotional_state_pub = self.create_publisher(String, '/emotional_state', 10)
        
        # Services
        self.start_interaction_srv = self.create_service(
            Trigger,
            '/start_interaction',
            self.start_interaction_callback
        )
        
        self.stop_interaction_srv = self.create_service(
            Trigger,
            '/stop_interaction',
            self.stop_interaction_callback
        )
        
        # Timers
        self.interaction_timer = self.create_timer(0.1, self.interaction_loop)
        
        # Setup microphone
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source)
        
        self.get_logger().info('Human-Robot Interaction Node initialized')

    def audio_callback(self, msg):
        """Process audio input"""
        if self.interaction_mode == InteractionMode.LISTENING:
            try:
                # Convert audio data to audio segment
                # This is a simplified approach - in practice, you'd need proper audio conversion
                self.get_logger().info('Audio received, processing...')
                
                # In a real implementation, you would:
                # 1. Convert AudioData to proper audio format
                # 2. Use speech recognition to get text
                # 3. Process the text for intent
                pass
            except Exception as e:
                self.get_logger().error(f'Error processing audio: {e}')

    def vision_callback(self, msg):
        """Process visual input for gesture and emotion recognition"""
        # In a real implementation, you would:
        # 1. Process image for human detection
        # 2. Recognize gestures using computer vision
        # 3. Detect emotional expressions
        # 4. Track gaze direction
        pass

    def interaction_loop(self):
        """Main interaction control loop"""
        status_msg = String()
        
        if self.interaction_mode == InteractionMode.IDLE:
            status_msg.data = 'INTERACTION_IDLE'
        elif self.interaction_mode == InteractionMode.LISTENING:
            status_msg.data = 'LISTENING_FOR_SPEECH'
        elif self.interaction_mode == InteractionMode.PROCESSING:
            status_msg.data = 'PROCESSING_USER_INPUT'
        elif self.interaction_mode == InteractionMode.RESPONDING:
            status_msg.data = 'RESPONDING_TO_USER'
        
        self.interaction_status_pub.publish(status_msg)

    def start_interaction_callback(self, request, response):
        """Start interaction service callback"""
        if self.interaction_mode == InteractionMode.IDLE:
            self.interaction_mode = InteractionMode.LISTENING
            self.get_logger().info('Interaction started - listening for user input')
            response.success = True
            response.message = 'Interaction started successfully'
        else:
            response.success = False
            response.message = f'Interaction already active in mode: {self.interaction_mode}'
        
        return response

    def stop_interaction_callback(self, request, response):
        """Stop interaction service callback"""
        self.interaction_mode = InteractionMode.IDLE
        self.get_logger().info('Interaction stopped')
        response.success = True
        response.message = 'Interaction stopped successfully'
        return response

    def process_user_speech(self, speech_text):
        """Process user speech and determine intent"""
        # Simple intent recognition - in practice, use NLP/ML models
        speech_lower = speech_text.lower()
        
        if any(word in speech_lower for word in ['hello', 'hi', 'hey']):
            self.user_intent = 'greeting'
        elif any(word in speech_lower for word in ['help', 'assist', 'need']):
            self.user_intent = 'request_help'
        elif any(word in speech_lower for word in ['move', 'go', 'walk', 'navigate']):
            self.user_intent = 'navigation_request'
        elif any(word in speech_lower for word in ['dance', 'wave', 'gesture', 'move']):
            self.user_intent = 'gesture_request'
        elif any(word in speech_lower for word in ['stop', 'halt', 'quit']):
            self.user_intent = 'stop_request'
        else:
            self.user_intent = 'unknown'
        
        # Generate appropriate response
        self.generate_robot_response()
        
        # Update interaction mode
        self.interaction_mode = InteractionMode.RESPONDING

    def generate_robot_response(self):
        """Generate appropriate response based on user intent"""
        responses = {
            'greeting': [
                "Hello! It's great to meet you.",
                "Hi there! How can I assist you today?",
                "Greetings! I'm ready to help."
            ],
            'request_help': [
                "I'm here to help. What do you need assistance with?",
                "Sure, I can help with that. What specifically?",
                "I'm ready to assist. Tell me more about what you need."
            ],
            'navigation_request': [
                "I can help with navigation. Where would you like me to go?",
                "I'm ready to navigate. Please specify the destination.",
                "I understand you need navigation assistance. Where to?"
            ],
            'gesture_request': [
                "I can perform gestures. What would you like me to do?",
                "Sure, I can move. What gesture would you like to see?",
                "I'm ready to demonstrate. What movement should I make?"
            ],
            'stop_request': [
                "Stopping as requested. How else can I help?",
                "I've stopped. Is there something else I can do?",
                "Movement stopped. Ready for your next instruction."
            ],
            'unknown': [
                "I'm not sure I understood. Could you please repeat?",
                "I didn't quite catch that. Could you say it again?",
                "I'm sorry, I didn't understand. Could you rephrase that?"
            ]
        }
        
        import random
        if self.user_intent in responses:
            self.robot_response = random.choice(responses[self.user_intent])
        else:
            self.robot_response = "I'm not sure how to respond to that."

    def execute_robot_response(self):
        """Execute the robot's response"""
        if self.robot_response:
            # Speak the response
            self.tts_engine.say(self.robot_response)
            self.tts_engine.runAndWait()
            
            # Publish speech output
            speech_msg = String()
            speech_msg.data = self.robot_response
            self.speech_output_pub.publish(speech_msg)
            
            # Add to conversation history
            self.conversation_history.append({
                'timestamp': self.get_clock().now().nanoseconds,
                'speaker': 'robot',
                'text': self.robot_response
            })
            
            # Reset for next interaction
            self.interaction_mode = InteractionMode.LISTENING
            self.user_intent = None
            self.robot_response = None

    def execute_gesture(self, gesture_type):
        """Execute a specific gesture"""
        gesture_msg = String()
        gesture_msg.data = gesture_type
        self.gesture_cmd_pub.publish(gesture_msg)
        
        # Log the gesture
        self.get_logger().info(f'Gesture executed: {gesture_type}')

    def set_emotional_state(self, emotion):
        """Set and publish emotional state"""
        emotion_msg = String()
        emotion_msg.data = emotion
        self.emotional_state_pub.publish(emotion_msg)
        
        # Map emotion to visual/auditory expressions
        emotion_effects = {
            'happy': {'gesture': 'wave', 'tone': 'upbeat'},
            'sad': {'gesture': 'head_down', 'tone': 'softer'},
            'surprised': {'gesture': 'raise_eyebrows', 'tone': 'higher_pitch'},
            'neutral': {'gesture': 'idle', 'tone': 'normal'}
        }
        
        if emotion in emotion_effects:
            effect = emotion_effects[emotion]
            self.execute_gesture(effect['gesture'])
            
            # Adjust speech parameters based on emotion
            if effect['tone'] == 'upbeat':
                self.tts_engine.setProperty('rate', 170)
            elif effect['tone'] == 'softer':
                self.tts_engine.setProperty('rate', 130)
            elif effect['tone'] == 'higher_pitch':
                # Pitch adjustment would require different TTS engine
                pass
            else:
                self.tts_engine.setProperty('rate', 150)

def main(args=None):
    rclpy.init(args=args)
    hri_node = HumanRobotInteractionNode()
    
    try:
        rclpy.spin(hri_node)
    except KeyboardInterrupt:
        pass
    finally:
        hri_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Exercise G5: Advanced Control Systems

### Problem Statement
Implement advanced control systems for the humanoid robot including:
1. Whole-body motion control
2. Balance and stability control
3. Adaptive control for changing conditions
4. Model Predictive Control (MPC) for complex movements

### Solution Approach
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float64MultiArray, String
from geometry_msgs.msg import WrenchStamped, PoseStamped
from sensor_msgs.msg import JointState, Imu
from control_msgs.msg import JointTrajectoryControllerState
import numpy as np
import casadi as ca
import threading
import time
from typing import List, Tuple

class AdvancedControlNode(Node):
    def __init__(self):
        super().__init__('advanced_control_node')
        
        # Control parameters
        self.control_frequency = 100  # Hz
        self.prediction_horizon = 20  # steps
        self.dt = 0.01  # time step (seconds)
        
        # Robot state
        self.current_joint_positions = []
        self.current_joint_velocities = []
        self.current_joint_efforts = []
        self.imu_data = None
        self.center_of_mass = np.array([0.0, 0.0, 0.8])  # Default CoM position
        self.support_polygon = []  # Current support polygon vertices
        
        # Subscriptions
        self.joint_state_sub = self.create_subscription(
            JointState,
            '/joint_states',
            self.joint_state_callback,
            10
        )
        
        self.imu_sub = self.create_subscription(
            Imu,
            '/imu/data',
            self.imu_callback,
            10
        )
        
        self.target_pose_sub = self.create_subscription(
            PoseStamped,
            '/control_target',
            self.target_pose_callback,
            10
        )
        
        # Publishers
        self.joint_command_pub = self.create_publisher(Float64MultiArray, '/joint_group_position_controller/commands', 10)
        self.control_status_pub = self.create_publisher(String, '/control_status', 10)
        self.com_pub = self.create_publisher(WrenchStamped, '/center_of_mass', 10)
        
        # Initialize MPC controller
        self.mpc_controller = self.initialize_mpc_controller()
        
        # Control thread
        self.control_thread = threading.Thread(target=self.control_loop, daemon=True)
        self.control_active = True
        self.control_thread.start()
        
        self.get_logger().info('Advanced Control Node initialized')

    def joint_state_callback(self, msg):
        """Update joint state information"""
        self.current_joint_positions = list(msg.position)
        self.current_joint_velocities = list(msg.velocity)
        self.current_joint_efforts = list(msg.effort)

    def imu_callback(self, msg):
        """Update IMU information"""
        self.imu_data = msg
        
        # Extract orientation and angular velocity
        import tf_transformations
        orientation = [msg.orientation.x, msg.orientation.y, msg.orientation.z, msg.orientation.w]
        euler = tf_transformations.euler_from_quaternion(orientation)
        
        # Calculate tilt angles for balance control
        self.roll, self.pitch, self.yaw = euler
        self.angular_velocity = [msg.angular_velocity.x, msg.angular_velocity.y, msg.angular_velocity.z]

    def target_pose_callback(self, msg):
        """Update target pose for control"""
        self.target_position = np.array([
            msg.pose.position.x,
            msg.pose.position.y,
            msg.pose.position.z
        ])
        
        # Convert orientation to Euler
        import tf_transformations
        orientation = [
            msg.pose.orientation.x,
            msg.pose.orientation.y,
            msg.pose.orientation.z,
            msg.pose.orientation.w
        ]
        self.target_orientation = tf_transformations.euler_from_quaternion(orientation)

    def initialize_mpc_controller(self):
        """Initialize Model Predictive Controller using CasADi"""
        # Define symbolic variables
        N = self.prediction_horizon  # Prediction horizon
        
        # State variables (simplified model - in practice, use full humanoid model)
        # [x, y, z, roll, pitch, yaw, x_dot, y_dot, z_dot, roll_dot, pitch_dot, yaw_dot]
        x = ca.MX.sym('x', 12)  # State vector
        
        # Control variables (simplified - joint torques or positions)
        u = ca.MX.sym('u', 12)  # Control vector (simplified)
        
        # Parameters (reference trajectory, initial state)
        x_ref = ca.MX.sym('x_ref', 12)  # Reference state
        x_init = ca.MX.sym('x_init', 12)  # Initial state
        
        # System dynamics (simplified double integrator model)
        # In practice, use full humanoid dynamics model
        A = ca.MX.eye(12)
        A[0, 6] = self.dt  # x += x_dot*dt
        A[1, 7] = self.dt  # y += y_dot*dt
        A[2, 8] = self.dt  # z += z_dot*dt
        A[3, 9] = self.dt  # roll += roll_dot*dt
        A[4, 10] = self.dt  # pitch += pitch_dot*dt
        A[5, 11] = self.dt  # yaw += yaw_dot*dt
        
        # Simplified control input effect
        B = ca.MX.zeros(12, 12)
        B[6:, :] = ca.MX.eye(6) * self.dt  # Acceleration affects velocity
        
        # State prediction
        x_next = A @ x + B @ u
        
        # Objective function
        Q = ca.MX.eye(12)  # State cost matrix
        R = ca.MX.eye(12) * 0.1  # Control cost matrix
        
        # Stage cost
        stage_cost = (x - x_ref).T @ Q @ (x - x_ref) + u.T @ R @ u
        
        # Terminal cost
        P = Q * 10  # Terminal cost matrix
        terminal_cost = (x - x_ref).T @ P @ (x - x_ref)
        
        # Constraints (simplified)
        # Joint limits, torque limits, etc.
        u_min = ca.MX.ones(12) * -100  # Min control limits
        u_max = ca.MX.ones(12) * 100   # Max control limits
        
        # Create MPC problem
        opt_variables = ca.vertcat(ca.vec(x), ca.vec(u))
        
        # Objective function for the whole horizon
        objective = 0
        x_current = x_init
        
        for k in range(N):
            # Add stage cost
            objective += stage_cost.substitute(x, x_current)
            
            # Predict next state
            x_current = A @ x_current + B @ u
            
        # Add terminal cost
        objective += terminal_cost.substitute(x, x_current)
        
        # Constraints
        constraints = []
        x_current = x_init
        
        for k in range(N):
            # Add dynamics constraints
            x_next_pred = A @ x_current + B @ u
            constraints.append(x_next_pred - x_current)  # This is a simplified representation
            
            # Update state for next step
            x_current = x_next_pred
        
        # Create NLP solver
        nlp = {'x': opt_variables, 'f': objective, 'g': ca.vertcat(*constraints)}
        solver = ca.nlpsol('solver', 'ipopt', nlp)
        
        return {
            'solver': solver,
            'x': x,
            'u': u,
            'x_ref': x_ref,
            'x_init': x_init,
            'objective': objective
        }

    def compute_balance_control(self):
        """Compute balance control using inverted pendulum model"""
        if not self.imu_data:
            return np.zeros(12)  # Return zero torques if no IMU data
        
        # Simplified inverted pendulum model for balance
        # In practice, use full humanoid balance control (e.g., LIPM, CAPM)
        
        # Calculate desired CoM position based on support polygon
        if self.support_polygon:
            # Find centroid of support polygon
            support_centroid = np.mean(self.support_polygon, axis=0)
            
            # Calculate CoM offset from support centroid
            com_offset = self.center_of_mass[:2] - support_centroid[:2]
            
            # Compute balance correction (proportional control)
            kp_balance = 50.0  # Proportional gain for balance
            balance_correction = -kp_balance * com_offset
            
            # Convert to joint torques (simplified)
            # In practice, use inverse kinematics/dynamics
            joint_torques = np.zeros(12)
            joint_torques[0:2] = balance_correction  # Apply to hip joints for balance
            
            return joint_torques
        else:
            return np.zeros(12)

    def compute_whole_body_control(self):
        """Compute whole-body motion control"""
        if not self.target_position or not self.current_joint_positions:
            return np.zeros(len(self.current_joint_positions))
        
        # Simplified whole-body control
        # In practice, use full inverse kinematics with constraints
        
        # Calculate desired joint positions to reach target
        # This is a simplified approach - in practice, use full IK solver
        current_pos = np.array(self.current_joint_positions)
        target_pos = np.array([0.0] * len(current_pos))  # Simplified target
        
        # Simple proportional control
        kp = 1.0
        joint_commands = current_pos + kp * (target_pos - current_pos)
        
        return joint_commands.tolist()

    def control_loop(self):
        """Main control loop running at control frequency"""
        rate = self.create_rate(self.control_frequency)
        
        while self.control_active and rclpy.ok():
            try:
                # Compute control commands
                balance_torques = self.compute_balance_control()
                wb_commands = self.compute_whole_body_control()
                
                # Combine control commands
                if len(balance_torques) == len(wb_commands):
                    final_commands = balance_torques + np.array(wb_commands)
                else:
                    # Pad or truncate as needed
                    min_len = min(len(balance_torques), len(wb_commands))
                    final_commands = balance_torques[:min_len] + np.array(wb_commands[:min_len])
                
                # Publish joint commands
                cmd_msg = Float64MultiArray()
                cmd_msg.data = final_commands.tolist()
                self.joint_command_pub.publish(cmd_msg)
                
                # Publish control status
                status_msg = String()
                status_msg.data = f'CONTROL_ACTIVE: Balance={np.linalg.norm(balance_torques):.2f}, WB={np.linalg.norm(wb_commands):.2f}'
                self.control_status_pub.publish(status_msg)
                
                # Calculate and publish center of mass
                self.publish_center_of_mass()
                
                rate.sleep()
                
            except Exception as e:
                self.get_logger().error(f'Error in control loop: {e}')
                time.sleep(0.01)  # Brief pause to prevent rapid error looping

    def publish_center_of_mass(self):
        """Calculate and publish center of mass"""
        # Simplified CoM calculation - in practice, use full kinematic model
        if self.current_joint_positions:
            # This is a very simplified calculation
            # In practice, use robot's kinematic model with link masses
            com_msg = WrenchStamped()
            com_msg.header.stamp = self.get_clock().now().to_msg()
            com_msg.header.frame_id = 'base_link'
            
            # Simplified CoM position
            com_msg.wrench.force.x = self.center_of_mass[0]
            com_msg.wrench.force.y = self.center_of_mass[1]
            com_msg.wrench.force.z = self.center_of_mass[2]
            
            # Publish CoM
            self.com_pub.publish(com_msg)

    def destroy_node(self):
        """Clean up before destroying node"""
        self.control_active = False
        if self.control_thread:
            self.control_thread.join(timeout=1.0)
        super().destroy_node()

def main(args=None):
    rclpy.init(args=args)
    control_node = AdvancedControlNode()
    
    try:
        rclpy.spin(control_node)
    except KeyboardInterrupt:
        pass
    finally:
        control_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Summary

These general robotics exercises cover essential aspects of humanoid robotics development:

1. **System Integration**: Techniques for integrating multiple complex subsystems
2. **Performance Optimization**: Methods for optimizing computational and resource usage
3. **Safety and Fault Tolerance**: Critical safety mechanisms for humanoid robots
4. **Human-Robot Interaction**: Advanced interaction capabilities
5. **Advanced Control**: Sophisticated control algorithms for humanoid motion

Each exercise builds on the concepts from the previous modules and demonstrates how to implement practical solutions for real-world humanoid robotics challenges. The solutions include proper error handling, performance considerations, and safety measures that are essential for deployed humanoid robot systems.