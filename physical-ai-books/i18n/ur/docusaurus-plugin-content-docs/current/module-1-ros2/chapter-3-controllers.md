---
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

```cpp
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
```

## خلاصہ

ROS 2 کنٹرولرز روبوٹ کے جوڑوں کو کنٹرول کرنے کے لیے ایک مضبوط اور قابل توسیع حل فراہم کرتے ہیں۔ یہ کنٹرولرز ROS 2 کے کنٹرول فریم ورک کا حصہ ہیں جو روبوٹ کے جوڑوں کو کنٹرول کرنے کے لیے ایک یونیفارم انٹرفیس فراہم کرتا ہے۔