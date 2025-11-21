import React from 'react';
import { motion } from 'framer-motion';

const DeviceCard = ({ device }) => {
  const { deviceId, alcoholLevel, engine, timestamp, connected } = device;

  const getStatusColor = () => {
    if (!connected) return 'bg-gray-500';
    if (alcoholLevel > 0.3) return 'bg-red-500';
    if (alcoholLevel > 0.15) return 'bg-yellow-500';
    return 'bg-cyan-500';
  };

  const getStatusText = () => {
    if (!connected) return 'DISCONNECTED';
    if (alcoholLevel > 0.3) return 'ALERT - HIGH LEVEL';
    if (alcoholLevel > 0.15) return 'WARNING';
    return 'SAFE';
  };

  const getEngineStatus = () => {
    if (engine === 'ON') return '🟢 Engine Running';
    if (engine === 'OFF') return '🔴 Engine Locked';
    return '⚪ Unknown';
  };

  const formatTimestamp = (ts) => {
    if (!ts) return 'N/A';
    const date = new Date(ts);
    return date.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6 hover:shadow-xl hover:shadow-neon-blue/20 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{deviceId}</h3>
          <p className="text-sm text-gray-400">
            Last Update: {formatTimestamp(timestamp)}
          </p>
        </div>
        <div className={`${getStatusColor()} w-4 h-4 rounded-full animate-pulse`}></div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
            connected
              ? alcoholLevel > 0.3
                ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                : alcoholLevel > 0.15
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
          }`}
        >
          {getStatusText()}
        </span>
      </div>

      {/* Alcohol Level */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Alcohol Level (BAC)</span>
          <span className="text-lg font-bold text-neon-blue">
            {alcoholLevel.toFixed(3)}
          </span>
        </div>
        <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(alcoholLevel * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${
              alcoholLevel > 0.3
                ? 'bg-red-500'
                : alcoholLevel > 0.15
                ? 'bg-yellow-500'
                : 'bg-cyan-500'
            }`}
          ></motion.div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.00</span>
          <span>0.15</span>
          <span>0.30</span>
          <span>1.00+</span>
        </div>
      </div>

      {/* Engine Status */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Engine Status</span>
          <span className="text-sm font-semibold">{getEngineStatus()}</span>
        </div>
      </div>

      {/* Connection Indicator */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? 'bg-cyan-500 animate-pulse' : 'bg-red-500'
            }`}
          ></div>
          <span className="text-xs text-gray-400">
            {connected ? 'Connected to Firebase' : 'Connection Lost'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default DeviceCard;
