import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, doc, setDoc, getDoc, updateDoc, deleteDoc, where, arrayUnion, arrayRemove, GeoPoint } from 'firebase/firestore';
import { getDatabase, ref, onValue, set, push } from 'firebase/database';

// 🔥 Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);
  
  if (missingKeys.length > 0) {
    console.error('❌ Missing Firebase configuration:', missingKeys);
    return false;
  }
  return true;
};

if (!validateFirebaseConfig()) {
  throw new Error('Firebase configuration is incomplete. Please check your environment variables.');
}

// Initialize Firebase
let app, auth, db, rtdb;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  rtdb = getDatabase(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  throw new Error('Firebase initialization failed. Please check your configuration.');
}

// ==========================================
// ⚡ Lightweight in-memory cache for reads
// ==========================================
const _cache = new Map();

const makeCacheKey = (prefix, ...parts) => `${prefix}:${parts.join('|')}`;

const fetchWithCache = async (key, fn, ttl = 30000) => {
  const now = Date.now();
  const entry = _cache.get(key);
  if (entry && (now - entry.ts) < ttl) {
    return entry.value;
  }

  const value = await fn();
  _cache.set(key, { value, ts: Date.now() });
  return value;
};

export const invalidateCache = (keyPrefix = '') => {
  if (!keyPrefix) {
    _cache.clear();
    return;
  }
  for (const key of Array.from(_cache.keys())) {
    if (key.startsWith(keyPrefix)) _cache.delete(key);
  }
};

// ==========================================
// 🔐 AUTHENTICATION FUNCTIONS
// ==========================================

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - User credential
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Signup new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Object} profileData - Additional user profile data (name, organization, phone, role)
 * @returns {Promise} - User credential
 */
export const signupUser = async (email, password, profileData = {}) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name if provided
    if (profileData.name) {
      await updateProfile(user, {
        displayName: profileData.name
      });
    }

    // Create admin document with device_ids array
    try {
      await setDoc(doc(db, 'admins', user.uid), {
        admin_id: user.uid,
        name: profileData.name || '',
        email: email,
        device_ids: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      
      // Also save to user_profiles for backward compatibility
      await setDoc(doc(db, 'user_profiles', user.uid), {
        email: email,
        name: profileData.name || '',
        organization: profileData.organization || '',
        phone: profileData.phone || '',
        role: profileData.role || 'admin',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    } catch (firestoreError) {
      console.warn('Profile data not saved to Firestore:', firestoreError);
    }

    return { success: true, user: user };
  } catch (error) {
    let errorMessage = 'Signup failed';
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please login instead.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address format.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Please use at least 6 characters.';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Email/password accounts are not enabled. Please contact support.';
    } else {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Logout current user
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (callback) => {
  if (!auth) {
    console.error('Auth not initialized');
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// ==========================================
// 📝 FIRESTORE FUNCTIONS
// ==========================================

/**
 * Save contact form data to Firestore
 * @param {Object} data - Contact form data
 */
export const saveContact = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'contact'), {
      ...data,
      timestamp: Date.now(),
      status: 'new'
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Save device log to Firestore
 * @param {string} deviceId - Device identifier
 * @param {Object} data - Log data
 */
export const saveDeviceLog = async (deviceId, data) => {
  try {
    const docRef = await addDoc(collection(db, 'logs'), {
      deviceId,
      alcoholLevel: data.alcoholLevel,
      engine: data.engine,
      timestamp: Date.now(),
      status: data.alcoholLevel > 0.3 ? 'ALERT' : 'SAFE'
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get device logs from Firestore
 * @param {number} limitCount - Number of logs to retrieve
 */
export const getDeviceLogs = async (limitCount = 50) => {
  try {
    const cacheKey = makeCacheKey('logs', String(limitCount));
    return await fetchWithCache(cacheKey, async () => {
      const q = query(
        collection(db, 'logs'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      const logs = [];
      querySnapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, logs };
    }, 5000);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get all alerts from Firestore
 * @param {number} limitCount - Number of alerts to retrieve
 */
export const getAlerts = async (limitCount = 20) => {
  try {
    const cacheKey = makeCacheKey('alerts', String(limitCount));
    return await fetchWithCache(cacheKey, async () => {
      const q = query(
        collection(db, 'alerts'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      const alerts = [];
      querySnapshot.forEach((doc) => {
        alerts.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, alerts };
    }, 5000); // short TTL for alerts
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==========================================
// 🔴 REALTIME DATABASE FUNCTIONS
// ==========================================

/**
 * Listen to device status in real-time
 * @param {string} deviceId - Device identifier
 * @param {function} callback - Callback function to handle data updates
 */
export const listenToDeviceStatus = (deviceId, callback) => {
  const deviceRef = ref(rtdb, `deviceStatus/${deviceId}`);
  return onValue(deviceRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback({
        alcoholLevel: data.alcoholLevel || 0,
        engine: data.engine || 'UNKNOWN',
        timestamp: data.timestamp || Date.now(),
        connected: true
      });
    } else {
      callback({
        alcoholLevel: 0,
        engine: 'UNKNOWN',
        timestamp: Date.now(),
        connected: false
      });
    }
  }, (error) => {
    console.error('Firebase RTDB Error:', error);
    callback({
      alcoholLevel: 0,
      engine: 'ERROR',
      timestamp: Date.now(),
      connected: false,
      error: error.message
    });
  });
};

/**
 * Update device status in Realtime Database
 * @param {string} deviceId - Device identifier
 * @param {Object} data - Status data
 */
export const updateDeviceStatus = async (deviceId, data) => {
  try {
    const deviceRef = ref(rtdb, `deviceStatus/${deviceId}`);
    await set(deviceRef, {
      ...data,
      timestamp: Date.now()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Trigger manual alert
 * @param {string} deviceId - Device identifier
 * @param {number} alcoholLevel - Alcohol level
 */
export const triggerAlert = async (deviceId, alcoholLevel) => {
  try {
    const alertRef = collection(db, 'alerts');
    const docRef = await addDoc(alertRef, {
      deviceId,
      alcoholLevel,
      type: 'MANUAL',
      timestamp: Date.now(),
      message: `Manual alert triggered for device ${deviceId}`,
      status: 'new'
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==========================================
// 🚨 ADVANCED MONITORING FUNCTIONS
// ==========================================

/**
 * Update complete monitoring data for a device
 * @param {string} deviceId - Device identifier
 * @param {Object} monitoringData - All monitoring sensor data
 */
export const updateDeviceMonitoring = async (deviceId, monitoringData) => {
  try {
    // Update Realtime Database for live monitoring
    const deviceRef = ref(rtdb, `deviceMonitoring/${deviceId}`);
    await set(deviceRef, {
      // BAC Detection
      alcoholLevel: monitoringData.alcoholLevel || 0,
      engine: monitoringData.engine || 'UNKNOWN',
      
      // Face Authentication
      faceAuth: {
        verified: monitoringData.faceAuth?.verified || false,
        confidence: monitoringData.faceAuth?.confidence || 0,
        lastCheck: Date.now()
      },
      
      // Drowsiness Detection (PERCLOS)
      drowsiness: {
        detected: monitoringData.drowsiness?.detected || false,
        perclosValue: monitoringData.drowsiness?.perclosValue || 0,
        eyesClosed: monitoringData.drowsiness?.eyesClosed || false,
        severity: monitoringData.drowsiness?.severity || 'none' // none, mild, severe
      },
      
      // Distraction Detection
      distraction: {
        detected: monitoringData.distraction?.detected || false,
        type: monitoringData.distraction?.type || null, // phone, smoking, looking_away
        duration: monitoringData.distraction?.duration || 0
      },
      
      // Audio Alcohol Analysis
      audioAlcohol: {
        detected: monitoringData.audioAlcohol?.detected || false,
        slurringScore: monitoringData.audioAlcohol?.slurringScore || 0,
        confidence: monitoringData.audioAlcohol?.confidence || 0
      },
      
      // Rash Driving Detection
      rashDriving: {
        detected: monitoringData.rashDriving?.detected || false,
        harshBraking: monitoringData.rashDriving?.harshBraking || false,
        drifting: monitoringData.rashDriving?.drifting || false,
        overSpeeding: monitoringData.rashDriving?.overSpeeding || false,
        speed: monitoringData.rashDriving?.speed || 0,
        acceleration: monitoringData.rashDriving?.acceleration || 0
      },
      
      // Driver Behavior Score
      driverScore: monitoringData.driverScore || 85,
      
      // Connection & Timestamp
      connected: true,
      timestamp: Date.now(),
      location: monitoringData.location || null
    });
    
    // Also log to Firestore for history
    await addDoc(collection(db, 'monitoring_logs'), {
      deviceId,
      ...monitoringData,
      timestamp: Date.now()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating device monitoring:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Listen to complete device monitoring data in real-time
 * @param {string} deviceId - Device identifier
 * @param {function} callback - Callback function
 */
export const listenToDeviceMonitoring = (deviceId, callback) => {
  const deviceRef = ref(rtdb, `deviceMonitoring/${deviceId}`);
  return onValue(deviceRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback({
        ...data,
        connected: true
      });
    } else {
      callback({
        alcoholLevel: 0,
        engine: 'UNKNOWN',
        faceAuth: { verified: false, confidence: 0 },
        drowsiness: { detected: false, perclosValue: 0 },
        distraction: { detected: false, type: null },
        audioAlcohol: { detected: false, slurringScore: 0 },
        rashDriving: { detected: false, harshBraking: false },
        driverScore: 0,
        connected: false,
        timestamp: Date.now()
      });
    }
  }, (error) => {
    console.error('Firebase RTDB Error:', error);
    callback({
      connected: false,
      error: error.message
    });
  });
};

/**
 * Get monitoring history for a device
 * @param {string} deviceId - Device identifier
 * @param {number} limitCount - Number of records to retrieve
 */
export const getMonitoringHistory = async (deviceId, limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'monitoring_logs'),
      where('deviceId', '==', deviceId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, logs };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update driver behavior score
 * @param {string} deviceId - Device identifier
 * @param {number} score - Behavior score (0-100)
 * @param {Object} factors - Factors affecting the score
 */
export const updateDriverBehaviorScore = async (deviceId, score, factors = {}) => {
  try {
    await addDoc(collection(db, 'behavior_scores'), {
      deviceId,
      score,
      factors: {
        safeDriving: factors.safeDriving || 0,
        rashDrivingEvents: factors.rashDrivingEvents || 0,
        distractionEvents: factors.distractionEvents || 0,
        drowsinessEvents: factors.drowsinessEvents || 0,
        alcoholDetections: factors.alcoholDetections || 0,
        totalTrips: factors.totalTrips || 0
      },
      timestamp: Date.now()
    });
    
    // Update in realtime database
    const deviceRef = ref(rtdb, `deviceMonitoring/${deviceId}/driverScore`);
    await set(deviceRef, score);
    
    return { success: true, score };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Create safety alert for detected issues
 * @param {string} deviceId - Device identifier
 * @param {string} alertType - Type of alert
 * @param {Object} data - Alert data
 */
export const createSafetyAlert = async (deviceId, alertType, data = {}) => {
  try {
    const alertRef = collection(db, 'safety_alerts');
    const docRef = await addDoc(alertRef, {
      deviceId,
      alertType, // 'alcohol', 'drowsiness', 'distraction', 'rash_driving', 'face_auth_failed'
      severity: data.severity || 'medium', // low, medium, high, critical
      message: data.message || `${alertType} detected`,
      data: data,
      resolved: false,
      timestamp: Date.now()
    });
    
    // Update alert count in realtime
    const alertCountRef = ref(rtdb, `deviceAlerts/${deviceId}/count`);
    const snapshot = await new Promise((resolve) => {
      onValue(alertCountRef, (snap) => resolve(snap), { onlyOnce: true });
    });
    const currentCount = snapshot.val() || 0;
    await set(alertCountRef, currentCount + 1);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get all safety alerts for a device
 * @param {string} deviceId - Device identifier
 * @param {number} limitCount - Number of alerts to retrieve
 */
export const getSafetyAlerts = async (deviceId, limitCount = 20) => {
  try {
    const cacheKey = makeCacheKey('safetyAlerts', deviceId, String(limitCount));
    return await fetchWithCache(cacheKey, async () => {
      const q = query(
        collection(db, 'safety_alerts'),
        where('deviceId', '==', deviceId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      const alerts = [];
      querySnapshot.forEach((doc) => {
        alerts.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, alerts };
    }, 5000); // short TTL
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get all alerts for a given device by querying both `safety_alerts` and `alerts` collections.
 * Returns merged, deduped, sorted alerts.
 * @param {string} deviceId
 * @param {number} limitCount
 */
export const getAlertsByDevice = async (deviceId, limitCount = 200) => {
  try {
    // Query safety_alerts for the device
    const q1 = query(
      collection(db, 'safety_alerts'),
      where('deviceId', '==', deviceId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const snap1 = await getDocs(q1);
    const safetyAlerts = [];
    snap1.forEach((doc) => safetyAlerts.push({ id: doc.id, ...doc.data() }));

    // Query generic alerts collection for the device
    const q2 = query(
      collection(db, 'alerts'),
      where('deviceId', '==', deviceId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const snap2 = await getDocs(q2);
    const genericAlerts = [];
    snap2.forEach((doc) => genericAlerts.push({ id: doc.id, ...doc.data() }));

    // Merge and dedupe by id/timestamp
    const combined = [...safetyAlerts, ...genericAlerts];
    const map = new Map();
    for (const a of combined) {
      const key = a.id || String(a.timestamp) || JSON.stringify(a);
      if (!map.has(key)) map.set(key, a);
    }
    const alerts = Array.from(map.values());
    alerts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    return { success: true, alerts };
  } catch (error) {
    console.error('Error in getAlertsByDevice:', error);
    return { success: false, error: error.message };
  }
};

// Cached device fetch
export const getDeviceByIdCached = async (deviceId, ttl = 30000) => {
  const cacheKey = makeCacheKey('device', deviceId);
  return await fetchWithCache(cacheKey, async () => await getDeviceById(deviceId), ttl);
};

/**
 * Listen to all devices monitoring status for admin
 * @param {Array} deviceIds - Array of device IDs to monitor
 * @param {function} callback - Callback function
 */
export const listenToMultipleDevices = (deviceIds, callback) => {
  const listeners = {};
  const deviceData = {};
  
  deviceIds.forEach(deviceId => {
    const deviceRef = ref(rtdb, `deviceMonitoring/${deviceId}`);
    listeners[deviceId] = onValue(deviceRef, (snapshot) => {
      const data = snapshot.val();
      deviceData[deviceId] = data || { connected: false };
      callback(deviceData);
    });
  });
  
  // Return unsubscribe function
  return () => {
    Object.values(listeners).forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') unsubscribe();
    });
  };
};

/**
 * Get driver statistics
 * @param {string} deviceId - Device identifier
 */
export const getDriverStatistics = async (deviceId) => {
  try {
    // Get all monitoring logs for the device
    const logsResult = await getMonitoringHistory(deviceId, 100);
    if (!logsResult.success) {
      return { success: false, error: logsResult.error };
    }
    
    const logs = logsResult.logs;
    
    // Calculate statistics
    const stats = {
      totalTrips: logs.length,
      alcoholDetections: logs.filter(log => log.alcoholLevel > 0.15).length,
      drowsinessEvents: logs.filter(log => log.drowsiness?.detected).length,
      distractionEvents: logs.filter(log => log.distraction?.detected).length,
      rashDrivingEvents: logs.filter(log => log.rashDriving?.detected).length,
      faceAuthFailures: logs.filter(log => !log.faceAuth?.verified).length,
      averageScore: logs.reduce((sum, log) => sum + (log.driverScore || 0), 0) / logs.length || 0,
      safeTrips: logs.filter(log => 
        log.alcoholLevel < 0.15 && 
        !log.drowsiness?.detected && 
        !log.distraction?.detected &&
        !log.rashDriving?.detected
      ).length
    };
    
    return { success: true, statistics: stats };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==========================================
// 📱 DEVICE MANAGEMENT FUNCTIONS
// ==========================================

/**
 * Generate unique driver ID
 * @returns {Promise<string>} - Generated driver ID
 */
export const generateDriverId = async () => {
  try {
    // Get the latest driver ID from Firestore
    const counterRef = doc(db, 'counters', 'driverIdCounter');
    const counterDoc = await getDoc(counterRef);
    
    let nextId = 1;
    if (counterDoc.exists()) {
      nextId = (counterDoc.data().current || 0) + 1;
    }
    
    // Update the counter
    await setDoc(counterRef, { current: nextId }, { merge: true });
    
    // Format: DRV-YYYY-XXXX (e.g., DRV-2025-0001)
    const year = new Date().getFullYear();
    const paddedId = String(nextId).padStart(4, '0');
    return `DRV-${year}-${paddedId}`;
  } catch (error) {
    console.error('Error generating driver ID:', error);
    // Fallback to timestamp-based ID
    return `DRV-${Date.now()}`;
  }
};

/**
 * Get all devices
 */
export const getDevices = async () => {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'No user logged in' };
    const cacheKey = makeCacheKey('devicesForUser', user.uid);
    return await fetchWithCache(cacheKey, async () => {
      const q = query(collection(db, 'devices'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const devices = [];
      querySnapshot.forEach((doc) => {
        devices.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, devices };
    }, 30000);
  } catch (error) {
    console.error('Error fetching devices:', error);
    return { success: false, error: error.message, devices: [] };
  }
};

/**
 * Add new device
 * @param {Object} deviceData - Device data
 */
export const addDevice = async (deviceData) => {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'No user logged in' };
    
    // Add device to devices collection
    // Only store the allowed schema fields to the device document
    const deviceDoc = {
      adminId: deviceData.adminId || null,
      // Generate random Firestore-like IDs for alertsId/logsId when not provided
      alertsId: deviceData.alertsId || doc(collection(db, 'alerts')).id || null,
      batteryLevel: typeof deviceData.batteryLevel === 'number' ? deviceData.batteryLevel : (deviceData.batteryLevel != null ? Number(deviceData.batteryLevel) : null),
      // currLocation should be stored as a Firestore GeoPoint if lat/lng provided
      currLocation: null,
      deviceRegisterDate: deviceData.deviceRegisterDate || null,
      lastActive: deviceData.lastActive || null,
      lastLocationUpdateTime: deviceData.lastLocationUpdateTime || null,
      logsId: deviceData.logsId || doc(collection(db, 'logs')).id || null,
      status: deviceData.status || 'active',
      vehicleName: deviceData.vehicleName || null,
      vehicleNo: deviceData.vehicleNo || null
    };

    // Convert currLocation shapes to GeoPoint
    if (deviceData.currLocation) {
      const loc = deviceData.currLocation;
      let lat, lng;
      if (typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
        lat = loc.latitude; lng = loc.longitude;
      } else if (typeof loc.lat === 'number' && typeof loc.lng === 'number') {
        lat = loc.lat; lng = loc.lng;
      } else if (Array.isArray(loc) && loc.length >= 2) {
        lat = loc[0]; lng = loc[1];
      }
      if (typeof lat === 'number' && typeof lng === 'number') {
        deviceDoc.currLocation = new GeoPoint(lat, lng);
      } else {
        deviceDoc.currLocation = null;
      }
    }

    const docRef = await addDoc(collection(db, 'devices'), deviceDoc);
    
    // Add device ID to admin's device_ids array
    try {
      const adminRef = doc(db, 'admins', user.uid);
      await updateDoc(adminRef, {
        device_ids: arrayUnion(docRef.id),
        updatedAt: Date.now()
      });
    } catch (adminError) {
      console.warn('Could not update admin device_ids:', adminError);
    }
    
    const newDevice = {
      id: docRef.id,
      ...deviceDoc
    };
    
    return { success: true, device: newDevice };
  } catch (error) {
    console.error('Error adding device:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update device
 * @param {string} deviceId - Device ID
 * @param {Object} deviceData - Updated device data
 */
export const updateDevice = async (deviceId, deviceData) => {
  try {
    const deviceRef = doc(db, 'devices', deviceId);
    // Only allow updating the whitelisted fields
    const updatePayload = {
      ...(deviceData.adminId !== undefined ? { adminId: deviceData.adminId } : {}),
      ...(deviceData.alertsId !== undefined ? { alertsId: deviceData.alertsId } : {}),
      ...(deviceData.batteryLevel !== undefined ? { batteryLevel: Number(deviceData.batteryLevel) } : {}),
      ...(deviceData.currLocation !== undefined ? {} : {}),
      ...(deviceData.deviceRegisterDate !== undefined ? { deviceRegisterDate: deviceData.deviceRegisterDate } : {}),
      ...(deviceData.lastActive !== undefined ? { lastActive: deviceData.lastActive } : {}),
      ...(deviceData.lastLocationUpdateTime !== undefined ? { lastLocationUpdateTime: deviceData.lastLocationUpdateTime } : {}),
      ...(deviceData.logsId !== undefined ? { logsId: deviceData.logsId } : {}),
      ...(deviceData.status !== undefined ? { status: deviceData.status } : {}),
      ...(deviceData.vehicleName !== undefined ? { vehicleName: deviceData.vehicleName } : {}),
      ...(deviceData.vehicleNo !== undefined ? { vehicleNo: deviceData.vehicleNo } : {})
    };

    // Handle currLocation conversion if provided
    if (deviceData.currLocation !== undefined) {
      const loc = deviceData.currLocation;
      let lat, lng;
      if (loc && typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
        lat = loc.latitude; lng = loc.longitude;
      } else if (loc && typeof loc.lat === 'number' && typeof loc.lng === 'number') {
        lat = loc.lat; lng = loc.lng;
      } else if (Array.isArray(loc) && loc.length >= 2) {
        lat = loc[0]; lng = loc[1];
      }
      if (typeof lat === 'number' && typeof lng === 'number') {
        updatePayload.currLocation = new GeoPoint(lat, lng);
      } else {
        updatePayload.currLocation = null;
      }
    }

    await updateDoc(deviceRef, updatePayload);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Delete device
 * @param {string} deviceId - Device ID
 */
export const deleteDevice = async (deviceId) => {
  try {
    const user = getCurrentUser();
    
    // Delete device document
    await deleteDoc(doc(db, 'devices', deviceId));
    
    // Remove device ID from admin's device_ids array
    if (user) {
      try {
        const adminRef = doc(db, 'admins', user.uid);
        await updateDoc(adminRef, {
          device_ids: arrayRemove(deviceId),
          updatedAt: Date.now()
        });
      } catch (adminError) {
        console.warn('Could not update admin device_ids:', adminError);
      }
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==========================================
// 👤 ADMIN FUNCTIONS
// ==========================================

/**
 * Get admin data including device_ids
 * @param {string} adminId - Admin user ID (optional, uses current user if not provided)
 */
export const getAdminData = async (adminId = null) => {
  try {
    const user = adminId || getCurrentUser()?.uid;
    if (!user) return { success: false, error: 'No user logged in' };
    
    const adminRef = doc(db, 'admins', user);
    const adminDoc = await getDoc(adminRef);
    
    if (adminDoc.exists()) {
      return { success: true, admin: { id: adminDoc.id, ...adminDoc.data() } };
    } else {
      return { success: false, error: 'Admin not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get all devices for current admin
 */
export const getAdminDevices = async (limitCount = null) => {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'No user logged in' };
    
    // Get admin data to fetch device_ids
    const adminResult = await getAdminData(user.uid);
    if (!adminResult.success) {
      return { success: false, error: 'Could not fetch admin data' };
    }
    

    let deviceIds = adminResult.admin.device_ids || [];
    if (limitCount && Array.isArray(deviceIds)) {
      deviceIds = deviceIds.slice(0, limitCount);
    }

    if (deviceIds.length === 0) {
      return { success: true, devices: [] };
    }

    const cacheKey = makeCacheKey('adminDevices', user.uid, deviceIds.join(','));
    return await fetchWithCache(cacheKey, async () => {
      // Fetch devices in parallel to reduce latency
      const devicePromises = deviceIds.map(async (deviceId) => {
        const deviceRef = doc(db, 'devices', deviceId);
        const deviceDoc = await getDoc(deviceRef);
        if (deviceDoc.exists()) return { id: deviceDoc.id, ...deviceDoc.data() };
        return null;
      });
      const resolved = await Promise.all(devicePromises);
      const devices = resolved.filter(Boolean);
      return { success: true, devices };
    }, 30000);
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==========================================
// 🔒 SECURITY FUNCTIONS
// ==========================================

/**
 * Get security logs
 */
export const getSecurityLogs = async () => {
  try {
    const q = query(
      collection(db, 'security_logs'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, logs };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update security settings
 * @param {Object} settings - Security settings
 */
export const updateSecuritySettings = async (settings) => {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'No user logged in' };

    const settingsRef = doc(db, 'user_settings', user.uid);
    await setDoc(settingsRef, {
      security: settings,
      updatedAt: Date.now()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get security settings
 */
export const getSecuritySettings = async () => {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'No user logged in' };

    const settingsRef = doc(db, 'user_settings', user.uid);
    const docSnap = await getDoc(settingsRef);

    if (docSnap.exists()) {
      return { success: true, settings: docSnap.data().security || {} };
    } else {
      // Return default settings
      return {
        success: true,
        settings: {
          twoFactorEnabled: false,
          sessionTimeout: 30,
          passwordPolicy: 'strong',
          alertThreshold: 0.15,
          autoLock: true,
          auditLogging: true
        }
      };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ==========================================
// 👤 USER PROFILE FUNCTIONS
// ==========================================

/**
 * Update user profile
 * @param {Object} profileData - Profile data
 */
export const updateUserProfile = async (profileData) => {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'No user logged in' };

    await updateProfile(user, {
      displayName: profileData.name,
      phoneNumber: profileData.phone
    });

    // Update additional profile data in Firestore
    const profileRef = doc(db, 'user_profiles', user.uid);
    await setDoc(profileRef, {
      ...profileData,
      updatedAt: Date.now()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Export user data
 */
export const exportUserData = async () => {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'No user logged in' };

    const userId = user.uid;
    const data = {
      profile: {},
      devices: [],
      logs: [],
      alerts: [],
      settings: {},
      exportedAt: Date.now()
    };

    // Get user profile
    const profileRef = doc(db, 'user_profiles', userId);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      data.profile = profileSnap.data();
    }

    // Get devices
    const devicesQuery = query(collection(db, 'devices'), where('userId', '==', userId));
    const devicesSnap = await getDocs(devicesQuery);
    devicesSnap.forEach((doc) => {
      data.devices.push({ id: doc.id, ...doc.data() });
    });

    // Get logs
    const logsQuery = query(collection(db, 'logs'), where('userId', '==', userId));
    const logsSnap = await getDocs(logsQuery);
    logsSnap.forEach((doc) => {
      data.logs.push({ id: doc.id, ...doc.data() });
    });

    // Get alerts
    const alertsQuery = query(collection(db, 'alerts'), where('userId', '==', userId));
    const alertsSnap = await getDocs(alertsQuery);
    alertsSnap.forEach((doc) => {
      data.alerts.push({ id: doc.id, ...doc.data() });
    });

    // Get settings
    const settingsRef = doc(db, 'user_settings', userId);
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists()) {
      data.settings = settingsSnap.data();
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Import user data
 * @param {Object} data - Data to import
 */
export const importUserData = async (data) => {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'No user logged in' };

    const userId = user.uid;

    // Import profile
    if (data.profile) {
      const profileRef = doc(db, 'user_profiles', userId);
      await setDoc(profileRef, { ...data.profile, userId }, { merge: true });
    }

    // Import devices
    if (data.devices && Array.isArray(data.devices)) {
      for (const device of data.devices) {
        const { id, ...deviceData } = device;
        await addDoc(collection(db, 'devices'), { ...deviceData, userId });
      }
    }

    // Import settings
    if (data.settings) {
      const settingsRef = doc(db, 'user_settings', userId);
      await setDoc(settingsRef, data.settings, { merge: true });
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Clear all user data
 */
export const clearAllData = async () => {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'No user logged in' };

    const userId = user.uid;

    // This is a simplified version - in production, you'd want to delete all user-related documents
    // For now, we'll just clear the user profile and settings
    const profileRef = doc(db, 'user_profiles', userId);
    await deleteDoc(profileRef);

    const settingsRef = doc(db, 'user_settings', userId);
    await deleteDoc(settingsRef);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Export Firebase instances for direct use if needed
export { auth, db, rtdb };

// ==========================================
// 📊 ANALYTICS & STATISTICS FUNCTIONS
// ==========================================

/**
 * Get device statistics
 * @param {string} deviceId - Optional device ID to filter
 * @param {number} days - Number of days to analyze
 */
export const getDeviceStatistics = async (deviceId = null, days = 7) => {
  try {
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    let q;
    
    if (deviceId) {
      q = query(
        collection(db, 'logs'),
        where('deviceId', '==', deviceId),
        where('timestamp', '>=', cutoffTime),
        orderBy('timestamp', 'desc')
      );
    } else {
      q = query(
        collection(db, 'logs'),
        where('timestamp', '>=', cutoffTime),
        orderBy('timestamp', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    
    // Calculate statistics
    const stats = {
      totalReadings: logs.length,
      averageBAC: 0,
      maxBAC: 0,
      alertCount: 0,
      safeReadings: 0,
      warningReadings: 0,
      criticalReadings: 0
    };
    
    logs.forEach(log => {
      const bac = log.alcoholLevel || 0;
      stats.averageBAC += bac;
      stats.maxBAC = Math.max(stats.maxBAC, bac);
      
      if (bac > 0.3) {
        stats.criticalReadings++;
        stats.alertCount++;
      } else if (bac > 0.15) {
        stats.warningReadings++;
      } else {
        stats.safeReadings++;
      }
    });
    
    if (logs.length > 0) {
      stats.averageBAC = stats.averageBAC / logs.length;
    }
    
    return { success: true, stats, logs };
  } catch (error) {
    console.error('Error getting statistics:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Create security log entry
 * @param {Object} logData - Log data
 */
export const createSecurityLog = async (logData) => {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'No user logged in' };
    
    const docRef = await addDoc(collection(db, 'security_logs'), {
      ...logData,
      userId: user.uid,
      userEmail: user.email,
      timestamp: Date.now()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating security log:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get device by ID
 * @param {string} deviceId - Device ID
 */
export const getDeviceById = async (deviceId) => {
  try {
    const deviceRef = doc(db, 'devices', deviceId);
    const deviceSnap = await getDoc(deviceRef);
    
    if (deviceSnap.exists()) {
      return { success: true, device: { id: deviceSnap.id, ...deviceSnap.data() } };
    } else {
      return { success: false, error: 'Device not found' };
    }
  } catch (error) {
    console.error('Error getting device:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get logs for specific device
 * @param {string} deviceId - Device ID
 * @param {number} limitCount - Number of logs to retrieve
 */
export const getDeviceLogsById = async (deviceId, limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'logs'),
      where('deviceId', '==', deviceId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, logs };
  } catch (error) {
    console.error('Error getting device logs:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update alert status
 * @param {string} alertId - Alert ID
 * @param {string} status - New status (new, acknowledged, resolved)
 */
export const updateAlertStatus = async (alertId, status) => {
  try {
    const alertRef = doc(db, 'alerts', alertId);
    await updateDoc(alertRef, {
      status: status,
      updatedAt: Date.now()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating alert:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Batch create logs (for testing or bulk import)
 * @param {Array} logsData - Array of log objects
 */
export const batchCreateLogs = async (logsData) => {
  try {
    const promises = logsData.map(logData => 
      addDoc(collection(db, 'logs'), {
        ...logData,
        timestamp: logData.timestamp || Date.now()
      })
    );
    
    await Promise.all(promises);
    return { success: true, count: logsData.length };
  } catch (error) {
    console.error('Error batch creating logs:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user profile
 * @param {string} userId - Optional user ID (defaults to current user)
 */
export const getUserProfile = async (userId = null) => {
  try {
    const user = getCurrentUser();
    const targetUserId = userId || user?.uid;
    
    if (!targetUserId) return { success: false, error: 'No user ID provided' };
    
    const profileRef = doc(db, 'user_profiles', targetUserId);
    const profileSnap = await getDoc(profileRef);
    
    if (profileSnap.exists()) {
      return { success: true, profile: profileSnap.data() };
    } else {
      return { success: true, profile: null };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Save user preferences
 * @param {Object} preferences - User preferences
 */
export const saveUserPreferences = async (preferences) => {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'No user logged in' };
    
    const prefsRef = doc(db, 'user_settings', user.uid);
    await setDoc(prefsRef, {
      preferences: preferences,
      updatedAt: Date.now()
    }, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error('Error saving preferences:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user preferences
 */
export const getUserPreferences = async () => {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'No user logged in' };
    
    const prefsRef = doc(db, 'user_settings', user.uid);
    const prefsSnap = await getDoc(prefsRef);
    
    if (prefsSnap.exists() && prefsSnap.data().preferences) {
      return { success: true, preferences: prefsSnap.data().preferences };
    } else {
      // Return default preferences
      return {
        success: true,
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: true,
          autoRefresh: true
        }
      };
    }
  } catch (error) {
    console.error('Error getting preferences:', error);
    return { success: false, error: error.message };
  }
};
