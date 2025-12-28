# Chapter 3: LLM-Based Task Planning

## Overview

Large Language Models (LLMs) play a crucial role in VLA systems by enabling sophisticated task planning and reasoning. This chapter explores how to leverage LLMs for decomposing high-level human commands into executable robot actions, considering the robot's capabilities and environmental constraints.

## Introduction to LLM-Based Planning

Task planning in humanoid robotics involves translating high-level goals into sequences of low-level actions. LLMs excel at this by understanding natural language commands and generating detailed execution plans that account for:

- Robot kinematic constraints
- Environmental obstacles
- Object affordances
- Safety requirements

## LLM Integration Architecture

### Planning Pipeline

```
[Human Command] → [LLM] → [Task Plan] → [Action Execution] → [Feedback]
                    ↓
            [Robot Capabilities]
                    ↓
            [Environmental Context]
```

### Context Integration

For effective planning, LLMs need contextual information:

```python
import json
from dataclasses import dataclass
from typing import List, Dict, Any

@dataclass
class RobotCapabilities:
    """Describes the capabilities of the humanoid robot"""
    max_velocity: float
    joint_limits: Dict[str, tuple]  # (min, max) for each joint
    manipulator_reach: float
    navigation_speed: float
    sensor_range: float
    grasp_types: List[str]

@dataclass
class EnvironmentalContext:
    """Describes the current environment"""
    objects: List[Dict[str, Any]]  # Objects with position, properties
    obstacles: List[Dict[str, Any]]
    navigable_areas: List[Dict[str, Any]]
    spatial_relations: Dict[str, Any]

class LLMPlanner:
    def __init__(self, llm_client, robot_capabilities: RobotCapabilities):
        self.llm_client = llm_client
        self.robot_capabilities = robot_capabilities
    
    def generate_task_plan(self, command: str, context: EnvironmentalContext) -> List[Dict[str, Any]]:
        """Generate a task plan based on command and context"""
        # Construct the prompt with context
        prompt = self._construct_planning_prompt(command, context)
        
        # Get response from LLM
        response = self.llm_client.generate(prompt)
        
        # Parse the response into a structured plan
        plan = self._parse_plan(response)
        
        return plan
    
    def _construct_planning_prompt(self, command: str, context: EnvironmentalContext) -> str:
        """Construct a prompt for the LLM with all necessary context"""
        prompt = f"""
        You are a task planner for a humanoid robot. Given the following command and environmental context, 
        generate a detailed task plan that the robot can execute.

        Command: {command}

        Robot Capabilities:
        - Max Velocity: {self.robot_capabilities.max_velocity} m/s
        - Joint Limits: {json.dumps(self.robot_capabilities.joint_limits)}
        - Manipulator Reach: {self.robot_capabilities.manipulator_reach} m
        - Navigation Speed: {self.robot_capabilities.navigation_speed} m/s
        - Sensor Range: {self.robot_capabilities.sensor_range} m
        - Grasp Types: {', '.join(self.robot_capabilities.grasp_types)}

        Environmental Context:
        - Objects: {json.dumps(context.objects)}
        - Obstacles: {json.dumps(context.obstacles)}
        - Navigable Areas: {json.dumps(context.navigable_areas)}
        - Spatial Relations: {json.dumps(context.spatial_relations)}

        Generate a step-by-step plan with specific actions the robot should take. 
        Each action should be one of: NAVIGATE_TO, GRASP_OBJECT, PLACE_OBJECT, 
        ROTATE_BODY, MOVE_ARM, SPEAK, WAIT, or CHECK_CONDITION.

        Format the response as a JSON array of action objects with the following structure:
        [
          {{
            "action": "NAVIGATE_TO",
            "parameters": {{
              "x": 1.0,
              "y": 2.0,
              "z": 0.0
            }},
            "description": "Navigate to position (1.0, 2.0, 0.0)"
          }}
        ]

        Ensure the plan is feasible given the robot's capabilities and environmental constraints.
        """
        return prompt
    
    def _parse_plan(self, response: str) -> List[Dict[str, Any]]:
        """Parse the LLM response into a structured plan"""
        try:
            # Extract JSON from response if needed
            start_idx = response.find('[')
            end_idx = response.rfind(']') + 1
            
            if start_idx != -1 and end_idx != 0:
                json_str = response[start_idx:end_idx]
                plan = json.loads(json_str)
                return plan
            else:
                raise ValueError("Could not find JSON array in response")
        except json.JSONDecodeError:
            raise ValueError(f"Could not parse LLM response as JSON: {response}")
```

## Advanced Planning Techniques

### Hierarchical Task Planning

For complex tasks, we can use hierarchical planning:

```python
class HierarchicalPlanner:
    def __init__(self, llm_client):
        self.llm_client = llm_client
    
    def generate_hierarchical_plan(self, high_level_goal: str, context: EnvironmentalContext) -> Dict[str, Any]:
        """Generate a hierarchical plan with high-level and low-level actions"""
        
        # First, decompose the high-level goal into subtasks
        subtasks = self._decompose_goal(high_level_goal, context)
        
        # Then, generate detailed plans for each subtask
        detailed_plan = {}
        for i, subtask in enumerate(subtasks):
            detailed_plan[f"subtask_{i}"] = self._generate_subtask_plan(subtask, context)
        
        return {
            "high_level_goal": high_level_goal,
            "subtasks": subtasks,
            "detailed_plan": detailed_plan
        }
    
    def _decompose_goal(self, goal: str, context: EnvironmentalContext) -> List[str]:
        """Decompose a high-level goal into subtasks"""
        prompt = f"""
        Decompose the following high-level goal into 3-5 specific subtasks that can be executed by a humanoid robot:

        Goal: {goal}

        Environmental Context: {json.dumps([obj['name'] for obj in context.objects])}

        Return the subtasks as a JSON array of strings.
        """
        
        response = self.llm_client.generate(prompt)
        return self._extract_json_array(response)
    
    def _generate_subtask_plan(self, subtask: str, context: EnvironmentalContext) -> List[Dict[str, Any]]:
        """Generate a detailed plan for a specific subtask"""
        # Use the same approach as the basic planner
        basic_planner = LLMPlanner(self.llm_client, self.robot_capabilities)
        return basic_planner.generate_task_plan(subtask, context)
```

### Safety-Aware Planning

Safety is critical in humanoid robotics. We can incorporate safety constraints into planning:

```python
class SafetyAwarePlanner:
    def __init__(self, llm_client, robot_capabilities: RobotCapabilities):
        self.llm_client = llm_client
        self.robot_capabilities = robot_capabilities
        
        # Define safety rules
        self.safety_rules = [
            "Never move faster than the maximum safe velocity",
            "Always maintain balance during locomotion",
            "Avoid collisions with obstacles and humans",
            "Respect joint limits at all times",
            "Stop immediately if a safety violation is detected"
        ]
    
    def generate_safe_plan(self, command: str, context: EnvironmentalContext) -> List[Dict[str, Any]]:
        """Generate a task plan with explicit safety considerations"""
        prompt = f"""
        You are a safety-aware task planner for a humanoid robot. Generate a task plan for the following command,
        ensuring all safety rules are followed.

        Command: {command}

        Safety Rules:
        {chr(10).join(f"- {rule}" for rule in self.safety_rules)}

        Robot Capabilities: {json.dumps(self.robot_capabilities.__dict__)}

        Environmental Context:
        - Objects: {json.dumps(context.objects)}
        - Obstacles: {json.dumps(context.obstacles)}

        Generate a step-by-step plan that explicitly considers safety at each step.
        Include safety checks where appropriate.

        Format as a JSON array of action objects.
        """
        
        response = self.llm_client.generate(prompt)
        return self._parse_plan(response)
```

## Integration with ROS 2

To integrate LLM-based planning with ROS 2:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import Pose
from your_msgs.msg import TaskPlan, TaskAction

class LLMPlanningNode(Node):
    def __init__(self):
        super().__init__('llm_planning_node')
        
        # Publisher for task plans
        self.plan_publisher = self.create_publisher(TaskPlan, 'task_plan', 10)
        
        # Subscriber for commands
        self.command_subscriber = self.create_subscription(
            String,
            'high_level_command',
            self.command_callback,
            10
        )
        
        # Initialize LLM planner
        # Note: This is a simplified example - in practice, you'd use an actual LLM API
        self.planner = LLMPlanner(self._mock_llm_client, self._get_robot_capabilities())
        
    def command_callback(self, msg):
        """Process high-level command and generate plan"""
        command = msg.data
        self.get_logger().info(f"Received command: {command}")
        
        # Get current environmental context
        context = self._get_environmental_context()
        
        # Generate task plan
        try:
            plan = self.planner.generate_task_plan(command, context)
            
            # Publish the plan
            plan_msg = self._create_plan_message(plan)
            self.plan_publisher.publish(plan_msg)
            
            self.get_logger().info(f"Published task plan with {len(plan)} steps")
        except Exception as e:
            self.get_logger().error(f"Error generating plan: {e}")
    
    def _mock_llm_client(self, prompt):
        """Mock LLM client for demonstration purposes"""
        # In a real implementation, this would call an actual LLM API
        # For this example, we'll return a mock response
        if "pick up" in prompt.lower():
            return '''
            [
              {
                "action": "NAVIGATE_TO",
                "parameters": {
                  "x": 1.0,
                  "y": 2.0,
                  "z": 0.0
                },
                "description": "Navigate to object location"
              },
              {
                "action": "GRASP_OBJECT",
                "parameters": {
                  "object_id": "red_cup"
                },
                "description": "Grasp the red cup"
              }
            ]
            '''
        else:
            return '[]'  # Empty plan for other commands
    
    def _get_robot_capabilities(self):
        """Get robot capabilities"""
        capabilities = RobotCapabilities(
            max_velocity=1.0,
            joint_limits={"hip_pitch": (-1.57, 1.57), "knee_pitch": (0, 2.3)},
            manipulator_reach=0.8,
            navigation_speed=0.5,
            sensor_range=3.0,
            grasp_types=["pinch", "power"]
        )
        return capabilities
    
    def _get_environmental_context(self):
        """Get current environmental context"""
        # In a real implementation, this would query perception nodes
        context = EnvironmentalContext(
            objects=[
                {"name": "red_cup", "position": {"x": 1.0, "y": 2.0, "z": 0.8}},
                {"name": "table", "position": {"x": 1.0, "y": 2.0, "z": 0.0}}
            ],
            obstacles=[
                {"name": "wall", "position": {"x": 0.0, "y": 0.0, "z": 0.0}}
            ],
            navigable_areas=[
                {"name": "room_center", "bounds": {"min_x": -5, "max_x": 5, "min_y": -5, "max_y": 5}}
            ],
            spatial_relations={}
        )
        return context
    
    def _create_plan_message(self, plan):
        """Convert plan to ROS 2 message"""
        plan_msg = TaskPlan()
        for action in plan:
            action_msg = TaskAction()
            action_msg.action = action["action"]
            action_msg.description = action["description"]
            
            # Convert parameters to message format
            params_json = json.dumps(action.get("parameters", {}))
            action_msg.parameters = params_json
            
            plan_msg.actions.append(action_msg)
        
        return plan_msg
```

## Performance and Optimization

### Caching and Planning Efficiency

For frequently executed tasks, we can cache plans:

```python
from functools import lru_cache
import hashlib

class CachedLLMPlanner:
    def __init__(self, llm_client, robot_capabilities: RobotCapabilities):
        self.llm_client = llm_client
        self.robot_capabilities = robot_capabilities
        self.plan_cache = {}
    
    @lru_cache(maxsize=128)
    def _get_cached_plan(self, command_hash: str, context_hash: str) -> str:
        """Get a cached plan based on command and context hashes"""
        # This is a simplified caching approach
        # In practice, you'd need more sophisticated cache invalidation
        pass
    
    def generate_task_plan(self, command: str, context: EnvironmentalContext) -> List[Dict[str, Any]]:
        """Generate a task plan with caching"""
        # Create hashes of command and context for caching
        command_hash = hashlib.md5(command.encode()).hexdigest()
        context_hash = hashlib.md5(str(context).encode()).hexdigest()
        
        cache_key = f"{command_hash}:{context_hash}"
        
        # Check if plan is already cached
        if cache_key in self.plan_cache:
            self.get_logger().info("Using cached plan")
            return self.plan_cache[cache_key]
        
        # Generate new plan
        plan = self._generate_new_plan(command, context)
        
        # Cache the plan
        self.plan_cache[cache_key] = plan
        
        return plan
```

## Chapter Summary

This chapter explored how to use Large Language Models for task planning in humanoid robotics. We covered the architecture for integrating LLMs with robot systems, techniques for hierarchical planning, safety considerations, and performance optimizations. In the next chapter, we'll examine how to translate language commands into specific robot actions.