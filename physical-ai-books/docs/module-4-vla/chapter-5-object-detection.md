# Chapter 5: Object Detection and Recognition

## Overview

Object detection and recognition form the visual perception foundation of VLA systems, enabling humanoid robots to identify and understand objects in their environment. This chapter explores state-of-the-art object detection techniques and their integration with VLA systems for humanoid robotics.

## Introduction to Object Detection in Robotics

Object detection in robotics involves identifying and localizing objects within the robot's visual field. For humanoid robots, this capability is essential for:
- Manipulation tasks (identifying graspable objects)
- Navigation (detecting obstacles and passable areas)
- Human-robot interaction (recognizing gestures and expressions)
- Environmental understanding (mapping objects to semantic locations)

## Object Detection Architectures

### Two-Stage Detectors

Two-stage detectors first generate region proposals and then classify objects within those regions:

```python
import torch
import torchvision
from torchvision.models.detection import fasterrcnn_resnet50_fpn
from torchvision.transforms import functional as F
import cv2
import numpy as np

class TwoStageObjectDetector:
    def __init__(self, confidence_threshold=0.5):
        # Load pre-trained Faster R-CNN model
        self.model = fasterrcnn_resnet50_fpn(pretrained=True)
        self.model.eval()
        self.confidence_threshold = confidence_threshold
        
        # COCO dataset class names
        self.coco_names = [
            '__background__', 'person', 'bicycle', 'car', 'motorcycle', 'airplane', 
            'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 
            'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 
            'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 
            'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 
            'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 
            'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 
            'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 
            'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 
            'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 
            'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 
            'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 
            'teddy bear', 'hair drier', 'toothbrush'
        ]
    
    def detect_objects(self, image):
        """Detect objects in an image"""
        # Convert image to tensor
        image_tensor = F.to_tensor(image).unsqueeze(0)
        
        with torch.no_grad():
            predictions = self.model(image_tensor)
        
        # Filter predictions by confidence
        pred = predictions[0]
        keep_indices = pred['scores'] > self.confidence_threshold
        
        filtered_boxes = pred['boxes'][keep_indices].numpy()
        filtered_labels = pred['labels'][keep_indices].numpy()
        filtered_scores = pred['scores'][keep_indices].numpy()
        
        # Format results
        detections = []
        for box, label, score in zip(filtered_boxes, filtered_labels, filtered_scores):
            detections.append({
                'bbox': box.tolist(),  # [x1, y1, x2, y2]
                'label': self.coco_names[label],
                'confidence': float(score),
                'class_id': int(label)
            })
        
        return detections
```

### Single-Stage Detectors

Single-stage detectors are faster and more suitable for real-time applications:

```python
from torchvision.models.detection import ssd300_vgg16

class SingleStageObjectDetector:
    def __init__(self, confidence_threshold=0.5):
        # Load pre-trained SSD model
        self.model = ssd300_vgg16(pretrained=True)
        self.model.eval()
        self.confidence_threshold = confidence_threshold
        self.coco_names = [
            '__background__', 'person', 'bicycle', 'car', 'motorcycle', 'airplane', 
            'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 
            'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 
            'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 
            'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 
            'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 
            'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 
            'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 
            'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 
            'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 
            'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 
            'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 
            'teddy bear', 'hair drier', 'toothbrush'
        ]
    
    def detect_objects(self, image):
        """Detect objects in an image using SSD"""
        # Convert image to tensor
        image_tensor = F.to_tensor(image).unsqueeze(0)
        
        with torch.no_grad():
            predictions = self.model(image_tensor)
        
        # Process predictions
        pred = predictions[0]
        keep_indices = pred['scores'] > self.confidence_threshold
        
        filtered_boxes = pred['boxes'][keep_indices].numpy()
        filtered_labels = pred['labels'][keep_indices].numpy()
        filtered_scores = pred['scores'][keep_indices].numpy()
        
        detections = []
        for box, label, score in zip(filtered_boxes, filtered_labels, filtered_scores):
            detections.append({
                'bbox': box.tolist(),
                'label': self.coco_names[label],
                'confidence': float(score),
                'class_id': int(label)
            })
        
        return detections
```

## Custom Object Detection for Robotics

For robotics applications, we often need to detect custom objects not present in general datasets:

```python
import torch
import torch.nn as nn
import torchvision
from torchvision.models.detection import fasterrcnn_resnet50_fpn
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor

class CustomObjectDetector:
    def __init__(self, num_classes, confidence_threshold=0.5):
        # Load a model pre-trained on COCO
        self.model = fasterrcnn_resnet50_fpn(pretrained=True)
        
        # Replace the classifier with a new one for custom classes
        in_features = self.model.roi_heads.box_predictor.cls_score.in_features
        self.model.roi_heads.box_predictor = FastRCNNPredictor(in_features, num_classes)
        
        self.confidence_threshold = confidence_threshold
        self.device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
        self.model.to(self.device)
    
    def train(self, data_loader, num_epochs=10):
        """Train the custom object detector"""
        self.model.train()
        
        # Define optimizer
        params = [p for p in self.model.parameters() if p.requires_grad]
        optimizer = torch.optim.SGD(params, lr=0.005, momentum=0.9, weight_decay=0.0005)
        
        # Learning rate scheduler
        lr_scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=3, gamma=0.1)
        
        for epoch in range(num_epochs):
            for images, targets in data_loader:
                images = [image.to(self.device) for image in images]
                targets = [{k: v.to(self.device) for k, v in t.items()} for t in targets]
                
                loss_dict = self.model(images, targets)
                losses = sum(loss for loss in loss_dict.values())
                
                optimizer.zero_grad()
                losses.backward()
                optimizer.step()
            
            if epoch % 5 == 0:
                print(f"Epoch {epoch}, Loss: {losses.item()}")
            
            lr_scheduler.step()
    
    def detect_objects(self, image):
        """Detect custom objects in an image"""
        self.model.eval()
        
        # Convert image to tensor and move to device
        image_tensor = F.to_tensor(image).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            predictions = self.model(image_tensor)
        
        # Process predictions
        pred = predictions[0]
        keep_indices = pred['scores'] > self.confidence_threshold
        
        filtered_boxes = pred['boxes'][keep_indices].cpu().numpy()
        filtered_labels = pred['labels'][keep_indices].cpu().numpy()
        filtered_scores = pred['scores'][keep_indices].cpu().numpy()
        
        detections = []
        for box, label, score in zip(filtered_boxes, filtered_labels, filtered_scores):
            detections.append({
                'bbox': box.tolist(),
                'label': f"object_{label}",  # Custom label mapping would go here
                'confidence': float(score),
                'class_id': int(label)
            })
        
        return detections
```

## 3D Object Detection

For humanoid robots, 3D object detection is crucial for manipulation tasks:

```python
import open3d as o3d
import numpy as np

class ThreeDObjectDetector:
    def __init__(self):
        # For 3D detection, we'll use geometric and deep learning approaches
        pass
    
    def detect_3d_objects(self, point_cloud):
        """Detect objects in 3D point cloud data"""
        # Convert to Open3D point cloud if needed
        if not isinstance(point_cloud, o3d.geometry.PointCloud):
            pcd = o3d.geometry.PointCloud()
            pcd.points = o3d.utility.Vector3dVector(point_cloud)
        else:
            pcd = point_cloud
        
        # Apply voxel downsampling for performance
        downsampled_pcd = pcd.voxel_down_sample(voxel_size=0.01)
        
        # Segment plane (e.g., ground plane)
        plane_model, inliers = downsampled_pcd.segment_plane(
            distance_threshold=0.01,
            ransac_n=3,
            num_iterations=1000
        )
        
        # Extract objects by removing the ground plane
        object_cloud = downsampled_pcd.select_by_index(inliers, invert=True)
        
        # Cluster objects using DBSCAN
        with o3d.utility.VerbosityContextManager(o3d.utility.VerbosityLevel.Debug) as cm:
            labels = np.array(object_cloud.cluster_dbscan(eps=0.02, min_points=10, print_progress=False))
        
        # Process each cluster as a potential object
        objects = []
        max_label = labels.max()
        
        for i in range(max_label + 1):
            idx = np.where(labels == i)[0]
            if len(idx) > 100:  # Only consider clusters with sufficient points
                cluster_pcd = object_cloud.select_by_index(idx)
                
                # Compute bounding box
                bbox = cluster_pcd.get_axis_aligned_bounding_box()
                
                objects.append({
                    'bbox_3d': [bbox.min_bound, bbox.max_bound],
                    'center': np.array(bbox.get_center()),
                    'points': np.asarray(cluster_pcd.points),
                    'cluster_id': i
                })
        
        return objects
```

## Integration with ROS 2

### Object Detection ROS 2 Node

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from vision_msgs.msg import Detection2DArray, Detection2D, ObjectHypothesisWithPose
from cv_bridge import CvBridge
import cv2
import torch

class ObjectDetectionNode(Node):
    def __init__(self):
        super().__init__('object_detection_node')
        
        # Initialize CV bridge
        self.bridge = CvBridge()
        
        # Initialize object detector
        self.detector = TwoStageObjectDetector(confidence_threshold=0.7)
        
        # Create subscriber for camera images
        self.image_subscriber = self.create_subscription(
            Image,
            '/camera/rgb/image_raw',
            self.image_callback,
            10
        )
        
        # Create publisher for detections
        self.detection_publisher = self.create_publisher(
            Detection2DArray,
            '/object_detections',
            10
        )
        
        self.get_logger().info("Object Detection Node initialized")
    
    def image_callback(self, msg):
        """Process incoming image and detect objects"""
        try:
            # Convert ROS image message to OpenCV image
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')
            
            # Detect objects
            detections = self.detector.detect_objects(cv_image)
            
            # Convert to ROS message
            detection_array_msg = self._create_detection_array_msg(detections, msg.header)
            
            # Publish detections
            self.detection_publisher.publish(detection_array_msg)
            
            self.get_logger().info(f"Published {len(detections)} detections")
            
        except Exception as e:
            self.get_logger().error(f"Error in image callback: {e}")
    
    def _create_detection_array_msg(self, detections, header):
        """Convert detections to ROS message"""
        detection_array_msg = Detection2DArray()
        detection_array_msg.header = header
        
        for detection in detections:
            detection_msg = Detection2D()
            detection_msg.header = header
            
            # Set bounding box
            x1, y1, x2, y2 = detection['bbox']
            detection_msg.bbox.center.x = (x1 + x2) / 2.0
            detection_msg.bbox.center.y = (y1 + y2) / 2.0
            detection_msg.bbox.size_x = abs(x2 - x1)
            detection_msg.bbox.size_y = abs(y2 - y1)
            
            # Set hypothesis
            hypothesis = ObjectHypothesisWithPose()
            hypothesis.hypothesis.class_id = detection['label']
            hypothesis.hypothesis.score = detection['confidence']
            
            detection_msg.results.append(hypothesis)
            detection_array_msg.detections.append(detection_msg)
        
        return detection_array_msg
```

## Object Tracking

For continuous interaction, we need to track objects over time:

```python
import cv2
import numpy as np
from collections import defaultdict

class ObjectTracker:
    def __init__(self):
        self.trackers = {}  # Dictionary to store trackers for each object ID
        self.next_id = 0
        self.lost_threshold = 5  # Number of frames before considering object lost
        self.lost_count = defaultdict(int)
    
    def update(self, detections, image):
        """Update object tracking with new detections"""
        active_trackers = {}
        
        # Update existing trackers
        for obj_id, tracker in self.trackers.items():
            success, bbox = tracker.update(image)
            
            if success:
                # Update the tracked object's position
                active_trackers[obj_id] = tracker
                self.lost_count[obj_id] = 0  # Reset lost count
                
                # Update the detection with tracked position
                for detection in detections:
                    # Check if detection is close to tracked position
                    det_center = ((detection['bbox'][0] + detection['bbox'][2]) / 2,
                                  (detection['bbox'][1] + detection['bbox'][3]) / 2)
                    track_center = (bbox[0] + bbox[2] / 2, bbox[1] + bbox[3] / 2)
                    
                    distance = np.sqrt((det_center[0] - track_center[0])**2 + 
                                      (det_center[1] - track_center[1])**2)
                    
                    if distance < 50:  # Threshold for matching
                        detection['tracked_id'] = obj_id
                        detection['bbox'] = list(bbox)
                        break
            else:
                # Tracker failed, increment lost count
                self.lost_count[obj_id] += 1
        
        # Remove lost trackers
        for obj_id in list(self.trackers.keys()):
            if self.lost_count[obj_id] >= self.lost_threshold:
                del self.trackers[obj_id]
                del self.lost_count[obj_id]
        
        # Initialize new trackers for untracked detections
        for detection in detections:
            if 'tracked_id' not in detection:
                # Create new tracker for this detection
                tracker = cv2.legacy.TrackerKCF_create()  # Using KCF tracker
                bbox = tuple(map(int, detection['bbox']))
                tracker.init(image, bbox)
                
                self.trackers[self.next_id] = tracker
                detection['tracked_id'] = self.next_id
                self.next_id += 1
        
        return detections
```

## Performance Optimization

### Multi-Scale Detection

To improve detection accuracy across different object sizes:

```python
class MultiScaleDetector:
    def __init__(self, base_detector):
        self.base_detector = base_detector
        self.scales = [0.5, 1.0, 1.5, 2.0]  # Different scales to try
    
    def detect_objects_multiscale(self, image):
        """Detect objects at multiple scales and combine results"""
        all_detections = []
        
        for scale in self.scales:
            # Resize image
            new_width = int(image.shape[1] * scale)
            new_height = int(image.shape[0] * scale)
            resized_image = cv2.resize(image, (new_width, new_height))
            
            # Detect objects in resized image
            detections = self.base_detector.detect_objects(resized_image)
            
            # Adjust bounding boxes to original image scale
            for detection in detections:
                bbox = detection['bbox']
                # Scale back to original image coordinates
                detection['bbox'] = [
                    bbox[0] / scale,
                    bbox[1] / scale,
                    bbox[2] / scale,
                    bbox[3] / scale
                ]
                # Add scale information
                detection['scale'] = scale
            
            all_detections.extend(detections)
        
        # Apply non-maximum suppression to remove duplicate detections
        final_detections = self._non_max_suppression(all_detections)
        
        return final_detections
    
    def _non_max_suppression(self, detections, iou_threshold=0.5):
        """Apply non-maximum suppression to remove duplicate detections"""
        if len(detections) == 0:
            return []
        
        # Sort by confidence
        detections = sorted(detections, key=lambda x: x['confidence'], reverse=True)
        
        keep = []
        while detections:
            # Take the detection with highest confidence
            current = detections.pop(0)
            keep.append(current)
            
            # Remove overlapping detections
            detections = [
                d for d in detections
                if self._calculate_iou(current['bbox'], d['bbox']) < iou_threshold
            ]
        
        return keep
    
    def _calculate_iou(self, bbox1, bbox2):
        """Calculate Intersection over Union between two bounding boxes"""
        x1_1, y1_1, x2_1, y2_1 = bbox1
        x1_2, y1_2, x2_2, y2_2 = bbox2
        
        # Calculate intersection
        xi1 = max(x1_1, x1_2)
        yi1 = max(y1_1, y1_2)
        xi2 = min(x2_1, x2_2)
        yi2 = min(y2_1, y2_2)
        
        if xi2 < xi1 or yi2 < yi1:
            return 0.0
        
        intersection = (xi2 - xi1) * (yi2 - yi1)
        
        # Calculate areas
        area1 = (x2_1 - x1_1) * (y2_1 - y1_1)
        area2 = (x2_2 - x1_2) * (y2_2 - y1_2)
        union = area1 + area2 - intersection
        
        return intersection / union if union != 0 else 0.0
```

## Integration with VLA Systems

Object detection results need to be integrated with the VLA system:

```python
class VLAObjectIntegration:
    def __init__(self, object_detector, semantic_mapper):
        self.object_detector = object_detector
        self.semantic_mapper = semantic_mapper
        self.object_memory = {}  # Store recognized objects with their properties
    
    def process_visual_input(self, image):
        """Process visual input and update VLA system"""
        # Detect objects in the image
        detections = self.object_detector.detect_objects(image)
        
        # Update object memory with new detections
        for detection in detections:
            obj_id = detection['label'] + '_' + str(hash(str(detection['bbox'])))
            self.object_memory[obj_id] = {
                'bbox': detection['bbox'],
                'confidence': detection['confidence'],
                'class': detection['label'],
                'location': self._bbox_to_3d_location(detection['bbox'], image)
            }
        
        return self.object_memory
    
    def find_objects_by_name(self, object_name):
        """Find objects matching a given name"""
        matches = []
        for obj_id, obj_data in self.object_memory.items():
            if object_name.lower() in obj_data['class'].lower():
                matches.append(obj_data)
        return matches
    
    def _bbox_to_3d_location(self, bbox, image):
        """Convert 2D bounding box to 3D location (simplified)"""
        # In a real implementation, this would use depth information
        # For now, we'll return a simplified 3D position
        x_center = (bbox[0] + bbox[2]) / 2
        y_center = (bbox[1] + bbox[3]) / 2
        
        # Convert to normalized coordinates (0-1)
        h, w = image.shape[:2]
        x_norm = x_center / w
        y_norm = y_center / h
        
        # Return a simplified 3D position (z would come from depth)
        return {'x': x_norm, 'y': y_norm, 'z': 0.5}  # Placeholder z value
```

## Chapter Summary

This chapter covered object detection techniques essential for VLA systems in humanoid robotics. We explored different detection architectures, custom training approaches, 3D detection, tracking, and integration with ROS 2. In the next chapter, we'll examine safety validation in VLA systems.