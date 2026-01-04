---
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

```cpp
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
```

## خلاصہ

کنیمیٹکس روبوٹکس کا ایک اہم پہلو ہے جو روبوٹ کے جوڑوں اور ختم کے درمیان رشتے کو تفصیل سے بیان کرتا ہے۔ کنیمیٹکس روبوٹ کے حرکت کو سمجھنے اور کنٹرول کرنے کے لیے ضروری ہے۔