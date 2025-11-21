# Cloudinary Setup Guide

This project uses Cloudinary for image uploads and storage. Follow these steps to configure it:

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a free account
3. After signing up, you'll be redirected to your dashboard

## Step 2: Get Your Credentials

From your Cloudinary Dashboard, you'll need:
- **Cloud Name**: Found at the top of your dashboard
- **API Key**: Found in your dashboard (not needed for client-side uploads)
- **API Secret**: Found in your dashboard (keep this secure!)

## Step 3: Create an Upload Preset

1. Go to **Settings** → **Upload** in your Cloudinary dashboard
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: Choose a name (e.g., `alchozero_driver_photos`)
   - **Signing mode**: Select **Unsigned** (for client-side uploads)
   - **Folder**: Enter a folder name (e.g., `alchozero/drivers`)
   - **Allowed formats**: jpg, png, webp
   - **Max file size**: 5 MB
   - **Transformation**: Optional (you can add automatic transformations)
5. Click **Save**

## Step 4: Update the Configuration

Open `client/src/cloudinaryConfig.js` and update these values:

```javascript
const CLOUDINARY_CLOUD_NAME = 'your_cloud_name_here'; // Replace with your Cloud Name
const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset_here'; // Replace with your Upload Preset name
```

## Step 5: Firebase Storage (Optional Alternative)

If you prefer using Firebase Storage instead of Cloudinary:

1. Go to Firebase Console → Storage
2. Enable Firebase Storage
3. Update the upload function to use Firebase Storage APIs

## How It Works

### Image Upload Flow

1. **User selects image** → File is validated (type, size)
2. **Upload to Cloudinary** → File is sent to Cloudinary via their API
3. **Get Image URL** → Cloudinary returns a secure URL
4. **Store in Firebase** → URL is stored in Firestore with device/driver data

### Where Images Are Stored

- **Images**: Stored on Cloudinary's CDN servers
- **Image URLs**: Stored in Firebase Firestore
- **Metadata**: Stored in Firebase Firestore with device data

### Data Structure in Firebase

```javascript
{
  deviceId: "ALCH-001",
  driverId: "DRV-2025-0001",
  driverName: "John Doe",
  driverAge: 35,
  driverPhoto: "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/alchozero/drivers/abc123.jpg",
  licenseNo: "DL-1234567890",
  vehicleName: "Toyota Camry",
  vehicleNumber: "ABC-1234",
  contactNumber: "+1234567890",
  // ... other fields
}
```

## Features

✅ **Auto-generate Driver ID**: Format `DRV-YYYY-XXXX` (e.g., DRV-2025-0001)
✅ **File Upload**: Upload from device with validation
✅ **URL Input**: Paste image URL directly
✅ **Image Preview**: Preview uploaded/selected image
✅ **Image Removal**: Remove uploaded image
✅ **Cloudinary CDN**: Fast image delivery worldwide
✅ **Firebase Integration**: All data synced with Firebase

## File Size and Format Limits

- **Max file size**: 5 MB
- **Supported formats**: JPG, PNG, WebP, GIF
- **Recommended size**: 800x800 pixels or less

## Security Considerations

1. **Unsigned uploads** are used for client-side convenience
2. **Upload preset** restricts what can be uploaded
3. **File validation** on the client side
4. For production, consider:
   - Backend validation
   - Signed uploads
   - Rate limiting
   - Content moderation

## Troubleshooting

### Upload Failed
- Check if Cloud Name and Upload Preset are correct
- Verify the upload preset is set to "Unsigned"
- Check file size (must be under 5MB)
- Verify internet connection

### Image Not Displaying
- Check if the URL is correct
- Verify Cloudinary account is active
- Check browser console for errors

## Free Tier Limits (Cloudinary)

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month

This should be sufficient for most use cases. Upgrade if needed.

## Support

For issues:
1. Check Cloudinary documentation: https://cloudinary.com/documentation
2. Check Firebase documentation: https://firebase.google.com/docs
3. Review browser console for errors
