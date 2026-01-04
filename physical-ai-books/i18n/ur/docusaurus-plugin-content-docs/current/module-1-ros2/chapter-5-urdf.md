---
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

```xml
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
```

## URDF اور ROS 2

ROS 2 URDF فائلز کو لوڈ کرنے اور روبوٹ کی جسمانی ساخت کو ترتیب دینے کے لیے استعمال ہوتا ہے۔ URDF فائلز کو ROS 2 میں مندرجہ ذیل طریقوں سے استعمال کیا جا سکتا ہے:

- **TF ٹری**: URDF روبوٹ کے TF ٹری کو تیار کرنے کے لیے استعمال ہوتا ہے جو روبوٹ کے مختلف اجزاء کے درمیان جگہ کے تعلقات کو بیان کرتا ہے۔
- **سیمولیشن**: URDF گیزبو جیسے سیمولیشن ٹولز میں روبوٹ کی تفصیل فراہم کرنے کے لیے استعمال ہوتا ہے۔
- **وژن اور کنٹرول**: URDF روبوٹ کے جسمانی خصوصیات کو وژن اور کنٹرول الگورتھم کے لیے فراہم کرتا ہے۔

## خلاصہ

URDF روبوٹ کی جسمانی ساخت کو تفصیل سے بیان کرنے کے لیے ایک اہم ٹول ہے۔ URDF ROS 2 میں روبوٹ کی جسمانی خصوصیات، جوڑوں، سینسرز اور دیگر اجزاء کی تفصیل فراہم کرتا ہے۔