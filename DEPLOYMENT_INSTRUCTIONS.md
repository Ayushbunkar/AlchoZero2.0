# Deployment Instructions

## 🔧 Fixes Applied

### 1. Firebase Firestore Permissions
- Updated `firestore.rules` to allow authenticated users to:
  - Create, read, update, delete devices
  - Read and write to counters (for driver ID generation)
  - Manage their own user profiles and settings
  - Create security logs

### 2. Cloudinary Upload Configuration
- Changed from signed uploads (API key/secret) to unsigned uploads (upload preset)
- More secure as API credentials don't need to be exposed in the frontend
- Simpler implementation without backend signature generation

---

## 📋 Required Actions

### Step 1: Deploy Firestore Rules

Run this command in your terminal from the project root:

```bash
firebase deploy --only firestore:rules
```

Or deploy all Firebase configurations:

```bash
firebase deploy
```

### Step 2: Configure Cloudinary Upload Preset

You need to create an unsigned upload preset in your Cloudinary dashboard:

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Navigate to **Settings** → **Upload**
3. Scroll to **Upload presets** section
4. Click **Add upload preset**
5. Configure the preset:
   - **Preset name**: `alcozero_drivers` (or any name you prefer)
   - **Signing Mode**: **Unsigned** ⚠️ Important!
   - **Folder**: `alcozero/drivers` (optional but recommended)
   - **Allowed formats**: jpg, png, jpeg, gif, webp
   - **Access mode**: public
   - Click **Save**

6. Update your `.env` file with the preset name:
   ```
   VITE_CLOUDINARY_UPLOAD_PRESET=alchozero_drivers
   ```

### Step 3: Restart Development Server

After updating the `.env` file, restart your Vite dev server:

```bash
cd client
npm run dev
```

---

## ✅ Verification

### Test Firebase Permissions
1. Log into your application
2. Try to add a new device
3. The driver ID should generate without errors
4. Device should be created successfully

### Test Cloudinary Upload
1. In the Add Device modal, click "Upload from Device"
2. Select an image file
3. The image should upload successfully
4. You should see the uploaded image preview

---

## 🚨 Troubleshooting

### If Cloudinary upload still fails:
- Verify the upload preset exists and is set to **Unsigned**
- Check the preset name in `.env` matches exactly
- Verify `VITE_CLOUDINARY_CLOUD_NAME` is correct
- Check browser console for specific error messages

### If Firebase permissions fail:
- Ensure you're logged in with a valid authenticated user
- Verify the rules were deployed successfully
- Check Firebase Console → Firestore → Rules tab to see deployed rules
- Look at Firebase Console → Firestore → Usage tab for permission errors

### Common Error Messages:

**"Missing or insufficient permissions"**
- Solution: Deploy the updated Firestore rules using `firebase deploy --only firestore:rules`

**"Upload failed with status 400"**
- Solution: Configure the unsigned upload preset in Cloudinary dashboard
- Ensure `VITE_CLOUDINARY_UPLOAD_PRESET` is set in `.env`

**"Invalid upload preset"**
- Solution: Double-check the preset name matches exactly (case-sensitive)
- Verify the preset is set to "Unsigned" mode

---

## 📝 Environment Variables Reference

### Required in `.env`:

```env
# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=dx7ztr9i3
VITE_CLOUDINARY_UPLOAD_PRESET=alcozero_drivers  # Must match your Cloudinary preset

# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 🎯 Next Steps

After completing the above steps:
1. Test device creation with driver information
2. Test image upload functionality
3. Verify driver IDs are generated correctly
4. Check that all data is saved to Firestore

---

## 💡 Production Considerations

For production deployment:
- Consider implementing signed uploads via a backend endpoint for better security
- Set up Cloudinary transformations in the upload preset (auto-resize, quality optimization)
- Configure Firebase Security Rules for stricter access control
- Enable Cloudinary's moderation features if handling user-generated content
- Set up proper error monitoring and logging
