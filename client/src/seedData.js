import {
  addDevice,
  generateDriverId,
  saveDeviceLog,
  triggerAlert,
  updateDeviceStatus
} from './firebaseConfig';

// Utility: try common shapes for returned ids
const safeIdFromResult = (result) => {
  if (!result) return null;
  if (result.id) return result.id;
  if (result.device && (result.device.id || result.device.deviceId)) return result.device.id || result.device.deviceId;
  if (result.deviceId) return result.deviceId;
  return null;
};

export const seedDevices = async () => {
  console.log('🌱 Seeding sample devices...');

  const sampleDevices = [
    {
      adminId: 'jcjdvncknvidenvn',
      batteryLevel: 90,
      currLocation: { lat: 0, lng: 0 },
      deviceRegisterDate: new Date('2025-11-26T06:58:57.000Z'),
      lastActive: new Date('2025-11-03T05:52:42.000Z'),
      lastLocationUpdateTime: new Date('2025-11-25T06:01:11.000Z'),
      logsId: 'xsjxbnsjncjss',
      status: 'active',
      vehicleName: 'Testing Vehicle',
      vehicleNo: 'MP07AA1234'
    },
    {
      adminId: 'jcjdvncknvidenvn',
      batteryLevel: 85,
      currLocation: { lat: 0, lng: 0 },
      deviceRegisterDate: new Date('2025-11-26T06:58:57.000Z'),
      lastActive: new Date('2025-11-03T05:52:42.000Z'),
      lastLocationUpdateTime: new Date('2025-11-25T06:01:11.000Z'),
      
      status: 'active',
      vehicleName: 'Testing Vehicle B',
      vehicleNo: 'MP07BB5678'
    }
  ];

  const created = [];
  for (const device of sampleDevices) {
    try {
      const driverId = await generateDriverId();
      const result = await addDevice({ ...device, driverId });
      const id = safeIdFromResult(result);
      if (id) {
        created.push({ id, ...device });
        console.log(`  ✅ Added device ${id}`);
      } else {
        console.warn('  ⚠️ Device add returned no id:', result);
      }
    } catch (err) {
      console.error('  ❌ Error adding device:', err);
    }
  }

  console.log(`\n✅ Created ${created.length} devices`);
  return created;
};

export const seedLogs = async (deviceIds = []) => {
  if (!Array.isArray(deviceIds) || deviceIds.length === 0) {
    console.warn('seedLogs: no deviceIds provided');
    return [];
  }

  console.log('🌱 Seeding sample logs...');
  const created = [];
  for (let i = 0; i < 50; i++) {
    const deviceId = deviceIds[Math.floor(Math.random() * deviceIds.length)];
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    let alcoholLevel;
    const rand = Math.random();
    if (rand < 0.7) alcoholLevel = Math.random() * 0.10;
    else if (rand < 0.9) alcoholLevel = 0.10 + Math.random() * 0.20;
    else alcoholLevel = 0.30 + Math.random() * 0.20;

    try {
      const res = await saveDeviceLog(deviceId, {
        alcoholLevel: parseFloat(alcoholLevel.toFixed(3)),
        engine: alcoholLevel > 0.15 ? 'LOCKED' : 'ON',
        timestamp: Date.now() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000)
      });
      const id = safeIdFromResult(res);
      if (id) created.push(id);
    } catch (err) {
      console.error('  ❌ Error creating log:', err);
    }
  }

  console.log(`✅ Created ${created.length} logs`);
  return created;
};

export const seedAlerts = async (deviceIds = []) => {
  if (!Array.isArray(deviceIds) || deviceIds.length === 0) {
    console.warn('seedAlerts: no deviceIds provided');
    return [];
  }

  console.log('🌱 Seeding sample alerts...');
  const created = [];
  for (let i = 0; i < 10; i++) {
    const deviceId = deviceIds[Math.floor(Math.random() * deviceIds.length)];
    const alcoholLevel = 0.30 + Math.random() * 0.20;
    try {
      const res = await triggerAlert(deviceId, parseFloat(alcoholLevel.toFixed(3)));
      const id = safeIdFromResult(res);
      if (id) {
        created.push(id);
        console.log(`  ✅ Created alert for ${deviceId}`);
      }
    } catch (err) {
      console.error('  ❌ Error creating alert:', err);
    }
  }

  console.log(`✅ Created ${created.length} alerts`);
  return created;
};

export const seedRealtimeData = async (deviceIds = []) => {
  if (!Array.isArray(deviceIds) || deviceIds.length === 0) {
    console.warn('seedRealtimeData: no deviceIds provided');
    return;
  }

  console.log('🌱 Seeding realtime device status...');
  for (const deviceId of deviceIds) {
    const alcoholLevel = Math.random() * 0.20;
    try {
      await updateDeviceStatus(deviceId, {
        alcoholLevel: parseFloat(alcoholLevel.toFixed(3)),
        engine: alcoholLevel > 0.15 ? 'LOCKED' : 'ON',
        timestamp: Date.now()
      });
      console.log(`  ✅ Updated realtime status for ${deviceId}`);
    } catch (err) {
      console.error(`  ❌ Error updating ${deviceId}:`, err);
    }
  }
  console.log('✅ Realtime data updated');
};

export const seedAllData = async () => {
  console.log('🌱 Seeding all sample data...\n');
  try {
    const devices = await seedDevices();
    const deviceIds = devices.map((d) => d.id).filter(Boolean);
    if (deviceIds.length === 0) {
      console.log('❌ No devices created. Aborting.');
      return { success: false, devices: [] };
    }

    // Give Firestore a moment to settle
    await new Promise((r) => setTimeout(r, 1500));

    await seedLogs(deviceIds);
    await new Promise((r) => setTimeout(r, 800));
    await seedAlerts(deviceIds);
    await new Promise((r) => setTimeout(r, 800));
    await seedRealtimeData(deviceIds);

    console.log('\n✅ All sample data seeded successfully!');
    console.log('📊 Summary:');
    console.log(`  - Devices: ${deviceIds.length}`);
    console.log(`  - Device IDs: ${deviceIds.join(', ')}`);
    console.log('  - Logs: ~50 entries');
    console.log('  - Alerts: ~10 entries');
    console.log('  - Realtime data: Updated');

    return { success: true, devices, deviceIds };
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    return { success: false, error: err?.message || String(err) };
  }
};

export const quickSeed = async () => {
  try {
    const sampleDevices = [
      {
        adminId: 'jcjdvncknvidenvn',
        batteryLevel: 95,
        currLocation: { lat: 0, lng: 0 },
        deviceRegisterDate: new Date(),
        lastActive: new Date(),
        lastLocationUpdateTime: new Date(),
      
        status: 'active',
        vehicleName: 'Test Car 1',
        vehicleNo: 'TEST-001'
      },
      {
        adminId: 'jcjdvncknvidenvn',
        batteryLevel: 88,
        currLocation: { lat: 0, lng: 0 },
        deviceRegisterDate: new Date(),
        lastActive: new Date(),
        lastLocationUpdateTime: new Date(),
        
        status: 'active',
        vehicleName: 'Test Car 2',
        vehicleNo: 'TEST-002'
      }
    ];

    const devices = [];
    for (const device of sampleDevices) {
      const driverId = await generateDriverId();
      const res = await addDevice({ ...device, driverId });
      const id = safeIdFromResult(res);
      if (id) devices.push({ id, ...device });
    }

    const deviceIds = devices.map((d) => d.id).filter(Boolean);
    if (deviceIds.length === 0) {
      return { success: false, error: 'no devices created' };
    }

    for (let i = 0; i < 20; i++) {
      const deviceId = deviceIds[i % deviceIds.length];
      const alcoholLevel = Math.random() * 0.30;
      await saveDeviceLog(deviceId, {
        alcoholLevel: parseFloat(alcoholLevel.toFixed(3)),
        engine: alcoholLevel > 0.15 ? 'LOCKED' : 'ON',
        timestamp: Date.now()
      });
    }

    for (let i = 0; i < 5; i++) {
      const deviceId = deviceIds[i % deviceIds.length];
      await triggerAlert(deviceId, 0.35);
    }

    console.log('✅ Quick seed complete!');
    return { success: true, devices, deviceIds };
  } catch (err) {
    console.error('❌ Quick seed failed:', err);
    return { success: false, error: err?.message || String(err) };
  }
};

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
  console.log('  window.seedData.quickSeed()       - Quick test data');
  console.log('  window.seedData.seedAllData()     - Full sample data');
}

export default {
  seedDevices,
  seedLogs,
  seedAlerts,
  seedRealtimeData,
  seedAllData,
  quickSeed
};

