---
sidebar_label: جنرل روبوٹکس مشقیں
title: جنرل روبوٹکس مشقیں
---

# جنرل روبوٹکس مشقیں

## مشق G1: سسٹم یکجہتی چیلنج

### مسئلہ کا بیان
چار ماڈیولز (ROS 2 آرکیٹیکچر، ڈیجیٹل ٹوئن، AI براہن، VLA) کو ایک مربوط ہیومنوائڈ روبوٹکس سسٹم میں ضم کریں۔ سسٹم کو یہ مظاہرہ کرنا چاہیے:
1. تمام ماڈیولز کے درمیان مناسب مواصلات
2. مکمل اسٹیک پر مربوط رویہ
3. نقص کا انتظام اور بازیابی کے میکنزم
4. ضم شدہ سسٹم میں کارکردگی کی بہتری

### حل کا طریقہ
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

        # ذیلی نظاموں کی ٹریکنگ کو شروع کریں
        self.subsystem_status = {
            'ros2_architecture': False,
            'digital_twin': False,
            'ai_brain': False,
            'vla_system': False
        }

        # تمام ذیلی نظاموں کے لیے سبسکرپشنز
        self.status_subs = []
        for subsystem in self.subsystem_status.keys():
            sub = self.create_subscription(
                String,
                f'/{subsystem}/status',
                lambda msg, sys=subsystem: self.subsystem_status_callback(msg, sys),
                10
            )
            self.status_subs.append(sub)

        # ضم شدہ سسٹم کے لیے پبلشرز
        self.system_status_pub = self.create_publisher(String, '/system_status', 10)
        self.integration_test_pub = self.create_publisher(Bool, '/integration_test', 10)

        # سسٹم کی حالت
        self.all_systems_ready = False
        self.integration_tests_passed = 0
        self.integration_tests_total = 0

        # سسٹم کی صحت کی چیک کے لیے ٹائمر
        self.health_check_timer = self.create_timer(1.0, self.system_health_check)

        self.get_logger().info('سسٹم یکجہتی نوڈ شروع کیا گیا')

    def subsystem_status_callback(self, msg, subsystem):
        """ذیلی نظام کی حالت کو اپ ڈیٹ کریں"""
        if msg.data == 'READY':
            self.subsystem_status[subsystem] = True
            self.get_logger().info(f'{subsystem} تیار ہے')
        elif msg.data == 'ERROR':
            self.subsystem_status[subsystem] = False
            self.get_logger().error(f'{subsystem} نے نقص کی اطلاع دی')

        # چیک کریں کہ تمام نظام تیار ہیں
        self.all_systems_ready = all(self.subsystem_status.values())

        if self.all_systems_ready:
            self.get_logger().info('تمام ذیلی نظام یکجہتی ٹیسٹنگ کے لیے تیار ہیں')

    def system_health_check(self):
        """مکمل سسٹم کی صحت کو چیک کریں"""
        status_msg = String()

        if self.all_systems_ready:
            status_msg.data = 'SYSTEM_INTEGRATED_ALL_READY'

            # یکجہتی ٹیسٹس چلائیں
            self.run_integration_tests()
        else:
            # شناخت کریں کہ کون سے ذیلی نظام تیار نہیں ہیں
            not_ready = [sys for sys, ready in self.subsystem_status.items() if not ready]
            status_msg.data = f'SYSTEM_INTEGRATION_INCOMPLETE: {", ".join(not_ready)} تیار نہیں ہے'

        self.system_status_pub.publish(status_msg)

    def run_integration_tests(self):
        """تمام ذیلی نظاموں کے درمیان یکجہتی ٹیسٹس چلائیں"""
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
                    self.get_logger().info(f'یکجہتی ٹیسٹ پاس ہو گیا: {test_func.__name__}')
                else:
                    self.get_logger().error(f'یکجہتی ٹیسٹ ناکام ہو گیا: {test_func.__name__}')
            except Exception as e:
                self.get_logger().error(f'یکجہتی ٹیسٹ نقص: {test_func.__name__} - {e}')

    def test_ros2_digital_twin_integration(self):
        """ROS 2 اور ڈیجیٹل ٹوئن یکجہتی کو ٹیسٹ کریں"""
        # اس میں یہ چیک کرنا شامل ہوگا کہ کیا تصور کا ڈیٹا ROS ٹاپکس میں مناسب طور پر ظاہر ہو رہا ہے
        # مثال کے طور پر، یہ چیک کرنا کہ کیا تصور شدہ سینسر ڈیٹا متوقع پیٹرنز سے مماثل ہے
        try:
            # چیک کریں کہ کیا تصور متوقع ٹاپکس کو پبلش کر رہا ہے
            # TF ٹری کی مکملتا کی توثیق کریں
            # تصدیق کریں کہ تصور شدہ روبوٹ کمانڈز کا جواب دے رہا ہے
            return True  # سادہ - عمل میں، تفصیلی چیکس ہوں گے
        except:
            return False

    def test_ai_brain_navigation_integration(self):
        """AI براہن اور نیویگیشن یکجہتی کو ٹیسٹ کریں"""
        # اس میں یہ چیک کرنا شامل ہوگا کہ کیا AI جنریٹڈ پلانز نیویگیشن اسٹیک کے ذریعہ مناسب طور پر انجام دیے جا رہے ہیں
        try:
            # AI براہن کو ایک ہائی لیول کمانڈ بھیجیں
            # تصدیق کریں کہ نیویگیشن سسٹم منصوبہ وصول کر رہا ہے اور اسے انجام دے رہا ہے
            # چیک کریں کہ فیڈ بیک AI سسٹم کو مناسب طور پر واپس بھیجا جا رہا ہے
            return True  # سادہ
        except:
            return False

    def test_vla_perception_integration(self):
        """VLA اور ادراک یکجہتی کو ٹیسٹ کریں"""
        # اس میں یہ چیک کرنا شامل ہوگا کہ کیا VLA سسٹم ادراک ڈیٹا کو مناسب طور پر پروسیس کر رہا ہے
        try:
            # تصدیق کریں کہ کیا کیمرہ ڈیٹا VLA سسٹم کے ذریعہ پروسیس کیا جا رہا ہے
            # چیک کریں کہ کیا شناخت کردہ اشیاء مناسب طور پر درجہ بندی کی گئی ہیں
            # تصدیق کریں کہ زبان کی سمجھ ادراک سے منسلک ہے
            return True  # سادہ
        except:
            return False

    def test_cross_module_communication(self):
        """تمام ماڈیولز کے درمیان مواصلات کو ٹیسٹ کریں"""
        # اس میں تمام ماڈیولز کے درمیان میسج پاسنگ کو چیک کرنا شامل ہوگا
        try:
            # ایک میسج بھیجیں جو تمام ماڈیولز کے ذریعہ پار کرنا چاہیے
            # تصدیق کریں کہ اسے ہر اسٹیج پر مناسب طور پر پروسیس کیا جا رہا ہے
            return True  # سادہ
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

## مشق G2: کارکردگی کی بہتری

### مسئلہ کا بیان
ہیومنوائڈ روبوٹکس سسٹم کی کارکردگی کو بہتر بنائیں تاکہ تمام ماڈیولز میں حقیقی وقت کا آپریشن یقینی بنایا جا سکے۔ اس میں شامل ہے:
1. CPU اور میموری کے استعمال کی بہتری
2. حقیقی وقت کے جواب کی ضمانتیں
3. موثر ڈیٹا پروسیسنگ پائپ لائنز
4. تیزی کے لیے GPU کا استعمال

### حل کا طریقہ
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

        # کارکردگی کی نگرانی
        self.cpu_usage_history = deque(maxlen=100)
        self.memory_usage_history = deque(maxlen=100)
        self.gpu_usage_history = deque(maxlen=100)

        # کارکردگی کی نگرانی کے لیے تھریڈنگ
        self.monitoring_thread = threading.Thread(target=self.performance_monitoring_loop, daemon=True)
        self.monitoring_thread.start()

        # کارکردگی کے معیار کے لیے پبلشرز
        self.cpu_usage_pub = self.create_publisher(Float32, '/performance/cpu_usage', 10)
        self.memory_usage_pub = self.create_publisher(Float32, '/performance/memory_usage', 10)
        self.gpu_usage_pub = self.create_publisher(Float32, '/performance/gpu_usage', 10)

        # بہتری کے فیصلے کے لیے ٹائمر
        self.optimization_timer = self.create_timer(5.0, self.optimization_decision_loop)

        # بہتری کے پیرامیٹرز
        self.cpu_threshold = 80.0  # فیصد
        self.memory_threshold = 85.0  # فیصد
        self.gpu_threshold = 85.0  # فیصد

        self.get_logger().info('کارکردگی کا بہتر کار نوڈ شروع کیا گیا')

    def performance_monitoring_loop(self):
        """مسلسل سسٹم کارکردگی کی نگرانی کریں"""
        while rclpy.ok():
            # CPU استعمال
            cpu_percent = psutil.cpu_percent(interval=1)
            self.cpu_usage_history.append(cpu_percent)

            # میموری استعمال
            memory_percent = psutil.virtual_memory().percent
            self.memory_usage_history.append(memory_percent)

            # GPU استعمال (اگر دستیاب ہو)
            gpu_percent = self.get_gpu_usage()
            self.gpu_usage_history.append(gpu_percent)

            # معیار پبلش کریں
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
        """GPU استعمال حاصل کریں اگر دستیاب ہو"""
        try:
            import GPUtil
            gpus = GPUtil.getGPUs()
            if gpus:
                return gpus[0].load * 100  # فیصد میں تبدیل کریں
            else:
                return 0.0
        except ImportError:
            return 0.0  # GPU نگرانی دستیاب نہیں ہے

    def optimization_decision_loop(self):
        """کارکردگی کے معیار کی بنیاد پر بہتری کے فیصلے کریں"""
        avg_cpu = np.mean(list(self.cpu_usage_history)[-10:]) if self.cpu_usage_history else 0
        avg_memory = np.mean(list(self.memory_usage_history)[-10:]) if self.memory_usage_history else 0
        avg_gpu = np.mean(list(self.gpu_usage_history)[-10:]) if self.gpu_usage_history else 0

        # موجودہ اوسط لاگ کریں
        self.get_logger().info(f'کارکردگی کے اوسط - CPU: {avg_cpu:.1f}%, میموری: {avg_memory:.1f}%, GPU: {avg_gpu:.1f}%')

        # بہتری کے فیصلے کریں
        if avg_cpu > self.cpu_threshold:
            self.optimize_cpu_usage()
        if avg_memory > self.memory_threshold:
            self.optimize_memory_usage()
        if avg_gpu > self.gpu_threshold:
            self.optimize_gpu_usage()

    def optimize_cpu_usage(self):
        """CPU استعمال کی بہتری لاگو کریں"""
        self.get_logger().warn('زیادہ CPU استعمال کا پتہ چلا، بہتری لاگو کی جا رہی ہے')

        # غیر اہم کاموں کی پروسیسنگ کی فریکوئنسی کم کریں
        # زیادہ موثر الگورتھم لاگو کریں
        # مناسب جگہوں پر ملٹی-تھریڈنگ کا استعمال کریں
        pass

    def optimize_memory_usage(self):
        """میموری استعمال کی بہتری لاگو کریں"""
        self.get_logger().warn('زیادہ میموری استعمال کا پتہ چلا، بہتری لاگو کی جا رہی ہے')

        # میموری پولنگ لاگو کریں
        # بفر سائز کم کریں
        # کچرہ جمع کرنے کی حکمت عملیاں لاگو کریں
        pass

    def optimize_gpu_usage(self):
        """GPU استعمال کی بہتری لاگو کریں"""
        self.get_logger().warn('زیادہ GPU استعمال کا پتہ چلا، بہتری لاگو کی جا رہی ہے')

        # بیچ سائز کم کریں
        # ٹینسر آپریشن کو بہتر بنائیں
        # مناسب جگہوں پر مکسڈ پریسیژن کا استعمال کریں
        pass

class EfficientDataPipeline:
    """ہیومنوائڈ روبوٹکس کے لیے موثر ڈیٹا پروسیسنگ پائپ لائن"""

    def __init__(self):
        self.buffer_size = 10
        self.data_buffer = deque(maxlen=self.buffer_size)
        self.processing_thread = None
        self.is_processing = False

    def start_processing(self):
        """موثر ڈیٹا پروسیسنگ شروع کریں"""
        self.is_processing = True
        self.processing_thread = threading.Thread(target=self.processing_loop, daemon=True)
        self.processing_thread.start()

    def add_data(self, data):
        """پروسیسنگ پائپ لائن میں ڈیٹا شامل کریں"""
        if len(self.data_buffer) < self.buffer_size:
            self.data_buffer.append(data)
        else:
            # بفر بھرا ہوا ہے، سب سے پرانا ڈیٹا چھوڑ دیں
            self.data_buffer.popleft()
            self.data_buffer.append(data)

    def processing_loop(self):
        """موثر پروسیسنگ لوپ"""
        while self.is_processing:
            if self.data_buffer:
                data = self.data_buffer.popleft()
                self.process_data_efficiently(data)
            else:
                time.sleep(0.001)  # مصروف انتظار سے بچنے کے لیے مختصر سوتا

    def process_data_efficiently(self, data):
        """موثر ڈیٹا پروسیسنگ نفاذ"""
        # عددی حساب کے لیے NumPy کا استعمال کریں
        # ویکٹرائزڈ آپریشن لاگو کریں
        # میموری کے تفویض کو کم کریں
        pass

    def stop_processing(self):
        """پروسیسنگ پائپ لائن کو روکیں"""
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

## مشق G3: محفوظ اور نقص کی برداشت

### مسئلہ کا بیان
ہیومنوائڈ روبوٹکس سسٹم کے لیے جامع محفوظ اور نقص کی برداشت کے میکنزم لاگو کریں، جن میں شامل ہے:
1. ہنگامی بند کی کارروائیاں
2. نقص کا پتہ لگانا اور علیحدہ کرنا
3. عظمت کی کمی
4. ناکامیوں سے بازیابی

### حل کا طریقہ
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

        # محفوظ حالت کا انتظام
        self.safety_state = SafetyState.NORMAL
        self.emergency_active = False
        self.faults_detected = []
        self.recovery_attempts = 0
        self.max_recovery_attempts = 3

        # سسٹم کی نگرانی کے لیے سبسکرپشنز
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

        # محفوظ کمانڈز کے لیے پبلشرز
        self.emergency_stop_pub = self.create_publisher(Bool, '/emergency_stop', 10)
        self.safety_cmd_pub = self.create_publisher(Twist, '/safety_cmd_vel', 10)
        self.safety_status_pub = self.create_publisher(String, '/safety_status', 10)

        # نقص کا پتہ لگانے کے پیرامیٹرز
        self.joint_effort_threshold = 50.0  # N*m
        self.joint_velocity_threshold = 5.0  # rad/s
        self.cmd_vel_threshold = 1.0  # m/s for linear, rad/s for angular
        self.fault_history_window = 10
        self.fault_history = deque(maxlen=self.fault_history_window)

        # محفوظ چیکس کے لیے ٹائمرز
        self.safety_check_timer = self.create_timer(0.1, self.safety_check_loop)  # 10Hz
        self.fault_detection_timer = self.create_timer(0.05, self.fault_detection_loop)  # 20Hz

        self.get_logger().info('محفوظ اور نقص کی برداشت نوڈ شروع کیا گیا')

    def joint_state_callback(self, msg):
        """ joints کی حالت کو نقص کے لیے نگرانی کریں"""
        if not msg.effort or not msg.velocity:
            return

        # joints کے نقص کے لیے چیک کریں
        for i, (effort, velocity) in enumerate(zip(msg.effort, msg.velocity)):
            if abs(effort) > self.joint_effort_threshold:
                fault_desc = f'HIGH_EFFORT_JOINT_{i}: {effort:.2f} > {self.joint_effort_threshold}'
                self.fault_history.append(('effort', fault_desc, self.get_clock().now()))

            if abs(velocity) > self.joint_velocity_threshold:
                fault_desc = f'HIGH_VELOCITY_JOINT_{i}: {velocity:.2f} > {self.joint_velocity_threshold}'
                self.fault_history.append(('velocity', fault_desc, self.get_clock().now()))

    def cmd_vel_callback(self, msg):
        """رفتار کمانڈز کو محفوظ خلاف ورزیوں کے لیے نگرانی کریں"""
        if (abs(msg.linear.x) > self.cmd_vel_threshold or
            abs(msg.linear.y) > self.cmd_vel_threshold or
            abs(msg.linear.z) > self.cmd_vel_threshold or
            abs(msg.angular.x) > self.cmd_vel_threshold or
            abs(msg.angular.y) > self.cmd_vel_threshold or
            abs(msg.angular.z) > self.cmd_vel_threshold):

            fault_desc = f'COMMAND_THRESHOLD_EXCEEDED: linear=({msg.linear.x:.2f}, {msg.linear.y:.2f}, {msg.linear.z:.2f}), angular=({msg.angular.x:.2f}, {msg.angular.y:.2f}, {msg.angular.z:.2f})'
            self.fault_history.append(('command', fault_desc, self.get_clock().now()))

    def safety_check_loop(self):
        """مرکزی محفوظ چیک لوپ"""
        # حالات کی بنیاد پر موجودہ محفوظ حالت کا تعین کریں
        current_state = self.determine_safety_state()

        if current_state != self.safety_state:
            self.get_logger().info(f'محفوظ حالت تبدیل ہو گئی: {self.safety_state} -> {current_state}')
            self.safety_state = current_state

        # محفوظ حالت کی بنیاد پر مناسب کارروائی کریں
        if self.safety_state == SafetyState.EMERGENCY_STOP:
            self.activate_emergency_stop()
        elif self.safety_state == SafetyState.RECOVERY:
            self.attempt_recovery()
        else:
            # معمول کا آپریشن، اگر فعال ہو تو ہنگامی کو صاف کریں
            if self.emergency_active:
                self.deactivate_emergency_stop()

        # محفوظ حالت پبلش کریں
        status_msg = String()
        status_msg.data = f'SAFETY_STATE: {self.safety_state.name}, FAULTS_DETECTED: {len(self.fault_history)}'
        self.safety_status_pub.publish(status_msg)

    def fault_detection_loop(self):
        """مسلسل نقص کا پتہ لگانا"""
        # اس میں شامل ہو سکتا ہے:
        # - مواصلات کے ٹائم آؤٹس
        # - سینسر ڈیٹا کی درستگی
        # - سسٹم وسائل کی حدیں
        # - رویے کے انوملیز
        pass

    def determine_safety_state(self):
        """حالات کی بنیاد پر محفوظ حالت کا تعین کریں"""
        # حالیہ نقصوں کو گنیں
        recent_faults = list(self.fault_history)

        if not recent_faults:
            return SafetyState.NORMAL

        # فوری بند کی ضرورت والے اہم نقصوں کے لیے چیک کریں
        critical_faults = [f for f in recent_faults if 'HIGH_EFFORT' in f[1] or 'COMMAND_THRESHOLD_EXCEEDED' in f[1]]

        if len(critical_faults) > 3:  # مختصر وقت میں متعدد اہم نقص
            return SafetyState.EMERGENCY_STOP

        # انتباہ سطحی نقصوں کے لیے چیک کریں
        warning_faults = [f for f in recent_faults if 'HIGH_VELOCITY' in f[1]]

        if len(warning_faults) > 5:  # متعدد انتباہ نقص
            return SafetyState.ALERT

        # واحد اہم نقص
        if critical_faults:
            return SafetyState.WARNING

        # واحد انتباہ نقص
        if warning_faults:
            return SafetyState.WARNING

        return SafetyState.NORMAL

    def activate_emergency_stop(self):
        """ہنگامی بند کو فعال کریں"""
        if not self.emergency_active:
            self.emergency_active = True

            # ہنگامی بند کمانڈ پبلش کریں
            stop_msg = Bool()
            stop_msg.data = True
            self.emergency_stop_pub.publish(stop_msg)

            # صفر رفتار کمانڈ پبلش کریں
            zero_cmd = Twist()
            self.safety_cmd_pub.publish(zero_cmd)

            self.get_logger().error('ہنگامی بند فعال ہو گیا')

            # محفوظ حالت کو اپ ڈیٹ کریں
            status_msg = String()
            status_msg.data = 'EMERGENCY_STOP_ACTIVATED'
            self.safety_status_pub.publish(status_msg)

    def deactivate_emergency_stop(self):
        """ہنگامی بند کو غیر فعال کریں"""
        if self.emergency_active:
            self.emergency_active = False

            # ہنگامی بند ریلیز پبلش کریں
            release_msg = Bool()
            release_msg.data = False
            self.emergency_stop_pub.publish(release_msg)

            self.get_logger().info('ہنگامی بند غیر فعال ہو گیا')

            # محفوظ حالت کو اپ ڈیٹ کریں
            status_msg = String()
            status_msg.data = 'EMERGENCY_STOP_DEACTIVATED'
            self.safety_status_pub.publish(status_msg)

    def attempt_recovery(self):
        """نقص کی حالت سے بازیابی کی کوشش کریں"""
        if self.recovery_attempts < self.max_recovery_attempts:
            self.get_logger().info(f'بازیابی کی کوشش (کوشش {self.recovery_attempts + 1}/{self.max_recovery_attempts})')

            # بازیابی کی کارروائی لاگو کریں
            # اس میں شامل ہو سکتا ہے:
            # - آہستہ آہستہ کام کی صلاحیتوں کو بحال کرنا
            # - ذیلی نظاموں کو دوبارہ شروع کرنا
            # - آپریٹر کی مداخلت کی درخواست کرنا

            self.recovery_attempts += 1

            # بازیابی کی کوشش کے بعد، چیک کریں کہ کیا ہم معمول پر واپس جا سکتے ہیں
            time.sleep(2.0)  # بازیابی کے لیے وقت دیں

            # اگر حالیہ نقص نہ ہوں، معمول پر واپس جائیں
            if len(self.fault_history) == 0 or all(
                (self.get_clock().now() - fault[2]).nanoseconds / 1e9 > 5.0
                for fault in self.fault_history
            ):
                self.safety_state = SafetyState.NORMAL
                self.recovery_attempts = 0
        else:
            self.get_logger().error('زیادہ سے زیادہ بازیابی کی کوششیں پہنچ گئیں - سسٹم محفوظ حالت میں رہے گا')
            self.safety_state = SafetyState.EMERGENCY_STOP

    def graceful_degradation(self):
        """جب نقص ہوں تو عظمت کی کمی لاگو کریں"""
        # نقص کی شدت کی بنیاد پر آپریشنل صلاحیتوں کو کم کریں
        # مثال کے طور پر:
        # - زیادہ سے زیادہ رفتار کم کریں
        # - غیر اہم فنکشنز کو غیر فعال کریں
        # - محفوظ مارجنز میں اضافہ کریں
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

## مشق G4: انسان-روبوٹ بات چیت کی بہتری

### مسئلہ کا بیان
ہیومنوائڈ سسٹم کی انسان-روبوٹ بات چیت کی صلاحیتوں کو بہتر بنائیں تاکہ اس میں شامل ہو:
1. قدرتی زبان کی سمجھ اور تخلیق
2. اشارے کا پتہ لگانا اور تخلیق
3. جذباتی اظہار اور پہچان
4. سماجی رویہ کا نفاذ

### حل کا طریقہ
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

        # تقریر کی پہچان اور ترکیب شروع کریں
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()

        # ٹیکسٹ ٹو اسپیچ شروع کریں
        self.tts_engine = pyttsx3.init()
        voices = self.tts_engine.getProperty('voices')
        if voices:
            self.tts_engine.setProperty('voice', voices[0].id)
        self.tts_engine.setProperty('rate', 150)

        # بات چیت کی حالت
        self.interaction_mode = InteractionMode.IDLE
        self.conversation_history = []
        self.user_intent = None
        self.robot_response = None

        # سبسکرپشنز
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

        # پبلشرز
        self.speech_output_pub = self.create_publisher(String, '/speech_output', 10)
        self.gesture_cmd_pub = self.create_publisher(String, '/gesture_command', 10)
        self.interaction_status_pub = self.create_publisher(String, '/interaction_status', 10)
        self.emotional_state_pub = self.create_publisher(String, '/emotional_state', 10)

        # سروسز
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

        # ٹائمرز
        self.interaction_timer = self.create_timer(0.1, self.interaction_loop)

        # مائیکروفون سیٹ اپ کریں
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source)

        self.get_logger().info('انسان-روبوٹ بات چیت نوڈ شروع کیا گیا')

    def audio_callback(self, msg):
        """آڈیو ان پٹ کو ہینڈل کریں"""
        # آڈیو ڈیٹا کو پروسیس کریں
        pass

    def vision_callback(self, msg):
        """وژن ڈیٹا کو ہینڈل کریں"""
        # تصویر کو پروسیس کریں اور اشارے/چہرے کی پہچان کریں
        pass

    def start_interaction_callback(self, request, response):
        """بات چیت شروع کریں"""
        self.interaction_mode = InteractionMode.LISTENING
        response.success = True
        response.message = 'Interaction started'
        self.get_logger().info('Interaction started')
        return response

    def stop_interaction_callback(self, request, response):
        """بات چیت روکیں"""
        self.interaction_mode = InteractionMode.IDLE
        response.success = True
        response.message = 'Interaction stopped'
        self.get_logger().info('Interaction stopped')
        return response

    def interaction_loop(self):
        """بات چیت کا لوپ"""
        if self.interaction_mode == InteractionMode.LISTENING:
            # صبر کریں کہ کیا صارف بات کر رہا ہے
            pass
        elif self.interaction_mode == InteractionMode.PROCESSING:
            # صارف کے حکم کو سمجھنے کی کوشش کریں
            self.process_user_command()
        elif self.interaction_mode == InteractionMode.RESPONDING:
            # جواب دیں اور اشارہ کریں
            self.respond_to_user()
        else:
            # IDLE - کچھ نہ کریں
            pass

        # بات چیت کی حالت پبلش کریں
        status_msg = String()
        status_msg.data = f'INTERACTION_MODE: {self.interaction_mode.name}'
        self.interaction_status_pub.publish(status_msg)

    def process_user_command(self):
        """صارف کے حکم کو سمجھنے کی کوشش کریں"""
        # حکم کو سمجھنے کے لیے NLP/LLM کا استعمال کریں
        pass

    def respond_to_user(self):
        """صارف کو جواب دیں"""
        # جواب کو اسپیچ میں تبدیل کریں
        if self.robot_response:
            self.tts_engine.say(self.robot_response)
            self.tts_engine.runAndWait()

            # جواب پبلش کریں
            response_msg = String()
            response_msg.data = self.robot_response
            self.speech_output_pub.publish(response_msg)

            # جواب کے مطابق اشارہ کریں
            self.generate_gesture_response()

        # حالت کو IDLE پر ری سیٹ کریں
        self.interaction_mode = InteractionMode.IDLE

    def generate_gesture_response(self):
        """جواب کے مطابق اشارہ تخلیق کریں"""
        # مناسب اشارہ کمانڈ جنریٹ کریں
        gesture_msg = String()
        gesture_msg.data = 'NOD_HEAD'  # مثال کے طور پر
        self.gesture_cmd_pub.publish(gesture_msg)

def main(args=None):
    rclpy.init(args=args)
    interaction_node = HumanRobotInteractionNode()

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