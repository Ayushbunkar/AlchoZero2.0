import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Menu, Eye } from 'lucide-react';
import {
  onAuthStateChange,
  loginUser,
  getAdminDevices,
  listenToMultipleDevices,
} from '../firebaseConfig';
import Sidebar from './Sidebar';
import Monitor from './Monitor';
import DriverMonitor from './DriverMonitor';
import Alerts from './Alerts';
import Analytics from './Analytics';
import Devices from './Devices';
import DriverProfile from './DriverProfile';
import Security from './Security';
import Settings from './Settings';

const DashboardHome = () => {
  const [user, setUser] = useState(null);
  const [devices, setDevices] = useState([]);
  const [realtimeData, setRealtimeData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
        return;
      }
      // Fetch admin's devices
      const result = await getAdminDevices();
      setDevices(result.devices || []);
      setLoading(false);
      // Listen to all devices' real-time data
      const deviceIds = (result.devices || []).map((d) => d.id);
      if (deviceIds.length > 0) {
        listenToMultipleDevices(deviceIds, (data) => {
          setRealtimeData({ ...data });
        });
      }
    });
    return () => unsubscribe && unsubscribe();
  }, []);

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

  // Quick stats calculation
  const total = devices.length;
  let online = 0, offline = 0, critical = 0;
  devices.forEach((device) => {
    const data = realtimeData[device.id] || {};
    if (data.connected) online++;
    else offline++;
    if (data.alcoholLevel > 0.3) critical++;
  });

  // Pie chart data
  const pieData = [
    { name: 'Online', value: online },
    { name: 'Offline', value: offline },
    { name: 'Critical', value: critical },
  ];
  const pieColors = ['#22d3ee', '#64748b', '#f87171'];

  // Bar chart data
  const barData = [
    { name: 'Devices', Online: online, Offline: offline, Critical: critical },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-950 to-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Welcome Header & Fleet Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex flex-col gap-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-(--primary-blue) to-(--accent-blue) bg-clip-text text-transparent flex items-center gap-3">
                <span role="img" aria-label="dashboard">📊</span> Real-time Dashboard
              </h1>
              <p className="text-gray-400">
                {devices.length === 0 ? 'No devices found.' : `Monitoring ${devices.length} device${devices.length > 1 ? 's' : ''} in your fleet.`}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">{total}</div>
                <div className="text-xs text-gray-400 mt-1">Total Devices</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 text-center">
                <div className="text-2xl font-bold text-green-400">{online}</div>
                <div className="text-xs text-gray-400 mt-1">Online</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 text-center">
                <div className="text-2xl font-bold text-gray-400">{offline}</div>
                <div className="text-xs text-gray-400 mt-1">Offline</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 text-center">
                <div className="text-2xl font-bold text-red-400">{critical}</div>
                <div className="text-xs text-gray-400 mt-1">Critical Alerts</div>
              </div>
            </div>
          </div>
          {/* Fleet Overview Graphs */}
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex-1 flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold text-gray-200 mb-2">Device Status Distribution</h2>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex-1 flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold text-gray-200 mb-2">Device Status Bar</h2>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#fff' }} />
                  <Legend />
                  <Bar dataKey="Online" fill="#22d3ee" />
                  <Bar dataKey="Offline" fill="#64748b" />
                  <Bar dataKey="Critical" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Devices Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device, idx) => {
            const data = realtimeData[device.id] || {};
            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className={`glass-card p-6 hover:bg-white/10 hover:scale-105 transition-all cursor-pointer border-2 ${
                  data.alcoholLevel > 0.15 ? 'border-red-500/50' : 'border-transparent'
                } group relative`}
                onClick={() => navigate(`/dashboard/monitor/${device.id}`)}
                title="Click to view detailed real-time monitoring"
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex items-center space-x-3 mb-4">
                  {device.driverPhoto ? (
                    <img
                      src={device.driverPhoto}
                      alt={device.driverName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-cyan-500/30"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">{device.driverName?.[0] || '?'}</span>
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
                <div className={`mb-4 p-4 rounded-lg ${
                  data.alcoholLevel > 0.3 ? 'bg-red-500/20 border border-red-500/50' :
                  data.alcoholLevel > 0.15 ? 'bg-yellow-500/20 border border-yellow-500/50' :
                  'bg-green-500/20 border border-green-500/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">BAC Level</span>
                    <span className={`text-2xl font-bold ${
                      data.alcoholLevel > 0.3 ? 'text-red-400' :
                      data.alcoholLevel > 0.15 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {data.alcoholLevel?.toFixed(3) || '0.000'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {data.alcoholLevel > 0.3 ? '🚨 Critical - Engine Locked' :
                     data.alcoholLevel > 0.15 ? '⚠️ Warning Level' : '✅ Safe to Drive'}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-bg/50 rounded-lg">
                  <span className="text-sm text-gray-400">Engine Status</span>
                  <span className={`text-sm font-semibold ${
                    data.engine === 'ON' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {data.engine === 'ON' ? '🔓 Unlocked' : '🔒 Locked'}
                  </span>
                </div>
                <div className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 bg-cyan-500/20 group-hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-semibold">Click for Real-Time Monitoring</span>
                </div>
              </motion.div>
            );
          })}
        </div>
        {devices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 flex flex-col items-center justify-center"
          >
            <img src="/empty-dashboard-illustration.svg" alt="No devices" className="w-48 h-48 mb-6 opacity-80" onError={e => e.target.style.display='none'} />
            <h3 className="text-2xl font-semibold text-white mb-2">No devices found</h3>
            <p className="text-gray-400 mb-4">
              You haven't added any devices yet.<br/>Click "Add Device" in the sidebar to get started!
            </p>
            <div className="flex items-center gap-2 justify-center">
              <span className="text-3xl">➕</span>
              <span className="text-cyan-400 font-semibold">Add your first device to start monitoring in real-time!</span>
            </div>
          </motion.div>
        )}
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
    console.log('Dashboard component rendering, path:', location.pathname);
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
      {/* Mobile Sidebar Toggle - positioned below navbar */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-dark-bg/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-bold bg-linear-to-r from-(--primary-blue) to-(--accent-blue) bg-clip-text text-transparent">
            AlchoZero Dashboard
          </h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="md:ml-64 h-full pt-20 mt-14 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="monitor" element={<Monitor />} />
          <Route path="monitor/:deviceId" element={<DriverMonitor />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="devices" element={<Devices />} />
          <Route path="driver/:deviceId" element={<DriverProfile />} />
          <Route path="security" element={<Security />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
