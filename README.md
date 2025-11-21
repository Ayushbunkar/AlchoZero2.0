# 🚗 AlchoZero - Alcohol Detection System

<div align="center">

![AlchoZero Logo](https://img.shields.io/badge/AlchoZero-Drive%20Safe-00f3ff?style=for-the-badge)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**An intelligent IoT-based alcohol detection system that automatically locks the engine and alerts administrators in real-time.**

[Features](#-features) • [Installation](#-installation) • [Hardware Setup](#-hardware-setup) • [Deployment](#-deployment) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Firebase Setup](#-firebase-setup)
- [Frontend Setup](#-frontend-setup)
- [Firebase Functions Setup](#-firebase-functions-setup)
- [Hardware Setup](#-hardware-setup)
- [Deployment](#-deployment)
- [Usage](#-usage)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

AlchoZero is a comprehensive alcohol detection and prevention system designed for vehicles. It combines:

- **MQ-3 Sensor** - Detects breath alcohol content (BAC)
- **ESP32 Microcontroller** - Processes sensor data and controls engine relay
- **Firebase Backend** - Real-time database, cloud functions, and authentication
- **React Dashboard** - Live monitoring, alerts, and historical data visualization

### How It Works

1. **Detection**: MQ-3 sensor continuously monitors for alcohol vapor
2. **Analysis**: ESP32 calculates BAC and sends data to Firebase
3. **Action**: If BAC exceeds threshold (0.03%), engine is automatically locked
4. **Alert**: Firebase Cloud Functions trigger email/SMS notifications to admin
5. **Monitor**: Real-time dashboard displays live status and historical logs

---

## ✨ Features

### 🔬 Core Features

- ✅ Real-time alcohol detection with MQ-3 sensor
- ✅ Automatic engine lock via relay module
- ✅ Instant Firebase Realtime Database sync
- ✅ Cloud Functions for automated alerts
- ✅ Email notifications (Gmail/SMTP)
- ✅ SMS alerts support (Twilio integration)
- ✅ Historical data logging in Firestore
- ✅ Live monitoring dashboard

### 📊 Dashboard Features

- ✅ Real-time device status monitoring
- ✅ Interactive charts (Recharts)
- ✅ Device connection status
- ✅ Alert management system
- ✅ Historical logs viewer
- ✅ Admin authentication
- ✅ Responsive design (mobile-friendly)
- ✅ Dark mode with neon accents

### 🔐 Security Features

- ✅ Firebase Authentication
- ✅ Firestore security rules
- ✅ Realtime Database rules
- ✅ Protected admin routes
- ✅ Secure API endpoints

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Firebase SDK** - Backend integration

### Backend
- **Firebase Authentication** - User management
- **Firebase Realtime Database** - Live data sync
- **Firestore** - Document storage
- **Firebase Cloud Functions** - Serverless backend
- **Firebase Hosting** - Static hosting
- **Nodemailer** - Email notifications

### Hardware
- **ESP32/NodeMCU** - Microcontroller
- **MQ-3 Sensor** - Alcohol detection
- **5V Relay Module** - Engine control
- **LEDs & Buzzer** - Visual/audio indicators

---

## 📁 Project Structure

```
Alchozero2.0/
├── client/                      # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── DeviceCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── firebaseConfig.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── functions/                   # Firebase Cloud Functions
│   ├── index.js
│   └── package.json
│
├── hardware/                    # ESP32 Arduino Code
│   └── AlchoZero_ESP32.ino
│
├── firebase.json               # Firebase configuration
├── firestore.rules             # Firestore security rules
├── database.rules.json         # RTDB security rules
├── storage.rules               # Storage security rules
├── firestore.indexes.json      # Firestore indexes
└── README.md                   # This file
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### Software Requirements

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Git**
- **Arduino IDE** (for ESP32 programming)

### Hardware Requirements

- ESP32 or NodeMCU board
- MQ-3 Alcohol Sensor
- 5V Relay Module
- LEDs (Red & Green)
- Buzzer (optional)
- Jumper wires
- Breadboard
- 5V Power supply

### Accounts Needed

- Firebase account ([firebase.google.com](https://firebase.google.com))
- Gmail account (for email notifications)
- Twilio account (optional, for SMS)

---

## 🚀 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/alchozero.git
cd alchozero
```

---

## 🔥 Firebase Setup

### 1️⃣ Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter project name: `AlchoZero`
4. Enable Google Analytics (optional)
5. Click **"Create Project"**

### 2️⃣ Enable Firebase Services

#### Authentication
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. Create admin user:
   - Email: `admin@alchozero.com`
   - Password: `Admin@123`

#### Realtime Database
1. Go to **Realtime Database** > **Create Database**
2. Choose region closest to you
3. Start in **Test mode** (we'll apply rules later)
4. Copy your database URL (e.g., `https://project-id.firebaseio.com/`)

#### Firestore
1. Go to **Firestore Database** > **Create Database**
2. Start in **Test mode**
3. Choose region

#### Cloud Functions
1. Upgrade to **Blaze Plan** (pay-as-you-go)
   - Required for Cloud Functions
   - Free tier includes generous limits

### 3️⃣ Get Firebase Configuration

1. Go to **Project Settings** > **General**
2. Scroll to **Your apps** > Click **Web** icon (</>)
3. Register app name: `AlchoZero Web`
4. Copy the configuration object:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 4️⃣ Update Firebase Config in Code

Edit `client/src/firebaseConfig.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## 💻 Frontend Setup

### 1️⃣ Install Dependencies

```bash
cd client
npm install
```

### 2️⃣ Run Development Server

```bash
npm run dev
```

Open browser at `http://localhost:5173`

### 3️⃣ Build for Production

```bash
npm run build
```

Output will be in `client/dist/`

---

## ⚡ Firebase Functions Setup

### 1️⃣ Install Dependencies

```bash
cd functions
npm install
```

### 2️⃣ Configure Email Notifications

Edit `functions/index.js`:

```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password', // Generate from Google Account settings
  },
});
```

**Generate Gmail App Password:**
1. Go to [Google Account](https://myaccount.google.com/)
2. Security > 2-Step Verification
3. App passwords > Generate
4. Copy the 16-character password

### 3️⃣ Test Functions Locally (Optional)

```bash
cd functions
npm run serve
```

### 4️⃣ Deploy Functions

```bash
firebase deploy --only functions
```

---

## 🔌 Hardware Setup

### 1️⃣ Required Components

| Component | Quantity | Purpose |
|-----------|----------|---------|
| ESP32 or NodeMCU | 1 | Microcontroller |
| MQ-3 Alcohol Sensor | 1 | Alcohol detection |
| 5V Relay Module | 1 | Engine control |
| Green LED | 1 | Safe indicator |
| Red LED | 1 | Alert indicator |
| Buzzer | 1 | Audio alert |
| 220Ω Resistors | 2 | LED current limiting |
| Jumper Wires | ~20 | Connections |
| Breadboard | 1 | Prototyping |

### 2️⃣ Wiring Diagram

#### ESP32 Connections

| Component | Pin | ESP32 GPIO |
|-----------|-----|------------|
| MQ-3 VCC | - | 5V |
| MQ-3 GND | - | GND |
| MQ-3 AO | - | GPIO 34 |
| Relay VCC | - | 5V |
| Relay GND | - | GND |
| Relay IN | - | GPIO 25 |
| Green LED + | - | GPIO 26 |
| Green LED - | - | GND (via 220Ω) |
| Red LED + | - | GPIO 27 |
| Red LED - | - | GND (via 220Ω) |
| Buzzer + | - | GPIO 14 |
| Buzzer - | - | GND |

### 3️⃣ Install ESP32 Libraries

1. Open **Arduino IDE**
2. Go to **Tools** > **Board** > **Boards Manager**
3. Search for "ESP32" and install
4. Install required libraries:
   - Go to **Sketch** > **Include Library** > **Manage Libraries**
   - Install: `Firebase ESP Client` by Mobizt

### 4️⃣ Configure Arduino Code

Edit `hardware/AlchoZero_ESP32.ino`:

```cpp
// WiFi credentials
#define WIFI_SSID "Your_WiFi_SSID"
#define WIFI_PASSWORD "Your_WiFi_Password"

// Firebase credentials
#define API_KEY "YOUR_FIREBASE_API_KEY"
#define DATABASE_URL "YOUR_DATABASE_URL"

// Device ID
#define DEVICE_ID "Car123"
```

### 5️⃣ Upload Code to ESP32

1. Connect ESP32 to computer via USB
2. Select **Board**: Tools > Board > ESP32 Dev Module
3. Select **Port**: Tools > Port > (Your COM port)
4. Click **Upload** button
5. Wait for "Done uploading" message

### 6️⃣ Monitor Serial Output

1. Open **Tools** > **Serial Monitor**
2. Set baud rate to **115200**
3. You should see:
   - WiFi connection status
   - Firebase authentication
   - Sensor readings
   - Data upload confirmations

---

## 🌐 Deployment

### 1️⃣ Login to Firebase

```bash
firebase login
```

### 2️⃣ Initialize Firebase Project

```bash
firebase init
```

Select:
- ✅ Hosting
- ✅ Functions
- ✅ Firestore
- ✅ Realtime Database

Choose existing project: **AlchoZero**

### 3️⃣ Build Frontend

```bash
cd client
npm run build
```

### 4️⃣ Deploy Everything

```bash
# Deploy all services
firebase deploy

# Or deploy individually:
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only database:rules
```

### 5️⃣ Access Your App

After deployment, Firebase will provide a URL:
```
https://your-project-id.web.app
```

---

## 📖 Usage

### Admin Login

1. Navigate to `/dashboard`
2. Login with credentials:
   - **Email**: `admin@alchozero.com`
   - **Password**: `Admin@123`

### Dashboard Features

- **Live Status**: Real-time alcohol level and engine status
- **Device Card**: Detailed device information
- **Charts**: Visual representation of alcohol levels
- **Logs Table**: Historical data records
- **Alerts**: Active alerts and notifications

### Testing the System

1. **Power on ESP32**
2. **Wait for WiFi connection**
3. **Bring alcohol near MQ-3 sensor**
4. **Observe**:
   - Red LED lights up
   - Buzzer sounds
   - Dashboard shows alert
   - Email notification sent
   - Engine relay locks

---

## 🐛 Troubleshooting

### ESP32 Issues

**Problem**: ESP32 not connecting to WiFi
```cpp
// Solution: Check WiFi credentials in code
#define WIFI_SSID "Your_WiFi_SSID"
#define WIFI_PASSWORD "Your_WiFi_Password"
```

**Problem**: Firebase connection failed
- Verify API_KEY and DATABASE_URL
- Check Firebase project settings
- Ensure Realtime Database is enabled

**Problem**: Sensor readings always 0
- Check MQ-3 connections
- Verify sensor has warmed up (2-3 minutes)
- Test with isopropyl alcohol

### Frontend Issues

**Problem**: Build errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Problem**: Firebase not connecting
- Check firebaseConfig.js has correct credentials
- Verify Firebase services are enabled
- Check browser console for errors

### Cloud Functions Issues

**Problem**: Functions not deploying
```bash
# Solution: Upgrade to Blaze plan
# Then redeploy:
firebase deploy --only functions
```

**Problem**: Email not sending
- Generate Gmail App Password
- Update transporter config in functions/index.js
- Check function logs: `firebase functions:log`

---

## 📝 API Reference

### Firebase Realtime Database Structure

```json
{
  "deviceStatus": {
    "Car123": {
      "alcoholLevel": 0.42,
      "engine": "OFF",
      "timestamp": 1732143200000
    }
  }
}
```

### Firestore Collections

#### `logs` Collection
```javascript
{
  deviceId: "Car123",
  alcoholLevel: 0.58,
  engine: "OFF",
  timestamp: 1732143200000,
  status: "ALERT"
}
```

#### `alerts` Collection
```javascript
{
  deviceId: "Car123",
  alcoholLevel: 0.58,
  type: "AUTO",
  timestamp: 1732143200000,
  message: "ALERT: High alcohol level detected",
  status: "new",
  severity: "HIGH"
}
```

#### `contact` Collection
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  message: "Inquiry about the system",
  timestamp: 1732143200000,
  status: "new"
}
```

---

## 🔐 Security

### Firestore Rules

```javascript
// Read: Authenticated users only
// Write: Cloud Functions only
match /logs/{logId} {
  allow read: if request.auth != null;
  allow write: if false;
}
```

### Realtime Database Rules

```json
{
  "deviceStatus": {
    "$deviceId": {
      ".read": "auth != null",
      ".write": true
    }
  }
}
```

---

## 🎨 Customization

### Change Theme Colors

Edit `client/tailwind.config.js`:

```javascript
colors: {
  neon: {
    blue: '#00f3ff',    // Change to your color
    purple: '#a855f7',
    pink: '#ec4899',
  }
}
```

### Adjust Alcohol Threshold

Edit `hardware/AlchoZero_ESP32.ino`:

```cpp
#define ALCOHOL_THRESHOLD 0.03  // Change threshold value
```

And `functions/index.js`:

```javascript
const THRESHOLD = 0.03; // Match hardware threshold
```

---

## 📊 Performance

- **Sensor Response Time**: < 1 second
- **Firebase Sync Interval**: 5 seconds
- **Alert Trigger Time**: < 2 seconds
- **Email Delivery**: 5-10 seconds
- **Dashboard Update**: Real-time

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Project Lead**: Your Name
- **Hardware Engineer**: Team Member 1
- **Frontend Developer**: Team Member 2
- **Backend Developer**: Team Member 3

---

## 📧 Contact

For support or inquiries:

- **Email**: support@alchozero.com
- **Website**: https://alchozero.com
- **GitHub**: https://github.com/your-username/alchozero

---

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- React team for the amazing framework
- Tailwind CSS for the styling system
- MQ-3 sensor manufacturers
- ESP32 community

---

<div align="center">

**Made with ❤️ for Safer Roads**

⭐ Star this repo if you find it helpful!

</div>
