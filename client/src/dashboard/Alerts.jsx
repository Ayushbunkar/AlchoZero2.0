import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, Filter } from 'lucide-react';
import {
  onAuthStateChange,
  getAlerts,
} from '../firebaseConfig';

const Alerts = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all'); // all, critical, warning

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

  // Fetch alerts
  useEffect(() => {
    if (user) {
      fetchAlerts();
      const interval = setInterval(fetchAlerts, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchAlerts = async () => {
    const alertsResult = await getAlerts(100);
    if (alertsResult.success) {
      setAlerts(alertsResult.alerts);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'critical') return alert.alcoholLevel > 0.3;
    if (filter === 'warning') return alert.alcoholLevel > 0.15 && alert.alcoholLevel <= 0.3;
    return true;
  });

  const getAlertSeverity = (level) => {
    if (level > 0.3) return { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50', label: 'CRITICAL' };
    if (level > 0.15) return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', label: 'WARNING' };
    return { color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', label: 'INFO' };
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
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-(--primary-blue) to-(--accent-blue) bg-clip-text text-transparent">
            Alerts & Notifications
          </h1>
          <p className="text-gray-400">
            Monitor and manage system alerts for device safety
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Alerts</span>
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              {alerts.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">All time</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Critical Alerts</span>
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-red-400">
              {alerts.filter(a => a.alcoholLevel > 0.3).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">BAC 0.3</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Warnings</span>
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-yellow-400">
              {alerts.filter(a => a.alcoholLevel > 0.15 && a.alcoholLevel <= 0.3).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">BAC 0.15-0.3</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Recent (24h)</span>
              <Clock className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-cyan-400">
              {alerts.filter(a => {
                const alertTime = new Date(a.timestamp);
                const now = new Date();
                const diffHours = (now - alertTime) / (1000 * 60 * 60);
                return diffHours <= 24;
              }).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Last 24 hours</div>
          </motion.div>
        </div>

        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All Alerts' },
                { key: 'critical', label: 'Critical' },
                { key: 'warning', label: 'Warnings' }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === option.key
                      ? 'bg-(--primary-blue) text-white!'
                      : 'bg-dark-bg border border-white/20 text-gray-400 hover:text-white'
                  }`}
                  style={filter === option.key ? { color: '#ffffff' } : undefined}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Alerts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            Alert History ({filteredAlerts.length})
          </h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredAlerts.map((alert, index) => {
              const severity = getAlertSeverity(alert.alcoholLevel);
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${severity.bg} ${severity.border}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className={`w-5 h-5 ${severity.color}`} />
                      <div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${severity.bg} ${severity.color}`}>
                          {severity.label}
                        </span>
                        <h4 className="text-white font-medium mt-1">
                          High BAC Detected
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Device:</span>
                      <span className="text-white ml-2 font-medium">{alert.deviceId}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">BAC Level:</span>
                      <span className={`ml-2 font-bold ${severity.color}`}>
                        {alert.alcoholLevel?.toFixed(3)} mg/L
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Engine Status:</span>
                      <span className="text-white ml-2">{alert.engine || 'N/A'}</span>
                    </div>
                  </div>

                  {alert.alcoholLevel > 0.3 && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded">
                      <p className="text-red-400 text-sm">
                        🚨 Critical: BAC level exceeds safe threshold. Immediate action required.
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
            {filteredAlerts.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No alerts found</p>
                <p className="text-gray-500 text-sm">
                  {filter === 'all' ? 'No alerts have been generated yet.' : `No ${filter} alerts found.`}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Alerts;