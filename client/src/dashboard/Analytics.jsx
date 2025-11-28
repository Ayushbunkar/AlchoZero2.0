import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Calendar, Download } from 'lucide-react';
import {
  onAuthStateChange,
  getDeviceLogs,
  getAlerts,
} from '../firebaseConfig';

const Analytics = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [timeRange, setTimeRange] = useState('7d'); // 1d, 7d, 30d

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

  // Fetch data
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, timeRange]);

  const fetchData = async () => {
    const logsResult = await getDeviceLogs(200); // reduce initial fetch size for speed
    if (logsResult.success) {
      setLogs(logsResult.logs);
    }

    const alertsResult = await getAlerts(100); // smaller sample for dashboard analytics
    if (alertsResult.success) {
      setAlerts(alertsResult.alerts);
    }
  };

  const getFilteredData = () => {
    const now = new Date();
    const days = timeRange === '1d' ? 1 : timeRange === '7d' ? 7 : 30;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return {
      logs: logs.filter(log => new Date(log.timestamp) >= cutoff),
      alerts: alerts.filter(alert => new Date(alert.timestamp) >= cutoff)
    };
  };

  const generateHourlyData = () => {
    const { logs } = getFilteredData();
    const hourlyData = {};

    logs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      if (!hourlyData[hour]) {
        hourlyData[hour] = { hour, readings: 0, avgBAC: 0, alerts: 0 };
      }
      hourlyData[hour].readings += 1;
      hourlyData[hour].avgBAC += log.alcoholLevel;
    });

    return Object.values(hourlyData).map(item => ({
      ...item,
      avgBAC: item.avgBAC / item.readings
    })).sort((a, b) => a.hour - b.hour);
  };

  const generateDailyData = () => {
    const { logs } = getFilteredData();
    const dailyData = {};

    logs.forEach(log => {
      const date = new Date(log.timestamp).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = { date, readings: 0, avgBAC: 0, maxBAC: 0 };
      }
      dailyData[date].readings += 1;
      dailyData[date].avgBAC += log.alcoholLevel;
      dailyData[date].maxBAC = Math.max(dailyData[date].maxBAC, log.alcoholLevel);
    });

    return Object.values(dailyData).map(item => ({
      ...item,
      avgBAC: item.avgBAC / item.readings,
      date: new Date(item.date).toLocaleDateString()
    }));
  };

  const generateAlertDistribution = () => {
    const { alerts } = getFilteredData();
    const distribution = { critical: 0, warning: 0, info: 0 };

    alerts.forEach(alert => {
      if (alert.alcoholLevel > 0.3) distribution.critical++;
      else if (alert.alcoholLevel > 0.15) distribution.warning++;
      else distribution.info++;
    });

    return [
      { name: 'Critical', value: distribution.critical, color: '#ef4444' },
      { name: 'Warning', value: distribution.warning, color: '#eab308' },
      { name: 'Info', value: distribution.info, color: '#06b6d4' }
    ];
  };

  const exportData = () => {
    const { logs, alerts } = getFilteredData();
    const csvContent = [
      ['Type', 'Timestamp', 'BAC Level', 'Engine Status', 'Device ID'].join(','),
      ...logs.map(log => ['Log', log.timestamp, log.alcoholLevel, log.engine, log.deviceId || 'Car123'].join(',')),
      ...alerts.map(alert => ['Alert', alert.timestamp, alert.alcoholLevel, alert.engine, alert.deviceId || 'Car123'].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alcozero-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neon-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const { logs: filteredLogs, alerts: filteredAlerts } = getFilteredData();
  const hourlyData = generateHourlyData();
  const dailyData = generateDailyData();
  const alertDistribution = generateAlertDistribution();

  return (
    <div className="p-4 pt-20 md:p-6 lg:p-8">
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
                Analytics Dashboard
              </h1>
              <p className="text-gray-400">
                Comprehensive insights and trends for device performance
              </p>
            </div>
            <button
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-(--primary-blue) hover:bg-(--primary-blue)/80 text-white! rounded-lg transition-colors"
              style={{ color: '#ffffff' }}
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div className="flex space-x-2">
              {[
                { key: '1d', label: 'Last 24 Hours' },
                { key: '7d', label: 'Last 7 Days' },
                { key: '30d', label: 'Last 30 Days' }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setTimeRange(option.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === option.key
                      ? 'bg-(--primary-blue) text-white!'
                      : 'bg-dark-bg border border-white/20 text-gray-400 hover:text-white'
                  }`}
                  style={timeRange === option.key ? { color: '#ffffff' } : undefined}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Readings</span>
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-cyan-400">
              {filteredLogs.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Data points collected</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Average BAC</span>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-neon-blue">
              {(filteredLogs.reduce((sum, log) => sum + log.alcoholLevel, 0) / Math.max(filteredLogs.length, 1)).toFixed(3)}
            </div>
            <div className="text-xs text-gray-500 mt-1">mg/L</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Peak BAC</span>
              <span className="text-2xl">🔺</span>
            </div>
            <div className="text-3xl font-bold text-red-400">
              {Math.max(...filteredLogs.map(log => log.alcoholLevel), 0).toFixed(3)}
            </div>
            <div className="text-xs text-gray-500 mt-1">mg/L</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Alert Rate</span>
              <span className="text-2xl">🚨</span>
            </div>
            <div className="text-3xl font-bold text-yellow-400">
              {((filteredAlerts.length / Math.max(filteredLogs.length, 1)) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Of total readings</div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Daily BAC Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              Daily BAC Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" stroke="#888" />
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
                  dataKey="avgBAC"
                  stroke="#00f3ff"
                  fill="#00f3ff"
                  fillOpacity={0.3}
                  name="Avg BAC"
                />
                <Area
                  type="monotone"
                  dataKey="maxBAC"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.2}
                  name="Peak BAC"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Hourly Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              Hourly Activity Pattern
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="hour" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #2a2a2a',
                    borderRadius: '8px',
                  }}
                />
                <Bar
                  dataKey="readings"
                  fill="#a855f7"
                  name="Readings"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Alert Distribution and Trends */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Alert Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              Alert Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={alertDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {alertDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* BAC Level Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              BAC Level Distribution
            </h3>
            <div className="space-y-4">
              {[
                { range: '0.00 - 0.05', count: filteredLogs.filter(l => l.alcoholLevel <= 0.05).length, color: 'bg-green-500' },
                { range: '0.05 - 0.15', count: filteredLogs.filter(l => l.alcoholLevel > 0.05 && l.alcoholLevel <= 0.15).length, color: 'bg-cyan-500' },
                { range: '0.15 - 0.25', count: filteredLogs.filter(l => l.alcoholLevel > 0.15 && l.alcoholLevel <= 0.25).length, color: 'bg-yellow-500' },
                { range: '0.25+', count: filteredLogs.filter(l => l.alcoholLevel > 0.25).length, color: 'bg-red-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{item.range}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${(item.count / Math.max(filteredLogs.length, 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;