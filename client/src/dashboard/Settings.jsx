import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Globe,
  Database,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw
} from 'lucide-react';
import {
  onAuthStateChange,
  updateUserProfile,
  exportUserData,
  importUserData,
  clearAllData
} from '../firebaseConfig';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    phone: ''
  });
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      email: true,
      push: true,
      alerts: true,
      reports: false
    },
    dashboard: {
      autoRefresh: true,
      refreshInterval: 30,
      defaultView: 'monitor'
    }
  });
  const [saving, setSaving] = useState(false);

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      if (!currentUser) {
        navigate('/');
        return;
      }
      setUser(currentUser);
      setProfile({
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        organization: currentUser.organization || '',
        role: currentUser.role || '',
        phone: currentUser.phone || ''
      });
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const result = await updateUserProfile(profile);
      if (result.success) {
        // Update local user state
        setUser({...user, ...profile});
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
    setSaving(false);
  };

  const handleExportData = async () => {
    const result = await exportUserData();
    if (result.success) {
      const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alchozero-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const result = await importUserData(data);
          if (result.success) {
            alert('Data imported successfully');
            window.location.reload();
          }
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      const result = await clearAllData();
      if (result.success) {
        alert('All data cleared successfully');
        window.location.reload();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neon-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

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
                Settings
              </h1>
              <p className="text-gray-400">
                Customize your AlchoZero experience and manage your account
              </p>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-3 bg-(--primary-blue) hover:bg-(--primary-blue)/80 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {saving ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-(--primary-blue)" />
                Profile Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Organization</label>
                  <input
                    type="text"
                    value={profile.organization}
                    onChange={(e) => setProfile({...profile, organization: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                  <select
                    value={profile.role}
                    onChange={(e) => setProfile({...profile, role: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white focus:outline-none focus:border-(--primary-blue)"
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Administrator</option>
                    <option value="manager">Manager</option>
                    <option value="operator">Operator</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                  />
                </div>
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Palette className="w-5 h-5 mr-2 text-(--primary-blue)" />
                Preferences
              </h3>

              <div className="space-y-6">
                {/* Appearance */}
                <div>
                  <h4 className="text-white font-medium mb-3">Appearance</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Theme</label>
                      <select
                        value={preferences.theme}
                        onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                        className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white focus:outline-none focus:border-(--primary-blue)"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Language</label>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                        className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white focus:outline-none focus:border-(--primary-blue)"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Regional Settings */}
                <div>
                  <h4 className="text-white font-medium mb-3">Regional Settings</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Timezone</label>
                      <select
                        value={preferences.timezone}
                        onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                        className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white focus:outline-none focus:border-(--primary-blue)"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="PST">Pacific Time</option>
                        <option value="GMT">GMT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Date Format</label>
                      <select
                        value={preferences.dateFormat}
                        onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
                        className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white focus:outline-none focus:border-(--primary-blue)"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Dashboard Settings */}
                <div>
                  <h4 className="text-white font-medium mb-3">Dashboard</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white text-sm">Auto Refresh</span>
                        <p className="text-gray-400 text-xs">Automatically refresh dashboard data</p>
                      </div>
                      <button
                        onClick={() => setPreferences({
                          ...preferences,
                          dashboard: {...preferences.dashboard, autoRefresh: !preferences.dashboard.autoRefresh}
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences.dashboard.autoRefresh ? 'bg-(--primary-blue)' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.dashboard.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {preferences.dashboard.autoRefresh && (
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Refresh Interval (seconds)</label>
                        <input
                          type="number"
                          min="10"
                          max="300"
                          value={preferences.dashboard.refreshInterval}
                          onChange={(e) => setPreferences({
                            ...preferences,
                            dashboard: {...preferences.dashboard, refreshInterval: parseInt(e.target.value)}
                          })}
                          className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white focus:outline-none focus:border-(--primary-blue)"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Default View</label>
                      <select
                        value={preferences.dashboard.defaultView}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          dashboard: {...preferences.dashboard, defaultView: e.target.value}
                        })}
                        className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white focus:outline-none focus:border-(--primary-blue)"
                      >
                        <option value="monitor">Monitor</option>
                        <option value="alerts">Alerts</option>
                        <option value="analytics">Analytics</option>
                        <option value="devices">Devices</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-(--primary-blue)" />
                Notifications
              </h3>

              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive alerts via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
                  { key: 'alerts', label: 'Alert Notifications', desc: 'Get notified of system alerts' },
                  { key: 'reports', label: 'Weekly Reports', desc: 'Receive weekly summary reports' }
                ].map((notification) => (
                  <div key={notification.key} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{notification.label}</h4>
                      <p className="text-gray-400 text-sm">{notification.desc}</p>
                    </div>
                    <button
                      onClick={() => setPreferences({
                        ...preferences,
                        notifications: {
                          ...preferences.notifications,
                          [notification.key]: !preferences.notifications[notification.key]
                        }
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.notifications[notification.key] ? 'bg-(--primary-blue)' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.notifications[notification.key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Data Export/Import */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Database className="w-5 h-5 mr-2 text-(--primary-blue)" />
                Data Management
              </h3>

              <div className="space-y-4">
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-(--primary-blue)/20 hover:bg-(--primary-blue)/30 text-(--primary-blue) rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
                </button>

                <div>
                  <label className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Import Data</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  onClick={handleClearData}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All Data</span>
                </button>
              </div>
            </div>

            {/* System Information */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-(--primary-blue)" />
                System Information
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Version</span>
                  <span className="text-white">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated</span>
                  <span className="text-white">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Environment</span>
                  <span className="text-green-400">Production</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Uptime</span>
                  <span className="text-white">99.9%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>

              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-dark-bg hover:bg-white/10 rounded-lg transition-colors">
                  <div className="text-white font-medium">Reset Dashboard Layout</div>
                  <div className="text-gray-400 text-sm">Restore default dashboard configuration</div>
                </button>

                <button className="w-full text-left px-4 py-3 bg-dark-bg hover:bg-white/10 rounded-lg transition-colors">
                  <div className="text-white font-medium">Clear Cache</div>
                  <div className="text-gray-400 text-sm">Clear application cache and temporary data</div>
                </button>

                <button className="w-full text-left px-4 py-3 bg-dark-bg hover:bg-white/10 rounded-lg transition-colors">
                  <div className="text-white font-medium">Generate API Key</div>
                  <div className="text-gray-400 text-sm">Create new API key for integrations</div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;