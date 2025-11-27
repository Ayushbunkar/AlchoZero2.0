# AlcoZero — Backend Documentation

This README documents the backend architecture and Cloud Functions for the AlcoZero project. It covers how the system works end-to-end, Cloud Functions details, database schemas, security rules, deployment steps, local testing, and recommended improvements.

**Important:** This file covers backend (Firebase Cloud Functions, Realtime Database, Firestore). The frontend React app lives in `client/` and uses Firebase SDK to interact with these services.

**Table of contents**
- **Overview**
- **Architecture**
- **Cloud Functions (detailed)**
- **Realtime DB & Firestore data models**
- **Security rules summary**
- **End-to-end flows**
- **Environment & secrets**
- **Deploying functions**
- **Local testing and emulators**
- **How to simulate alerts (quick tests)**
- **Monitoring & logs**
- **Recommended improvements & next steps**
- **Contact / Notes**


**Overview**
- Backend uses Firebase:
  - Realtime Database (RTDB) for device telemetry and control paths (low-latency updates)
  - Firestore for persisted alerts, logs, statistics and admin data
  - Firebase Cloud Functions for server-side reactive logic and scheduled jobs
- Notifications are sent via `nodemailer` (Gmail credentials in current code), with Twilio SMS optional (commented-out)


**Architecture**

Devices (ESP32 + sensors) -> write telemetry to RTDB `deviceStatus/{deviceId}`
  - Cloud Functions listen to RTDB and react:
    - `onAlcoholDetected` (onUpdate `deviceStatus/{deviceId}/alcoholLevel`) -> creates `alerts` in Firestore + send email
    - `autoLogAlcoholLevel` (onWrite `deviceStatus/{deviceId}/alcoholLevel`) -> persist readings to Firestore `logs`
    - `onEngineStatusChange` (onUpdate `deviceStatus/{deviceId}/engine`) -> write `engineLogs` + notify admin
  - Scheduled functions:
    - `cleanupOldLogs` (daily) -> deletes logs older than 30 days
    - `generateDailyStats` (daily) -> aggregates todays stats to `statistics`


**Cloud Functions (detailed)**
File: `functions/index.js`

1) `onAlcoholDetected`
- Trigger: RTDB `.ref('deviceStatus/{deviceId}/alcoholLevel').onUpdate`
- Purpose: Detect crossing of alcohol threshold and create alerts + notify admin
- Config: `THRESHOLD = 0.03` (0.03% BAC). Severity `CRITICAL` if > 0.08
- Actions:
  - If `new > THRESHOLD` and `previous <= THRESHOLD`
    - Read device status at `deviceStatus/{deviceId}`
    - Create a Firestore document in `alerts` with fields: `deviceId`, `alcoholLevel`, `engine`, `type`, `timestamp`, `message`, `status`, `severity`
    - Call `sendEmailAlert(deviceId, alcoholLevel)` to notify admin
    - (Optional) call `sendSMSAlert` if enabled
- Note: Current code does not directly write a lock command to RTDB; device is expected to handle local locking or external commands must be added (recommended improvement below)


2) `autoLogAlcoholLevel`
- Trigger: RTDB `.ref('deviceStatus/{deviceId}/alcoholLevel').onWrite`
- Purpose: Append every reading to Firestore `logs` for analytics and audit
- Actions:
  - Read device status
  - Add to Firestore `logs`:
    - `deviceId`, `alcoholLevel`, `engine`, `timestamp`, `status` ('ALERT' | 'SAFE')


3) `onEngineStatusChange`
- Trigger: RTDB `.ref('deviceStatus/{deviceId}/engine').onUpdate`
- Purpose: Log engine ON/OFF events and notify admin when engine is locked
- Actions:
  - Create `engineLogs` entry in Firestore with previous/new status, timestamp, action
  - If `newStatus === 'OFF' && oldStatus === 'ON'` -> send engine lock notification email


4) `sendEmailAlert` and `sendEngineLockNotification`
- Helpers that use `nodemailer` to send HTML emails
- Current code uses a Gmail account configured inline (replace with secure secrets)


5) `cleanupOldLogs` (scheduled)
- Trigger: daily cron
- Purpose: Delete logs older than 30 days from Firestore


6) `generateDailyStats` (scheduled)
- Trigger: daily cron
- Purpose: Compute daily aggregates (total logs, total alerts, average alcohol level, max alcohol level, device count)
- Stores result in Firestore `statistics`


**Realtime DB & Firestore data models**

Realtime Database: `deviceStatus/{deviceId}` (example)
```json
{
  "alcoholLevel": 0.042,
  "engine": "OFF",
  "lastSeen": 1690000000000,
  "battery": 88,
  "gps": { "lat": 19.07, "lng": 72.87 }
}
```

Firestore collections & example documents:

- `alerts/{alertId}`
```json
{
  "deviceId": "device-123",
  "alcoholLevel": 0.042,
  "engine": "OFF",
  "type": "AUTO",
  "timestamp": 1690001000000,
  "message": "ALERT: High alcohol level detected (0.042 BAC)",
  "status": "new",
  "severity": "HIGH"
}
```

- `logs/{logId}`
```json
{
  "deviceId": "device-123",
  "alcoholLevel": 0.020,
  "engine": "ON",
  "timestamp": 1690000000000,
  "status": "SAFE"
}
```

- `engineLogs/{id}`
```json
{
  "deviceId": "device-123",
  "previousStatus": "ON",
  "newStatus": "OFF",
  "timestamp": 1690001100000,
  "action": "LOCKED"
}
```

- `statistics/{id}`
```json
{
  "date": 1690000000000,
  "totalLogs": 125,
  "totalAlerts": 2,
  "averageAlcoholLevel": 0.012,
  "maxAlcoholLevel": 0.085,
  "deviceCount": 12
}
```


**Security rules summary (Firestore)**
File: `firestore.rules` (project root)
- `contact` create: open, read/update/delete: admin only
- `logs` read/create: authenticated users; update/delete: admin only
- `alerts` read/create: authenticated users; update/delete: admin only
- `engineLogs` & `statistics` write: false (Cloud Functions only)
- `users`, `user_profiles`, `user_settings`, `devices`: read/write controlled by authenticated user ownership

Recommendation: also lock RTDB rules for `deviceStatus` so only authorized devices or service accounts can write telemetry.


**End-to-end flows**

1) Device telemetry flow
- Device writes telemetry to RTDB `deviceStatus/{deviceId}` (periodic or event-driven)
- The RTDB triggers Cloud Functions

2) Detection and alert flow
- Device writes `alcoholLevel`
- `autoLogAlcoholLevel` logs reading to Firestore `logs`
- `onAlcoholDetected` creates an `alerts` doc and sends email when threshold crossed
- Dashboard reads `alerts` and surfaces them to admins
- (Recommended) Cloud Function writes a command to RTDB `deviceCommands/{deviceId}` instructing the device to lock engine; device listens and acts

3) Admin actions
- Admin can change `alerts/{alertId}.status` (admins only) to acknowledge/resolve
- Admin can review `logs` and `statistics` in dashboard

4) Scheduled maintenance
- Daily `generateDailyStats` writes aggregated `statistics`
- Daily `cleanupOldLogs` removes old `logs`


**Environment & secrets (recommended setup)**

_Do not store credentials in source control._ Use `firebase functions:config:set` or Secret Manager.

Recommended config keys (example):
- `smtp.user` - SMTP username
- `smtp.pass` - SMTP app password or API key
- `admin.email` - Admin notification address
- `twilio.sid` / `twilio.token` / `twilio.from` - For SMS

Set config (PowerShell example):

```powershell
# from project root
firebase functions:config:set smtp.user="your-email@gmail.com" smtp.pass="your-app-password" admin.email="admin@alcozero.com"
```

In `functions/index.js` use `functions.config().smtp.user` & `functions.config().smtp.pass` instead of hard-coded values.

For production, prefer Google Cloud Secret Manager and `secretManager` integration with Cloud Functions.


**Deploying functions**

1) Install dependencies (from `functions/`):

```powershell
cd "d:\Yash Coding\sih final\Alchozero2.0\functions"
npm install
```

2) Deploy functions (project root):

```powershell
# deploy all functions
firebase deploy --only functions

# or deploy specific functions
firebase deploy --only functions:onAlcoholDetected,functions:autoLogAlcoholLevel,functions:onEngineStatusChange
```

Notes:
- For scheduled functions, deploy to a project with billing (Blaze) enabled.
- Ensure Firestore & Realtime Database are enabled in the Firebase Console.


**Local testing and emulators**

Use Firebase Emulators for local testing:

```powershell
# from project root
firebase emulators:start --only functions,firestore,database
```

- Emulate device writes to RTDB via the Firebase Console or `curl` / `Invoke-RestMethod` to the emulator endpoints.
- Monitor function logs in the emulator terminal.


**How to simulate an alert (quick test)**

1) Use Firebase Console -> Realtime Database -> set
`deviceStatus/device-123/alcoholLevel` to `0.01` (safe)
2) Update to `0.05` (above threshold)

Or use PowerShell REST call:

```powershell
$project = "<PROJECT_ID>"
$url = "https://${project}.firebaseio.com/deviceStatus/device-123/alcoholLevel.json"
# set to 0.05
Invoke-RestMethod -Method PUT -Uri $url -Body "0.05"
```

Expected:
- `autoLogAlcoholLevel` creates a Firestore `logs` doc
- `onAlcoholDetected` creates `alerts` doc and tries to send an email (if transporter configured)


**Monitoring & logs**
- Use Firebase Console -> Functions -> Logs to inspect function execution and errors
- In production add Cloud Monitoring alerts for repeated failures or email issues


**Recommended improvements**
1. Move SMTP credentials to `functions.config()` or Secret Manager.
2. Implement a reliable engine lock command flow:
   - Cloud Function writes `deviceCommands/{deviceId}` with `{ lock: true, reason: 'high_bac' }`
   - Device subscribes and executes; then writes ack back `deviceCommands/{deviceId}/ack`.
3. Add deduplication / cooldown to avoid repeated alerts for sustained high readings.
4. Add per-device thresholds stored in `devices/{deviceId}.threshold`
5. Harden RTDB rules so only authorized devices can write telemetry
6. Use a transactional/queued notification system for high-volume deployments (SendGrid/SES)
7. Add unit/integration tests using Firebase Emulator Suite


**Frequently used paths & pieces of code**
- Cloud Functions source: `functions/index.js`
- Firestore rules: `firestore.rules`
- Realtime DB device path: `deviceStatus/{deviceId}`
- Firestore collections: `alerts`, `logs`, `engineLogs`, `statistics`


**Next steps I can implement for you (choose one)**
- A) Replace inline SMTP credentials with `functions.config()` usage and add a short README section showing how to set them.
- B) Implement `deviceCommands/{deviceId}/lock` write inside `onAlcoholDetected` and document expected device ack flow.
- C) Add deduplication & cooldown logic to `onAlcoholDetected` to prevent repeated alerts.

Tell me which you'd like and I will implement it.


**Contact / Notes**
- This documentation was generated from `functions/index.js` and `firestore.rules` in the repository. If you change function names or move code, update this README accordingly.

---
Generated: 2025-11-27
