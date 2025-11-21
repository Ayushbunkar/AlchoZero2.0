// Firebase Connection Test Utility
// Use this in browser console to test Firebase connections

import {
  loginUser,
  getDevices,
  addDevice,
  getDeviceLogs,
  getAlerts,
  generateDriverId,
  saveDeviceLog,
  triggerAlert,
  getDeviceStatistics,
  getCurrentUser
} from './firebaseConfig';

/**
 * Test Firebase Authentication
 */
export const testAuth = async () => {
  console.log('🔐 Testing Authentication...');
  try {
    const user = getCurrentUser();
    if (user) {
      console.log('✅ User is authenticated:', user.email);
      return true;
    } else {
      console.log('❌ No user authenticated. Please login first.');
      return false;
    }
  } catch (error) {
    console.error('❌ Auth test failed:', error);
    return false;
  }
};

/**
 * Test Device Operations
 */
export const testDevices = async () => {
  console.log('📱 Testing Device Operations...');
  try {
    // Test: Get all devices
    console.log('  → Fetching devices...');
    const result = await getDevices();
    if (result.success) {
      console.log(`  ✅ Found ${result.devices.length} devices`);
      return true;
    } else {
      console.log('  ❌ Failed to fetch devices:', result.error);
      return false;
    }
  } catch (error) {
    console.error('  ❌ Device test failed:', error);
    return false;
  }
};

/**
 * Test Add Device
 */
export const testAddDevice = async () => {
  console.log('➕ Testing Add Device...');
  try {
    const driverId = await generateDriverId();
    console.log(`  → Generated Driver ID: ${driverId}`);
    
    const deviceData = {
      name: 'Test Device',
      deviceId: `TEST-${Date.now()}`,
      driverId: driverId,
      driverName: 'Test Driver',
      driverAge: '30',
      location: 'Test Location',
      status: 'active',
      vehicleName: 'Test Vehicle',
      vehicleNumber: 'TEST-123'
    };
    
    const result = await addDevice(deviceData);
    if (result.success) {
      console.log('  ✅ Device added successfully:', result.device.id);
      return result.device;
    } else {
      console.log('  ❌ Failed to add device:', result.error);
      return null;
    }
  } catch (error) {
    console.error('  ❌ Add device test failed:', error);
    return null;
  }
};

/**
 * Test Logs
 */
export const testLogs = async () => {
  console.log('📝 Testing Logs...');
  try {
    const result = await getDeviceLogs(10);
    if (result.success) {
      console.log(`  ✅ Found ${result.logs.length} logs`);
      return true;
    } else {
      console.log('  ❌ Failed to fetch logs:', result.error);
      return false;
    }
  } catch (error) {
    console.error('  ❌ Logs test failed:', error);
    return false;
  }
};

/**
 * Test Create Log
 */
export const testCreateLog = async (deviceId = 'TEST-001') => {
  console.log('📝 Testing Create Log...');
  try {
    const result = await saveDeviceLog(deviceId, {
      alcoholLevel: Math.random() * 0.5,
      engine: Math.random() > 0.5 ? 'ON' : 'OFF'
    });
    
    if (result.success) {
      console.log('  ✅ Log created successfully:', result.id);
      return true;
    } else {
      console.log('  ❌ Failed to create log:', result.error);
      return false;
    }
  } catch (error) {
    console.error('  ❌ Create log test failed:', error);
    return false;
  }
};

/**
 * Test Alerts
 */
export const testAlerts = async () => {
  console.log('🚨 Testing Alerts...');
  try {
    const result = await getAlerts(10);
    if (result.success) {
      console.log(`  ✅ Found ${result.alerts.length} alerts`);
      return true;
    } else {
      console.log('  ❌ Failed to fetch alerts:', result.error);
      return false;
    }
  } catch (error) {
    console.error('  ❌ Alerts test failed:', error);
    return false;
  }
};

/**
 * Test Create Alert
 */
export const testCreateAlert = async (deviceId = 'TEST-001') => {
  console.log('🚨 Testing Create Alert...');
  try {
    const result = await triggerAlert(deviceId, 0.35);
    if (result.success) {
      console.log('  ✅ Alert created successfully:', result.id);
      return true;
    } else {
      console.log('  ❌ Failed to create alert:', result.error);
      return false;
    }
  } catch (error) {
    console.error('  ❌ Create alert test failed:', error);
    return false;
  }
};

/**
 * Test Statistics
 */
export const testStatistics = async () => {
  console.log('📊 Testing Statistics...');
  try {
    const result = await getDeviceStatistics(null, 7);
    if (result.success) {
      console.log('  ✅ Statistics retrieved:');
      console.log('    - Total Readings:', result.stats.totalReadings);
      console.log('    - Average BAC:', result.stats.averageBAC.toFixed(3));
      console.log('    - Max BAC:', result.stats.maxBAC.toFixed(3));
      console.log('    - Alert Count:', result.stats.alertCount);
      return true;
    } else {
      console.log('  ❌ Failed to get statistics:', result.error);
      return false;
    }
  } catch (error) {
    console.error('  ❌ Statistics test failed:', error);
    return false;
  }
};

/**
 * Run All Tests
 */
export const runAllTests = async () => {
  console.log('🧪 Running All Firebase Tests...\n');
  
  const results = {
    auth: await testAuth(),
    devices: await testDevices(),
    logs: await testLogs(),
    alerts: await testAlerts(),
    statistics: await testStatistics()
  };
  
  console.log('\n📊 Test Results:');
  console.log('================');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}`);
  });
  
  const allPassed = Object.values(results).every(r => r);
  console.log('\n' + (allPassed ? '✅ All tests passed!' : '❌ Some tests failed'));
  
  return results;
};

// Quick test command
export const quickTest = async () => {
  console.log('⚡ Quick Firebase Test\n');
  
  const user = getCurrentUser();
  if (!user) {
    console.log('❌ Please login first!');
    return;
  }
  
  console.log('✅ Authenticated as:', user.email);
  
  const devices = await getDevices();
  console.log(`✅ Devices: ${devices.devices?.length || 0}`);
  
  const logs = await getDeviceLogs(5);
  console.log(`✅ Logs: ${logs.logs?.length || 0}`);
  
  const alerts = await getAlerts(5);
  console.log(`✅ Alerts: ${alerts.alerts?.length || 0}`);
  
  console.log('\n✅ Firebase is working properly!');
};

// Export for browser console use
if (typeof window !== 'undefined') {
  window.firebaseTest = {
    testAuth,
    testDevices,
    testAddDevice,
    testLogs,
    testCreateLog,
    testAlerts,
    testCreateAlert,
    testStatistics,
    runAllTests,
    quickTest
  };
  
  console.log('🔥 Firebase test utilities loaded!');
  console.log('Usage:');
  console.log('  window.firebaseTest.quickTest()');
  console.log('  window.firebaseTest.runAllTests()');
}
