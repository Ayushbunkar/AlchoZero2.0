import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  UserCheck,
  Activity,
  Clock
} from 'lucide-react';
import {
  onAuthStateChange,
  getSecurityLogs,
  updateSecuritySettings,
  getSecuritySettings
} from '../firebaseConfig';

const Security = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [settings, setSettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    alertThreshold: 0.15,
    autoLock: true,
    auditLogging: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  // Fetch security data
  useEffect(() => {
    if (user) {
      fetchSecurityData();
    }
  }, [user]);

  const fetchSecurityData = async () => {
    const logsResult = await getSecurityLogs();
    if (logsResult.success) {
      setSecurityLogs(logsResult.logs);
    }

    const settingsResult = await getSecuritySettings();
    if (settingsResult.success) {
      setSettings(settingsResult.settings);
    }
  };

  const handleUpdateSettings = async (newSettings) => {
    const result = await updateSecuritySettings(newSettings);
    if (result.success) {
      setSettings(newSettings);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    // In a real app, this would call an API to change the password
    alert('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-cyan-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neon-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading security settings...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-(--primary-blue) to-(--accent-blue) bg-clip-text text-transparent">
                Security Center
              </h1>
              <p className="text-gray-400">
                Manage security settings and monitor system access
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-green-400" />
              <span className="text-green-400 font-medium">System Secure</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Security Settings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Account Security */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-(--primary-blue)" />
                Account Security
              </h3>

              <div className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                  <div>
                    <h4 className="text-primary font-medium">Two-Factor Authentication</h4>
                    <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                  </div>
                  <button
                    onClick={() => handleUpdateSettings({...settings, twoFactorEnabled: !settings.twoFactorEnabled})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.twoFactorEnabled ? 'bg-(--primary-blue)' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Session Timeout */}
                <div className="p-4 bg-dark-bg rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-primary font-medium">Session Timeout</h4>
                    <span className="text-gray-400 text-sm">{settings.sessionTimeout} minutes</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleUpdateSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5 min</span>
                    <span>120 min</span>
                  </div>
                </div>

                {/* Password Policy */}
                <div className="p-4 bg-dark-bg rounded-lg">
                  <h4 className="text-primary font-medium mb-3">Password Policy</h4>
                  <div className="space-y-2">
                    {[
                      { key: 'weak', label: 'Weak (6+ chars)', desc: 'Basic security' },
                      { key: 'medium', label: 'Medium (8+ chars, mixed case)', desc: 'Balanced security' },
                      { key: 'strong', label: 'Strong (12+ chars, special chars)', desc: 'High security' }
                    ].map((policy) => (
                      <label key={policy.key} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="passwordPolicy"
                          value={policy.key}
                          checked={settings.passwordPolicy === policy.key}
                          onChange={(e) => handleUpdateSettings({...settings, passwordPolicy: e.target.value})}
                          className="text-(--primary-blue) focus:ring-(--primary-blue)"
                        />
                        <div>
                          <span className="text-primary text-sm">{policy.label}</span>
                          <p className="text-gray-400 text-xs">{policy.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Change Password */}
                <div className="p-4 bg-dark-bg rounded-lg">
                  <h4 className="text-primary font-medium mb-4">Change Password</h4>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 bg-dark-bg border border-(--glass-border) rounded-lg text-primary placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-dark-bg border border-(--glass-border) rounded-lg text-primary placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                    />
                    <button
                      onClick={handlePasswordChange}
                      className="w-full px-4 py-2 bg-(--primary-blue) hover:bg-(--primary-blue)/80 text-white! rounded-lg transition-colors"
                      style={{ color: '#ffffff' }}
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* System Security */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-(--primary-blue)" />
                System Security
              </h3>

              <div className="space-y-6">
                {/* Alert Threshold */}
                <div className="p-4 bg-dark-bg rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">Alert Threshold (BAC)</h4>
                    <span className="text-gray-400 text-sm">{settings.alertThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.3"
                    step="0.01"
                    value={settings.alertThreshold}
                    onChange={(e) => handleUpdateSettings({...settings, alertThreshold: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0.05</span>
                    <span>0.30</span>
                  </div>
                </div>

                {/* Auto Lock */}
                <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Auto Lock</h4>
                    <p className="text-gray-400 text-sm">Automatically lock device after inactivity</p>
                  </div>
                  <button
                    onClick={() => handleUpdateSettings({...settings, autoLock: !settings.autoLock})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.autoLock ? 'bg-(--primary-blue)' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.autoLock ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Audit Logging */}
                <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Audit Logging</h4>
                    <p className="text-gray-400 text-sm">Log all security-related events</p>
                  </div>
                  <button
                    onClick={() => handleUpdateSettings({...settings, auditLogging: !settings.auditLogging})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.auditLogging ? 'bg-(--primary-blue)' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.auditLogging ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Security Logs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Security Status */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                Security Status
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Account Status</span>
                  <span className="text-green-400 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Secure
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Last Login</span>
                  <span className="text-white">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Active Sessions</span>
                  <span className="text-white">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Failed Attempts</span>
                  <span className="text-green-400">0</span>
                </div>
              </div>
            </div>

            {/* Recent Security Events */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-(--primary-blue)" />
                Recent Events
              </h3>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {securityLogs.slice(0, 10).map((log, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-dark-bg rounded-lg">
                    {getSeverityIcon(log.severity)}
                    <div className="flex-1">
                      <p className="text-white text-sm">{log.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {securityLogs.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No security events</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Security;