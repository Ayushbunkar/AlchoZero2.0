import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Car,
  Camera,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  Gauge,
  Timer,
  TrendingUp,
  TrendingDown,
  Image as ImageIcon,
  Upload,
  Trash2
} from 'lucide-react';
import { getDeviceById, updateDevice } from '../firebaseConfig';
import { uploadToCloudinary } from '../cloudinaryConfig';

const DeviceDetails = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [capturedImages, setCapturedImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for driving statistics (in real app, fetch from Firebase)
  const [drivingStats] = useState({
    averageSpeed: 45, // km/h
    maxSpeed: 85,
    totalDistance: 2450, // km
    totalTrips: 124,
    safeTrips: 118,
    violations: 6,
    lastTripDate: new Date().toISOString(),
    avgTripDuration: 35, // minutes
    fuelEfficiency: 15.5, // km/l
    co2Emissions: 2.1 // tons
  });

  useEffect(() => {
    fetchDeviceDetails();
  }, [deviceId]);

  const parseLocation = (loc) => {
    if (!loc) return null;
    // Firestore GeoPoint may be { latitude, longitude }
    if (loc.latitude != null && loc.longitude != null) return { lat: loc.latitude, lng: loc.longitude };
    // Other shape: { lat, lng }
    if (loc.lat != null && loc.lng != null) return { lat: loc.lat, lng: loc.lng };
    // Array-like [lat, lng]
    if (Array.isArray(loc) && loc.length >= 2) return { lat: loc[0], lng: loc[1] };
    return null;
  };

  const fetchDeviceDetails = async () => {
    const result = await getDeviceById(deviceId);
    if (result.success) {
      const foundDevice = result.device;
      if (foundDevice) {
        // normalize currLocation
        const normalizedLocation = parseLocation(foundDevice.currLocation);
        const deviceWithNormalizedLocation = { ...foundDevice, currLocation: normalizedLocation };
        setDevice(deviceWithNormalizedLocation);
        setCapturedImages(foundDevice.capturedImages || []);
      }
    } else {
      console.warn('Could not fetch device by id:', result.error);
    }
    setLoading(false);
  };

  const handleCaptureImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    const result = await uploadToCloudinary(file);
    setUploadingImage(false);

    if (result.success) {
      const newImage = {
        url: result.url,
        timestamp: new Date().toISOString(),
        publicId: result.publicId
      };

      // Keep only last 5 images
      const updatedImages = [newImage, ...capturedImages].slice(0, 5);
      setCapturedImages(updatedImages);

      // Update device in Firebase
      await updateDevice(deviceId, {
        ...device,
        capturedImages: updatedImages
      });
    } else {
      alert('Failed to upload image: ' + result.error);
    }
  };

  const handleDeleteImage = async (imageIndex) => {
    const updatedImages = capturedImages.filter((_, index) => index !== imageIndex);
    setCapturedImages(updatedImages);
    
    // Update device in Firebase
    await updateDevice(deviceId, {
      ...device,
      capturedImages: updatedImages
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neon-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading device details...</p>
        </div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Device Not Found</h2>
          <p className="text-gray-400 mb-6">The requested device could not be found.</p>
          <button
            onClick={() => navigate('/dashboard/devices')}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            Back to Devices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/dashboard/devices')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Devices</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Device Details
              </h1>
              <p className="text-gray-400">Comprehensive device information and system fields</p>
            </div>
            <div className={`px-4 py-2 rounded-full ${
              device.status === 'active' ? 'bg-green-500/20 text-green-400' :
              device.status === 'offline' ? 'bg-red-500/20 text-red-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
            </div>
          </div>
        </motion.div>

        {/* Device Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-6"
        >
          <div className="grid md:grid-cols-3 gap-6">
            {/* Photo and Basic Info */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Activity className="w-16 h-16 text-white" />
                </div>
                <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-dark-bg ${
                  device.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                }`} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{device.vehicleName || device.deviceId}</h2>
              <p className="text-cyan-400 font-mono text-sm mb-2">{device.deviceId || 'N/A'}</p>
              <p className="text-gray-400 text-sm">Status: {(device.status || 'N/A').charAt(0).toUpperCase() + (device.status || '').slice(1)}</p>
            </div>

            {/* Device System Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-cyan-400" />
                Device System Info
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Activity className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Admin ID</p>
                    <p className="text-white font-mono">{device.adminId || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Alerts ID</p>
                    <p className="text-white font-mono">{device.alertsId || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Gauge className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Battery Level</p>
                    <p className="text-white">{(device.batteryLevel != null) ? `${device.batteryLevel}%` : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Car className="w-5 h-5 mr-2 text-cyan-400" />
                Device & Vehicle Info
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Car className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Vehicle Name</p>
                    <p className="text-white">{device.vehicleName || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Vehicle Number</p>
                    <p className="text-white font-mono">{device.vehicleNo || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Registered</p>
                    <p className="text-white font-mono">{device.deviceRegisterDate ? new Date(device.deviceRegisterDate).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Timer className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Last Active</p>
                    <p className="text-white font-mono">{device.lastActive ? new Date(device.lastActive).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Last Location Update</p>
                    <p className="text-white font-mono">{device.lastLocationUpdateTime ? new Date(device.lastLocationUpdateTime).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Current Location</p>
                    <p className="text-white font-mono">{device.currLocation ? `${device.currLocation.lat}, ${device.currLocation.lng}` : 'Unknown'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Captured Images Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <Camera className="w-6 h-6 mr-2 text-cyan-400" />
              Captured Images
              <span className="ml-2 text-sm text-gray-400">
                (Last 5 captures)
              </span>
            </h3>
            
            <label className="cursor-pointer">
              <div className="flex items-center space-x-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors border border-cyan-500/50">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {uploadingImage ? 'Uploading...' : 'Capture New'}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCaptureImage}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {capturedImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="relative group"
              >
                <img
                  src={image.url}
                  alt={`Capture ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-cyan-500/30"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="p-2 bg-red-500 hover:bg-red-600 rounded-full"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1 text-center">
                  {new Date(image.timestamp).toLocaleDateString()}
                </p>
              </motion.div>
            ))}

            {capturedImages.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
                <ImageIcon className="w-16 h-16 mb-3 opacity-50" />
                <p>No captured images yet</p>
                <p className="text-sm">Upload images to track device activity</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex space-x-2 border-b border-white/10">
            {['overview', 'statistics', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <Gauge className="w-8 h-8 text-cyan-400" />
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Average Speed</p>
              <p className="text-3xl font-bold text-white">{drivingStats.averageSpeed} <span className="text-lg text-gray-400">km/h</span></p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <Activity className="w-8 h-8 text-blue-400" />
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Max Speed</p>
              <p className="text-3xl font-bold text-white">{drivingStats.maxSpeed} <span className="text-lg text-gray-400">km/h</span></p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <MapPin className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Total Distance</p>
              <p className="text-3xl font-bold text-white">{drivingStats.totalDistance} <span className="text-lg text-gray-400">km</span></p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Safe Trips</p>
              <p className="text-3xl font-bold text-white">{drivingStats.safeTrips}<span className="text-lg text-gray-400">/{drivingStats.totalTrips}</span></p>
            </div>
          </motion.div>
        )}

        {activeTab === 'statistics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Driving Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Trip Completion Rate</span>
                    <span className="text-white">{((drivingStats.safeTrips / drivingStats.totalTrips) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-dark-bg rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      style={{ width: `${(drivingStats.safeTrips / drivingStats.totalTrips) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Average Trip Duration</span>
                    <span className="text-white">{drivingStats.avgTripDuration} min</span>
                  </div>
                  <div className="w-full bg-dark-bg rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                      style={{ width: '70%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Fuel Efficiency</span>
                    <span className="text-white">{drivingStats.fuelEfficiency} km/l</span>
                  </div>
                  <div className="w-full bg-dark-bg rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: '80%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Additional Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-dark-bg/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">Total Violations</span>
                  </div>
                  <span className="text-xl font-bold text-yellow-400">{drivingStats.violations}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-dark-bg/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Timer className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Total Trips</span>
                  </div>
                  <span className="text-xl font-bold text-blue-400">{drivingStats.totalTrips}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-dark-bg/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">CO₂ Emissions</span>
                  </div>
                  <span className="text-xl font-bold text-green-400">{drivingStats.co2Emissions}t</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-dark-bg/30 rounded-lg hover:bg-dark-bg/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Trip to {['Downtown', 'Airport', 'Mall', 'Office', 'Home'][index]}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(Date.now() - index * 86400000).toLocaleDateString()} • {25 + index * 5} km • {30 + index * 10} min
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      index % 3 === 0 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {index % 3 === 0 ? 'Safe' : 'Warning'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DeviceDetails;
