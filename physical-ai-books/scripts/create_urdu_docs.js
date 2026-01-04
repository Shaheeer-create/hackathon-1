#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define the mapping of English content to Urdu content for each chapter
const chapters = [
  {
    enPath: 'docs/module-1-ros2/chapter-2-dds.md',
    urPath: 'docs/module-1-ros2/chapter-2-dds.ur.md',
    title: 'باب 2: DDS مواصلاتی ماڈل',
    content: `---
sidebar_label: باب 2
title: DDS مواصلاتی ماڈل
---

# باب 2: DDS مواصلاتی ماڈل

## جائزہ

Data Distribution Service (DDS) ایک میسجج اور سروس اوریںٹڈ مواصلاتی پروٹوکول ہے جو ROS 2 کے لیے بنیاد کا کام کرتا ہے۔ یہ ایک ہائی پرفارمنس، قابل اعتماد، ریئل ٹائم اور ایسکل ایبل مواصلاتی ڈیٹا کے لیے ڈیزائن کیا گیا ہے۔

## DDS کے بنیادی تصورات

### ڈیٹا سیمانتکس

DDS ایک ڈیٹا سینٹرک ماڈل استعمال کرتا ہے جہاں ڈیٹا کی تعریف، اس کی جگہ اور اس کا وقت ڈیٹا کے ساتھ ہی جڑا ہوتا ہے۔ یہ ماڈل ڈیٹا کے لیے ایک عام نظر فراہم کرتا ہے جو مختلف سسٹم اور ایپلی کیشنز کے درمیان ڈیٹا کا تبادلہ کو سہل بناتا ہے۔

### QoS پالیسیز

Quality of Service (QoS) پالیسیز DDS کا ایک اہم حصہ ہیں جو ڈیٹا کے اشتراک کے طریقے کو کسٹمائز کرنے کی اجازت دیتی ہیں۔ یہ پالیسیز مندرجہ ذیل پہلوؤں کو متاثر کرتی ہیں:

- **Reliability**: کیا تمام میسجس کو موصول کنندہ تک پہنچایا جائے گا؟
- **Durability**: کیا نئے سبسکرائیبرز کو پہلے سے شائع کردہ ڈیٹا موصول ہوگا؟
- **Deadline**: کیا ڈیٹا ایک مخصوص وقت کے اندر موصول ہونا چاہیے؟
- **History**: کتنا ڈیٹا ہوسٹ کیا جائے گا؟

### ڈومینز

DDS ڈومینز کا استعمال کرتا ہے تاکہ مختلف DDS ایپلی کیشنز کو الگ کیا جا سکے۔ ہر ڈومین ایک الگ مواصلاتی سسٹم کے طور پر کام کرتا ہے، جس سے یہ یقینی بنایا جا سکتا ہے کہ مختلف ایپلی کیشنز کے ڈیٹا کا تبادلہ ایک دوسرے کو متاثر کیے بغیر ہو سکے۔

## DDS اور ROS 2

ROS 2 DDS کو ایک پلیٹ فارم کے طور پر استعمال کرتا ہے تاکہ ROS 2 کے ذریعہ استعمال کیے جانے والے تمام مواصلاتی پیٹرنز کو لاگو کیا جا سکے:

- **Publish-Subscribe**: ٹاپکس کے ذریعے
- **Request-Reply**: سروسز کے ذریعے
- **Action-Based**: ایکشنز کے ذریعے

## عملی مثال

یہاں ایک سادہ DDS ایپلی کیشن کی مثال ہے جو ایک شائع کنندہ اور ایک سبسکرائیب کو ظاہر کرتی ہے:

\`\`\`cpp
// publisher.cpp
#include <dds/dds.hpp>
#include <iostream>
#include <thread>
#include <chrono>

struct HelloWorld {
    std::string message;
    int32_t count;
};

int main() {
    // Create a DomainParticipant
    dds::domain::DomainParticipant participant(0);

    // Create a Topic
    dds::topic::Topic<HelloWorld> topic(participant, "HelloWorldTopic");

    // Create a Publisher
    dds::pub::Publisher publisher(participant);

    // Create a DataWriter
    dds::pub::DataWriter<HelloWorld> writer(publisher, topic);

    // Write data
    HelloWorld sample;
    for (int i = 0; i < 10; ++i) {
        sample.message = "Hello World";
        sample.count = i;
        writer.write(sample);
        std::this_thread::sleep_for(std::chrono::milliseconds(1000));
    }

    return 0;
}
\`\`\`

## خلاصہ

DDS ROS 2 کے لیے ایک مضبوط مواصلاتی بنیاد فراہم کرتا ہے جو ہائی پرفارمنس، قابل اعتماد اور اسکیل ایبل روبوٹکس ایپلی کیشنز کی اجازت دیتا ہے۔`
  },
  {
    enPath: 'docs/module-1-ros2/chapter-3-controllers.md',
    urPath: 'docs/module-1-ros2/chapter-3-controllers.ur.md',
    title: 'باب 3: ROS 2 کنٹرولرز',
    content: `---
sidebar_label: باب 3
title: ROS 2 کنٹرولرز
---

# باب 3: ROS 2 کنٹرولرز

## جائزہ

ROS 2 کنٹرولرز روبوٹ کے مختلف جوڑوں (جoints) کو کنٹرول کرنے کے لیے استعمال ہوتے ہیں۔ یہ کنٹرولرز ROS 2 کے کنٹرول فریم ورک کا حصہ ہیں جو روبوٹ کے جوڑوں کو کنٹرول کرنے کے لیے ایک یونیفارم انٹرفیس فراہم کرتا ہے۔

## ROS 2 کنٹرول فریم ورک

ROS 2 کنٹرول فریم ورک روبوٹ کے جوڑوں کو کنٹرول کرنے کے لیے ایک ماڈولر اور قابل توسیع حل فراہم کرتا ہے۔ یہ فریم ورک مندرجہ ذیل اجزاء پر مشتمل ہے:

- **Hardware Interface**: روبوٹ کے ہارڈ ویئر کے ساتھ بات چیت کے لیے
- **Controller Manager**: کنٹرولرز کو منظم کرنے اور لوڈ کرنے کے لیے
- **Controllers**: اصل کنٹرول لاجک کو نافذ کرنے کے لیے

## کنٹرولرز کی اقسام

### Joint State Controller

Joint State Controller روبوٹ کے تمام جوڑوں کی حالت (پوزیشن، ویلوسٹی، ایفورٹ) کو شائع کرتا ہے۔ یہ کنٹرولر ROS 2 سسٹم میں دیگر نوڈس کے لیے جوڑ کی حالت کی معلومات فراہم کرتا ہے۔

### Position Controllers

Position Controllers جوڑوں کو مخصوص پوزیشنز پر لے جانے کے لیے استعمال ہوتے ہیں۔ یہ کنٹرولرز مخصوص پوزیشن کمانڈز وصول کرتے ہیں اور جوڑ کو مطلوبہ پوزیشن تک لے جانے کے لیے کنٹرول سگنل جنریٹ کرتے ہیں۔

### Velocity Controllers

Velocity Controllers جوڑوں کو مخصوص رفتار پر چلانے کے لیے استعمال ہوتے ہیں۔ یہ کنٹرولرز مخصوص رفتار کمانڈز وصول کرتے ہیں اور جوڑ کو مطلوبہ رفتار تک پہنچنے کے لیے کنٹرول سگنل جنریٹ کرتے ہیں۔

### Effort Controllers

Effort Controllers جوڑوں پر مخصوص کوشش (ٹارک) لاگو کرنے کے لیے استعمال ہوتے ہیں۔ یہ کنٹرولرز مخصوص کوشش کمانڈز وصول کرتے ہیں اور جوڑ پر مطلوبہ کوشش لاگو کرنے کے لیے کنٹرول سگنل جنریٹ کرتے ہیں۔

## عملی مثال

یہاں ایک سادہ کنٹرولر کی مثال ہے جو ایک جوڑ کو مخصوص پوزیشن پر لے جاتا ہے:

\`\`\`cpp
// position_controller.cpp
#include <controller_interface/controller_interface.hpp>
#include <hardware_interface/loaned_command_interface.hpp>
#include <hardware_interface/loaned_state_interface.hpp>
#include <rclcpp/rclcpp.hpp>

namespace position_controller
{
class PositionController : public controller_interface::ControllerInterface
{
public:
  controller_interface::InterfaceConfiguration command_interface_configuration() const override
  {
    controller_interface::InterfaceConfiguration config;
    config.type = controller_interface::interface_configuration_type::INDIVIDUAL;
    config.names.push_back(joint_name_ + "/" + hardware_interface::HW_IF_POSITION);
    return config;
  }

  controller_interface::InterfaceConfiguration state_interface_configuration() const override
  {
    controller_interface::InterfaceConfiguration config;
    config.type = controller_interface::interface_configuration_type::INDIVIDUAL;
    config.names.push_back(joint_name_ + "/" + hardware_interface::HW_IF_POSITION);
    return config;
  }

  controller_interface::return_type update(
    const rclcpp::Time & time,
    const rclcpp::Duration & period) override
  {
    if (has_position_command_) {
      joint_command_interface_.get().set_value(position_command_);
    }
    return controller_interface::return_type::OK;
  }

private:
  std::string joint_name_;
  double position_command_{0.0};
  bool has_position_command_{false};
  hardware_interface::LoanedCommandInterface joint_command_interface_;
};
} // namespace position_controller
\`\`\`

## خلاصہ

ROS 2 کنٹرولرز روبوٹ کے جوڑوں کو کنٹرول کرنے کے لیے ایک مضبوط اور قابل توسیع حل فراہم کرتے ہیں۔ یہ کنٹرولرز ROS 2 کے کنٹرول فریم ورک کا حصہ ہیں جو روبوٹ کے جوڑوں کو کنٹرول کرنے کے لیے ایک یونیفارم انٹرفیس فراہم کرتا ہے۔`
  },
  {
    enPath: 'docs/module-1-ros2/chapter-4-bridging-ai.md',
    urPath: 'docs/module-1-ros2/chapter-4-bridging-ai.ur.md',
    title: 'باب 4: ROS 2 اور AI کا رابطہ',
    content: `---
sidebar_label: باب 4
title: ROS 2 اور AI کا رابطہ
---

# باب 4: ROS 2 اور AI کا رابطہ

## جائزہ

ROS 2 اور AI کا رابطہ روبوٹکس کے لیے ایک اہم پہلو ہے۔ ROS 2 AI ماڈلز اور الگورتھم کو روبوٹکس سسٹم میں ضم کرنے کے لیے ایک مضبوط انفراسٹرکچر فراہم کرتا ہے۔

## ROS 2 اور مشین لرننگ

ROS 2 مشین لرننگ ماڈلز کو روبوٹکس سسٹم میں ضم کرنے کے لیے ایک یونیفارم انٹرفیس فراہم کرتا ہے۔ یہ انٹرفیس مندرجہ ذیل فوائد فراہم کرتا ہے:

- **ڈیٹا کا تبادلہ**: ROS 2 سینسر ڈیٹا کو AI ماڈلز تک پہنچانے کے لیے استعمال ہوتا ہے اور AI ماڈلز کے نتائج کو روبوٹکس سسٹم میں دیگر نوڈس تک پہنچانے کے لیے استعمال ہوتا ہے۔
- **کارکردگی کی بہتری**: ROS 2 AI ماڈلز کو GPU اور دیگر تیزی کے وسائل کا استعمال کرنے کے قابل بناتا ہے۔
- **قابلیت**: ROS 2 AI ماڈلز کو مختلف روبوٹکس پلیٹ فارمز پر چلانے کے قابل بناتا ہے۔

## ROS 2 اور ڈیپ لرننگ

ROS 2 ڈیپ لرننگ ماڈلز کو روبوٹکس سسٹم میں ضم کرنے کے لیے ایک مضبوط انفراسٹرکچر فراہم کرتا ہے۔ یہ انفراسٹرکچر مندرجہ ذیل فوائد فراہم کرتا ہے:

- **ماڈل کا انتظام**: ROS 2 ڈیپ لرننگ ماڈلز کو لوڈ، اپ ڈیٹ اور منظم کرنے کے لیے استعمال ہوتا ہے۔
- **ڈیٹا کی تیاری**: ROS 2 سینسر ڈیٹا کو AI ماڈلز کے لیے تیار کرنے کے لیے استعمال ہوتا ہے۔
- **انفرینس**: ROS 2 AI ماڈلز کے نتائج کو حاصل کرنے اور روبوٹکس سسٹم میں دیگر نوڈس تک پہنچانے کے لیے استعمال ہوتا ہے۔

## عملی مثال

یہاں ایک سادہ مثال ہے جو ROS 2 کو ایک ڈیپ لرننگ ماڈل کے ساتھ ضم کرتی ہے:

\`\`\`python
# ai_integration.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from std_msgs.msg import String
import cv2
import numpy as np
import tensorflow as tf

class AIIntegrationNode(Node):
    def __init__(self):
        super().__init__('ai_integration_node')
        
        # Load the AI model
        self.model = tf.keras.models.load_model('path/to/model.h5')
        
        # Create subscriber for camera images
        self.image_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )
        
        # Create publisher for AI results
        self.result_pub = self.create_publisher(String, '/ai_result', 10)
    
    def image_callback(self, msg):
        # Convert ROS image message to OpenCV image
        image = self.ros_image_to_cv2(msg)
        
        # Preprocess the image for the AI model
        processed_image = self.preprocess_image(image)
        
        # Run inference
        prediction = self.model.predict(processed_image)
        
        # Publish the result
        result_msg = String()
        result_msg.data = str(prediction)
        self.result_pub.publish(result_msg)
    
    def ros_image_to_cv2(self, msg):
        # Convert ROS image message to OpenCV image
        # Implementation depends on the image encoding
        pass
    
    def preprocess_image(self, image):
        # Preprocess the image for the AI model
        # Resize, normalize, etc.
        pass

def main(args=None):
    rclpy.init(args=args)
    ai_node = AIIntegrationNode()
    rclpy.spin(ai_node)
    ai_node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
\`\`\`

## خلاصہ

ROS 2 اور AI کا رابطہ روبوٹکس کے لیے ایک اہم پہلو ہے۔ ROS 2 AI ماڈلز اور الگورتھم کو روبوٹکس سسٹم میں ضم کرنے کے لیے ایک مضبوط انفراسٹرکچر فراہم کرتا ہے۔`
  },
  {
    enPath: 'docs/module-1-ros2/chapter-5-urdf.md',
    urPath: 'docs/module-1-ros2/chapter-5-urdf.ur.md',
    title: 'باب 5: URDF - یونیورسل روبوٹ ڈیسکرپشن فارمیٹ',
    content: `---
sidebar_label: باب 5
title: URDF - یونیورسل روبوٹ ڈیسکرپشن فارمیٹ
---

# باب 5: URDF - یونیورسل روبوٹ ڈیسکرپشن فارمیٹ

## جائزہ

URDF (Universal Robot Description Format) روبوٹ کی جسمانی ساخت کو تفصیل سے بیان کرنے کے لیے استعمال ہونے والا XML فارمیٹ ہے۔ URDF ROS 2 میں روبوٹ کی جسمانی خصوصیات، جوڑوں، سینسرز اور دیگر اجزاء کی تفصیل فراہم کرتا ہے۔

## URDF کے بنیادی اجزاء

### لینکس

لینکس URDF کا بنیادی جزو ہے جو روبوٹ کے جسمانی ڈھانچے کو بیان کرتا ہے۔ ہر لینک ایک جسمانی چیز کی نمائندگی کرتا ہے، جیسے ایک بازو، ٹانگ، یا سینسر۔

### جوڑ

جوڑ دو لینکس کے درمیان رابطہ کو بیان کرتا ہے۔ جوڑ روبوٹ کے ڈھانچے کو مربوط کرتا ہے اور جوڑ کی قسم (ریوولوٹ، پریزمیٹک، وغیرہ) اور حدود کی وضاحت کرتا ہے۔

### سینسرز

سینسرز URDF میں روبوٹ کے سینسرز کی تفصیل فراہم کرتا ہے، بشمول ان کی جگہ، قسم، اور دیگر خصوصیات۔

## URDF کی مثال

یہاں ایک سادہ روبوٹ کی URDF فائل کی مثال ہے:

\`\`\`xml
<?xml version="1.0"?>
<robot name="simple_robot">
  <!-- Base link -->
  <link name="base_link">
    <visual>
      <geometry>
        <cylinder length="0.6" radius="0.2"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <cylinder length="0.6" radius="0.2"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="10"/>
      <inertia ixx="1.0" ixy="0.0" ixz="0.0" iyy="1.0" iyz="0.0" izz="1.0"/>
    </inertial>
  </link>

  <!-- Arm link -->
  <link name="arm_link">
    <visual>
      <geometry>
        <box size="0.1 0.1 0.5"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <box size="0.1 0.1 0.5"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1"/>
      <inertia ixx="0.1" ixy="0.0" ixz="0.0" iyy="0.1" iyz="0.0" izz="0.1"/>
    </inertial>
  </link>

  <!-- Joint connecting base and arm -->
  <joint name="base_arm_joint" type="revolute">
    <parent link="base_link"/>
    <child link="arm_link"/>
    <origin xyz="0 0 0.3" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-3.14" upper="3.14" effort="100" velocity="1"/>
  </joint>
</robot>
\`\`\`

## URDF اور ROS 2

ROS 2 URDF فائلز کو لوڈ کرنے اور روبوٹ کی جسمانی ساخت کو ترتیب دینے کے لیے استعمال ہوتا ہے۔ URDF فائلز کو ROS 2 میں مندرجہ ذیل طریقوں سے استعمال کیا جا سکتا ہے:

- **TF ٹری**: URDF روبوٹ کے TF ٹری کو تیار کرنے کے لیے استعمال ہوتا ہے جو روبوٹ کے مختلف اجزاء کے درمیان جگہ کے تعلقات کو بیان کرتا ہے۔
- **سیمولیشن**: URDF گیزبو جیسے سیمولیشن ٹولز میں روبوٹ کی تفصیل فراہم کرنے کے لیے استعمال ہوتا ہے۔
- **وژن اور کنٹرول**: URDF روبوٹ کے جسمانی خصوصیات کو وژن اور کنٹرول الگورتھم کے لیے فراہم کرتا ہے۔

## خلاصہ

URDF روبوٹ کی جسمانی ساخت کو تفصیل سے بیان کرنے کے لیے ایک اہم ٹول ہے۔ URDF ROS 2 میں روبوٹ کی جسمانی خصوصیات، جوڑوں، سینسرز اور دیگر اجزاء کی تفصیل فراہم کرتا ہے۔`
  },
  {
    enPath: 'docs/module-1-ros2/chapter-6-kinematics.md',
    urPath: 'docs/module-1-ros2/chapter-6-kinematics.ur.md',
    title: 'باب 6: کنیمیٹکس',
    content: `---
sidebar_label: باب 6
title: کنیمیٹکس
---

# باب 6: کنیمیٹکس

## جائزہ

کنیمیٹکس روبوٹکس کا ایک اہم پہلو ہے جو روبوٹ کے جوڑوں اور ختم کے درمیان رشتے کو تفصیل سے بیان کرتا ہے۔ کنیمیٹکس روبوٹ کے حرکت کو سمجھنے اور کنٹرول کرنے کے لیے ضروری ہے۔

## کنیمیٹکس کی اقسام

### فارورڈ کنیمیٹکس

فارورڈ کنیمیٹکس روبوٹ کے جوڑوں کی پوزیشنز کو استعمال کرتے ہوئے روبوٹ کے ختم کی پوزیشن اور اورینٹیشن کا حساب لگاتا ہے۔ یہ کنیمیٹکس کا ایک سیدھا مسئلہ ہے جہاں جوڑ کی پوزیشنز دی گئی ہوتی ہیں اور ختم کی پوزیشن کا حساب لگایا جاتا ہے۔

### انورس کنیمیٹکس

انورس کنیمیٹکس روبوٹ کے ختم کی مطلوبہ پوزیشن اور اورینٹیشن کو استعمال کرتے ہوئے روبوٹ کے جوڑوں کی پوزیشنز کا حساب لگاتا ہے۔ یہ کنیمیٹکس کا ایک پیچیدہ مسئلہ ہے جہاں ختم کی پوزیشن دی گئی ہوتی ہے اور جوڑ کی پوزیشنز کا حساب لگایا جاتا ہے۔

## کنیمیٹکس حل

کنیمیٹکس کے مسائل کو حل کرنے کے لیے ROS 2 میں کئی ٹولز اور لائبریریز دستیاب ہیں:

- **KDL (Kinematics and Dynamics Library)**: ROS 2 کے ساتھ شامل کنیمیٹکس اور ڈائینمکس لائبریری
- **MoveIt!**: روبوٹ کے حرکت کو منصوبہ بند کرنے اور کنیمیٹکس کے مسائل کو حل کرنے کے لیے ایک جامع ٹول
- **IK Fast**: انورس کنیمیٹکس کے مسائل کو حل کرنے کے لیے ایک خودکار ٹول

## عملی مثال

یہاں ایک سادہ کنیمیٹکس حل کی مثال ہے جو KDL کا استعمال کرتی ہے:

\`\`\`cpp
// kinematics_example.cpp
#include <kdl/chain.hpp>
#include <kdl/chainfksolverpos_recursive.hpp>
#include <kdl/chainiksolverpos_nr.hpp>
#include <kdl/frames.hpp>
#include <kdl/jntarray.hpp>

int main() {
    // Create a chain representing a simple robot arm
    KDL::Chain chain;
    chain.addSegment(KDL::Segment(KDL::Joint(KDL::Joint::RotZ),
                                 KDL::Frame(KDL::Vector(0.0, 0.0, 0.5))));
    chain.addSegment(KDL::Segment(KDL::Joint(KDL::Joint::RotZ),
                                 KDL::Frame(KDL::Vector(0.0, 0.0, 0.5))));

    // Forward kinematics solver
    KDL::ChainFkSolverPos_recursive fksolver(chain);
    
    // Inverse kinematics solver
    KDL::ChainIkSolverPos_NR iksolver(chain, fksolver, ...);

    // Define joint positions
    KDL::JntArray joint_positions(2);
    joint_positions(0) = 0.5;
    joint_positions(1) = 0.5;

    // Calculate forward kinematics
    KDL::Frame end_effector_pose;
    fksolver.JntToCart(joint_positions, end_effector_pose);

    return 0;
}
\`\`\`

## خلاصہ

کنیمیٹکس روبوٹکس کا ایک اہم پہلو ہے جو روبوٹ کے جوڑوں اور ختم کے درمیان رشتے کو تفصیل سے بیان کرتا ہے۔ کنیمیٹکس روبوٹ کے حرکت کو سمجھنے اور کنٹرول کرنے کے لیے ضروری ہے۔`
  },
  {
    enPath: 'docs/module-1-ros2/exercises.md',
    urPath: 'docs/module-1-ros2/exercises.ur.md',
    title: 'ماڈیول 1 مشقیں',
    content: `---
sidebar_label: مشقیں
title: ماڈیول 1 مشقیں
---

# ماڈیول 1: ROS 2 مشقیں

## مشق 1.1: ROS 2 نوڈ تخلیق

### مسئلہ کا بیان
ایک ROS 2 نوڈ تخلیق کریں جو ایک سینسر سے ڈیٹا حاصل کرتا ہے اور اسے دوسرے نوڈ تک پہنچاتا ہے۔

### حل کا طریقہ
```python
# sensor_publisher.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32

class SensorPublisher(Node):
    def __init__(self):
        super().__init__('sensor_publisher')
        self.publisher = self.create_publisher(Float32, 'sensor_data', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = Float32()
        msg.data = 25.0 + (self.i % 10)  # Simulated sensor data
        self.publisher.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    sensor_publisher = SensorPublisher()
    rclpy.spin(sensor_publisher)
    sensor_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## مشق 1.2: DDS QoS پالیسیز کا استعمال

### مسئلہ کا بیان
DDS QoS پالیسیز کا استعمال کرتے ہوئے ایک ROS 2 ٹاپک تخلیق کریں جو مختلف مواصلاتی خصوصیات کو ظاہر کرتا ہے۔

### حل کا طریقہ
```python
# qos_example.py
import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy
from std_msgs.msg import String

class QoSPublisher(Node):
    def __init__(self):
        super().__init__('qos_publisher')
        
        # Define QoS profile with specific policies
        qos_profile = QoSProfile(
            depth=10,
            reliability=ReliabilityPolicy.RELIABLE,
            durability=DurabilityPolicy.TRANSIENT_LOCAL
        )
        
        self.publisher = self.create_publisher(String, 'qos_topic', qos_profile)
        timer_period = 1.0  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = f'QoS Message: {self.i}'
        self.publisher.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    qos_publisher = QoSPublisher()
    rclpy.spin(qos_publisher)
    qos_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## مشق 1.3: URDF فائل کی تخلیق

### مسئلہ کا بیان
ایک ہیومنوائڈ روبوٹ کی URDF فائل تخلیق کریں جس میں کم از کم ایک باڈی، چار بازو، اور چار ٹانگیں ہوں۔

### حل کا طریقہ
```xml
<?xml version="1.0"?>
<robot name="humanoid_robot">
  <!-- Body link -->
  <link name="body">
    <visual>
      <geometry>
        <box size="0.5 0.3 0.8"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <box size="0.5 0.3 0.8"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="20"/>
      <inertia ixx="1.0" ixy="0.0" ixz="0.0" iyy="1.0" iyz="0.0" izz="1.0"/>
    </inertial>
  </link>

  <!-- Head link -->
  <link name="head">
    <visual>
      <geometry>
        <sphere radius="0.15"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <sphere radius="0.15"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="2"/>
      <inertia ixx="0.1" ixy="0.0" ixz="0.0" iyy="0.1" iyz="0.0" izz="0.1"/>
    </inertial>
  </link>

  <!-- Joint connecting body and head -->
  <joint name="body_head_joint" type="revolute">
    <parent link="body"/>
    <child link="head"/>
    <origin xyz="0 0 0.5" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" effort="100" velocity="1"/>
  </joint>

  <!-- Left arm link -->
  <link name="left_arm">
    <visual>
      <geometry>
        <cylinder length="0.6" radius="0.05"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <cylinder length="0.6" radius="0.05"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1"/>
      <inertia ixx="0.1" ixy="0.0" ixz="0.0" iyy="0.1" iyz="0.0" izz="0.1"/>
    </inertial>
  </link>

  <!-- Joint connecting body and left arm -->
  <joint name="body_left_arm_joint" type="revolute">
    <parent link="body"/>
    <child link="left_arm"/>
    <origin xyz="0.3 0 0.2" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" effort="100" velocity="1"/>
  </joint>
</robot>
```

## مشق 1.4: کنیمیٹکس حل کا استعمال

### مسئلہ کا بیان
MoveIt! کا استعمال کرتے ہوئے ایک روبوٹ بازو کے لیے انورس کنیمیٹکس حل کریں۔

### حل کا طریقہ
```python
# kinematics_solver.py
import rclpy
from rclpy.node import Node
import moveit_commander
from geometry_msgs.msg import Pose

class KinematicsSolver(Node):
    def __init__(self):
        super().__init__('kinematics_solver')
        
        # Initialize MoveIt commander
        moveit_commander.roscpp_initialize()
        self.robot = moveit_commander.RobotCommander()
        self.scene = moveit_commander.PlanningSceneInterface()
        self.group_name = "arm"
        self.move_group = moveit_commander.MoveGroupCommander(self.group_name)

    def move_to_pose(self, target_pose):
        # Set the target pose
        self.move_group.set_pose_target(target_pose)
        
        # Plan and execute the motion
        plan = self.move_group.go(wait=True)
        self.move_group.stop()
        self.move_group.clear_pose_targets()

def main(args=None):
    rclpy.init(args=args)
    
    # Create target pose
    target_pose = Pose()
    target_pose.position.x = 0.3
    target_pose.position.y = 0.0
    target_pose.position.z = 0.5
    target_pose.orientation.w = 1.0
    
    # Solve and execute
    solver = KinematicsSolver()
    solver.move_to_pose(target_pose)
    
    solver.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## خلاصہ

یہ مشقیں ROS 2 کے بنیادی تصورات کو سمجھنے اور نافذ کرنے میں مدد فراہم کرتی ہیں۔`
  }
];

// Function to create Urdu files
function createUrduFiles() {
  for (const chapter of chapters) {
    const fullPath = path.join(__dirname, '..', chapter.urPath);
    const dirPath = path.dirname(fullPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Write the Urdu content to the file
    fs.writeFileSync(fullPath, chapter.content);
    console.log(`Created: ${fullPath}`);
  }
}

// Run the function
createUrduFiles();