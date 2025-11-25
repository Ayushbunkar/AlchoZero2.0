# 🚀 Quick Start Guide - AlcoZero

Get AlcoZero up and running in 10 minutes!

## 📋 Checklist

- [ ] Node.js 18+ installed
- [ ] Firebase account created
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Git installed

---

## ⚡ 5-Minute Setup (Frontend Only)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/your-username/alcozero.git
cd alcozero/client
npm install
```

### 2️⃣ Configure Firebase

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Enable Realtime Database
4. Enable Firestore
5. Copy your config from Project Settings

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

### 3️⃣ Create Admin User

In Firebase Console:
1. Go to Authentication > Users
2. Add user:
   - Email: `admin@alcozero.com`
   - Password: `Admin@123`

### 4️⃣ Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` 🎉

---

## 🔥 Full Setup (With Cloud Functions)

### 1️⃣ Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 2️⃣ Initialize Firebase

```bash
cd alchozero
firebase init
```

Select:
- ✅ Hosting
- ✅ Functions
- ✅ Firestore
- ✅ Realtime Database

### 3️⃣ Deploy Security Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only database:rules
```

### 4️⃣ Setup Cloud Functions

```bash
cd functions
npm install
```

Edit `functions/index.js` - Configure email:

```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password',
  },
});
```

Deploy:

```bash
firebase deploy --only functions
```

### 5️⃣ Build & Deploy Frontend

```bash
cd client
npm run build
cd ..
firebase deploy --only hosting
```

Your app is live! 🚀

---

## 🔌 Hardware Quick Setup

### Required Parts

- ESP32 board
- MQ-3 Alcohol Sensor
- 5V Relay Module
- 2x LEDs (Red & Green)
- Buzzer
- Jumper wires

### Connections

```
MQ-3 Sensor:
  VCC -> 5V
  GND -> GND
  AO -> GPIO 34

Relay:
  VCC -> 5V
  GND -> GND
  IN -> GPIO 25

Green LED -> GPIO 26 (+ 220Ω resistor)
Red LED -> GPIO 27 (+ 220Ω resistor)
Buzzer -> GPIO 14
```

### Upload Code

1. Install Arduino IDE
2. Install ESP32 board support
3. Install "Firebase ESP Client" library
4. Open `hardware/AlcoZero_ESP32.ino`
5. Update WiFi and Firebase credentials
6. Upload to ESP32

---

## 🧪 Test the System

### Frontend Test

1. Open dashboard: `http://localhost:5173/dashboard`
2. Login with admin credentials
3. You should see:
   - Device status card
   - Real-time charts
   - Logs table

### Hardware Test

1. Power on ESP32
2. Open Serial Monitor (115200 baud)
3. Wait for WiFi connection
4. Bring alcohol near sensor
5. Check:
   - Red LED lights up
   - Dashboard updates
   - Email notification (if configured)

---

## 🎯 Demo Mode (No Hardware)

Want to test without hardware? Use Firebase Console to simulate device data:

1. Go to Realtime Database in Firebase Console
2. Create this structure:

```json
{
  "deviceStatus": {
    "Car123": {
      "alcoholLevel": 0.45,
      "engine": "OFF",
      "timestamp": 1732143200000
    }
  }
}
```

3. Change `alcoholLevel` value to see dashboard update in real-time!

---

## 📝 Default Credentials

**Admin Login:**
- Email: `admin@alcozero.com`
- Password: `Admin@123`

**Device ID:**
- Default: `Car123`
- Change in ESP32 code: `#define DEVICE_ID "YourID"`

---

## 🐛 Common Issues

### Issue: "Firebase not connecting"
**Fix:** Check firebaseConfig.js has correct credentials

### Issue: "Build failed"
**Fix:**
```bash
rm -rf node_modules
npm install
npm run build
```

### Issue: "ESP32 not connecting to WiFi"
**Fix:** Check WiFi credentials in Arduino code

### Issue: "Email not sending"
**Fix:** 
1. Enable "Less secure app access" in Gmail
2. Or use App Password (recommended)

---

## 📚 Next Steps

- [ ] Customize theme colors in `tailwind.config.js`
- [ ] Add more devices in Firebase
- [ ] Configure SMS alerts (Twilio)
- [ ] Set up custom domain for hosting
- [ ] Add more admin users
- [ ] Integrate with vehicle systems

---

## 🔗 Useful Links

- **Firebase Console**: https://console.firebase.google.com
- **Full Documentation**: See README.md
- **Firebase Docs**: https://firebase.google.com/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **ESP32 Guide**: https://docs.espressif.com

---

## 💬 Need Help?

- 📧 Email: support@alcozero.com
- 🐛 Issues: GitHub Issues page
- 💬 Discord: [Join our server]
- 📖 Docs: README.md

---

**Happy Coding! 🚀**

Made with ❤️ for Safer Roads
