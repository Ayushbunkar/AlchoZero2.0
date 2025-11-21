# 🚀 AlchoZero Deployment Checklist

Use this checklist to ensure successful deployment of your AlchoZero system.

## 📋 Pre-Deployment

### Firebase Setup
- [ ] Firebase project created
- [ ] Billing enabled (Blaze plan for Cloud Functions)
- [ ] Authentication enabled (Email/Password)
- [ ] Realtime Database created
- [ ] Firestore Database created
- [ ] Admin user created (`admin@alchozero.com`)

### Local Environment
- [ ] Node.js 18+ installed
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Git installed
- [ ] Arduino IDE installed (for hardware)

---

## 🔥 Firebase Configuration

### 1. Update Firebase Config
- [ ] Copy Firebase config from console
- [ ] Update `client/src/firebaseConfig.js`
- [ ] Verify all credentials are correct

### 2. Security Rules
- [ ] Review `firestore.rules`
- [ ] Review `database.rules.json`
- [ ] Deploy rules: `firebase deploy --only firestore:rules,database:rules`

### 3. Cloud Functions
- [ ] Navigate to `functions/` directory
- [ ] Run `npm install`
- [ ] Update email credentials in `functions/index.js`
- [ ] Generate Gmail App Password
- [ ] Test locally (optional): `npm run serve`
- [ ] Deploy: `firebase deploy --only functions`

---

## 💻 Frontend Deployment

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Update Configuration
- [ ] Verify `firebaseConfig.js` has correct values
- [ ] Check `tailwind.config.js` for theme customization
- [ ] Update `index.html` title and meta tags

### 3. Build Project
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] Check `client/dist/` folder exists

### 4. Deploy to Firebase Hosting
```bash
cd ..
firebase deploy --only hosting
```
- [ ] Deployment successful
- [ ] Note the hosting URL

---

## 🔌 Hardware Setup

### 1. Component Check
- [ ] ESP32/NodeMCU board
- [ ] MQ-3 Alcohol Sensor
- [ ] 5V Relay Module
- [ ] Green LED + 220Ω resistor
- [ ] Red LED + 220Ω resistor
- [ ] Buzzer
- [ ] Jumper wires
- [ ] Breadboard
- [ ] 5V power supply

### 2. Wiring
- [ ] MQ-3 sensor connected
- [ ] Relay module connected
- [ ] LEDs connected with resistors
- [ ] Buzzer connected
- [ ] Double-check all connections

### 3. Arduino Code
- [ ] Open `hardware/AlchoZero_ESP32.ino`
- [ ] Update WiFi credentials
- [ ] Update Firebase credentials
- [ ] Update Device ID (if needed)
- [ ] Install "Firebase ESP Client" library
- [ ] Select correct board (ESP32 Dev Module)
- [ ] Select correct COM port
- [ ] Upload code
- [ ] Open Serial Monitor (115200 baud)
- [ ] Verify WiFi connection
- [ ] Verify Firebase connection

---

## 🧪 Testing

### Frontend Tests
- [ ] Website loads correctly
- [ ] All pages accessible (Home, About, Features, Contact)
- [ ] Navbar navigation works
- [ ] Footer displays correctly
- [ ] Responsive design on mobile
- [ ] Contact form submits successfully

### Dashboard Tests
- [ ] Dashboard route accessible
- [ ] Login page displays
- [ ] Login with admin credentials works
- [ ] Dashboard displays after login
- [ ] Real-time data visible
- [ ] Charts rendering correctly
- [ ] Logs table showing data
- [ ] Logout functionality works

### Hardware Tests
- [ ] ESP32 connects to WiFi
- [ ] Firebase sync successful
- [ ] Sensor readings in Serial Monitor
- [ ] Firebase Realtime Database updates
- [ ] Bring alcohol near sensor
- [ ] Red LED lights up
- [ ] Buzzer sounds
- [ ] Engine relay activates
- [ ] Dashboard shows alert
- [ ] Email notification received

### Integration Tests
- [ ] Change sensor value manually in Firebase Console
- [ ] Dashboard updates in real-time
- [ ] Cloud Functions trigger on threshold
- [ ] Alert saved to Firestore
- [ ] Email sent successfully
- [ ] Log entry created

---

## 📧 Email Configuration

### Gmail Setup
- [ ] Gmail account ready
- [ ] 2-Step Verification enabled
- [ ] App Password generated
- [ ] Update `functions/index.js` with credentials
- [ ] Test email sending
- [ ] Verify admin receives email

### Email Troubleshooting
If emails not sending:
- [ ] Check App Password is correct
- [ ] Verify Gmail allows less secure apps (if applicable)
- [ ] Check Firebase Functions logs: `firebase functions:log`
- [ ] Test with different email service (SendGrid, etc.)

---

## 🔐 Security Checklist

### Firebase Security
- [ ] Firestore rules deployed
- [ ] Realtime Database rules deployed
- [ ] Admin authentication working
- [ ] No public write access
- [ ] API keys restricted (optional)

### Code Security
- [ ] No credentials in Git repository
- [ ] `.gitignore` configured correctly
- [ ] Environment variables used where appropriate
- [ ] Firebase config in separate file

---

## 📊 Monitoring

### Setup Monitoring
- [ ] Firebase Console > Analytics enabled
- [ ] Firebase Console > Performance enabled
- [ ] Set up error logging
- [ ] Configure alerts for:
  - [ ] High function errors
  - [ ] Database quota exceeded
  - [ ] Hosting downtime

### Regular Checks
- [ ] Check Firebase usage daily
- [ ] Monitor function execution count
- [ ] Review error logs weekly
- [ ] Check device connection status
- [ ] Verify email delivery

---

## 🎯 Post-Deployment

### Documentation
- [ ] Update README with actual URLs
- [ ] Document admin credentials (securely)
- [ ] Create user manual
- [ ] Document maintenance procedures

### Performance Optimization
- [ ] Enable Firebase caching
- [ ] Optimize images
- [ ] Minify assets (done by Vite)
- [ ] Set up CDN (Firebase does this)

### Backup
- [ ] Export Firestore data
- [ ] Backup Realtime Database
- [ ] Save configuration files
- [ ] Document hardware wiring

---

## 🚨 Troubleshooting

### Common Issues

**Issue: Dashboard not showing live data**
- [ ] Check Firebase Realtime Database rules
- [ ] Verify device is connected
- [ ] Check browser console for errors
- [ ] Test with manual data update in Firebase Console

**Issue: Cloud Functions not triggering**
- [ ] Verify functions deployed successfully
- [ ] Check function logs
- [ ] Ensure Blaze plan is active
- [ ] Test threshold value

**Issue: Hardware not connecting**
- [ ] Verify WiFi credentials
- [ ] Check Firebase API key
- [ ] Ensure database URL is correct
- [ ] Check Serial Monitor for errors

**Issue: Build fails**
- [ ] Clear node_modules: `rm -rf node_modules`
- [ ] Delete package-lock.json
- [ ] Run `npm install`
- [ ] Try `npm run build` again

---

## ✅ Final Verification

### Before Going Live
- [ ] All tests passing
- [ ] Hardware functioning correctly
- [ ] Dashboard accessible
- [ ] Alerts working
- [ ] Emails sending
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] Documentation complete

### Launch Checklist
- [ ] DNS configured (if custom domain)
- [ ] SSL certificate active
- [ ] Monitoring enabled
- [ ] Backup procedures in place
- [ ] Support contacts ready
- [ ] User training complete

---

## 📞 Support Contacts

**Technical Issues:**
- Firebase Support: https://firebase.google.com/support
- GitHub Issues: [Your Repo URL]

**Emergency Contacts:**
- Admin Email: admin@alchozero.com
- Technical Lead: [Your Contact]

---

## 📅 Maintenance Schedule

**Daily:**
- [ ] Check system status
- [ ] Review alerts
- [ ] Monitor Firebase usage

**Weekly:**
- [ ] Review logs
- [ ] Check error rates
- [ ] Update documentation

**Monthly:**
- [ ] Security audit
- [ ] Performance review
- [ ] Backup verification
- [ ] Update dependencies

---

**Deployment Date:** _______________

**Deployed By:** _______________

**Notes:**
_______________________________________
_______________________________________
_______________________________________

---

✅ **Deployment Complete!** 🎉

Your AlchoZero system is now live and protecting lives on the road!
