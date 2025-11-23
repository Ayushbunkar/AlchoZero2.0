import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  Search, 
  Filter, 
  Eye, 
  User,
  ShieldCheck,
  Moon,
  PhoneOff,
  Volume2,
  Gauge,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  onAuthStateChange,
  listenToDeviceMonitoring,
  getAdminDevices,
  listenToMultipleDevices,
  getSafetyAlerts,
  getDriverStatistics
} from '../firebaseConfig';

const Monitor = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [realtimeData, setRealtimeData] = useState({});
  const [chartData, setChartData] = useState([]);

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      if (!currentUser) {
        navigate('/');
        return;
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  // Fetch admin devices
  useEffect(() => {
    if (user) {
      fetchDevices();
    }
  }, [user]);

  const fetchDevices = async () => {
    const result = await getAdminDevices();
    if (result.success) {
      setDevices(result.devices);
      
      // Listen to all devices in real-time
      const deviceIds = result.devices.map(d => d.id);
      if (deviceIds.length > 0) {
        const unsubscribe = listenToMultipleDevices(deviceIds, (data) => {
          setRealtimeData(data);
        });
        
        // Store unsubscribe function
        return () => unsubscribe();
      }
    }
  };

  // Simulate realtime updates - REMOVE THIS in production when hardware sends data
  useEffect(() => {
    // This is for demo purposes - your hardware will send real data to Firebase
    // Once hardware is connected, you can remove this simulation
    const interval = setInterval(() => {
      if (Object.keys(realtimeData).length === 0) return;
      
      // Only simulate if data seems static (for demo)
      setRealtimeData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(deviceId => {
          if (!updated[deviceId]) return;
          // Keep real Firebase data, just add random variations for demo
          updated[deviceId] = {
            ...updated[deviceId],
            // These will be replaced by real hardware data
            alcoholLevel: updated[deviceId].alcoholLevel || (Math.random() * 0.3).toFixed(3)
          };
        });
        return updated;
      });

      // Update chart data for selected device
      if (selectedDevice) {
        setChartData(prev => {
          const newData = [
            ...prev.slice(-19),
            {
              time: new Date().toLocaleTimeString(),
              alcoholLevel: parseFloat(realtimeData[selectedDevice.id]?.alcoholLevel || 0),
              drowsiness: realtimeData[selectedDevice.id]?.drowsiness ? 1 : 0,
              distraction: realtimeData[selectedDevice.id]?.distraction ? 1 : 0
            }
          ];
          return newData;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedDevice]);

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.deviceId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || device.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const activeDevices = devices.filter(d => d.status === 'active').length;
  const connectedDevices = Object.values(realtimeData).filter(d => d.connected).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neon-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading devices...</p>
        </div>
      </div>
    );
  }

  const getDetectionStatus = (device) => {
    const data = realtimeData[device.id] || {};
    return {
      faceAuth: data.faceAuth?.verified ? 'Verified' : 'Failed',
      drowsiness: data.drowsiness?.detected ? 'Detected' : 'Normal',
      distraction: data.distraction?.detected ? 'Alert' : 'Normal',
      audioAlcohol: data.audioAlcohol?.detected ? 'Detected' : 'Normal',
      rashDriving: data.rashDriving?.detected ? 'Detected' : 'Normal',
      driverScore: data.driverScore || 85
    };
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-(--primary-blue) to-(--accent-blue) bg-clip-text text-transparent">
                Live Monitoring
              </h1>
              <p className="text-gray-400">
                Real-time monitoring of all drivers and safety systems
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by driver name, device ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-dark-bg border border-white/20 rounded-lg text-white focus:outline-none focus:border-(--primary-blue)"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Devices</span>
              <span className="text-2xl">📱</span>
            </div>
            <div className="text-3xl font-bold text-cyan-400">{devices.length}</div>
            <div className="text-xs text-gray-500 mt-1">Registered devices</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Active</span>
              <span className="text-2xl">🟢</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{activeDevices}</div>
            <div className="text-xs text-gray-500 mt-1">Currently active</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Connected</span>
              <Wifi className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-400">{connectedDevices}</div>
            <div className="text-xs text-gray-500 mt-1">Online now</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Alerts</span>
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-red-400">
              {Object.values(realtimeData).filter(d => parseFloat(d.alcoholLevel) > 0.15).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Requires attention</div>
          </motion.div>
        </div>

        {/* Driver Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDevices.map((device, index) => {
            const data = realtimeData[device.id] || {};
            const status = getDetectionStatus(device);
            const alcoholLevel = parseFloat(data.alcoholLevel || 0);
            const isAlert = alcoholLevel > 0.15;
            
            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`glass-card p-6 hover:bg-white/10 hover:scale-105 transition-all cursor-pointer border-2 ${
                  isAlert ? 'border-red-500/50' : 'border-transparent'
                } hover:border-cyan-500/50 group relative`}
                onClick={() => navigate(`/dashboard/monitor/${device.id}`)}
                title="Click to view detailed real-time monitoring"
              >
                {/* Hover Indicator */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-5 h-5 text-cyan-400" />
                </div>
                {/* Driver Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {device.driverPhoto ? (
                      <img
                        src={device.driverPhoto}
                        alt={device.driverName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-cyan-500/30"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                        <User className="w-7 h-7 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {device.driverName || 'Unknown Driver'}
                      </h3>
                      <p className="text-xs text-gray-400">{device.deviceId}</p>
                      <p className="text-xs text-gray-500">{device.vehicleNumber}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {data.connected ? (
                      <Wifi className="w-5 h-5 text-green-400" />
                    ) : (
                      <WifiOff className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${
                      data.connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {data.connected ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>

                {/* BAC Level - Prominent Display */}
                <div className={`mb-4 p-4 rounded-lg ${
                  alcoholLevel > 0.3 ? 'bg-red-500/20 border border-red-500/50' :
                  alcoholLevel > 0.15 ? 'bg-yellow-500/20 border border-yellow-500/50' :
                  'bg-green-500/20 border border-green-500/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">BAC Level</span>
                    <span className={`text-2xl font-bold ${
                      alcoholLevel > 0.3 ? 'text-red-400' :
                      alcoholLevel > 0.15 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {alcoholLevel}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {alcoholLevel > 0.3 ? '🚨 Critical - Engine Locked' :
                     alcoholLevel > 0.15 ? '⚠️ Warning Level' : '✅ Safe to Drive'}
                  </div>
                </div>

                {/* Safety Detection Systems */}
                <div className="space-y-3 mb-4">
                  {/* Face Authentication */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className={`w-4 h-4 ${status.faceAuth === 'Verified' ? 'text-green-400' : 'text-red-400'}`} />
                      <span className="text-gray-300">Face Auth</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      status.faceAuth === 'Verified' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {status.faceAuth}
                    </span>
                  </div>

                  {/* Drowsiness Detection */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Moon className={`w-4 h-4 ${status.drowsiness === 'Detected' ? 'text-red-400' : 'text-green-400'}`} />
                      <span className="text-gray-300">Drowsiness</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      status.drowsiness === 'Detected' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {status.drowsiness}
                    </span>
                  </div>

                  {/* Distraction Detection */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <PhoneOff className={`w-4 h-4 ${status.distraction === 'Alert' ? 'text-red-400' : 'text-green-400'}`} />
                      <span className="text-gray-300">Distraction</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      status.distraction === 'Alert' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {status.distraction}
                    </span>
                  </div>

                  {/* Audio Alcohol Analysis */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Volume2 className={`w-4 h-4 ${status.audioAlcohol === 'Detected' ? 'text-red-400' : 'text-green-400'}`} />
                      <span className="text-gray-300">Audio Analysis</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      status.audioAlcohol === 'Detected' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {status.audioAlcohol}
                    </span>
                  </div>

                  {/* Rash Driving Detection */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Gauge className={`w-4 h-4 ${status.rashDriving === 'Detected' ? 'text-red-400' : 'text-green-400'}`} />
                      <span className="text-gray-300">Rash Driving</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      status.rashDriving === 'Detected' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {status.rashDriving}
                    </span>
                  </div>

                  {/* Driver Behavior Score */}
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-white/10">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      <span className="text-gray-300">Behavior Score</span>
                    </div>
                    <span className={`text-sm font-bold ${
                      status.driverScore >= 80 ? 'text-green-400' :
                      status.driverScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {status.driverScore}/100
                    </span>
                  </div>
                </div>

                {/* Engine Status */}
                <div className="flex items-center justify-between p-3 bg-dark-bg/50 rounded-lg">
                  <span className="text-sm text-gray-400">Engine Status</span>
                  <span className={`text-sm font-semibold ${
                    data.engine === 'ON' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {data.engine === 'ON' ? '🔓 Unlocked' : '🔒 Locked'}
                  </span>
                </div>

                {/* View Details Button */}
                <div className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 bg-cyan-500/20 group-hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-semibold">Click for Real-Time Monitoring</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredDevices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No devices found</h3>
            <p className="text-gray-400">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No devices available for monitoring.'}
            </p>
          </motion.div>
        )}

        {/* Selected Device Chart */}
        {selectedDevice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Live Data: {selectedDevice.driverName || selectedDevice.name}
              </h3>
              <button
                onClick={() => setSelectedDevice(null)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #2a2a2a',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="alcoholLevel"
                  stroke="#00f3ff"
                  strokeWidth={2}
                  name="BAC Level"
                />
                <Line
                  type="monotone"
                  dataKey="drowsiness"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  name="Drowsiness"
                />
                <Line
                  type="monotone"
                  dataKey="distraction"
                  stroke="#f87171"
                  strokeWidth={2}
                  name="Distraction"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Monitor;