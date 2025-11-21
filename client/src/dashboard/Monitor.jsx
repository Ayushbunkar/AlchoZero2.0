import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Activity, Wifi, WifiOff } from 'lucide-react';
import {
  onAuthStateChange,
  listenToDeviceStatus,
  getDeviceLogs,
} from '../firebaseConfig';

const Monitor = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Device data
  const [deviceData, setDeviceData] = useState({
    alcoholLevel: 0,
    engine: 'UNKNOWN',
    timestamp: Date.now(),
    connected: false,
  });

  // Real-time data
  const [logs, setLogs] = useState([]);
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

  // Listen to device status in real-time
  useEffect(() => {
    if (user) {
      const unsubscribe = listenToDeviceStatus('Car123', (data) => {
        setDeviceData(data);

        // Update chart data
        setChartData((prev) => {
          const newData = [
            ...prev.slice(-19),
            {
              time: new Date(data.timestamp).toLocaleTimeString(),
              alcoholLevel: data.alcoholLevel,
              engine: data.engine,
              connected: data.connected,
            },
          ];
          return newData;
        });
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [user]);

  // Fetch logs
  useEffect(() => {
    if (user) {
      fetchLogs();
      const interval = setInterval(fetchLogs, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchLogs = async () => {
    const logsResult = await getDeviceLogs(20);
    if (logsResult.success) {
      setLogs(logsResult.logs);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neon-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    if (!deviceData.connected) {
      return {
        text: 'DISCONNECTED',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
        borderColor: 'border-gray-500/50',
      };
    }
    if (deviceData.alcoholLevel > 0.3) {
      return {
        text: 'ALERT - HIGH LEVEL',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/50',
      };
    }
    if (deviceData.alcoholLevel > 0.15) {
      return {
        text: 'WARNING',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/50',
      };
    }
    return {
      text: 'SAFE',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-500/50',
    };
  };

  const statusInfo = getStatusInfo();

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
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-(--primary-blue) to-(--accent-blue) bg-clip-text text-transparent">
            Real-time Monitor
          </h1>
          <p className="text-gray-400">
            Live monitoring of Device: <span className="text-neon-blue font-semibold">Car123</span>
          </p>
        </motion.div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Connection Status</span>
              {deviceData.connected ? (
                <Wifi className="w-6 h-6 text-green-400" />
              ) : (
                <WifiOff className="w-6 h-6 text-red-400" />
              )}
            </div>
            <div className={`text-2xl font-bold ${statusInfo.color}`}>
              {deviceData.connected ? 'CONNECTED' : 'DISCONNECTED'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {deviceData.connected ? 'Device is online' : 'Device is offline'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Engine Status</span>
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {deviceData.engine}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Current engine state
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">BAC Level</span>
              <span className="text-2xl">🔬</span>
            </div>
            <div className="text-3xl font-bold text-neon-blue">
              {deviceData.alcoholLevel.toFixed(3)}
            </div>
            <div className="text-xs text-gray-500 mt-1">mg/L</div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Real-time Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              Live BAC Monitoring
            </h3>
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
                  dot={{ fill: '#00f3ff', r: 4 }}
                  name="BAC Level"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Status Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              Connection Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.slice(-10)}>
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
                <Bar
                  dataKey="connected"
                  fill="#10b981"
                  name="Connected"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.slice(0, 15).map((log, index) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-dark-bg/50 rounded-lg border border-white/10"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    log.status === 'ALERT' ? 'bg-red-400' :
                    log.status === 'WARNING' ? 'bg-yellow-400' : 'bg-green-400'
                  }`}></div>
                  <div>
                    <p className="text-sm text-white font-medium">
                      BAC: {log.alcoholLevel?.toFixed(3)} mg/L
                    </p>
                    <p className="text-xs text-gray-400">
                      Engine: {log.engine} | Status: {log.status}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-center text-gray-500 py-8">No activity data available</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Monitor;