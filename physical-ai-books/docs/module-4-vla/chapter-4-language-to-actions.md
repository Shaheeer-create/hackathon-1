# Chapter 4: Language to Actions Translation

## Overview

Translating natural language commands into executable robot actions is a critical component of VLA systems. This chapter explores techniques for mapping high-level language instructions to low-level robot control commands, ensuring that humanoid robots can accurately execute human intentions.

## Introduction to Language-to-Action Translation

The language-to-action translation process involves several key steps:
1. Natural language understanding (NLU)
2. Semantic parsing
3. Action mapping
4. Execution validation

This process bridges the gap between human communication and robot execution, requiring both linguistic understanding and knowledge of robot capabilities.

## Semantic Parsing for Robot Commands

### Command Structure Analysis

Robot commands typically follow specific patterns that can be parsed using semantic rules:

```python
import re
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass

@dataclass
class ParsedCommand:
    """Represents a parsed command with its components"""
    action_type: str
    object: Optional[str] = None
    location: Optional[str] = None
    direction: Optional[str] = None
    parameters: Dict[str, str] = None

class SemanticParser:
    def __init__(self):
        # Define command patterns
        self.patterns = [
            # Navigation patterns
            (r'go to (?P<location>.+)', 'NAVIGATE_TO'),
            (r'move to (?P<location>.+)', 'NAVIGATE_TO'),
            (r'walk to (?P<location>.+)', 'NAVIGATE_TO'),
            
            # Manipulation patterns
            (r'pick up (?P<object>.+)', 'GRASP_OBJECT'),
            (r'grasp (?P<object>.+)', 'GRASP_OBJECT'),
            (r'grab (?P<object>.+)', 'GRASP_OBJECT'),
            (r'put down (?P<object>.+)', 'PLACE_OBJECT'),
            (r'drop (?P<object>.+)', 'PLACE_OBJECT'),
            
            # Movement patterns
            (r'move (?P<direction>forward|backward|left|right)', 'MOVE_BASE'),
            (r'go (?P<direction>forward|backward|left|right)', 'MOVE_BASE'),
            (r'turn (?P<direction>left|right)', 'TURN_BASE'),
            (r'rotate (?P<direction>left|right)', 'TURN_BASE'),
            
            # Complex patterns
            (r'bring (?P<object>.+) to (?P<location>.+)', 'BRING_OBJECT'),
            (r'take (?P<object>.+) to (?P<location>.+)', 'BRING_OBJECT'),
        ]
    
    def parse_command(self, text: str) -> Optional[ParsedCommand]:
        """Parse a natural language command into structured components"""
        text = text.lower().strip()
        
        for pattern, action_type in self.patterns:
            match = re.search(pattern, text)
            if match:
                groups = match.groupdict()
                return ParsedCommand(
                    action_type=action_type,
                    object=groups.get('object'),
                    location=groups.get('location'),
                    direction=groups.get('direction'),
                    parameters=groups
                )
        
        # If no pattern matches, return None
        return None
```

### Handling Ambiguity

Natural language often contains ambiguity that needs to be resolved:

```python
class AmbiguityResolver:
    def __init__(self, object_detector, location_mapper):
        self.object_detector = object_detector
        self.location_mapper = location_mapper
    
    def resolve_object_ambiguity(self, object_name: str, context: Dict) -> str:
        """Resolve ambiguous object references using context"""
        # Get all objects matching the name pattern
        possible_objects = self.object_detector.find_objects(object_name)
        
        if len(possible_objects) == 1:
            return possible_objects[0]['id']
        
        # If multiple objects match, use context to disambiguate
        if 'location' in context:
            # Find the closest object to the specified location
            closest = min(
                possible_objects,
                key=lambda obj: self._distance_to_location(obj, context['location'])
            )
            return closest['id']
        
        # If still ambiguous, ask for clarification
        raise AmbiguousObjectError(
            f"Multiple objects match '{object_name}'. Please specify which one."
        )
    
    def _distance_to_location(self, obj: Dict, location: str) -> float:
        """Calculate distance from object to location"""
        # Implementation would depend on your specific coordinate system
        pass
```

## Action Mapping and Execution

### Action Mapping Framework

```python
from abc import ABC, abstractmethod
from typing import Any

class ActionExecutor(ABC):
    """Abstract base class for action executors"""
    
    @abstractmethod
    def execute(self, parameters: Dict[str, Any]) -> bool:
        """Execute the action with given parameters"""
        pass

class NavigationExecutor(ActionExecutor):
    """Executor for navigation actions"""
    
    def __init__(self, navigation_client):
        self.navigation_client = navigation_client
    
    def execute(self, parameters: Dict[str, Any]) -> bool:
        """Execute navigation to specified location"""
        location_name = parameters.get('location')
        
        # Resolve location name to coordinates
        location_coords = self.navigation_client.get_location_coordinates(location_name)
        
        if location_coords:
            # Send navigation goal
            return self.navigation_client.navigate_to_pose(location_coords)
        else:
            raise ValueError(f"Unknown location: {location_name}")

class ManipulationExecutor(ActionExecutor):
    """Executor for manipulation actions"""
    
    def __init__(self, manipulation_client):
        self.manipulation_client = manipulation_client
    
    def execute(self, parameters: Dict[str, Any]) -> bool:
        """Execute manipulation action"""
        action_type = parameters.get('action_type')
        object_name = parameters.get('object')
        
        if action_type == 'GRASP_OBJECT':
            return self.manipulation_client.grasp_object(object_name)
        elif action_type == 'PLACE_OBJECT':
            return self.manipulation_client.place_object(object_name)
        else:
            raise ValueError(f"Unknown manipulation action: {action_type}")

class ActionMapper:
    """Maps parsed commands to executable actions"""
    
    def __init__(self):
        # Initialize action executors
        # In a real implementation, these would connect to ROS 2 action servers
        self.executors = {
            'NAVIGATE_TO': NavigationExecutor(None),  # Placeholder
            'GRASP_OBJECT': ManipulationExecutor(None),  # Placeholder
            'PLACE_OBJECT': ManipulationExecutor(None),  # Placeholder
            'MOVE_BASE': None,  # Would need specific implementation
            'TURN_BASE': None,  # Would need specific implementation
            'BRING_OBJECT': None,  # Complex action requiring multiple steps
        }
    
    def execute_command(self, parsed_command: ParsedCommand) -> bool:
        """Execute a parsed command"""
        executor = self.executors.get(parsed_command.action_type)
        
        if executor:
            # Prepare parameters for execution
            params = {
                'action_type': parsed_command.action_type,
                'object': parsed_command.object,
                'location': parsed_command.location,
                'direction': parsed_command.direction,
                **parsed_command.parameters
            }
            
            return executor.execute(params)
        else:
            raise ValueError(f"No executor for action type: {parsed_command.action_type}")
```

## Complex Action Sequences

### Handling Multi-Step Commands

Many language commands require multiple actions to complete:

```python
class MultiStepActionPlanner:
    """Plans and executes multi-step actions"""
    
    def __init__(self, action_mapper: ActionMapper):
        self.action_mapper = action_mapper
    
    def execute_bring_object(self, object_name: str, destination: str) -> bool:
        """Execute a 'bring object to location' command"""
        steps = [
            # 1. Navigate to object
            ParsedCommand(
                action_type='NAVIGATE_TO',
                location=self._get_object_location(object_name)
            ),
            # 2. Grasp object
            ParsedCommand(
                action_type='GRASP_OBJECT',
                object=object_name
            ),
            # 3. Navigate to destination
            ParsedCommand(
                action_type='NAVIGATE_TO',
                location=destination
            ),
            # 4. Place object
            ParsedCommand(
                action_type='PLACE_OBJECT',
                object=object_name
            )
        ]
        
        # Execute each step in sequence
        for step in steps:
            success = self.action_mapper.execute_command(step)
            if not success:
                # Handle failure - maybe return object to original location?
                self._handle_failure(steps, step)
                return False
        
        return True
    
    def _get_object_location(self, object_name: str) -> str:
        """Get the location of an object"""
        # Implementation would query object detection system
        pass
    
    def _handle_failure(self, steps: List[ParsedCommand], failed_step: ParsedCommand):
        """Handle failure in multi-step execution"""
        # Implementation would handle error recovery
        pass
```

## Integration with ROS 2

### ROS 2 Action Translation Node

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import Pose
from action_msgs.msg import GoalStatus
from your_msgs.msg import TaskAction, TaskPlan
from your_msgs.action import NavigateToPose, GraspObject, PlaceObject

class LanguageToActionNode(Node):
    def __init__(self):
        super().__init__('language_to_action_node')
        
        # Subscriber for parsed commands
        self.command_subscriber = self.create_subscription(
            TaskAction,
            'parsed_command',
            self.command_callback,
            10
        )
        
        # Action clients for different robot capabilities
        self.nav_client = self.create_action_client(NavigateToPose, 'navigate_to_pose')
        self.grasp_client = self.create_action_client(GraspObject, 'grasp_object')
        self.place_client = self.create_action_client(PlaceObject, 'place_object')
        
        # Publisher for execution status
        self.status_publisher = self.create_publisher(String, 'action_status', 10)
        
    def command_callback(self, msg: TaskAction):
        """Process a parsed command and execute corresponding action"""
        self.get_logger().info(f"Executing action: {msg.action}")
        
        # Parse parameters from JSON string
        import json
        try:
            params = json.loads(msg.parameters) if msg.parameters else {}
        except json.JSONDecodeError:
            self.get_logger().error(f"Invalid parameters JSON: {msg.parameters}")
            return
        
        # Execute the appropriate action based on type
        if msg.action == 'NAVIGATE_TO':
            self._execute_navigate_to(params)
        elif msg.action == 'GRASP_OBJECT':
            self._execute_grasp_object(params)
        elif msg.action == 'PLACE_OBJECT':
            self._execute_place_object(params)
        else:
            self.get_logger().error(f"Unknown action type: {msg.action}")
    
    def _execute_navigate_to(self, params: Dict[str, Any]):
        """Execute navigation action"""
        # Extract target pose from parameters
        target_pose = Pose()
        target_pose.position.x = params.get('x', 0.0)
        target_pose.position.y = params.get('y', 0.0)
        target_pose.position.z = params.get('z', 0.0)
        
        # Set orientation (simplified)
        target_pose.orientation.w = 1.0
        
        # Send navigation goal
        goal_msg = NavigateToPose.Goal()
        goal_msg.pose = target_pose
        
        self.nav_client.wait_for_server()
        future = self.nav_client.send_goal_async(goal_msg)
        future.add_done_callback(self._navigation_done_callback)
    
    def _execute_grasp_object(self, params: Dict[str, Any]):
        """Execute grasp action"""
        object_name = params.get('object_id', '')
        
        goal_msg = GraspObject.Goal()
        goal_msg.object_name = object_name
        
        self.grasp_client.wait_for_server()
        future = self.grasp_client.send_goal_async(goal_msg)
        future.add_done_callback(self._grasp_done_callback)
    
    def _execute_place_object(self, params: Dict[str, Any]):
        """Execute place action"""
        goal_msg = PlaceObject.Goal()
        # Set placement parameters based on context
        
        self.place_client.wait_for_server()
        future = self.place_client.send_goal_async(goal_msg)
        future.add_done_callback(self._place_done_callback)
    
    def _navigation_done_callback(self, future):
        """Handle navigation completion"""
        goal_handle = future.result()
        result = goal_handle.get_result()
        
        status_msg = String()
        if result.result.success:
            status_msg.data = "Navigation completed successfully"
        else:
            status_msg.data = "Navigation failed"
        
        self.status_publisher.publish(status_msg)
    
    def _grasp_done_callback(self, future):
        """Handle grasp completion"""
        # Similar to navigation callback
        pass
    
    def _place_done_callback(self, future):
        """Handle place completion"""
        # Similar to navigation callback
        pass
```

## Error Handling and Validation

### Action Validation

Before executing actions, it's important to validate them:

```python
class ActionValidator:
    """Validates actions before execution"""
    
    def __init__(self, robot_capabilities, environment_model):
        self.robot_capabilities = robot_capabilities
        self.environment_model = environment_model
    
    def validate_action(self, parsed_command: ParsedCommand) -> Tuple[bool, str]:
        """Validate an action before execution"""
        
        if parsed_command.action_type == 'NAVIGATE_TO':
            return self._validate_navigation(parsed_command)
        elif parsed_command.action_type == 'GRASP_OBJECT':
            return self._validate_grasp(parsed_command)
        elif parsed_command.action_type == 'MOVE_BASE':
            return self._validate_base_movement(parsed_command)
        else:
            return True, "Action type not requiring validation"
    
    def _validate_navigation(self, command: ParsedCommand) -> Tuple[bool, str]:
        """Validate navigation command"""
        location = command.location
        
        if not location:
            return False, "No destination specified for navigation"
        
        # Check if location is reachable
        if not self.environment_model.is_navigable(location):
            return False, f"Location {location} is not navigable"
        
        # Check if location is within operational bounds
        location_coords = self.environment_model.get_coordinates(location)
        if not self._within_operational_bounds(location_coords):
            return False, f"Location {location} is outside operational bounds"
        
        return True, "Navigation is valid"
    
    def _validate_grasp(self, command: ParsedCommand) -> Tuple[bool, str]:
        """Validate grasp command"""
        object_name = command.object
        
        if not object_name:
            return False, "No object specified for grasp"
        
        # Check if object exists and is graspable
        obj = self.environment_model.get_object(object_name)
        if not obj:
            return False, f"Object {object_name} not found"
        
        if not obj.get('graspable', False):
            return False, f"Object {object_name} is not graspable"
        
        # Check if object is within reach
        if not self._is_within_reach(obj):
            return False, f"Object {object_name} is not within reach"
        
        return True, "Grasp is valid"
    
    def _within_operational_bounds(self, coords: Dict[str, float]) -> bool:
        """Check if coordinates are within operational bounds"""
        # Implementation would check against robot's operational limits
        return True
    
    def _is_within_reach(self, obj: Dict[str, Any]) -> bool:
        """Check if object is within robot's reach"""
        # Implementation would check against robot's manipulator reach
        return True
```

## Performance Considerations

### Optimizing Language Processing

For real-time performance, consider these optimizations:

1. **Caching**: Cache frequently used command mappings
2. **Preprocessing**: Preprocess common command patterns
3. **Parallel Processing**: Process multiple aspects of commands in parallel
4. **Efficient Parsing**: Use efficient parsing algorithms

## Chapter Summary

This chapter covered the critical process of translating natural language commands into executable robot actions. We explored semantic parsing, action mapping, handling complex multi-step commands, and integration with ROS 2. In the next chapter, we'll examine object detection and how it integrates with VLA systems.