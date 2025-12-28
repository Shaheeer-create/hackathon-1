# Chapter 2: Voice Commands with Whisper

## Overview

Voice commands form the primary interface for human-robot interaction in VLA systems. This chapter explores how to implement voice command processing using OpenAI's Whisper model, enabling humanoid robots to understand and respond to natural language instructions.

## Introduction to Voice Command Processing

Voice command processing in humanoid robots involves several key steps:
1. Audio capture and preprocessing
2. Speech-to-text conversion
3. Natural language understanding
4. Command execution planning

Whisper, developed by OpenAI, is a state-of-the-art automatic speech recognition (ASR) system that can transcribe speech to text with high accuracy across multiple languages.

## Setting up Whisper for Robot Commands

### Installation and Dependencies

```bash
pip install openai-whisper
pip install torch
pip install torchaudio
```

### Basic Whisper Implementation

```python
import whisper
import torch
import pyaudio
import wave
import threading
import queue
import time

class VoiceCommandProcessor:
    def __init__(self, model_size="base"):
        # Load the Whisper model
        self.model = whisper.load_model(model_size)
        
        # Audio parameters
        self.format = pyaudio.paInt16
        self.channels = 1
        self.rate = 16000
        self.chunk = 1024
        self.record_seconds = 5
        
        # Initialize PyAudio
        self.audio = pyaudio.PyAudio()
        
        # Queue for audio data
        self.audio_queue = queue.Queue()
        
    def record_audio(self):
        """Record audio from microphone"""
        stream = self.audio.open(
            format=self.format,
            channels=self.channels,
            rate=self.rate,
            input=True,
            frames_per_buffer=self.chunk
        )
        
        print("Recording...")
        frames = []
        
        for _ in range(0, int(self.rate / self.chunk * self.record_seconds)):
            data = stream.read(self.chunk)
            frames.append(data)
        
        print("Recording finished")
        
        stream.stop_stream()
        stream.close()
        
        # Save to WAV file
        wf = wave.open("temp_audio.wav", 'wb')
        wf.setnchannels(self.channels)
        wf.setsampwidth(self.audio.get_sample_size(self.format))
        wf.setframerate(self.rate)
        wf.writeframes(b''.join(frames))
        wf.close()
        
        return "temp_audio.wav"
    
    def transcribe_audio(self, audio_file):
        """Transcribe audio using Whisper"""
        result = self.model.transcribe(audio_file)
        return result["text"].strip()
    
    def process_voice_command(self):
        """Complete process: record and transcribe"""
        audio_file = self.record_audio()
        transcription = self.transcribe_audio(audio_file)
        return transcription
```

## Advanced Voice Command Processing

### Voice Activity Detection (VAD)

To improve efficiency and reduce processing overhead, we can implement voice activity detection:

```python
import webrtcvad
import collections

class VoiceActivityDetector:
    def __init__(self, aggressiveness=3):
        self.vad = webrtcvad.Vad(aggressiveness)
        self.frame_duration = 30  # ms
        self.sample_rate = 16000
        self.frame_size = int(self.sample_rate * self.frame_duration / 1000) * 2  # 2 bytes per sample
        
    def is_speech(self, audio_frame):
        """Check if the audio frame contains speech"""
        return self.vad.is_speech(audio_frame, self.sample_rate)
```

### Command Parsing and Intent Recognition

After transcribing the speech, we need to parse the command and extract intent:

```python
import re
from typing import Dict, List, Tuple

class CommandParser:
    def __init__(self):
        # Define command patterns
        self.command_patterns = {
            'move': [
                r'move (?P<direction>forward|backward|left|right)',
                r'go (?P<direction>forward|backward|left|right)',
                r'walk (?P<direction>forward|backward|left|right)',
            ],
            'turn': [
                r'turn (?P<direction>left|right)',
                r'rotate (?P<direction>left|right)',
            ],
            'grasp': [
                r'pick up (?P<object>.+)',
                r'grasp (?P<object>.+)',
                r'grab (?P<object>.+)',
            ],
            'navigate': [
                r'go to (?P<location>.+)',
                r'walk to (?P<location>.+)',
                r'move to (?P<location>.+)',
            ]
        }
    
    def parse_command(self, text: str) -> Dict:
        """Parse the transcribed text to extract command and parameters"""
        text = text.lower().strip()
        
        for intent, patterns in self.command_patterns.items():
            for pattern in patterns:
                match = re.search(pattern, text)
                if match:
                    params = match.groupdict()
                    params['intent'] = intent
                    return params
        
        # If no pattern matches, return as a general command
        return {'intent': 'unknown', 'text': text}
```

## Integration with ROS 2

To integrate voice command processing with our ROS 2 system:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import Twist

class VoiceCommandNode(Node):
    def __init__(self):
        super().__init__('voice_command_node')
        
        # Publisher for robot commands
        self.cmd_vel_publisher = self.create_publisher(Twist, '/cmd_vel', 10)
        
        # Publisher for voice status
        self.status_publisher = self.create_publisher(String, 'voice_status', 10)
        
        # Initialize voice processor
        self.voice_processor = VoiceCommandProcessor()
        self.command_parser = CommandParser()
        
        # Timer to periodically check for voice commands
        self.timer = self.create_timer(1.0, self.check_voice_commands)
        
    def check_voice_commands(self):
        """Check for and process voice commands"""
        try:
            transcription = self.voice_processor.process_voice_command()
            if transcription:
                self.get_logger().info(f"Heard: {transcription}")
                
                # Publish status
                status_msg = String()
                status_msg.data = f"Heard: {transcription}"
                self.status_publisher.publish(status_msg)
                
                # Parse and execute command
                command = self.command_parser.parse_command(transcription)
                self.execute_command(command)
        except Exception as e:
            self.get_logger().error(f"Error processing voice command: {e}")
    
    def execute_command(self, command):
        """Execute the parsed command"""
        intent = command.get('intent')
        
        if intent == 'move':
            direction = command.get('direction')
            self.move_robot(direction)
        elif intent == 'turn':
            direction = command.get('direction')
            self.turn_robot(direction)
        elif intent == 'navigate':
            location = command.get('location')
            self.navigate_to_location(location)
        else:
            self.get_logger().info(f"Unknown command: {command}")
    
    def move_robot(self, direction):
        """Move the robot in the specified direction"""
        msg = Twist()
        
        if direction == 'forward':
            msg.linear.x = 0.5
        elif direction == 'backward':
            msg.linear.x = -0.5
        elif direction == 'left':
            msg.linear.y = 0.5
        elif direction == 'right':
            msg.linear.y = -0.5
            
        self.cmd_vel_publisher.publish(msg)
        self.get_logger().info(f"Moving {direction}")
```

## Performance Considerations

### Real-Time Processing

For real-time voice command processing, consider:

1. **Model Size**: Smaller Whisper models (tiny, base) are faster but less accurate
2. **Hardware Acceleration**: Use GPU acceleration when available
3. **Optimization**: Use optimized inference libraries like ONNX Runtime

### Accuracy Improvements

To improve voice command accuracy:

1. **Noise Reduction**: Apply noise reduction algorithms
2. **Custom Training**: Fine-tune Whisper on robot-specific commands
3. **Context Awareness**: Use context to disambiguate similar-sounding commands

## Chapter Summary

This chapter covered the implementation of voice command processing using Whisper for humanoid robots. We explored the complete pipeline from audio capture to command execution, including voice activity detection and command parsing. In the next chapter, we'll explore how to use large language models for task planning.