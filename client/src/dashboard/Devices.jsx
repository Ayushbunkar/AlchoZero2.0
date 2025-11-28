import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Wifi,
  WifiOff,
  Battery,
  MapPin,
  Settings,
  Trash2,
  Edit,
  RefreshCw,
  Upload,
  XCircle,
  Eye,
  User
} from 'lucide-react';
import {
  onAuthStateChange,
  getDevices,
  addDevice,
  updateDevice,
  deleteDevice,
  generateDriverId,
  getAdminDevices
} from '../firebaseConfig';
import { uploadToCloudinary } from '../cloudinaryConfig';

const Devices = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newDevice, setNewDevice] = useState({
    // visible/editable identifiers
    deviceId: '',
    // requested persistent/system fields
    adminId: '',
    alertsId: '',
    batteryLevel: 100,
    currLocation: { lat: 0, lng: 0 },
    deviceRegisterDate: '',
    lastActive: '',
    lastLocationUpdateTime: '',
    logsId: '',
    status: 'active',
    vehicleName: '',
    vehicleNo: ''
  });

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

  // Fetch devices
  useEffect(() => {
    if (user) {
      fetchDevices();
    }
  }, [user]);

  // (driverId generation removed — system IDs are created on save)

  const fetchDevices = async () => {
    // Fetch only devices belonging to current admin
    const result = await getAdminDevices();
    if (result.success) {
      setDevices(result.devices);
    } else {
      console.error('Failed to fetch admin devices:', result.error);
      setDevices([]);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    const result = await uploadToCloudinary(file);
    setUploadingImage(false);

    if (result.success) {
      if (editingDevice) {
        setEditingDevice({...editingDevice, driverPhoto: result.url});
      } else {
        setNewDevice({...newDevice, driverPhoto: result.url});
      }
    } else {
      alert('Failed to upload image: ' + result.error);
    }
  };

  const handleAddDevice = async () => {
    // auto-generate deviceId if not provided
    const deviceId = newDevice.deviceId || await generateDriverId();

    // let backend generate random alerts/logs IDs (Firestore-style)
    const now = new Date().toISOString();

    const payload = {
      ...newDevice,
      deviceId,
      adminId: user?.uid || newDevice.adminId || '',
      // alertsId and logsId will be generated server-side if not provided
      batteryLevel: newDevice.batteryLevel ?? 100,
      currLocation: newDevice.currLocation || { lat: 0, lng: 0 },
      deviceRegisterDate: now,
      lastActive: now,
      lastLocationUpdateTime: now,
      lastSeen: now,
      firmwareVersion: '1.0.0',
      vehicleName: newDevice.vehicleName || '',
      vehicleNo: newDevice.vehicleNo || newDevice.vehicleNumber || ''
    };

    const result = await addDevice(payload);

    if (result.success) {
      // add normalized payload to UI list so fields are available immediately
      setDevices([...devices, { ...result.device, ...payload }]);
      setShowAddModal(false);
      setNewDevice({
        deviceId: '',
        adminId: '',
        alertsId: '',
        batteryLevel: 100,
        currLocation: { lat: 0, lng: 0 },
        deviceRegisterDate: '',
        lastActive: '',
        lastLocationUpdateTime: '',
        logsId: '',
        status: 'active',
        vehicleName: '',
        vehicleNo: ''
      });
    }
  };

  const handleUpdateDevice = async () => {
    if (!editingDevice) return;

    const result = await updateDevice(editingDevice.id, editingDevice);
    if (result.success) {
      setDevices(devices.map(d => d.id === editingDevice.id ? editingDevice : d));
      setEditingDevice(null);
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      const result = await deleteDevice(deviceId);
      if (result.success) {
        setDevices(devices.filter(d => d.id !== deviceId));
      }
    }
  };

  const filteredDevices = devices.filter(device => {
    const nameLower = (device.vehicleName || '').toLowerCase();
    const idLower = (device.deviceId || '').toLowerCase();
    const vehicleNoLower = (device.vehicleNo || '').toLowerCase();
    const term = (searchTerm || '').toLowerCase();
    const matchesSearch = nameLower.includes(term) || idLower.includes(term) || vehicleNoLower.includes(term);
    const matchesFilter = filterStatus === 'all' || (device.status || '') === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'inactive': return 'text-gray-400';
      case 'maintenance': return 'text-yellow-400';
      case 'offline': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status, isOnline) => {
    if (!isOnline) return <WifiOff className="w-4 h-4 text-red-400" />;
    return <Wifi className="w-4 h-4 text-green-400" />;
  };

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
                Device Management
              </h1>
              <p className="text-gray-400">
                Monitor and manage all connected AlcoZero devices
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-(--primary-blue) hover:bg-(--primary-blue)/80 text-white! rounded-lg transition-colors"
              style={{ color: '#ffffff' }}
            >
              <Plus className="w-5 h-5" />
              <span>Add Device</span>
            </button>
          </div>
        </motion.div>

        {/* Filters and Search */}
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
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-(--glass-border) rounded-lg text-primary placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-dark-bg border border-(--glass-border) rounded-lg text-primary focus:outline-none focus:border-(--primary-blue)"
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

        {/* Device Stats */}
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
            <div className="text-3xl font-bold text-green-400">
              {devices.filter(d => d.status === 'active').length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Offline</span>
              <span className="text-2xl">🔴</span>
            </div>
            <div className="text-3xl font-bold text-red-400">
              {devices.filter(d => d.status === 'offline').length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Maintenance</span>
              <span className="text-2xl">🟡</span>
            </div>
            <div className="text-3xl font-bold text-yellow-400">
              {devices.filter(d => d.status === 'maintenance').length}
            </div>
          </motion.div>
        </div>

        {/* Devices Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDevices.map((device, index) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass-card p-6 hover:bg-white/10 transition-colors cursor-pointer group"
              onClick={() => navigate(`/dashboard/device/${device.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <span className="text-white font-bold">{(device.vehicleName || '?')[0]}</span>
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-dark-bg ${
                      device.status === 'active' ? 'bg-green-500' : 
                      device.status === 'offline' ? 'bg-red-500' : 
                      'bg-yellow-500'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary group-hover:text-cyan-400 transition-colors">
                      {device.vehicleName || device.deviceId}
                    </h3>
                    <p className="text-sm text-gray-400">{device.deviceId}</p>
                  </div>
                </div>
                <div className="relative">
                  <Eye className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Vehicle</span>
                  <span className="text-sm font-medium text-primary">
                    {device.vehicleName || 'Not assigned'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Status</span>
                  <span className={`text-sm font-medium ${getStatusColor(device.status)}`}>
                    {(device.status || '').charAt(0).toUpperCase() + (device.status || '').slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Vehicle No</span>
                  <span className="text-sm text-primary">{device.vehicleNo || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Location</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-primary">{device.currLocation ? `${device.currLocation.lat}, ${device.currLocation.lng}` : 'Unknown'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Last Seen</span>
                  <span className="text-sm text-gray-300">
                    {device.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Never'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/device/${device.id}`);
                  }}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View Details</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingDevice(device);
                  }}
                  className="flex items-center justify-center px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDevice(device.id);
                  }}
                  className="flex items-center justify-center px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredDevices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-white mb-2">No devices found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first device.'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-(--primary-blue) hover:bg-(--primary-blue)/80 text-white rounded-lg transition-colors"
              >
                Add Your First Device
              </button>
            )}
          </motion.div>
        )}

        {/* Add Device Modal */}
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-dark-bg border border-white/20 rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-white mb-6">Add New Device</h3>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {/* Device name removed; deviceId is auto-generated. */}
                {/* Driver-related fields removed — only vehicle/system fields kept */}

                <div className="border-t border-white/10 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-white mb-3">Vehicle Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Vehicle Name</label>
                    <input
                      type="text"
                      value={newDevice.vehicleName}
                      onChange={(e) => setNewDevice({...newDevice, vehicleName: e.target.value})}
                      className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                      placeholder="e.g., Toyota Camry"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Vehicle Number</label>
                  <input
                    type="text"
                    value={newDevice.vehicleNo}
                    onChange={(e) => setNewDevice({...newDevice, vehicleNo: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                    placeholder="e.g., ABC-1234"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDevice}
                  className="flex-1 px-4 py-2 bg-(--primary-blue) hover:bg-(--primary-blue)/80 text-white rounded-lg transition-colors"
                >
                  Add Device
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Device Modal */}
        {editingDevice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-dark-bg border border-white/20 rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-white mb-6">Edit Device</h3>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {/* Device name removed from edit UI per new schema */}
                {/* Location removed — system keeps currLocation */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <select
                    value={editingDevice.status}
                    onChange={(e) => setEditingDevice({...editingDevice, status: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white focus:outline-none focus:border-(--primary-blue)"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>

                {/* Driver-related edit fields removed per new schema */}

                <div className="border-t border-white/10 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-white mb-3">Vehicle Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Vehicle Name</label>
                    <input
                      type="text"
                      value={editingDevice.vehicleName || ''}
                      onChange={(e) => setEditingDevice({...editingDevice, vehicleName: e.target.value})}
                      className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                      placeholder="e.g., Toyota Camry"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Vehicle Number</label>
                  <input
                    type="text"
                    value={editingDevice.vehicleNo || ''}
                    onChange={(e) => setEditingDevice({...editingDevice, vehicleNo: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                    placeholder="e.g., ABC-1234"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setEditingDevice(null)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateDevice}
                  className="flex-1 px-4 py-2 bg-(--primary-blue) hover:bg-(--primary-blue)/80 text-white rounded-lg transition-colors"
                >
                  Update Device
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Devices;