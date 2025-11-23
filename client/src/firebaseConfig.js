import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, doc, setDoc, getDoc, updateDoc, deleteDoc, where, arrayUnion, arrayRemove } from 'firebase/firestore';
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
    
    const q = query(collection(db, 'devices'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const devices = [];
    querySnapshot.forEach((doc) => {
      devices.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, devices };
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
    const docRef = await addDoc(collection(db, 'devices'), {
      ...deviceData,
      userId: user.uid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: deviceData.status || 'active'
    });
    
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
      ...deviceData,
      userId: user.uid,
      createdAt: Date.now(),
      updatedAt: Date.now()
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
    await updateDoc(deviceRef, {
      ...deviceData,
      updatedAt: Date.now()
    });
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
export const getAdminDevices = async () => {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'No user logged in' };
    
    // Get admin data to fetch device_ids
    const adminResult = await getAdminData(user.uid);
    if (!adminResult.success) {
      return { success: false, error: 'Could not fetch admin data' };
    }
    
    const deviceIds = adminResult.admin.device_ids || [];
    
    if (deviceIds.length === 0) {
      return { success: true, devices: [] };
    }
    
    // Fetch devices by IDs
    const devices = [];
    for (const deviceId of deviceIds) {
      const deviceRef = doc(db, 'devices', deviceId);
      const deviceDoc = await getDoc(deviceRef);
      if (deviceDoc.exists()) {
        devices.push({ id: deviceDoc.id, ...deviceDoc.data() });
      }
    }
    
    return { success: true, devices };
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
