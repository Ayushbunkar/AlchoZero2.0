# 🔥 Firebase Backend Integration Guide

## Complete Guide to Connect Hardware/Backend to Firebase

This document explains how to connect your hardware devices, sensors, and backend systems to Firebase for real-time monitoring.

---

## 📊 Database Structure

### Realtime Database Structure
```
deviceMonitoring/
  └── {deviceId}/
      ├── alcoholLevel: 0.05
      ├── engine: "ON" | "LOCKED"
      ├── faceAuth:
      │   ├── verified: true/false
      │   ├── confidence: 0.95
      │   └── lastCheck: 1732345678900
      ├── drowsiness:
      │   ├── detected: true/false
      │   ├── perclosValue: 0.3
      │   ├── eyesClosed: true/false
      │   └── severity: "none" | "mild" | "severe"
      ├── distraction:
      │   ├── detected: true/false
      │   ├── type: "phone" | "smoking" | "looking_away" | null
      │   └── duration: 5000 (milliseconds)
      ├── audioAlcohol:
      │   ├── detected: true/false
      │   ├── slurringScore: 0.7
      │   └── confidence: 0.85
      ├── rashDriving:
      │   ├── detected: true/false
      │   ├── harshBraking: true/false
      │   ├── drifting: true/false
      │   ├── overSpeeding: true/false
      │   ├── speed: 85 (km/h)
      │   └── acceleration: 2.5 (m/s²)
      ├── driverScore: 85
      ├── connected: true
      ├── timestamp: 1732345678900
      └── location: {lat: 28.7041, lng: 77.1025}

deviceAlerts/
  └── {deviceId}/
      └── count: 5
```

### Firestore Collections Structure
```
monitoring_logs/
  └── {logId}:
      - deviceId: "ALCH-001"
      - alcoholLevel: 0.05
      - faceAuth: {...}
      - drowsiness: {...}
      - distraction: {...}
      - audioAlcohol: {...}
      - rashDriving: {...}
      - driverScore: 85
      - timestamp: 1732345678900

safety_alerts/
  └── {alertId}:
      - deviceId: "ALCH-001"
      - alertType: "drowsiness" | "alcohol" | "distraction" | "rash_driving" | "face_auth_failed"
      - severity: "low" | "medium" | "high" | "critical"
      - message: "Drowsiness detected"
      - data: {...}
      - resolved: false
      - timestamp: 1732345678900

behavior_scores/
  └── {scoreId}:
      - deviceId: "ALCH-001"
      - score: 85
      - factors:
          - safeDriving: 45
          - rashDrivingEvents: 2
          - distractionEvents: 3
          - drowsinessEvents: 1
          - alcoholDetections: 0
          - totalTrips: 50
      - timestamp: 1732345678900
```

---

## 🔌 Connection Methods

### Method 1: Direct Hardware to Firebase (Recommended)

#### For Arduino/ESP32/Raspberry Pi

**Install Firebase Library:**
```bash
# For Python (Raspberry Pi)
pip install firebase-admin python-firebase

# For Arduino/ESP32
# Install "Firebase ESP Client" library from Arduino Library Manager
```

**Python Example (Raspberry Pi):**
```python
import firebase_admin
from firebase_admin import credentials, db
import time
import random

# Initialize Firebase
cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://fftour-5ac79-default-rtdb.firebaseio.com'
})

# Get reference to your device
device_id = 'ALCH-001'
ref = db.reference(f'/deviceMonitoring/{device_id}')

# Send monitoring data
def update_monitoring_data():
    data = {
        'alcoholLevel': 0.05,  # From alcohol sensor
        'engine': 'ON',
        'faceAuth': {
            'verified': True,
            'confidence': 0.95,
            'lastCheck': int(time.time() * 1000)
        },
        'drowsiness': {
            'detected': False,
            'perclosValue': 0.2,
            'eyesClosed': False,
            'severity': 'none'
        },
        'distraction': {
            'detected': False,
            'type': None,
            'duration': 0
        },
        'audioAlcohol': {
            'detected': False,
            'slurringScore': 0.1,
            'confidence': 0.3
        },
        'rashDriving': {
            'detected': False,
            'harshBraking': False,
            'drifting': False,
            'overSpeeding': False,
            'speed': 60,
            'acceleration': 0.5
        },
        'driverScore': 85,
        'connected': True,
        'timestamp': int(time.time() * 1000)
    }
    
    ref.set(data)
    print(f"Data sent to Firebase for {device_id}")

# Update every 3 seconds
while True:
    update_monitoring_data()
    time.sleep(3)
```

**Arduino/ESP32 Example:**
```cpp
#include <WiFi.h>
#include <FirebaseESP32.h>

// WiFi credentials
#define WIFI_SSID "your-wifi-ssid"
#define WIFI_PASSWORD "your-wifi-password"

// Firebase credentials
#define FIREBASE_HOST "fftour-5ac79-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "your-database-secret"

FirebaseData firebaseData;
String deviceId = "ALCH-001";

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  // Initialize Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
}

void loop() {
  // Read sensor data
  float alcoholLevel = readAlcoholSensor();
  bool drowsinessDetected = checkDrowsiness();
  bool distractionDetected = checkDistraction();
  
  // Create path
  String path = "/deviceMonitoring/" + deviceId;
  
  // Send data to Firebase
  Firebase.setFloat(firebaseData, path + "/alcoholLevel", alcoholLevel);
  Firebase.setString(firebaseData, path + "/engine", alcoholLevel > 0.15 ? "LOCKED" : "ON");
  Firebase.setBool(firebaseData, path + "/drowsiness/detected", drowsinessDetected);
  Firebase.setBool(firebaseData, path + "/distraction/detected", distractionDetected);
  Firebase.setBool(firebaseData, path + "/connected", true);
  Firebase.setInt(firebaseData, path + "/timestamp", millis());
  
  delay(3000); // Update every 3 seconds
}

float readAlcoholSensor() {
  // Your alcohol sensor code
  return analogRead(A0) * 0.0001;
}

bool checkDrowsiness() {
  // Your drowsiness detection code
  return false;
}

bool checkDistraction() {
  // Your distraction detection code
  return false;
}
```

---

### Method 2: Backend API to Firebase

**Node.js Backend Example:**

```javascript
const admin = require('firebase-admin');
const express = require('express');
const app = express();

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fftour-5ac79-default-rtdb.firebaseio.com'
});

const db = admin.database();
const firestore = admin.firestore();

app.use(express.json());

// API endpoint to receive hardware data
app.post('/api/device/monitoring', async (req, res) => {
  try {
    const { deviceId, data } = req.body;
    
    // Update Realtime Database
    await db.ref(`/deviceMonitoring/${deviceId}`).set({
      ...data,
      timestamp: Date.now(),
      connected: true
    });
    
    // Log to Firestore
    await firestore.collection('monitoring_logs').add({
      deviceId,
      ...data,
      timestamp: Date.now()
    });
    
    // Check for alerts
    if (data.alcoholLevel > 0.15) {
      await firestore.collection('safety_alerts').add({
        deviceId,
        alertType: 'alcohol',
        severity: data.alcoholLevel > 0.3 ? 'critical' : 'high',
        message: `High alcohol level detected: ${data.alcoholLevel}`,
        data: { alcoholLevel: data.alcoholLevel },
        resolved: false,
        timestamp: Date.now()
      });
    }
    
    if (data.drowsiness?.detected) {
      await firestore.collection('safety_alerts').add({
        deviceId,
        alertType: 'drowsiness',
        severity: data.drowsiness.severity === 'severe' ? 'high' : 'medium',
        message: 'Drowsiness detected',
        data: data.drowsiness,
        resolved: false,
        timestamp: Date.now()
      });
    }
    
    res.json({ success: true, message: 'Data received' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API to get device status
app.get('/api/device/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const snapshot = await db.ref(`/deviceMonitoring/${deviceId}`).once('value');
    res.json({ success: true, data: snapshot.val() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Backend API running on port 3000');
});
```

---

### Method 3: MQTT to Firebase (For IoT Devices)

```javascript
const mqtt = require('mqtt');
const admin = require('firebase-admin');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),
  databaseURL: 'https://fftour-5ac79-default-rtdb.firebaseio.com'
});

const db = admin.database();

// Connect to MQTT broker
const client = mqtt.connect('mqtt://your-mqtt-broker:1883');

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  
  // Subscribe to device topics
  client.subscribe('devices/+/monitoring');
  client.subscribe('devices/+/alerts');
});

client.on('message', async (topic, message) => {
  const parts = topic.split('/');
  const deviceId = parts[1];
  const dataType = parts[2];
  
  const data = JSON.parse(message.toString());
  
  if (dataType === 'monitoring') {
    // Update Firebase Realtime Database
    await db.ref(`/deviceMonitoring/${deviceId}`).set({
      ...data,
      timestamp: Date.now(),
      connected: true
    });
  }
});
```

---

## 📡 Sensor Integration Examples

### 1. Alcohol Sensor (MQ-3)
```python
import Adafruit_ADS1x15
import time

# Create ADC instance
adc = Adafruit_ADS1x15.ADS1115()

def read_alcohol_level():
    # Read from alcohol sensor
    value = adc.read_adc(0, gain=1)
    
    # Convert to BAC (calibration needed)
    bac = value * 0.0001  # Adjust multiplier based on calibration
    
    return round(bac, 3)

# Send to Firebase
alcoholLevel = read_alcohol_level()
ref = db.reference(f'/deviceMonitoring/{device_id}/alcoholLevel')
ref.set(alcoholLevel)
```

### 2. Face Recognition
```python
import face_recognition
import cv2

def verify_driver_face(known_face_encoding):
    # Capture image from camera
    video_capture = cv2.VideoCapture(0)
    ret, frame = video_capture.read()
    
    # Find faces in frame
    face_locations = face_recognition.face_locations(frame)
    face_encodings = face_recognition.face_encodings(frame, face_locations)
    
    verified = False
    confidence = 0
    
    if len(face_encodings) > 0:
        # Compare with known face
        matches = face_recognition.compare_faces([known_face_encoding], face_encodings[0])
        face_distances = face_recognition.face_distance([known_face_encoding], face_encodings[0])
        
        if matches[0]:
            verified = True
            confidence = 1 - face_distances[0]
    
    video_capture.release()
    
    return {
        'verified': verified,
        'confidence': round(confidence, 2),
        'lastCheck': int(time.time() * 1000)
    }

# Send to Firebase
face_auth_data = verify_driver_face(known_encoding)
ref = db.reference(f'/deviceMonitoring/{device_id}/faceAuth')
ref.set(face_auth_data)
```

### 3. Drowsiness Detection (PERCLOS)
```python
import dlib
import cv2
from scipy.spatial import distance

def eye_aspect_ratio(eye):
    A = distance.euclidean(eye[1], eye[5])
    B = distance.euclidean(eye[2], eye[4])
    C = distance.euclidean(eye[0], eye[3])
    return (A + B) / (2.0 * C)

def detect_drowsiness():
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
    
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    faces = detector(gray)
    
    drowsiness_detected = False
    perclos_value = 0
    
    if len(faces) > 0:
        shape = predictor(gray, faces[0])
        
        # Get eye coordinates
        left_eye = [(shape.part(i).x, shape.part(i).y) for i in range(36, 42)]
        right_eye = [(shape.part(i).x, shape.part(i).y) for i in range(42, 48)]
        
        # Calculate EAR
        left_ear = eye_aspect_ratio(left_eye)
        right_ear = eye_aspect_ratio(right_eye)
        ear = (left_ear + right_ear) / 2.0
        
        # PERCLOS threshold
        if ear < 0.25:
            drowsiness_detected = True
            perclos_value = 1 - ear
    
    cap.release()
    
    return {
        'detected': drowsiness_detected,
        'perclosValue': round(perclos_value, 2),
        'eyesClosed': drowsiness_detected,
        'severity': 'severe' if perclos_value > 0.8 else ('mild' if perclos_value > 0.5 else 'none')
    }

# Send to Firebase
drowsiness_data = detect_drowsiness()
ref = db.reference(f'/deviceMonitoring/{device_id}/drowsiness')
ref.set(drowsiness_data)
```

### 4. Accelerometer for Rash Driving
```python
import smbus
import math

# MPU6050 Registers
PWR_MGMT_1 = 0x6B
ACCEL_XOUT_H = 0x3B

bus = smbus.SMBus(1)
address = 0x68

def read_acceleration():
    # Read accelerometer data
    accel_x = read_word_2c(ACCEL_XOUT_H)
    accel_y = read_word_2c(ACCEL_XOUT_H + 2)
    accel_z = read_word_2c(ACCEL_XOUT_H + 4)
    
    # Convert to m/s²
    accel_x = accel_x / 16384.0 * 9.81
    accel_y = accel_y / 16384.0 * 9.81
    accel_z = accel_z / 16384.0 * 9.81
    
    # Calculate total acceleration
    total_accel = math.sqrt(accel_x**2 + accel_y**2 + accel_z**2)
    
    # Detect harsh events
    harsh_braking = accel_x < -15  # Sudden deceleration
    harsh_acceleration = accel_x > 15  # Sudden acceleration
    drifting = abs(accel_y) > 12  # Lateral g-force
    
    return {
        'detected': harsh_braking or harsh_acceleration or drifting,
        'harshBraking': harsh_braking,
        'drifting': drifting,
        'overSpeeding': False,  # From GPS
        'speed': 0,  # From GPS
        'acceleration': round(total_accel, 2)
    }

# Send to Firebase
rash_driving_data = read_acceleration()
ref = db.reference(f'/deviceMonitoring/{device_id}/rashDriving')
ref.set(rash_driving_data)
```

---

## 🔐 Firebase Security Rules

Update your `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Monitoring logs - authenticated users can read, devices can write
    match /monitoring_logs/{logId} {
      allow read: if request.auth != null;
      allow write: if true; // Allow hardware to write
    }
    
    // Safety alerts
    match /safety_alerts/{alertId} {
      allow read: if request.auth != null;
      allow create: if true; // Allow hardware to create alerts
      allow update, delete: if request.auth != null;
    }
    
    // Behavior scores
    match /behavior_scores/{scoreId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Update your `database.rules.json` (Realtime Database):
```json
{
  "rules": {
    "deviceMonitoring": {
      "$deviceId": {
        ".read": "auth != null",
        ".write": true
      }
    },
    "deviceAlerts": {
      "$deviceId": {
        ".read": "auth != null",
        ".write": true
      }
    }
  }
}
```

---

## 🚀 Testing the Connection

### Test Script (Python)
```python
import firebase_admin
from firebase_admin import credentials, db
import time
import random

# Initialize
cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://fftour-5ac79-default-rtdb.firebaseio.com'
})

device_id = 'ALCH-TEST-001'
ref = db.reference(f'/deviceMonitoring/{device_id}')

# Send test data
for i in range(10):
    data = {
        'alcoholLevel': round(random.uniform(0, 0.3), 3),
        'engine': 'ON' if random.random() > 0.3 else 'LOCKED',
        'faceAuth': {
            'verified': random.random() > 0.2,
            'confidence': round(random.uniform(0.7, 1.0), 2)
        },
        'drowsiness': {
            'detected': random.random() > 0.7,
            'perclosValue': round(random.uniform(0, 1), 2)
        },
        'connected': True,
        'timestamp': int(time.time() * 1000)
    }
    
    ref.set(data)
    print(f"Test data {i+1} sent successfully!")
    time.sleep(2)

print("Test completed! Check your dashboard.")
```

---

## 📱 Frontend Integration (Already Done!)

The Monitor page is already configured to listen to Firebase real-time updates:

```javascript
// In Monitor.jsx - Already implemented
listenToMultipleDevices(deviceIds, (data) => {
  setRealtimeData(data); // Automatically updates UI
});
```

When your hardware sends data to Firebase, it will automatically appear in the dashboard in real-time! ⚡

---

## 🎯 Next Steps

1. **Get Firebase Service Account Key:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file

2. **Setup Hardware:**
   - Connect your sensors (alcohol, camera, accelerometer)
   - Install required libraries
   - Use the code examples above

3. **Deploy Rules:**
   ```bash
   firebase deploy --only database
   firebase deploy --only firestore:rules
   ```

4. **Test Connection:**
   - Run the test script
   - Check Firebase Console → Realtime Database
   - Check your dashboard → Monitor page

5. **Monitor Live:**
   - Open your dashboard
   - Go to Monitor page
   - See real-time data from your hardware!

---

## 🆘 Troubleshooting

**Problem: Data not showing up**
- Check Firebase connection
- Verify device ID matches
- Check Realtime Database rules

**Problem: Permission denied**
- Update security rules
- Check authentication token

**Problem: Slow updates**
- Check internet connection
- Reduce update frequency
- Use batch updates

---

**Your system is now ready for hardware integration!** 🎉

When your hardware sends data to Firebase, it will automatically appear in your dashboard in real-time.
