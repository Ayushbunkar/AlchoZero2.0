# 🔥 Firebase Setup - Step by Step Guide

## Current Status: ✅ Credentials Added

Your Firebase project: **fftour-5ac79**

---

## Step 1: Enable Authentication (Email/Password) ⚠️ MANUAL REQUIRED

1. **Open Firebase Console**: https://console.firebase.google.com/project/fftour-5ac79/authentication
2. Click **"Get Started"** (if first time)
3. Go to **"Sign-in method"** tab
4. Click **"Email/Password"**
5. **Toggle ON** the "Email/Password" option
6. Click **"Save"**

✅ **Status**: Ready to configure

---

## Step 2: Create Realtime Database ⚠️ MANUAL REQUIRED

1. **Open Realtime Database**: https://console.firebase.google.com/project/fftour-5ac79/database
2. Click **"Create Database"**
3. Select **Location**: `us-central1` (or your preferred region)
4. Choose **"Start in test mode"** (we'll deploy rules next)
5. Click **"Enable"**

✅ **Database URL**: https://fftour-5ac79-default-rtdb.firebaseio.com

**Deploy Security Rules** (after database is created):
```bash
cd "d:\Yash Coding\sih final\Alchozero2.0"
firebase deploy --only database
```

---

## Step 3: Create Firestore Database ⚠️ MANUAL REQUIRED

1. **Open Firestore**: https://console.firebase.google.com/project/fftour-5ac79/firestore
2. Click **"Create Database"**
3. Choose **"Start in production mode"** (we'll deploy rules)
4. Select **Location**: `us-central` (or your preferred region)
5. Click **"Enable"**

**Deploy Security Rules & Indexes** (after Firestore is created):
```bash
cd "d:\Yash Coding\sih final\Alchozero2.0"
firebase deploy --only firestore
```

---

## Step 4: Create Admin User ⚠️ MANUAL REQUIRED

### Option A: Using Firebase Console (Recommended)

1. **Open Authentication**: https://console.firebase.google.com/project/fftour-5ac79/authentication/users
2. Click **"Add user"**
3. Enter:
   - **Email**: `admin@alchozero.com`
   - **Password**: `Admin@123` (or your secure password)
4. Click **"Add user"**
5. **Copy the User UID** (you'll need this)

### Option B: Using Firebase CLI

```bash
# First, login to Firebase
firebase login

# Then run this command to create user programmatically
# (Note: This requires firebase-admin in a Node.js script)
```

---

## Step 5: Deploy All Firebase Rules & Functions

After completing Steps 1-4, deploy everything:

```bash
cd "d:\Yash Coding\sih final\Alchozero2.0"

# Login to Firebase (browser will open)
firebase login

# Initialize Firebase project (if not done)
firebase use fftour-5ac79

# Deploy Realtime Database rules
firebase deploy --only database

# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy Cloud Functions
firebase deploy --only functions

# Deploy Storage rules
firebase deploy --only storage
```

---

## Step 6: Test Your Setup

1. **Test Authentication**:
   - Go to: http://localhost:5174/dashboard
   - Login with: `admin@alchozero.com` / `Admin@123`

2. **Test Realtime Database**:
   - Dashboard should show live device data
   - Check Firebase Console for real-time updates

3. **Test Firestore**:
   - Submit contact form: http://localhost:5174/contact
   - Check Firestore Console for new document

4. **Test Cloud Functions**:
   - Simulate alcohol detection
   - Check if email alerts are sent

---

## Quick Deploy All (After Manual Steps Complete)

```bash
cd "d:\Yash Coding\sih final\Alchozero2.0"
firebase deploy
```

This deploys:
- ✅ Hosting (React app)
- ✅ Cloud Functions (6 functions)
- ✅ Firestore Rules & Indexes
- ✅ Realtime Database Rules
- ✅ Storage Rules

---

## Verification Checklist

- [ ] Authentication enabled (Email/Password)
- [ ] Realtime Database created
- [ ] Firestore Database created
- [ ] Admin user created (`admin@alchozero.com`)
- [ ] Database rules deployed
- [ ] Firestore rules deployed
- [ ] Cloud Functions deployed
- [ ] Can login to dashboard
- [ ] Device status shows in dashboard
- [ ] Contact form saves to Firestore

---

## Troubleshooting

### Error: "Firebase CLI not authenticated"
```bash
firebase login --reauth
```

### Error: "Permission denied"
```bash
firebase deploy --only database
firebase deploy --only firestore
```

### Error: "Functions deployment failed"
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

---

## 📞 Need Help?

Check the comprehensive guides:
- `README.md` - Complete documentation
- `QUICKSTART.md` - Quick setup guide
- `DEPLOYMENT_CHECKLIST.md` - Deployment steps

Firebase Console: https://console.firebase.google.com/project/fftour-5ac79
