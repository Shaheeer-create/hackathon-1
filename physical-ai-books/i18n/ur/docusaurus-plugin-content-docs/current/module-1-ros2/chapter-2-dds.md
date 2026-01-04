---
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

```cpp
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
```

## خلاصہ

DDS ROS 2 کے لیے ایک مضبوط مواصلاتی بنیاد فراہم کرتا ہے جو ہائی پرفارمنس، قابل اعتماد اور اسکیل ایبل روبوٹکس ایپلی کیشنز کی اجازت دیتا ہے۔