import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, doc, setDoc, getDoc, updateDoc, deleteDoc, where } from 'firebase/firestore';
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

// Initialize Firebase
let app, auth, db, rtdb;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  rtdb = getDatabase(app);
} catch (error) {
  console.warn('Firebase initialization failed. Using demo mode.', error.message);
  // Create mock objects for development without Firebase
  app = null;
  auth = { currentUser: null };
  db = null;
  rtdb = null;
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
  return auth.onAuthStateChanged(callback);
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
    const q = query(collection(db, 'devices'), orderBy('name'));
    const querySnapshot = await getDocs(q);
    const devices = [];
    querySnapshot.forEach((doc) => {
      devices.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, devices };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Add new device
 * @param {Object} deviceData - Device data
 */
export const addDevice = async (deviceData) => {
  try {
    const docRef = await addDoc(collection(db, 'devices'), {
      ...deviceData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    return { success: true, device: { id: docRef.id, ...deviceData } };
  } catch (error) {
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
    await deleteDoc(doc(db, 'devices', deviceId));
    return { success: true };
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
