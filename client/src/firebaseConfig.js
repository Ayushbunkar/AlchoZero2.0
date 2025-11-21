import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { getDatabase, ref, onValue, set, push } from 'firebase/database';

// 🔥 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjPs8l-PKtwIak7A4NMVreRG_82PuMozc",
  authDomain: "fftour-5ac79.firebaseapp.com",
  databaseURL: "https://fftour-5ac79-default-rtdb.firebaseio.com",
  projectId: "fftour-5ac79",
  storageBucket: "fftour-5ac79.appspot.com",
  messagingSenderId: "427551679783",
  appId: "1:427551679783:web:0df888c6c9d85f2eebf502",
  measurementId: "G-C7F970EMRZ"
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

// Export Firebase instances for direct use if needed
export { auth, db, rtdb };
