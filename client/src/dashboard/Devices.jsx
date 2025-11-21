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
  XCircle
} from 'lucide-react';
import {
  onAuthStateChange,
  getDevices,
  addDevice,
  updateDevice,
  deleteDevice,
  generateDriverId
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
  const [driverId, setDriverId] = useState('');
  const [newDevice, setNewDevice] = useState({
    name: '',
    deviceId: '',
    location: '',
    status: 'active',
    driverName: '',
    driverAge: '',
    driverPhoto: '',
    licenseNo: '',
    vehicleName: '',
    vehicleNumber: '',
    contactNumber: ''
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

  // Generate driver ID when modal opens
  useEffect(() => {
    if (showAddModal && !driverId) {
      const generateId = async () => {
        const id = await generateDriverId();
        setDriverId(id);
      };
      generateId();
    }
  }, [showAddModal]);

  const fetchDevices = async () => {
    const result = await getDevices();
    if (result.success) {
      setDevices(result.devices);
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
    if (!newDevice.name || !newDevice.deviceId) return;

    // Generate driver ID if driver name is provided
    let generatedDriverId = driverId;
    if (newDevice.driverName && !driverId) {
      generatedDriverId = await generateDriverId();
      setDriverId(generatedDriverId);
    }

    const result = await addDevice({
      ...newDevice,
      driverId: generatedDriverId,
      lastSeen: new Date().toISOString(),
      batteryLevel: 100,
      firmwareVersion: '1.0.0'
    });

    if (result.success) {
      setDevices([...devices, result.device]);
      setShowAddModal(false);
      setDriverId(''); // Reset driver ID
      setNewDevice({ 
        name: '', 
        deviceId: '', 
        location: '', 
        status: 'active',
        driverName: '',
        driverAge: '',
        driverPhoto: '',
        licenseNo: '',
        vehicleName: '',
        vehicleNumber: '',
        contactNumber: ''
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
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.deviceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || device.status === filterStatus;
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
                Device Management
              </h1>
              <p className="text-gray-400">
                Monitor and manage all connected AlchoZero devices
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-(--primary-blue) hover:bg-(--primary-blue)/80 text-white rounded-lg transition-colors"
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
              className="glass-card p-6 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(device.status, device.status === 'active')}
                  <div>
                    <h3 className="text-lg font-semibold text-white">{device.name}</h3>
                    <p className="text-sm text-gray-400">{device.deviceId}</p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-1 hover:bg-white/10 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  {/* Dropdown menu would go here */}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Status</span>
                  <span className={`text-sm font-medium ${getStatusColor(device.status)}`}>
                    {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Battery</span>
                  <div className="flex items-center space-x-2">
                    <Battery className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-white">{device.batteryLevel || 85}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Location</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-white">{device.location || 'Unknown'}</span>
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
                  onClick={() => setEditingDevice(device)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-(--primary-blue)/20 hover:bg-(--primary-blue)/30 text-(--primary-blue) rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteDevice(device.id)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Delete</span>
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
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Device Name</label>
                  <input
                    type="text"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                    placeholder="e.g., Car Alcohol Detector #1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Device ID</label>
                  <input
                    type="text"
                    value={newDevice.deviceId}
                    onChange={(e) => setNewDevice({...newDevice, deviceId: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                    placeholder="e.g., ALCH-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={newDevice.location}
                    onChange={(e) => setNewDevice({...newDevice, location: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                    placeholder="e.g., Parking Lot A"
                  />
                </div>
                
                <div className="border-t border-white/10 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-white mb-3">Driver Information</h4>
                  
                  <div className="mb-4 p-3 bg-(--primary-blue)/10 border border-(--primary-blue)/30 rounded-lg">
                    <label className="block text-xs font-medium text-gray-400 mb-1">Auto-Generated Driver ID</label>
                    <div className="text-base font-mono text-(--primary-blue)">{driverId || 'Generating...'}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Driver Name</label>
                    <input
                      type="text"
                      value={newDevice.driverName}
                      onChange={(e) => setNewDevice({...newDevice, driverName: e.target.value})}
                      className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                      placeholder="e.g., John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Driver Age</label>
                  <input
                    type="number"
                    value={newDevice.driverAge}
                    onChange={(e) => setNewDevice({...newDevice, driverAge: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                    placeholder="e.g., 35"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Driver Photo</label>
                  
                  {newDevice.driverPhoto && (
                    <div className="mb-3 relative">
                      <img 
                        src={newDevice.driverPhoto} 
                        alt="Driver" 
                        className="w-32 h-32 object-cover rounded-lg border-2 border-(--primary-blue)/30"
                      />
                      <button
                        type="button"
                        onClick={() => setNewDevice({...newDevice, driverPhoto: ''})}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-(--primary-blue)/20 hover:bg-(--primary-blue)/30 text-(--primary-blue) rounded-lg transition-colors border border-(--primary-blue)/50">
                          <Upload className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {uploadingImage ? 'Uploading...' : 'Upload from Device'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    <div className="text-center text-xs text-gray-500">OR</div>
                    
                    <input
                      type="text"
                      value={newDevice.driverPhoto}
                      onChange={(e) => setNewDevice({...newDevice, driverPhoto: e.target.value})}
                      className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                      placeholder="Paste image URL"
                      disabled={uploadingImage}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">License Number</label>
                  <input
                    type="text"
                    value={newDevice.licenseNo}
                    onChange={(e) => setNewDevice({...newDevice, licenseNo: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                    placeholder="e.g., DL-1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    value={newDevice.contactNumber}
                    onChange={(e) => setNewDevice({...newDevice, contactNumber: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                    placeholder="e.g., +1234567890"
                  />
                </div>

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
                    value={newDevice.vehicleNumber}
                    onChange={(e) => setNewDevice({...newDevice, vehicleNumber: e.target.value})}
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
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Device Name</label>
                  <input
                    type="text"
                    value={editingDevice.name}
                    onChange={(e) => setEditingDevice({...editingDevice, name: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingDevice.location}
                    onChange={(e) => setEditingDevice({...editingDevice, location: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                  />
                </div>
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

                <div className="border-t border-white/10 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-white mb-3">Driver Information</h4>
                  
                  {editingDevice.driverId && (
                    <div className="mb-4 p-3 bg-(--primary-blue)/10 border border-(--primary-blue)/30 rounded-lg">
                      <label className="block text-xs font-medium text-gray-400 mb-1">Driver ID</label>
                      <div className="text-base font-mono text-(--primary-blue)">{editingDevice.driverId}</div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Driver Name</label>
                    <input
                      type="text"
                      value={editingDevice.driverName || ''}
                      onChange={(e) => setEditingDevice({...editingDevice, driverName: e.target.value})}
                      className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                      placeholder="e.g., John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Driver Age</label>
                  <input
                    type="number"
                    value={editingDevice.driverAge || ''}
                    onChange={(e) => setEditingDevice({...editingDevice, driverAge: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                    placeholder="e.g., 35"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Driver Photo</label>
                  
                  {editingDevice.driverPhoto && (
                    <div className="mb-3 relative">
                      <img 
                        src={editingDevice.driverPhoto} 
                        alt="Driver" 
                        className="w-32 h-32 object-cover rounded-lg border-2 border-(--primary-blue)/30"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingDevice({...editingDevice, driverPhoto: ''})}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-(--primary-blue)/20 hover:bg-(--primary-blue)/30 text-(--primary-blue) rounded-lg transition-colors border border-(--primary-blue)/50">
                          <Upload className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {uploadingImage ? 'Uploading...' : 'Upload from Device'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    <div className="text-center text-xs text-gray-500">OR</div>
                    
                    <input
                      type="text"
                      value={editingDevice.driverPhoto || ''}
                      onChange={(e) => setEditingDevice({...editingDevice, driverPhoto: e.target.value})}
                      className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                      placeholder="Paste image URL"
                      disabled={uploadingImage}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">License Number</label>
                  <input
                    type="text"
                    value={editingDevice.licenseNo || ''}
                    onChange={(e) => setEditingDevice({...editingDevice, licenseNo: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                    placeholder="e.g., DL-1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    value={editingDevice.contactNumber || ''}
                    onChange={(e) => setEditingDevice({...editingDevice, contactNumber: e.target.value})}
                    className="w-full px-3 py-2 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-(--primary-blue)"
                    placeholder="e.g., +1234567890"
                  />
                </div>

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
                    value={editingDevice.vehicleNumber || ''}
                    onChange={(e) => setEditingDevice({...editingDevice, vehicleNumber: e.target.value})}
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