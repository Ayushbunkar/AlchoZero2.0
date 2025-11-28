import DeviceDetails from './DeviceDetails';

export default DeviceDetails;

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
                <p className="text-sm">Upload images to track driver activity</p>
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

export default DriverProfile;
