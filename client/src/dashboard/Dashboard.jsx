import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import {
  onAuthStateChange,
  loginUser,
  listenToDeviceStatus,
  getDeviceLogs,
  getAlerts,
} from '../firebaseConfig';
import DeviceCard from '../components/DeviceCard';
import Sidebar from './Sidebar';
import Monitor from './Monitor';
import Alerts from './Alerts';
import Analytics from './Analytics';
import Devices from './Devices';
import Security from './Security';
import Settings from './Settings';

const DashboardHome = () => {
  const [user, setUser] = useState(null);
  const [deviceData, setDeviceData] = useState({
    alcoholLevel: 0,
    engine: 'UNKNOWN',
    timestamp: Date.now(),
    connected: false,
  });
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Listen to device status in real-time
  useEffect(() => {
    const unsubscribe = listenToDeviceStatus('Car123', (data) => {
      setDeviceData(data);
      
      // Update chart data
      setChartData((prev) => {
        const newData = [
          ...prev.slice(-19),
          {
            time: new Date(data.timestamp).toLocaleTimeString(),
            alcoholLevel: data.alcoholLevel,
            timestamp: data.timestamp,
          },
        ];
        return newData;
      });
    });

    return () => unsubscribe();
  }, []);

  // Fetch logs and alerts
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const logsResult = await getDeviceLogs(50);
    if (logsResult.success) {
      setLogs(logsResult.logs);
    }

    const alertsResult = await getAlerts(20);
    if (alertsResult.success) {
      setAlerts(alertsResult.alerts);
    }
  };

  // Get status info
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
            Real-time Dashboard
          </h1>
          <p className="text-gray-400">
            Monitoring Device: <span className="text-neon-blue font-semibold">Car123</span>
          </p>
        </motion.div>

        {/* Status Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Alcohol Level</span>
              <span className="text-2xl">🔬</span>
            </div>
            <div className="text-3xl font-bold text-neon-blue">
              {deviceData.alcoholLevel.toFixed(3)}
            </div>
            <div className="text-xs text-gray-500 mt-1">BAC (mg/L)</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Engine Status</span>
              <span className="text-2xl">{deviceData.engine === 'ON' ? '🟢' : '🔴'}</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {deviceData.engine}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {deviceData.engine === 'ON' ? 'Running' : 'Locked'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Status</span>
              <span className="text-2xl">
                {deviceData.connected ? '✅' : '❌'}
              </span>
            </div>
            <div className={`text-2xl font-bold ${statusInfo.color}`}>
              {statusInfo.text}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {deviceData.connected ? 'Connected' : 'Offline'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Alerts</span>
              <span className="text-2xl">🚨</span>
            </div>
            <div className="text-3xl font-bold text-red-400">
              {alerts.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Total Alerts</div>
          </motion.div>
        </div>

        {/* Device Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <DeviceCard device={{ deviceId: 'Car123', ...deviceData }} />
        </motion.div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Real-time Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              Real-time Alcohol Level
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

          {/* Area Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              Trend Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
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
                <Area
                  type="monotone"
                  dataKey="alcoholLevel"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.3}
                  name="BAC Level"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Tables */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Logs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Recent Logs</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-sm font-semibold text-gray-400 pb-3">
                      Time
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-400 pb-3">
                      BAC
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-400 pb-3">
                      Engine
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-400 pb-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(0, 10).map((log, index) => (
                    <tr key={log.id} className="border-b border-white/5">
                      <td className="py-3 text-sm text-gray-300">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 text-sm text-neon-blue font-semibold">
                        {log.alcoholLevel?.toFixed(3) || 'N/A'}
                      </td>
                      <td className="py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            log.engine === 'ON'
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {log.engine}
                        </span>
                      </td>
                      <td className="py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            log.status === 'ALERT'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-cyan-500/20 text-cyan-400'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {logs.length === 0 && (
                <p className="text-center text-gray-500 py-8">No logs available</p>
              )}
            </div>
          </motion.div>

          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Active Alerts</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.slice(0, 10).map((alert, index) => (
                <div
                  key={alert.id}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-red-400 font-semibold text-sm">
                      🚨 ALERT
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-1">
                    Device: {alert.deviceId}
                  </p>
                  <p className="text-sm text-gray-300">
                    BAC: <span className="text-red-400 font-semibold">
                      {alert.alcoholLevel?.toFixed(3)}
                    </span>
                  </p>
                </div>
              ))}
              {alerts.length === 0 && (
                <p className="text-center text-gray-500 py-8">No alerts</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setLoginError('');

    const result = await loginUser(email, password);
    
    if (result.success) {
      setUser(result.user);
    } else {
      setLoginError(result.error);
    }
    
    setAuthLoading(false);
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

  // Login Form
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-linear-to-r from-(--primary-blue) to-(--accent-blue) bg-clip-text text-transparent mb-2">
              Admin Login
            </h1>
            <p className="text-gray-400">Sign in to access the dashboard</p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">✗ {loginError}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-dark-bg border border-white/20 rounded-lg text-white focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="admin@alchozero.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-bg border border-white/20 rounded-lg text-white focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                authLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-linear-to-r from-(--primary-blue) to-(--accent-blue) hover:shadow-lg hover:shadow-(--primary-blue)/50'
              }`}
            >
              {authLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-gray-400 text-center">
              <strong>Demo Credentials:</strong><br />
              Email: admin@alchozero.com<br />
              Password: Admin@123
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main Dashboard with Sidebar and Routing
  return (
    <div className="h-screen bg-dark-bg overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-dark-bg/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-bold bg-linear-to-r from-(--primary-blue) to-(--accent-blue) bg-clip-text text-transparent">
            AlchoZero
          </h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="md:ml-64 h-full pt-16 md:pt-0 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="monitor" element={<Monitor />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="devices" element={<Devices />} />
          <Route path="security" element={<Security />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
