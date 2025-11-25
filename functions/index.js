const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure email transporter
// Replace with your actual email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password', // Use app-specific password
  },
});

// ==========================================
// 🚨 ALCOHOL DETECTION ALERT TRIGGER
// ==========================================

/**
 * Triggered when alcohol level is updated in Realtime Database
 * Checks if level exceeds threshold and creates alerts
 */
exports.onAlcoholDetected = functions.database
  .ref('deviceStatus/{deviceId}/alcoholLevel')
  .onUpdate(async (change, context) => {
    const deviceId = context.params.deviceId;
    const alcoholLevel = change.after.val();
    const previousLevel = change.before.val();
    
    const THRESHOLD = 0.03; // 0.03% BAC threshold
    
    console.log(`Device ${deviceId}: Alcohol level changed from ${previousLevel} to ${alcoholLevel}`);
    
    // Only trigger alert if crossing threshold
    if (alcoholLevel > THRESHOLD && previousLevel <= THRESHOLD) {
      try {
        // Get device data from Realtime Database
        const deviceSnapshot = await admin.database()
          .ref(`deviceStatus/${deviceId}`)
          .once('value');
        
        const deviceData = deviceSnapshot.val();
        
        // Create alert in Firestore
        const alertRef = await admin.firestore().collection('alerts').add({
          deviceId: deviceId,
          alcoholLevel: alcoholLevel,
          engine: deviceData.engine || 'UNKNOWN',
          type: 'AUTO',
          timestamp: Date.now(),
          message: `ALERT: High alcohol level detected (${alcoholLevel.toFixed(3)} BAC)`,
          status: 'new',
          severity: alcoholLevel > 0.08 ? 'CRITICAL' : 'HIGH',
        });
        
        console.log(`Alert created: ${alertRef.id}`);
        
        // Send email notification
        await sendEmailAlert(deviceId, alcoholLevel);
        
        // Optionally: Send SMS (uncomment and configure)
        // await sendSMSAlert(deviceId, alcoholLevel);
        
        return { success: true, alertId: alertRef.id };
      } catch (error) {
        console.error('Error creating alert:', error);
        return { success: false, error: error.message };
      }
    }
    
    return { success: true, message: 'No alert needed' };
  });

// ==========================================
// 📝 AUTO-LOG HISTORY
// ==========================================

/**
 * Automatically logs all alcohol level changes to Firestore
 */
exports.autoLogAlcoholLevel = functions.database
  .ref('deviceStatus/{deviceId}/alcoholLevel')
  .onWrite(async (change, context) => {
    const deviceId = context.params.deviceId;
    const alcoholLevel = change.after.val();
    
    // Skip if value was deleted
    if (!alcoholLevel && alcoholLevel !== 0) {
      return null;
    }
    
    try {
      // Get full device status
      const deviceSnapshot = await admin.database()
        .ref(`deviceStatus/${deviceId}`)
        .once('value');
      
      const deviceData = deviceSnapshot.val();
      
      // Save to Firestore logs collection
      await admin.firestore().collection('logs').add({
        deviceId: deviceId,
        alcoholLevel: alcoholLevel,
        engine: deviceData.engine || 'UNKNOWN',
        timestamp: Date.now(),
        status: alcoholLevel > 0.03 ? 'ALERT' : 'SAFE',
      });
      
      console.log(`Log created for device ${deviceId}: ${alcoholLevel}`);
      
      return { success: true };
    } catch (error) {
      console.error('Error logging data:', error);
      return { success: false, error: error.message };
    }
  });

// ==========================================
// 🔒 ENGINE STATUS MONITOR
// ==========================================

/**
 * Monitors engine status changes and logs them
 */
exports.onEngineStatusChange = functions.database
  .ref('deviceStatus/{deviceId}/engine')
  .onUpdate(async (change, context) => {
    const deviceId = context.params.deviceId;
    const newStatus = change.after.val();
    const oldStatus = change.before.val();
    
    console.log(`Device ${deviceId}: Engine status changed from ${oldStatus} to ${newStatus}`);
    
    try {
      // Log engine status change
      await admin.firestore().collection('engineLogs').add({
        deviceId: deviceId,
        previousStatus: oldStatus,
        newStatus: newStatus,
        timestamp: Date.now(),
        action: newStatus === 'OFF' ? 'LOCKED' : 'UNLOCKED',
      });
      
      // If engine was locked, send notification
      if (newStatus === 'OFF' && oldStatus === 'ON') {
        await sendEngineLockNotification(deviceId);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error logging engine status:', error);
      return { success: false, error: error.message };
    }
  });

// ==========================================
// 📧 EMAIL NOTIFICATION FUNCTIONS
// ==========================================

/**
 * Send email alert for high alcohol level
 */
async function sendEmailAlert(deviceId, alcoholLevel) {
  const mailOptions = {
    from: 'AlcoZero Alert <your-email@gmail.com>',
    to: 'admin@alcozero.com', // Replace with actual admin email
    subject: `🚨 ALERT: High Alcohol Level Detected - ${deviceId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0;">⚠️ ALCOHOL ALERT</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #333; margin-top: 0;">High Alcohol Level Detected</h2>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;"><strong>Device ID:</strong> ${deviceId}</p>
            <p style="margin: 10px 0 0 0; color: #856404;"><strong>Alcohol Level:</strong> ${alcoholLevel.toFixed(3)} BAC</p>
            <p style="margin: 10px 0 0 0; color: #856404;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            The alcohol detection system has identified a blood alcohol content (BAC) level above the safe threshold.
            The vehicle engine has been automatically locked to prevent operation.
          </p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Recommended Actions:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Verify the alert on the dashboard</li>
              <li>Contact the vehicle operator</li>
              <li>Ensure driver safety measures are in place</li>
              <li>Review incident logs for details</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://your-dashboard-url.com/dashboard" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View Dashboard
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>This is an automated message from AlcoZero Alcohol Detection System</p>
          <p>© 2025 AlcoZero. All rights reserved.</p>
        </div>
      </div>
    `,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email alert sent for device ${deviceId}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send engine lock notification
 */
async function sendEngineLockNotification(deviceId) {
  const mailOptions = {
    from: 'AlcoZero System <your-email@gmail.com>',
    to: 'admin@alcozero.com',
    subject: `🔒 Engine Locked - ${deviceId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Engine Lock Notification</h2>
        <p><strong>Device:</strong> ${deviceId}</p>
        <p><strong>Action:</strong> Engine has been automatically locked</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p>The vehicle engine has been locked due to unsafe alcohol levels.</p>
      </div>
    `,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Engine lock notification sent for device ${deviceId}`);
  } catch (error) {
    console.error('Error sending engine lock notification:', error);
  }
}

// ==========================================
// 📱 SMS ALERT (OPTIONAL - Twilio/Fast2SMS)
// ==========================================

/**
 * Send SMS alert using Twilio (configure credentials)
 * Uncomment and configure to enable
 */
/*
const twilio = require('twilio');
const twilioClient = twilio('ACCOUNT_SID', 'AUTH_TOKEN');

async function sendSMSAlert(deviceId, alcoholLevel) {
  try {
    await twilioClient.messages.create({
      body: `ALERT: High alcohol level (${alcoholLevel.toFixed(3)} BAC) detected on device ${deviceId}. Engine locked.`,
      from: '+1234567890', // Your Twilio number
      to: '+1234567890'    // Admin phone number
    });
    console.log(`SMS alert sent for device ${deviceId}`);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
}
*/

// ==========================================
// 🔍 CLEANUP OLD LOGS (SCHEDULED)
// ==========================================

/**
 * Scheduled function to clean up old logs (runs daily)
 * Keeps only last 30 days of logs
 */
exports.cleanupOldLogs = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    try {
      const logsSnapshot = await admin.firestore()
        .collection('logs')
        .where('timestamp', '<', thirtyDaysAgo)
        .get();
      
      const batch = admin.firestore().batch();
      logsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`Deleted ${logsSnapshot.size} old log entries`);
      
      return { success: true, deletedCount: logsSnapshot.size };
    } catch (error) {
      console.error('Error cleaning up logs:', error);
      return { success: false, error: error.message };
    }
  });

// ==========================================
// 📊 STATISTICS AGGREGATION (SCHEDULED)
// ==========================================

/**
 * Generate daily statistics
 */
exports.generateDailyStats = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDay = today.getTime();
    
    try {
      // Get all logs from today
      const logsSnapshot = await admin.firestore()
        .collection('logs')
        .where('timestamp', '>=', startOfDay)
        .get();
      
      // Get all alerts from today
      const alertsSnapshot = await admin.firestore()
        .collection('alerts')
        .where('timestamp', '>=', startOfDay)
        .get();
      
      // Calculate statistics
      const stats = {
        date: startOfDay,
        totalLogs: logsSnapshot.size,
        totalAlerts: alertsSnapshot.size,
        averageAlcoholLevel: 0,
        maxAlcoholLevel: 0,
        deviceCount: new Set(),
      };
      
      let totalAlcohol = 0;
      logsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        totalAlcohol += data.alcoholLevel || 0;
        stats.maxAlcoholLevel = Math.max(stats.maxAlcoholLevel, data.alcoholLevel || 0);
        stats.deviceCount.add(data.deviceId);
      });
      
      stats.averageAlcoholLevel = logsSnapshot.size > 0 ? totalAlcohol / logsSnapshot.size : 0;
      stats.deviceCount = stats.deviceCount.size;
      
      // Save statistics
      await admin.firestore().collection('statistics').add(stats);
      
      console.log('Daily statistics generated:', stats);
      return { success: true, stats };
    } catch (error) {
      console.error('Error generating statistics:', error);
      return { success: false, error: error.message };
    }
  });
