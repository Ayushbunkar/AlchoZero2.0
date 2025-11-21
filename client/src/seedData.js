// Sample Data Seeder for Testing
// Run this after logging into the dashboard to populate with test data

import {
  addDevice,
  generateDriverId,
  saveDeviceLog,
  triggerAlert,
  updateDeviceStatus
} from './firebaseConfig';

/**
 * Create sample devices with drivers
 */
export const seedDevices = async () => {
  console.log('🌱 Seeding sample devices...');
  
  const sampleDevices = [
    {
      name: 'Car Alcohol Detector #1',
      deviceId: 'ALCH-001',
      driverName: 'John Smith',
      driverAge: '35',
      location: 'Downtown Area',
      vehicleName: 'Toyota Camry',
      vehicleNumber: 'ABC-1234',
      contactNumber: '+1234567890',
      licenseNo: 'DL-1234567890',
      status: 'active'
    },
    {
      name: 'Truck Alcohol Detector #2',
      deviceId: 'ALCH-002',
      driverName: 'Sarah Johnson',
      driverAge: '28',
      location: 'Highway 101',
      vehicleName: 'Ford F-150',
      vehicleNumber: 'XYZ-5678',
      contactNumber: '+1987654321',
      licenseNo: 'DL-9876543210',
      status: 'active'
    },
    {
      name: 'Bus Alcohol Detector #3',
      deviceId: 'ALCH-003',
      driverName: 'Michael Chen',
      driverAge: '42',
      location: 'Bus Terminal',
      vehicleName: 'Volvo Bus',
      vehicleNumber: 'BUS-9012',
      contactNumber: '+1122334455',
      licenseNo: 'DL-5566778899',
      status: 'active'
    },
    {
      name: 'Taxi Alcohol Detector #4',
      deviceId: 'ALCH-004',
      driverName: 'Emily Davis',
      driverAge: '31',
      location: 'Airport',
      vehicleName: 'Honda Accord',
      vehicleNumber: 'TAXI-3456',
      contactNumber: '+1555666777',
      licenseNo: 'DL-3344556677',
      status: 'maintenance'
    },
    {
      name: 'Van Alcohol Detector #5',
      deviceId: 'ALCH-005',
      driverName: 'David Martinez',
      driverAge: '39',
      location: 'City Center',
      vehicleName: 'Mercedes Sprinter',
      vehicleNumber: 'VAN-7890',
      contactNumber: '+1888999000',
      licenseNo: 'DL-7788990011',
      status: 'offline'
    }
  ];

  const createdDevices = [];
  
  for (const device of sampleDevices) {
    try {
      const driverId = await generateDriverId();
      const result = await addDevice({
        ...device,
        driverId,
        batteryLevel: Math.floor(Math.random() * 30) + 70, // 70-100%
        lastSeen: new Date().toISOString(),
        firmwareVersion: '1.0.0'
      });
      
      if (result.success) {
        console.log(`  ✅ Added: ${device.name}`);
        createdDevices.push(result.device);
      } else {
        console.log(`  ❌ Failed to add ${device.name}:`, result.error);
      }
    } catch (error) {
      console.error(`  ❌ Error adding ${device.name}:`, error);
    }
  }
  
  console.log(`\n✅ Created ${createdDevices.length} devices`);
  return createdDevices;
};

/**
 * Create sample logs for devices
 */
export const seedLogs = async (deviceIds = ['ALCH-001', 'ALCH-002', 'ALCH-003']) => {
  console.log('🌱 Seeding sample logs...');
  
  const logsCreated = [];
  
  // Create 50 logs spread over the last 7 days
  for (let i = 0; i < 50; i++) {
    const deviceId = deviceIds[Math.floor(Math.random() * deviceIds.length)];
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    
    // Generate realistic BAC levels (most safe, some warnings, few alerts)
    let alcoholLevel;
    const rand = Math.random();
    if (rand < 0.7) {
      // 70% safe readings (0.00 - 0.10)
      alcoholLevel = Math.random() * 0.10;
    } else if (rand < 0.9) {
      // 20% warning readings (0.10 - 0.30)
      alcoholLevel = 0.10 + Math.random() * 0.20;
    } else {
      // 10% alert readings (0.30 - 0.50)
      alcoholLevel = 0.30 + Math.random() * 0.20;
    }
    
    try {
      const result = await saveDeviceLog(deviceId, {
        alcoholLevel: parseFloat(alcoholLevel.toFixed(3)),
        engine: alcoholLevel > 0.15 ? 'LOCKED' : 'ON',
        timestamp: Date.now() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000)
      });
      
      if (result.success) {
        logsCreated.push(result.id);
      }
    } catch (error) {
      console.error('  ❌ Error creating log:', error);
    }
  }
  
  console.log(`✅ Created ${logsCreated.length} logs`);
  return logsCreated;
};

/**
 * Create sample alerts
 */
export const seedAlerts = async (deviceIds = ['ALCH-001', 'ALCH-002', 'ALCH-003']) => {
  console.log('🌱 Seeding sample alerts...');
  
  const alertsCreated = [];
  
  // Create 10 alerts over the last 7 days
  for (let i = 0; i < 10; i++) {
    const deviceId = deviceIds[Math.floor(Math.random() * deviceIds.length)];
    const alcoholLevel = 0.30 + Math.random() * 0.20; // 0.30 - 0.50
    
    try {
      const result = await triggerAlert(deviceId, parseFloat(alcoholLevel.toFixed(3)));
      
      if (result.success) {
        console.log(`  ✅ Created alert for ${deviceId}`);
        alertsCreated.push(result.id);
      }
    } catch (error) {
      console.error('  ❌ Error creating alert:', error);
    }
  }
  
  console.log(`✅ Created ${alertsCreated.length} alerts`);
  return alertsCreated;
};

/**
 * Update realtime device status
 */
export const seedRealtimeData = async (deviceIds = ['ALCH-001', 'ALCH-002', 'ALCH-003']) => {
  console.log('🌱 Seeding realtime device status...');
  
  for (const deviceId of deviceIds) {
    const alcoholLevel = Math.random() * 0.20; // 0.00 - 0.20
    
    try {
      await updateDeviceStatus(deviceId, {
        alcoholLevel: parseFloat(alcoholLevel.toFixed(3)),
        engine: alcoholLevel > 0.15 ? 'LOCKED' : 'ON',
        timestamp: Date.now()
      });
      
      console.log(`  ✅ Updated realtime status for ${deviceId}`);
    } catch (error) {
      console.error(`  ❌ Error updating ${deviceId}:`, error);
    }
  }
  
  console.log('✅ Realtime data updated');
};

/**
 * Seed all sample data
 */
export const seedAllData = async () => {
  console.log('🌱 Seeding all sample data...\n');
  
  try {
    // Step 1: Create devices
    const devices = await seedDevices();
    const deviceIds = devices.map(d => d.deviceId);
    
    if (deviceIds.length === 0) {
      console.log('❌ No devices created. Aborting.');
      return;
    }
    
    // Wait a bit for Firestore to sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 2: Create logs
    await seedLogs(deviceIds);
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 3: Create alerts
    await seedAlerts(deviceIds);
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 4: Update realtime status
    await seedRealtimeData(deviceIds);
    
    console.log('\n✅ All sample data seeded successfully!');
    console.log('📊 Summary:');
    console.log(`  - Devices: ${devices.length}`);
    console.log(`  - Device IDs: ${deviceIds.join(', ')}`);
    console.log('  - Logs: ~50 entries');
    console.log('  - Alerts: ~10 entries');
    console.log('  - Realtime data: Updated');
    console.log('\n🔄 Refresh your dashboard to see the data!');
    
    return {
      devices,
      deviceIds,
      success: true
    };
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Quick seed (smaller dataset for quick testing)
 */
export const quickSeed = async () => {
  console.log('⚡ Quick seed (3 devices, 20 logs, 5 alerts)...\n');
  
  try {
    // Create 3 devices
    const sampleDevices = [
      {
        name: 'Test Car #1',
        deviceId: 'TEST-001',
        driverName: 'Test Driver 1',
        driverAge: '30',
        location: 'Test Location',
        vehicleName: 'Test Car',
        vehicleNumber: 'TEST-001',
        contactNumber: '+1234567890',
        licenseNo: 'DL-TEST-001',
        status: 'active'
      },
      {
        name: 'Test Car #2',
        deviceId: 'TEST-002',
        driverName: 'Test Driver 2',
        driverAge: '35',
        location: 'Test Location',
        vehicleName: 'Test Car',
        vehicleNumber: 'TEST-002',
        contactNumber: '+1234567891',
        licenseNo: 'DL-TEST-002',
        status: 'active'
      },
      {
        name: 'Test Car #3',
        deviceId: 'TEST-003',
        driverName: 'Test Driver 3',
        driverAge: '28',
        location: 'Test Location',
        vehicleName: 'Test Car',
        vehicleNumber: 'TEST-003',
        contactNumber: '+1234567892',
        licenseNo: 'DL-TEST-003',
        status: 'active'
      }
    ];
    
    const devices = [];
    for (const device of sampleDevices) {
      const driverId = await generateDriverId();
      const result = await addDevice({ ...device, driverId });
      if (result.success) devices.push(result.device);
    }
    
    const deviceIds = devices.map(d => d.deviceId);
    
    // Create 20 logs
    for (let i = 0; i < 20; i++) {
      const deviceId = deviceIds[i % deviceIds.length];
      const alcoholLevel = Math.random() * 0.30;
      await saveDeviceLog(deviceId, {
        alcoholLevel: parseFloat(alcoholLevel.toFixed(3)),
        engine: alcoholLevel > 0.15 ? 'LOCKED' : 'ON'
      });
    }
    
    // Create 5 alerts
    for (let i = 0; i < 5; i++) {
      const deviceId = deviceIds[i % deviceIds.length];
      await triggerAlert(deviceId, 0.35);
    }
    
    console.log('✅ Quick seed complete!');
    return { success: true, devices, deviceIds };
  } catch (error) {
    console.error('❌ Quick seed failed:', error);
    return { success: false, error: error.message };
  }
};

// Export for browser console use
if (typeof window !== 'undefined') {
  window.seedData = {
    seedDevices,
    seedLogs,
    seedAlerts,
    seedRealtimeData,
    seedAllData,
    quickSeed
  };
  
  console.log('🌱 Data seeder loaded!');
  console.log('Usage:');
  console.log('  window.seedData.quickSeed()       - Quick test data (3 devices)');
  console.log('  window.seedData.seedAllData()     - Full sample data (5 devices)');
}

export default {
  seedDevices,
  seedLogs,
  seedAlerts,
  seedRealtimeData,
  seedAllData,
  quickSeed
};
