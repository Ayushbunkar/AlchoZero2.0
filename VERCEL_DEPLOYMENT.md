# Vercel Deployment Guide for AlchoZero

## 🚀 Deployment Steps

### 1. **Push Your Code to GitHub**
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. **Import Project to Vercel**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository: `Ayushbunkar/AlchoZero2.0`
4. Select the repository and click "Import"

### 3. **Configure Project Settings**

#### Root Directory
Set root directory to: `client`

#### Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. **Add Environment Variables** ⚠️ IMPORTANT

In Vercel project settings, add these environment variables:

#### Cloudinary Variables
```
VITE_CLOUDINARY_CLOUD_NAME=dx7ztr9i3
VITE_CLOUDINARY_UPLOAD_PRESET=alchozero_drivers
```

#### Firebase Variables
```
VITE_FIREBASE_API_KEY=AIzaSyDjPs8l-PKtwIak7A4NMVreRG_82PuMozc
VITE_FIREBASE_AUTH_DOMAIN=fftour-5ac79.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://fftour-5ac79-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=fftour-5ac79
VITE_FIREBASE_STORAGE_BUCKET=fftour-5ac79.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=427551679783
VITE_FIREBASE_APP_ID=1:427551679783:web:0df888c6c9d85f2eebf502
VITE_FIREBASE_MEASUREMENT_ID=G-C7F970EMRZ
```

**Steps to add variables in Vercel:**
1. Go to your project in Vercel Dashboard
2. Click "Settings" tab
3. Click "Environment Variables" in sidebar
4. Add each variable one by one:
   - Enter variable name (e.g., `VITE_FIREBASE_API_KEY`)
   - Enter variable value
   - Select environment: **Production**, **Preview**, **Development** (select all)
   - Click "Add"
5. Repeat for all variables above

### 5. **Update Firebase Authentication Settings**

Add your Vercel domain to Firebase authorized domains:

1. Go to [Firebase Console](https://console.firebase.google.com/project/fftour-5ac79/authentication/settings)
2. Click "Authentication" → "Settings" → "Authorized domains"
3. Add your Vercel domains:
   - `your-project-name.vercel.app`
   - `your-custom-domain.com` (if you have one)

### 6. **Deploy**

Click "Deploy" button in Vercel.

Vercel will:
- Install dependencies
- Build your project
- Deploy to production

### 7. **Verify Deployment**

After deployment completes:

1. **Check Build Logs**: Make sure no errors in build process
2. **Open Deployed Site**: Click "Visit" button
3. **Test Firebase Connection**: 
   - Open browser console (F12)
   - Look for "✅ Firebase initialized successfully"
   - If you see errors, check environment variables

4. **Test Authentication**:
   - Try signing up with a new account
   - Try logging in
   - Check if dashboard loads

5. **Test Firestore**:
   - Create a device
   - Check if it appears in Firebase Console

## 🔧 Common Issues & Solutions

### Issue 1: "onAuthStateChanged is not a function"
**Cause**: Environment variables not set in Vercel

**Solution**: 
1. Go to Vercel project settings
2. Add all Firebase environment variables
3. Redeploy the project

### Issue 2: "Firebase initialization failed"
**Cause**: Missing or incorrect Firebase config

**Solution**:
1. Verify all environment variables are correct
2. Check Firebase Console for correct values
3. Make sure variables start with `VITE_` prefix

### Issue 3: Build fails with "Module not found"
**Cause**: Wrong root directory

**Solution**:
1. Set root directory to `client` in Vercel settings
2. Redeploy

### Issue 4: Blank page after deployment
**Cause**: Environment variables not loaded

**Solution**:
1. Check browser console for errors
2. Verify all environment variables in Vercel
3. Clear Vercel cache and redeploy

### Issue 5: Firebase Auth domain error
**Cause**: Vercel domain not authorized in Firebase

**Solution**:
1. Add Vercel domain to Firebase authorized domains
2. Go to Firebase Console → Authentication → Settings → Authorized domains
3. Add `your-project.vercel.app`

## 📝 Redeploy After Changes

After making code changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically redeploy.

## 🔄 Manual Redeploy

If you need to redeploy without code changes:

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Deployments" tab
4. Click "..." menu on latest deployment
5. Click "Redeploy"

## 🌐 Custom Domain Setup

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Add custom domain to Firebase authorized domains

## ✅ Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are set in Vercel
- [ ] Root directory is set to `client`
- [ ] Build command is `npm run build`
- [ ] Output directory is `dist`
- [ ] Firebase authorized domains include Vercel domain
- [ ] All Firebase rules are deployed
- [ ] Cloudinary preset is configured
- [ ] Code is pushed to GitHub

## 🎯 Post-Deployment

After successful deployment:

1. **Test all features**:
   - Sign up / Login
   - Add devices
   - View driver profiles
   - Upload images
   - Real-time monitoring
   - Alerts system

2. **Monitor performance**:
   - Check Vercel Analytics
   - Monitor Firebase usage
   - Check Cloudinary usage

3. **Set up monitoring**:
   - Firebase Console → Analytics
   - Vercel Dashboard → Analytics
   - Set up error tracking

## 🚨 Emergency Rollback

If deployment fails:

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## 📞 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Firebase Documentation](https://firebase.google.com/docs)

---

**Note**: Keep your Firebase API keys and other sensitive information secure. Never commit `.env` files to public repositories.
