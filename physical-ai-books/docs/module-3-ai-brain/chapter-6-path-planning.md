# Chapter 6: Path Planning for Humanoids

## Overview

Path planning is a critical component for humanoid robots, enabling them to navigate complex environments while considering their unique kinematic and dynamic constraints. This chapter explores path planning techniques specifically tailored for humanoid robots, covering both global and local planning approaches, and how to integrate these with the robot's physical capabilities and balance requirements.

## Introduction to Humanoid Path Planning

Path planning for humanoid robots differs significantly from wheeled robots due to:

- **Bipedal locomotion**: Requires careful consideration of balance and step placement
- **Complex kinematics**: Multiple degrees of freedom and joint constraints
- **Dynamic stability**: Need to maintain balance during movement
- **Foot placement**: Discrete step locations rather than continuous motion
- **Terrain adaptability**: Ability to handle stairs, slopes, and uneven terrain

### Key Challenges

1. **Balance Maintenance**: Ensuring the robot's center of mass remains within the support polygon
2. **Step Planning**: Determining where to place feet for stable locomotion
3. **Kinematic Constraints**: Accounting for joint limits and reachability
4. **Dynamic Stability**: Planning trajectories that maintain stability during motion
5. **Terrain Analysis**: Understanding and navigating complex terrains

## Global Path Planning for Humanoids

### Configuration Space Considerations

For humanoid robots, the configuration space is significantly more complex than for wheeled robots:

```python
import numpy as np
from scipy.spatial import distance
import matplotlib.pyplot as plt

class HumanoidConfigurationSpace:
    def __init__(self, robot_model):
        self.robot_model = robot_model
        self.joint_limits = robot_model.joint_limits
        self.link_lengths = robot_model.link_lengths
        self.mass_properties = robot_model.mass_properties
        
    def is_balanced(self, joint_angles):
        """Check if the robot is balanced for given joint angles"""
        # Calculate center of mass position
        com_pos = self.calculate_com(joint_angles)
        
        # Calculate support polygon based on foot positions
        support_polygon = self.calculate_support_polygon(joint_angles)
        
        # Check if COM is within support polygon
        return self.point_in_polygon(com_pos[:2], support_polygon)
    
    def calculate_com(self, joint_angles):
        """Calculate center of mass for given joint angles"""
        # Simplified calculation - in practice, use forward kinematics
        # and weighted sum of link masses
        total_mass = sum(self.mass_properties.values())
        weighted_sum = np.zeros(3)
        
        # Calculate weighted sum of link centers
        # This is a simplified example
        for link_name, mass in self.mass_properties.items():
            link_pos = self.calculate_link_position(link_name, joint_angles)
            weighted_sum += mass * link_pos
        
        com = weighted_sum / total_mass
        return com
    
    def calculate_support_polygon(self, joint_angles):
        """Calculate support polygon based on foot positions"""
        # Get foot positions using forward kinematics
        left_foot_pos = self.calculate_foot_position('left_foot', joint_angles)
        right_foot_pos = self.calculate_foot_position('right_foot', joint_angles)
        
        # Create support polygon (convex hull of foot positions)
        # For bipedal robot, this is typically the convex hull of both feet
        support_points = [left_foot_pos[:2], right_foot_pos[:2]]
        
        # Add additional support points if in contact with ground
        # (e.g., hands during crawling or climbing)
        
        return support_points
    
    def point_in_polygon(self, point, polygon):
        """Check if a point is inside a polygon using ray casting"""
        x, y = point
        n = len(polygon)
        inside = False
        
        p1x, p1y = polygon[0]
        for i in range(1, n + 1):
            p2x, p2y = polygon[i % n]
            if y > min(p1y, p2y):
                if y <= max(p1y, p2y):
                    if x <= max(p1x, p2x):
                        if p1y != p2y:
                            xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                        if p1x == p2x or x <= xinters:
                            inside = not inside
            p1x, p1y = p2x, p2y
        
        return inside
    
    def calculate_foot_position(self, foot_name, joint_angles):
        """Calculate foot position using forward kinematics"""
        # This would use the robot's kinematic chain
        # Simplified example
        return np.array([0.0, 0.0, 0.0])
    
    def calculate_link_position(self, link_name, joint_angles):
        """Calculate link position using forward kinematics"""
        # This would use the robot's kinematic chain
        # Simplified example
        return np.array([0.0, 0.0, 0.0])

# Example usage
class SimpleHumanoidModel:
    def __init__(self):
        self.joint_limits = {
            'hip_pitch': (-1.57, 1.57),
            'knee_pitch': (0, 2.35),
            'ankle_pitch': (-0.78, 0.78),
            'ankle_roll': (-0.52, 0.52)
        }
        
        self.link_lengths = {
            'thigh': 0.4,
            'shin': 0.4,
            'foot': 0.25
        }
        
        self.mass_properties = {
            'torso': 10.0,
            'head': 2.0,
            'left_thigh': 1.5,
            'left_shin': 1.0,
            'left_foot': 0.5,
            'right_thigh': 1.5,
            'right_shin': 1.0,
            'right_foot': 0.5
        }

humanoid_model = SimpleHumanoidModel()
config_space = HumanoidConfigurationSpace(humanoid_model)
```

### Humanoid-Specific Global Planners

```python
import numpy as np
from scipy.spatial import distance
import heapq
from abc import ABC, abstractmethod

class HumanoidGlobalPlanner(ABC):
    def __init__(self, config_space, map_resolution=0.1):
        self.config_space = config_space
        self.map_resolution = map_resolution
        
    @abstractmethod
    def plan_path(self, start_pos, goal_pos, occupancy_map):
        """Plan a path from start to goal"""
        pass

class FootstepPlanner(HumanoidGlobalPlanner):
    def __init__(self, config_space, map_resolution=0.1):
        super().__init__(config_space, map_resolution)
        self.step_size = 0.3  # Typical humanoid step size
        self.max_step_height = 0.15  # Maximum step height
        self.support_margin = 0.05  # Safety margin for support polygon
        
    def plan_path(self, start_pos, goal_pos, occupancy_map):
        """Plan a path using discrete footsteps"""
        # Convert to grid coordinates
        start_grid = self.world_to_grid(start_pos)
        goal_grid = self.world_to_grid(goal_pos)
        
        # Use A* with footstep constraints
        path = self.footstep_astar(start_grid, goal_grid, occupancy_map)
        
        # Convert back to world coordinates
        world_path = [self.grid_to_world(grid_pos) for grid_pos in path]
        
        return world_path
    
    def footstep_astar(self, start, goal, occupancy_map):
        """A* algorithm adapted for footstep planning"""
        open_set = [(0, start)]
        came_from = {}
        g_score = {start: 0}
        f_score = {start: self.heuristic(start, goal)}
        
        while open_set:
            current = heapq.heappop(open_set)[1]
            
            if current == goal:
                # Reconstruct path
                path = [current]
                while current in came_from:
                    current = came_from[current]
                    path.append(current)
                path.reverse()
                return path
            
            # Generate possible next footsteps
            neighbors = self.get_footstep_neighbors(current, occupancy_map)
            
            for neighbor in neighbors:
                tentative_g_score = g_score[current] + self.step_cost(current, neighbor)
                
                if neighbor not in g_score or tentative_g_score < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score
                    f_score[neighbor] = g_score[neighbor] + self.heuristic(neighbor, goal)
                    
                    # Add to open set if not already there
                    if not any(neighbor == item[1] for item in open_set):
                        heapq.heappush(open_set, (f_score[neighbor], neighbor))
        
        return []  # No path found
    
    def get_footstep_neighbors(self, current, occupancy_map):
        """Get valid neighboring footsteps"""
        neighbors = []
        
        # Generate possible step directions
        step_angles = np.linspace(0, 2*np.pi, 16, endpoint=False)  # 16 directions
        
        for angle in step_angles:
            # Calculate potential step position
            dx = self.step_size * np.cos(angle)
            dy = self.step_size * np.sin(angle)
            
            next_pos = (current[0] + int(dx/self.map_resolution), 
                       current[1] + int(dy/self.map_resolution))
            
            # Check if position is valid
            if self.is_valid_footstep(next_pos, occupancy_map):
                neighbors.append(next_pos)
        
        return neighbors
    
    def is_valid_footstep(self, pos, occupancy_map):
        """Check if a footstep is valid"""
        # Check bounds
        if pos[0] < 0 or pos[0] >= occupancy_map.shape[0] or \
           pos[1] < 0 or pos[1] >= occupancy_map.shape[1]:
            return False
        
        # Check occupancy
        if occupancy_map[pos] > 50:  # Threshold for occupied cells
            return False
        
        # Additional checks could include:
        # - Slope constraints
        # - Step height constraints
        # - Terrain type constraints
        
        return True
    
    def step_cost(self, pos1, pos2):
        """Calculate cost of taking a step from pos1 to pos2"""
        # Euclidean distance cost
        dist = distance.euclidean(pos1, pos2)
        
        # Additional costs could include:
        # - Terrain difficulty
        # - Energy consumption
        # - Balance requirements
        
        return dist * self.map_resolution
    
    def heuristic(self, pos1, pos2):
        """Heuristic function for A*"""
        return distance.euclidean(pos1, pos2) * self.map_resolution
    
    def world_to_grid(self, pos):
        """Convert world coordinates to grid coordinates"""
        return (int(pos[0] / self.map_resolution), 
                int(pos[1] / self.map_resolution))
    
    def grid_to_world(self, grid_pos):
        """Convert grid coordinates to world coordinates"""
        return (grid_pos[0] * self.map_resolution, 
                grid_pos[1] * self.map_resolution)

# Example usage
footstep_planner = FootstepPlanner(config_space)
occupancy_map = np.zeros((100, 100))  # Example occupancy map
path = footstep_planner.plan_path((0, 0), (10, 10), occupancy_map)
print(f"Planned path: {path}")
```

## Local Path Planning and Trajectory Generation

### Model Predictive Control for Humanoid Locomotion

```python
import numpy as np
from scipy.optimize import minimize
import matplotlib.pyplot as plt

class HumanoidMPCController:
    def __init__(self, horizon=10, dt=0.1):
        self.horizon = horizon  # Prediction horizon
        self.dt = dt  # Time step
        self.Q = np.diag([10, 10, 1])  # State cost matrix (x, y, theta)
        self.R = np.diag([1, 0.1])  # Control cost matrix (v, omega)
        
    def setup_prediction_matrices(self, robot_state):
        """Setup matrices for linear prediction model"""
        x, y, theta = robot_state
        v, omega = 0, 0  # Current controls (would come from actual robot)
        
        # Linearized model matrices
        A = np.array([
            [1, 0, -v * np.sin(theta) * self.dt],
            [0, 1, v * np.cos(theta) * self.dt],
            [0, 0, 1]
        ])
        
        B = np.array([
            [np.cos(theta) * self.dt, 0],
            [np.sin(theta) * self.dt, 0],
            [0, self.dt]
        ])
        
        return A, B
    
    def predict_trajectory(self, initial_state, controls_sequence):
        """Predict trajectory given initial state and control sequence"""
        trajectory = [initial_state]
        current_state = initial_state.copy()
        
        for i in range(self.horizon):
            # Apply control
            v, omega = controls_sequence[i*2:(i+1)*2]
            
            # Update state (simplified bicycle model)
            x, y, theta = current_state
            new_theta = theta + omega * self.dt
            new_x = x + v * np.cos(new_theta) * self.dt
            new_y = y + v * np.sin(new_theta) * self.dt
            
            current_state = np.array([new_x, new_y, new_theta])
            trajectory.append(current_state)
        
        return np.array(trajectory)
    
    def compute_cost(self, predicted_trajectory, reference_trajectory, controls_sequence):
        """Compute cost of predicted trajectory vs reference"""
        state_cost = 0
        control_cost = 0
        
        for i in range(len(predicted_trajectory)):
            # State deviation cost
            state_deviation = predicted_trajectory[i] - reference_trajectory[i]
            state_cost += state_deviation.T @ self.Q @ state_deviation
            
            # Control effort cost (for controls that exist)
            if i < len(controls_sequence) // 2:
                control_input = controls_sequence[i*2:(i+1)*2]
                control_cost += control_input.T @ self.R @ control_input
        
        return state_cost + control_cost
    
    def optimize_controls(self, current_state, reference_trajectory):
        """Optimize control sequence to minimize cost"""
        # Initial guess for control sequence
        initial_controls = np.zeros(self.horizon * 2)
        
        # Bounds for controls (v: 0-0.5 m/s, omega: -1 to 1 rad/s)
        bounds = [(-0.5, 0.5)] * self.horizon + [(-1.0, 1.0)] * self.horizon
        
        def objective(controls):
            predicted_traj = self.predict_trajectory(current_state, controls)
            cost = self.compute_cost(predicted_traj, reference_trajectory, controls)
            return cost
        
        # Optimize
        result = minimize(objective, initial_controls, method='SLSQP', bounds=bounds)
        
        if result.success:
            return result.x[:2]  # Return first control pair (v, omega)
        else:
            # Return zero controls if optimization fails
            return np.array([0.0, 0.0])

# Example usage
mpc_controller = HumanoidMPCController()

# Example reference trajectory (would come from global planner)
reference_traj = np.array([[i*0.1, i*0.1, 0.1] for i in range(11)])

# Current robot state [x, y, theta]
current_state = np.array([0.0, 0.0, 0.0])

# Optimize controls
optimal_controls = mpc_controller.optimize_controls(current_state, reference_traj)
print(f"Optimal controls: v={optimal_controls[0]:.3f}, omega={optimal_controls[1]:.3f}")
```

### Trajectory Optimization with Balance Constraints

```python
import numpy as np
from scipy.optimize import minimize
from scipy.interpolate import interp1d

class BalanceAwareTrajectoryOptimizer:
    def __init__(self, robot_mass=50.0, gravity=9.81):
        self.robot_mass = robot_mass
        self.gravity = gravity
        self.com_height = 0.8  # Approximate CoM height for humanoid
        
    def compute_zmp(self, com_trajectory, com_velocity, com_acceleration):
        """Compute Zero Moment Point from CoM trajectory"""
        zmp_x = com_trajectory[:, 0] - (self.com_height / self.gravity) * com_acceleration[:, 0]
        zmp_y = com_trajectory[:, 1] - (self.com_height / self.gravity) * com_acceleration[:, 1]
        
        return np.column_stack((zmp_x, zmp_y))
    
    def is_balance_feasible(self, zmp_trajectory, support_polygon):
        """Check if ZMP trajectory is within support polygon"""
        # This is a simplified check - in practice, you'd use more sophisticated methods
        feasible = True
        
        for zmp in zmp_trajectory:
            if not self.point_in_support_polygon(zmp, support_polygon):
                feasible = False
                break
        
        return feasible
    
    def point_in_support_polygon(self, point, polygon):
        """Check if point is inside support polygon"""
        # Simplified implementation - in practice, use proper polygon inclusion test
        # For now, assuming rectangular support polygon
        min_x, max_x = np.min(polygon[:, 0]), np.max(polygon[:, 0])
        min_y, max_y = np.min(polygon[:, 1]), np.max(polygon[:, 1])
        
        return min_x <= point[0] <= max_x and min_y <= point[1] <= max_y
    
    def optimize_trajectory(self, start_state, goal_state, time_horizon=5.0, num_waypoints=20):
        """Optimize trajectory with balance constraints"""
        # Define time vector
        time_vector = np.linspace(0, time_horizon, num_waypoints)
        
        # Initial guess for trajectory (straight line)
        initial_trajectory = np.array([
            np.linspace(start_state[i], goal_state[i], num_waypoints) 
            for i in range(3)  # x, y, theta
        ]).T
        
        # Flatten for optimization
        initial_guess = initial_trajectory.flatten()
        
        # Define constraints
        constraints = [
            # Start constraint
            {'type': 'eq', 'fun': lambda x: x[:3] - start_state},
            # End constraint
            {'type': 'eq', 'fun': lambda x: x[-3:] - goal_state}
        ]
        
        def objective(trajectory_flat):
            """Minimize trajectory energy and jerk"""
            trajectory = trajectory_flat.reshape(-1, 3)
            
            # Compute velocities and accelerations
            velocities = np.gradient(trajectory, axis=0)
            accelerations = np.gradient(velocities, axis=0)
            
            # Energy cost (simplified)
            energy_cost = np.sum(np.sum(velocities**2, axis=1))
            
            # Jerk cost (smoothness)
            jerks = np.gradient(accelerations, axis=0)
            jerk_cost = np.sum(np.sum(jerks**2, axis=1))
            
            return energy_cost + 0.1 * jerk_cost
        
        def balance_constraint(trajectory_flat):
            """Constraint function for balance feasibility"""
            trajectory = trajectory_flat.reshape(-1, 3)
            
            # Compute CoM trajectory (assuming CoM follows base trajectory)
            com_trajectory = trajectory[:, :2]  # x, y
            velocities = np.gradient(com_trajectory, axis=0)
            accelerations = np.gradient(velocities, axis=0)
            
            # Compute ZMP
            zmp_trajectory = self.compute_zmp(
                np.column_stack((com_trajectory, np.full(len(com_trajectory), self.com_height))),
                np.column_stack((velocities, np.zeros(len(velocities)))),
                np.column_stack((accelerations, np.zeros(len(accelerations))))
            )[:, :2]
            
            # For simplicity, assume fixed support polygon
            # In practice, this would be computed based on footstep plan
            support_polygon = np.array([
                [-0.1, -0.05],  # Left foot corner
                [-0.1, 0.05],   # Left foot corner
                [0.1, 0.05],    # Right foot corner
                [0.1, -0.05]    # Right foot corner
            ])
            
            # Check if ZMP is always within support polygon
            is_feasible = self.is_balance_feasible(zmp_trajectory, support_polygon)
            
            # Return positive value if feasible, negative if not
            return 1.0 if is_feasible else -1.0
        
        # Add balance constraint
        constraints.append({'type': 'ineq', 'fun': balance_constraint})
        
        # Optimize
        result = minimize(
            objective,
            initial_guess,
            method='SLSQP',
            constraints=constraints,
            options={'disp': True, 'maxiter': 1000}
        )
        
        if result.success:
            optimized_trajectory = result.x.reshape(-1, 3)
            return optimized_trajectory
        else:
            print("Optimization failed:", result.message)
            return initial_trajectory

# Example usage
optimizer = BalanceAwareTrajectoryOptimizer()

# Define start and goal states [x, y, theta]
start_state = np.array([0.0, 0.0, 0.0])
goal_state = np.array([2.0, 1.0, 0.5])

# Optimize trajectory
optimized_traj = optimizer.optimize_trajectory(start_state, goal_state)
print(f"Optimized trajectory shape: {optimized_traj.shape}")
```

## Humanoid-Specific Path Planning Algorithms

### Footstep Planning with Terrain Analysis

```python
import numpy as np
from scipy.spatial import distance
import cv2

class TerrainAwareFootstepPlanner:
    def __init__(self, step_size=0.3, max_climb_height=0.15):
        self.step_size = step_size
        self.max_climb_height = max_climb_height
        self.foot_size = 0.25  # Approximate foot size
        
    def analyze_terrain(self, elevation_map, robot_pos):
        """Analyze terrain properties at robot position"""
        x, y = int(robot_pos[0]), int(robot_pos[1])
        
        # Get terrain properties around robot
        neighborhood_size = 5
        x_start = max(0, x - neighborhood_size)
        x_end = min(elevation_map.shape[1], x + neighborhood_size + 1)
        y_start = max(0, y - neighborhood_size)
        y_end = min(elevation_map.shape[0], y + neighborhood_size + 1)
        
        local_elevation = elevation_map[y_start:y_end, x_start:x_end]
        
        # Calculate slope
        grad_x, grad_y = np.gradient(local_elevation)
        slope = np.sqrt(grad_x**2 + grad_y**2)
        
        # Calculate roughness (local variance)
        roughness = np.std(local_elevation)
        
        return {
            'slope': np.mean(slope),
            'roughness': roughness,
            'elevation': elevation_map[y, x],
            'traversable': self.is_traversable(local_elevation, slope)
        }
    
    def is_traversable(self, elevation_patch, slope_patch):
        """Check if terrain patch is traversable"""
        # Check slope threshold
        if np.max(slope_patch) > 0.5:  # 26.5 degrees
            return False
        
        # Check height variation
        height_variation = np.max(elevation_patch) - np.min(elevation_patch)
        if height_variation > self.max_climb_height:
            return False
        
        # Check for obstacles
        # (This would involve more complex analysis in practice)
        
        return True
    
    def plan_footsteps(self, start_pos, goal_pos, elevation_map, occupancy_map):
        """Plan footsteps considering terrain properties"""
        # Convert positions to grid coordinates
        start_grid = (int(start_pos[1]), int(start_pos[0]))  # (row, col)
        goal_grid = (int(goal_pos[1]), int(goal_pos[0]))
        
        # Use A* with terrain-aware cost
        path = self.terrain_aware_astar(start_grid, goal_grid, elevation_map, occupancy_map)
        
        # Convert footsteps to world coordinates
        footsteps = []
        for grid_pos in path:
            world_pos = (grid_pos[1], grid_pos[0])  # (x, y)
            terrain_info = self.analyze_terrain(elevation_map, world_pos)
            footsteps.append({
                'position': world_pos,
                'terrain_info': terrain_info
            })
        
        return footsteps
    
    def terrain_aware_astar(self, start, goal, elevation_map, occupancy_map):
        """A* with terrain-aware cost function"""
        open_set = [(0, start)]
        came_from = {}
        g_score = {start: 0}
        f_score = {start: self.terrain_heuristic(start, goal)}
        
        while open_set:
            current = heapq.heappop(open_set)[1]
            
            if current == goal:
                # Reconstruct path
                path = [current]
                while current in came_from:
                    current = came_from[current]
                    path.append(current)
                path.reverse()
                return path
            
            # Get valid neighbors
            neighbors = self.get_terrain_valid_neighbors(current, elevation_map, occupancy_map)
            
            for neighbor in neighbors:
                # Calculate terrain-aware cost
                step_cost = self.terrain_step_cost(current, neighbor, elevation_map)
                tentative_g_score = g_score[current] + step_cost
                
                if neighbor not in g_score or tentative_g_score < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score
                    f_score[neighbor] = g_score[neighbor] + self.terrain_heuristic(neighbor, goal)
                    
                    if not any(neighbor == item[1] for item in open_set):
                        heapq.heappush(open_set, (f_score[neighbor], neighbor))
        
        return []  # No path found
    
    def get_terrain_valid_neighbors(self, current, elevation_map, occupancy_map):
        """Get neighbors that are terrain-valid"""
        neighbors = []
        directions = [
            (-1, -1), (-1, 0), (-1, 1),
            (0, -1),           (0, 1),
            (1, -1),  (1, 0),  (1, 1)
        ]
        
        for dr, dc in directions:
            nr, nc = current[0] + dr, current[1] + dc
            
            # Check bounds
            if 0 <= nr < elevation_map.shape[0] and 0 <= nc < elevation_map.shape[1]:
                # Check occupancy
                if occupancy_map[nr, nc] < 50:  # Not occupied
                    # Check terrain traversability
                    terrain_valid = self.is_terrain_valid_step(current, (nr, nc), elevation_map)
                    if terrain_valid:
                        neighbors.append((nr, nc))
        
        return neighbors
    
    def is_terrain_valid_step(self, from_pos, to_pos, elevation_map):
        """Check if step from from_pos to to_pos is terrain-valid"""
        # Check elevation difference
        elev_diff = abs(elevation_map[to_pos] - elevation_map[from_pos])
        if elev_diff > self.max_climb_height:
            return False
        
        # Check slope between positions
        dx = to_pos[1] - from_pos[1]
        dy = to_pos[0] - from_pos[0]
        dist = np.sqrt(dx**2 + dy**2)
        
        if dist > 0:
            slope = elev_diff / dist
            if slope > 0.5:  # Max slope 26.5 degrees
                return False
        
        return True
    
    def terrain_step_cost(self, pos1, pos2, elevation_map):
        """Calculate cost of step considering terrain properties"""
        # Base distance cost
        dist = distance.euclidean(pos1, pos2)
        
        # Elevation cost (going uphill is more costly)
        elev_diff = elevation_map[pos2] - elevation_map[pos1]
        if elev_diff > 0:
            elev_cost = elev_diff * 2.0  # Uphill penalty
        else:
            elev_cost = abs(elev_diff) * 0.5  # Downhill bonus
        
        # Slope cost
        dx = pos2[1] - pos1[1]
        dy = pos2[0] - pos1[0]
        if dx != 0 or dy != 0:
            slope = abs(elev_diff) / np.sqrt(dx**2 + dy**2)
            slope_cost = slope * 1.0
        else:
            slope_cost = 0
        
        return dist + elev_cost + slope_cost
    
    def terrain_heuristic(self, pos1, pos2):
        """Heuristic function considering terrain"""
        base_dist = distance.euclidean(pos1, pos2)
        return base_dist * 1.1  # Slightly inflated to account for terrain difficulty

# Example usage
terrain_planner = TerrainAwareFootstepPlanner()

# Example maps (in practice, these would come from perception system)
elevation_map = np.random.rand(100, 100) * 0.5  # Random elevation map
occupancy_map = np.zeros((100, 100))  # Free space

# Plan footsteps
footsteps = terrain_planner.plan_footsteps((10, 10), (90, 90), elevation_map, occupancy_map)
print(f"Planned {len(footsteps)} footsteps")
```

## Integration with Navigation Stack

### Path Planner Integration Node

```python
import rclpy
from rclpy.node import Node
from rclpy.action import ActionServer, GoalResponse, CancelResponse
from rclpy.callback_groups import ReentrantCallbackGroup
from geometry_msgs.msg import PoseStamped, PoseWithCovarianceStamped
from nav_msgs.msg import Path, OccupancyGrid
from sensor_msgs.msg import PointCloud2
from std_msgs.msg import String
from builtin_interfaces.msg import Duration
import tf2_ros
from tf2_ros import TransformException
import numpy as np
from threading import Lock

class HumanoidPathPlannerNode(Node):
    def __init__(self):
        super().__init__('humanoid_path_planner_node')
        
        # Create action server for path planning
        self.plan_server = ActionServer(
            self,
            PlanPathToPose,  # This would be a custom action
            'plan_path_to_pose',
            self.plan_path_callback,
            callback_group=ReentrantCallbackGroup(),
            result_timeout=Duration(sec=30)
        )
        
        # Create TF buffer and listener
        self.tf_buffer = tf2_ros.Buffer()
        self.tf_listener = tf2_ros.TransformListener(self.tf_buffer, self)
        
        # Subscriptions
        self.map_sub = self.create_subscription(
            OccupancyGrid,
            '/map',
            self.map_callback,
            1
        )
        
        self.elevation_sub = self.create_subscription(
            PointCloud2,
            '/elevation_map',
            self.elevation_callback,
            10
        )
        
        self.initial_pose_sub = self.create_subscription(
            PoseWithCovarianceStamped,
            '/initialpose',
            self.initial_pose_callback,
            10
        )
        
        # Publishers
        self.path_pub = self.create_publisher(Path, '/humanoid_planned_path', 10)
        self.status_pub = self.create_publisher(String, '/path_planner_status', 10)
        
        # Internal state
        self.current_map = None
        self.elevation_map = None
        self.initial_pose = None
        self.path_lock = Lock()
        
        # Initialize planners
        self.footstep_planner = FootstepPlanner(config_space)
        self.terrain_planner = TerrainAwareFootstepPlanner()
        self.mpc_controller = HumanoidMPCController()
        
        self.get_logger().info('Humanoid Path Planner Node initialized')

    def map_callback(self, msg):
        """Handle occupancy grid map"""
        self.get_logger().info(f'Received map: {msg.info.width}x{msg.info.height}')
        
        # Convert OccupancyGrid to numpy array
        map_data = np.array(msg.data).reshape(msg.info.height, msg.info.width)
        self.current_map = map_data
        
        # Store map metadata
        self.map_origin = (msg.info.origin.position.x, msg.info.origin.position.y)
        self.map_resolution = msg.info.resolution

    def elevation_callback(self, msg):
        """Handle elevation map data"""
        # Convert PointCloud2 to elevation map
        # This is a simplified implementation
        self.elevation_map = self.convert_pointcloud_to_elevation(msg)
        
        self.get_logger().info('Received elevation map')

    def initial_pose_callback(self, msg):
        """Handle initial pose"""
        self.initial_pose = msg.pose.pose
        self.get_logger().info('Received initial pose')

    def convert_pointcloud_to_elevation(self, pc_msg):
        """Convert PointCloud2 message to elevation map"""
        # This would involve complex point cloud processing
        # Simplified implementation
        return np.zeros((100, 100))  # Placeholder

    def plan_path_callback(self, goal_handle):
        """Handle path planning request"""
        self.get_logger().info('Received path planning request')
        
        # Check if we have necessary data
        if self.current_map is None:
            self.get_logger().error('No map available for path planning')
            goal_handle.abort()
            return PlanPathToPose.Result()  # Return appropriate result type
        
        # Get start and goal poses
        start_pose = goal_handle.request.start
        goal_pose = goal_handle.request.goal
        
        # If start pose is not provided, use current robot pose
        if start_pose.header.frame_id == '':
            try:
                transform = self.tf_buffer.lookup_transform(
                    'map', 'base_link', rclpy.time.Time()
                )
                # Convert transform to pose
                start_pose.pose.position.x = transform.transform.translation.x
                start_pose.pose.position.y = transform.transform.translation.y
                start_pose.pose.position.z = transform.transform.translation.z
                start_pose.pose.orientation = transform.transform.rotation
            except TransformException:
                self.get_logger().error('Could not get current robot pose')
                goal_handle.abort()
                return PlanPathToPose.Result()
        
        # Plan path using appropriate planner based on terrain
        if self.elevation_map is not None:
            # Use terrain-aware planner
            path = self.plan_terrain_aware_path(start_pose, goal_pose)
        else:
            # Use standard footstep planner
            path = self.plan_footstep_path(start_pose, goal_pose)
        
        if len(path) > 0:
            # Publish planned path
            self.publish_path(path)
            
            # Create result
            result = PlanPathToPose.Result()  # Use appropriate result type
            result.path.poses = path
            result.path.header.frame_id = 'map'
            result.path.header.stamp = self.get_clock().now().to_msg()
            
            goal_handle.succeed()
            self.get_logger().info('Path planning succeeded')
        else:
            # No path found
            result = PlanPathToPose.Result()  # Use appropriate result type
            goal_handle.abort()
            self.get_logger().info('Path planning failed - no path found')
        
        return result

    def plan_terrain_aware_path(self, start_pose, goal_pose):
        """Plan path using terrain-aware algorithm"""
        # Extract positions
        start_pos = (start_pose.pose.position.x, start_pose.pose.position.y)
        goal_pos = (goal_pose.pose.position.x, goal_pose.pose.position.y)
        
        # Convert to grid coordinates
        start_grid = self.world_to_grid(start_pos)
        goal_grid = self.world_to_grid(goal_pos)
        
        # Plan using terrain-aware planner
        footsteps = self.terrain_planner.plan_footsteps(
            start_grid, goal_grid, self.elevation_map, self.current_map
        )
        
        # Convert to Path message format
        path_poses = []
        for step in footsteps:
            pose_stamped = PoseStamped()
            pose_stamped.header.frame_id = 'map'
            pose_stamped.pose.position.x = step['position'][0]
            pose_stamped.pose.position.y = step['position'][1]
            pose_stamped.pose.position.z = step['terrain_info']['elevation']
            
            # Set orientation (simplified)
            pose_stamped.pose.orientation.w = 1.0
            
            path_poses.append(pose_stamped)
        
        return path_poses

    def plan_footstep_path(self, start_pose, goal_pose):
        """Plan path using standard footstep planner"""
        # Extract positions
        start_pos = (start_pose.pose.position.x, start_pose.pose.position.y)
        goal_pos = (goal_pose.pose.position.x, goal_pose.pose.position.y)
        
        # Plan path
        path = self.footstep_planner.plan_path(
            start_pos, goal_pos, self.current_map
        )
        
        # Convert to Path message format
        path_poses = []
        for point in path:
            pose_stamped = PoseStamped()
            pose_stamped.header.frame_id = 'map'
            pose_stamped.pose.position.x = point[0]
            pose_stamped.pose.position.y = point[1]
            pose_stamped.pose.position.z = 0.0  # Assume flat terrain
            
            # Set orientation (simplified)
            pose_stamped.pose.orientation.w = 1.0
            
            path_poses.append(pose_stamped)
        
        return path_poses

    def world_to_grid(self, world_pos):
        """Convert world coordinates to grid coordinates"""
        if self.map_origin and self.map_resolution:
            grid_x = int((world_pos[0] - self.map_origin[0]) / self.map_resolution)
            grid_y = int((world_pos[1] - self.map_origin[1]) / self.map_resolution)
            return (grid_x, grid_y)
        else:
            return (int(world_pos[0] / 0.1), int(world_pos[1] / 0.1))  # Default resolution

    def publish_path(self, path):
        """Publish planned path"""
        path_msg = Path()
        path_msg.header.frame_id = 'map'
        path_msg.header.stamp = self.get_clock().now().to_msg()
        path_msg.poses = path
        
        self.path_pub.publish(path_msg)

def main(args=None):
    rclpy.init(args=args)
    planner_node = HumanoidPathPlannerNode()
    
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

## Performance Optimization and Real-Time Considerations

### Efficient Path Planning Techniques

```python
import numpy as np
from numba import jit, cuda
import heapq

class EfficientPathPlanner:
    def __init__(self, map_size=(100, 100)):
        self.map_size = map_size
        self.visited = np.zeros(map_size, dtype=bool)
        self.costs = np.full(map_size, np.inf)
        
    @staticmethod
    @jit(nopython=True)
    def fast_astar(start, goal, occupancy_map, costs, visited):
        """Fast A* implementation using Numba JIT compilation"""
        rows, cols = occupancy_map.shape
        open_set = [(0, start[0], start[1])]
        
        # Directions: up, right, down, left, and diagonals
        directions = np.array([
            [-1, 0], [0, 1], [1, 0], [0, -1],  # Cardinal
            [-1, -1], [-1, 1], [1, 1], [1, -1]  # Diagonal
        ])
        
        # Cost factors
        cardinal_cost = 1.0
        diagonal_cost = 1.414  # sqrt(2)
        
        costs[start[0], start[1]] = 0
        
        while len(open_set) > 0:
            # Pop node with lowest f-score
            f_score, x, y = heapq.heappop(open_set)
            
            if x == goal[0] and y == goal[1]:
                break  # Found goal
            
            if visited[x, y]:
                continue
            
            visited[x, y] = True
            
            # Explore neighbors
            for i in range(len(directions)):
                nx, ny = x + directions[i, 0], y + directions[i, 1]
                
                # Check bounds
                if nx < 0 or nx >= rows or ny < 0 or ny >= cols:
                    continue
                
                # Check if occupied
                if occupancy_map[nx, ny] > 50:  # Occupied threshold
                    continue
                
                # Check if already visited
                if visited[nx, ny]:
                    continue
                
                # Calculate movement cost
                if i < 4:  # Cardinal directions
                    move_cost = cardinal_cost * (1 + occupancy_map[nx, ny] / 100.0)
                else:  # Diagonal directions
                    move_cost = diagonal_cost * (1 + occupancy_map[nx, ny] / 100.0)
                
                tentative_g_score = costs[x, y] + move_cost
                
                if tentative_g_score < costs[nx, ny]:
                    costs[nx, ny] = tentative_g_score
                    h_score = abs(nx - goal[0]) + abs(ny - goal[1])  # Manhattan distance
                    f_score = tentative_g_score + h_score
                    heapq.heappush(open_set, (f_score, nx, ny))
        
        return costs, visited

    def plan_path_fast(self, start, goal, occupancy_map):
        """Plan path using optimized algorithm"""
        # Reset arrays
        self.visited.fill(False)
        self.costs.fill(np.inf)
        
        # Run optimized A*
        costs, visited = self.fast_astar(
            start, goal, occupancy_map, self.costs, self.visited
        )
        
        # Reconstruct path
        path = self.reconstruct_path(start, goal, costs)
        return path

    def reconstruct_path(self, start, goal, costs):
        """Reconstruct path from cost map"""
        path = [goal]
        current = goal
        
        # Possible movement directions
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1), 
                      (-1, -1), (-1, 1), (1, -1), (1, 1)]
        
        while current != start:
            min_cost = float('inf')
            next_pos = None
            
            for dx, dy in directions:
                nx, ny = current[0] + dx, current[1] + dy
                
                # Check bounds
                if 0 <= nx < costs.shape[0] and 0 <= ny < costs.shape[1]:
                    if costs[nx, ny] < min_cost:
                        min_cost = costs[nx, ny]
                        next_pos = (nx, ny)
            
            if next_pos is None or min_cost == float('inf'):
                # No path found
                return []
            
            current = next_pos
            path.append(current)
        
        path.reverse()
        return path

# Example usage
fast_planner = EfficientPathPlanner()
occupancy_map = np.random.randint(0, 100, (100, 100))  # Random occupancy map
path = fast_planner.plan_path_fast((0, 0), (99, 99), occupancy_map)
print(f"Planned path with {len(path)} waypoints")
```

## Best Practices for Humanoid Path Planning

### 1. Multi-Layer Planning Approach
- **Global Path Planning**: High-level route planning
- **Local Path Planning**: Obstacle avoidance and refinement
- **Step Planning**: Individual footstep generation
- **Trajectory Optimization**: Smooth trajectory generation

### 2. Safety Considerations
- Maintain adequate safety margins
- Consider robot's dynamic capabilities
- Account for sensor uncertainties
- Implement fallback behaviors

### 3. Performance Optimization
- Use appropriate data structures (e.g., priority queues)
- Implement hierarchical planning
- Cache frequently computed values
- Use approximate algorithms when exact solutions aren't needed

### 4. Validation and Testing
- Test on various terrain types
- Validate balance constraints
- Verify kinematic feasibility
- Test recovery from failures

## Troubleshooting Common Issues

### 1. Planning Failures
- Check map quality and resolution
- Verify robot footprint configuration
- Validate kinematic constraints
- Ensure proper localization

### 2. Balance Problems
- Verify CoM calculations
- Check ZMP constraints
- Validate step timing
- Ensure proper control parameters

### 3. Performance Issues
- Profile algorithm complexity
- Optimize data structures
- Consider parallel processing
- Adjust planning frequency

## Summary

In this chapter, we've explored path planning techniques specifically designed for humanoid robots. We've covered global and local planning approaches, trajectory optimization with balance constraints, and terrain-aware footstep planning. Humanoid path planning requires special consideration of balance, kinematic constraints, and dynamic stability. The integration of these planning techniques with the navigation stack enables humanoid robots to navigate complex environments safely and efficiently. With this foundation in path planning, humanoid robots can effectively move through their environments while maintaining stability and achieving their navigation goals.