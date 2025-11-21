# 🎨 Cloudinary Upload Preset Setup Guide

## Current Issue
Error: `Upload preset not found` - You need to create an unsigned upload preset in Cloudinary.

---

## ✅ Step-by-Step Setup

### Step 1: Login to Cloudinary
Go to: https://console.cloudinary.com/

### Step 2: Navigate to Upload Settings
1. Click on **Settings** (gear icon) in the top right
2. Click on **Upload** tab in the left sidebar
3. Scroll down to the **"Upload presets"** section

### Step 3: Create New Upload Preset
1. Click the **"Add upload preset"** button
2. Fill in the form:

   **Basic Settings:**
   - **Upload preset name**: `alchozero_drivers`
   - **Signing Mode**: ⚠️ **UNSIGNED** (This is critical!)
   - **Folder**: `alchozero/drivers` (optional but recommended)
   
   **Advanced Settings (Optional but recommended):**
   - **Use filename or externally defined Public ID**: Leave unchecked or check if you want to preserve filenames
   - **Unique filename**: ✅ Check this (recommended to avoid overwrites)
   - **Allowed formats**: jpg, jpeg, png, gif, webp
   - **Resource Type**: Image
   - **Access mode**: Public
   - **Max image file size**: 5 MB (5000000 bytes)
   - **Max image width**: 2000 pixels
   - **Max image height**: 2000 pixels

3. Click **Save**

### Step 4: Update Your .env File
After creating the preset, update your `.env` file:

```env
VITE_CLOUDINARY_CLOUD_NAME=dx7ztr9i3
VITE_CLOUDINARY_UPLOAD_PRESET=alchozero_drivers
```

### Step 5: Restart Dev Server
```bash
cd client
npm run dev
```

---

## 🔍 Alternative: Find Existing Presets

If you're not sure what presets you have:

1. Go to Cloudinary Console → Settings → Upload
2. Scroll to "Upload presets" section
3. Look for any preset with **"Unsigned"** signing mode
4. Use that preset name in your `.env` file

Common preset names:
- `unsigned_default` ← Currently trying this one
- `ml_default` (usually requires signature)
- `upload_preset_1`

---

## 🚨 Common Issues

### Issue: "Upload preset not found"
**Cause**: The preset name doesn't exist or has a typo
**Solution**: 
- Double-check the preset name (case-sensitive)
- Verify it exists in your Cloudinary dashboard
- Ensure there are no extra spaces

### Issue: "Upload preset requires signature"
**Cause**: The preset is set to "Signed" mode
**Solution**: 
- Edit the preset in Cloudinary dashboard
- Change "Signing Mode" to "Unsigned"
- Save changes

### Issue: 403 or 401 error
**Cause**: Cloud name is incorrect or account issue
**Solution**: 
- Verify `VITE_CLOUDINARY_CLOUD_NAME=dx7ztr9i3` is correct
- Check your Cloudinary account status

---

## 🧪 Testing

After setup, test the upload:

1. Open your app
2. Go to Devices page
3. Click "Add Device"
4. Click "Upload from Device" in Driver Photo section
5. Select an image
6. Should upload successfully!

---

## 📸 Screenshot Reference

Your Cloudinary upload preset form should look like this:

```
┌─────────────────────────────────────────┐
│ Upload preset name: alchozero_drivers   │
│ Signing Mode: ○ Signed ● Unsigned       │
│ Folder: alchozero/drivers               │
│ Unique filename: ☑                      │
│ Allowed formats: jpg,jpeg,png,gif,webp  │
│                                         │
│         [Cancel]  [Save]                │
└─────────────────────────────────────────┘
```

---

## ✨ Quick Commands

Try the current setup:
```bash
cd client
npm run dev
```

If `unsigned_default` doesn't work, create `alchozero_drivers` preset and update `.env`:
```bash
# After creating preset in Cloudinary dashboard
# Update VITE_CLOUDINARY_UPLOAD_PRESET in .env file
# Then restart server
cd client
npm run dev
```

---

## 📞 Need Help?

If you're still stuck:
1. Check Cloudinary documentation: https://cloudinary.com/documentation/upload_presets
2. Verify your account has upload preset creation permissions
3. Try creating the preset with default settings first, then customize
