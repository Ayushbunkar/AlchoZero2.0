import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  ArrowLeft,
  Activity,
  AlertTriangle,
  Eye,
  Phone,
  Wind,
  Gauge,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import {
  listenToDeviceMonitoring,
  getMonitoringHistory,
  getSafetyAlerts,
  getDriverStatistics
} from '../firebaseConfig';
import { useTheme } from '../contexts/ThemeContext.jsx';

const DriverMonitor = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  const [device, setDevice] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [timeRange, setTimeRange] = useState('1h'); // 1h, 6h, 24h, 7d
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const wrapperClass = isDark ? 'min-h-screen bg-gray-950 text-white p-6' : 'min-h-screen bg-gray-50 text-gray-900 p-6';
  const cardClass = isDark ? 'bg-gray-900 border border-gray-800 rounded-xl p-6' : 'bg-white border border-gray-200 rounded-xl p-6 shadow-sm';
  const innerCardClass = isDark ? 'bg-gray-800 rounded-lg p-4' : 'bg-white rounded-lg p-4 border border-gray-200 shadow-sm';
  const smallMuted = isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600';
  const labelMuted = isDark ? '#9ca3af' : '#6b7280';
  const gridStroke = isDark ? '#374151' : '#e6e7ea';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';
  const scrollbarCss = isDark ? `
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
  ` : `
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f3f4f6; border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
  `;

  useEffect(() => {
    if (!deviceId) return;

    // Listen to real-time monitoring data
    const unsubscribe = listenToDeviceMonitoring(deviceId, (data) => {
      setRealtimeData(data);
    });

    // Fetch historical data
    fetchHistoricalData();

    // Fetch alerts
    fetchAlerts();

    // Fetch statistics
    fetchStatistics();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [deviceId, timeRange]);

  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      const limit = timeRange === '1h' ? 60 : timeRange === '6h' ? 360 : timeRange === '24h' ? 1440 : 10080;
      const result = await getMonitoringHistory(deviceId, limit);
      const logs = Array.isArray(result?.logs) ? result.logs : [];
      // Transform data for charts
      const chartData = logs.map((entry) => ({
        time: new Date(entry.timestamp).toLocaleTimeString(),
        alcoholLevel: entry.alcoholLevel || 0,
        drowsiness: entry.drowsiness?.perclosValue || 0,
        distraction: entry.distraction?.detected ? 1 : 0,
        speed: entry.rashDriving?.speed || 0,
        acceleration: entry.rashDriving?.acceleration || 0,
        driverScore: entry.driverScore || 100,
        audioAlcohol: entry.audioAlcohol?.slurringScore || 0
      }));
      setHistoricalData(chartData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const result = await getSafetyAlerts(deviceId, 50);
      const alertsArr = Array.isArray(result?.alerts) ? result.alerts : [];
      setAlerts(alertsArr);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await getDriverStatistics(deviceId);
      setStatistics(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return isDark ? 'text-gray-500 bg-gray-500/10 border-gray-500/20' : 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'drowsiness': return <Eye className="w-4 h-4" />;
      case 'distraction': return <Phone className="w-4 h-4" />;
      case 'alcohol': return <Wind className="w-4 h-4" />;
      case 'rash_driving': return <Gauge className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (current, previous) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const radarData = realtimeData ? [
    { metric: 'Safe Driving', value: (1 - (realtimeData.alcoholLevel || 0)) * 100, fullMark: 100 },
    { metric: 'Alertness', value: (1 - (realtimeData.drowsiness?.perclosValue || 0)) * 100, fullMark: 100 },
    { metric: 'Focus', value: realtimeData.distraction?.detected ? 30 : 100, fullMark: 100 },
    { metric: 'Audio Clear', value: (1 - (realtimeData.audioAlcohol?.slurringScore || 0)) * 100, fullMark: 100 },
    { metric: 'Speed Control', value: realtimeData.rashDriving?.overSpeeding ? 40 : 100, fullMark: 100 },
    { metric: 'Overall Score', value: realtimeData.driverScore || 100, fullMark: 100 }
  ] : [];

  if (loading && !realtimeData) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading driver data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate('/dashboard/monitor')} className={isDark ? 'flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4' : 'flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4'}>
          <ArrowLeft className="w-5 h-5" /> Back to Monitor
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Device: {deviceId}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${realtimeData?.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {realtimeData?.connected ? 'Connected' : 'Disconnected'}
              </div>
              {realtimeData?.location && (
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{realtimeData.location.lat?.toFixed(4)}, {realtimeData.location.lng?.toFixed(4)}</div>
              )}
              <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{realtimeData?.timestamp ? new Date(realtimeData.timestamp).toLocaleString() : 'N/A'}</div>
            </div>
          </div>

          <div className="flex gap-2">
            {['1h', '6h', '24h', '7d'].map((range) => (
              <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-2 rounded-lg transition-colors ${timeRange === range ? 'bg-blue-600 text-white' : isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cardClass}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><Wind className="w-5 h-5 text-blue-400" /><span className={isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Alcohol Level</span></div>
            {historicalData.length > 1 && getTrendIcon(realtimeData?.alcoholLevel || 0, historicalData[historicalData.length - 2]?.alcoholLevel || 0)}
          </div>
          <div className="text-3xl font-bold">{(realtimeData?.alcoholLevel || 0).toFixed(3)}%</div>
          <div className={`text-sm mt-2 ${realtimeData?.alcoholLevel > 0.15 ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-green-400' : 'text-green-600')}`}>{realtimeData?.alcoholLevel > 0.15 ? 'Above Limit' : 'Safe'}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={cardClass}>
          <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Activity className="w-5 h-5 text-green-400" /><span className={isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Driver Score</span></div>{historicalData.length > 1 && getTrendIcon(realtimeData?.driverScore || 100, historicalData[historicalData.length - 2]?.driverScore || 100)}</div>
          <div className="text-3xl font-bold">{realtimeData?.driverScore || 100}</div>
          <div className={isDark ? 'w-full bg-gray-800 rounded-full h-2 mt-2' : 'w-full bg-gray-200 rounded-full h-2 mt-2'}><div className={`h-2 rounded-full transition-all ${(realtimeData?.driverScore || 100) >= 80 ? 'bg-green-500' : (realtimeData?.driverScore || 100) >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${realtimeData?.driverScore || 100}%` }}></div></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cardClass}>
          <div className="flex items-center gap-2 mb-2"><Gauge className="w-5 h-5 text-purple-400" /><span className={isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Engine Status</span></div>
          <div className="text-3xl font-bold">{realtimeData?.engine || 'OFF'}</div>
          <div className={`text-sm mt-2 ${realtimeData?.engine === 'ON' ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')}`}>{realtimeData?.engine === 'ON' ? 'Running' : 'Locked/Off'}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cardClass}>
          <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Gauge className="w-5 h-5 text-orange-400" /><span className={isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Current Speed</span></div>{historicalData.length > 1 && getTrendIcon(realtimeData?.rashDriving?.speed || 0, historicalData[historicalData.length - 2]?.speed || 0)}</div>
          <div className="text-3xl font-bold">{realtimeData?.rashDriving?.speed || 0} <span className={isDark ? 'text-lg text-gray-400' : 'text-lg text-gray-600'}>km/h</span></div>
          <div className={`text-sm mt-2 ${realtimeData?.rashDriving?.overSpeeding ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-green-400' : 'text-green-600')}`}>{realtimeData?.rashDriving?.overSpeeding ? 'Over Speed!' : 'Normal'}</div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cardClass}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Wind className="w-5 h-5 text-blue-400" />Alcohol Level Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={historicalData}>
              <defs>
                <linearGradient id="alcoholGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="time" stroke={labelMuted} />
              <YAxis stroke={labelMuted} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}` }} labelStyle={{ color: labelMuted }} />
              <Area type="monotone" dataKey="alcoholLevel" stroke="#3b82f6" fillOpacity={1} fill="url(#alcoholGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={cardClass}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-purple-400" />Drowsiness (PERCLOS)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="time" stroke={labelMuted} />
              <YAxis stroke={labelMuted} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}` }} labelStyle={{ color: labelMuted }} />
              <Line type="monotone" dataKey="drowsiness" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={cardClass}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-green-400" />Driver Score History</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={historicalData}>
              <defs><linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="time" stroke={labelMuted} />
              <YAxis stroke={labelMuted} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}` }} labelStyle={{ color: labelMuted }} />
              <Area type="monotone" dataKey="driverScore" stroke="#10b981" fillOpacity={1} fill="url(#scoreGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={cardClass}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Gauge className="w-5 h-5 text-orange-400" />Speed & Acceleration</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="time" stroke={labelMuted} />
              <YAxis stroke={labelMuted} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}` }} labelStyle={{ color: labelMuted }} />
              <Legend />
              <Line type="monotone" dataKey="speed" stroke="#f97316" strokeWidth={2} name="Speed (km/h)" />
              <Line type="monotone" dataKey="acceleration" stroke="#06b6d4" strokeWidth={2} name="Acceleration (m/s²)" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cardClass}>
          <h3 className="text-xl font-semibold mb-4">Driver Performance Overview</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={gridStroke} />
              <PolarAngleAxis dataKey="metric" stroke={labelMuted} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke={labelMuted} />
              <Radar name="Performance" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}` }} labelStyle={{ color: labelMuted }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={cardClass}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-400" />Recent Activity Logs ({alerts.length})</h3>
          <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar">
            {alerts.length === 0 ? (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}><Activity className="w-12 h-12 mx-auto mb-2 opacity-50" /><p>No recent activity</p></div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start gap-3"><div className="mt-1">{getAlertIcon(alert.alertType)}</div><div className="flex-1"><div className="flex items-center justify-between mb-1"><span className="font-semibold capitalize">{alert.alertType.replace('_', ' ')}</span><span className="text-xs">{new Date(alert.timestamp).toLocaleTimeString()}</span></div><p className="text-sm opacity-90">{alert.message}</p>{alert.data && (<div className="mt-2 text-xs opacity-75">{Object.entries(alert.data).map(([key, value]) => (<span key={key} className="mr-3">{key}: {typeof value === 'object' ? JSON.stringify(value) : value.toString()}</span>))}</div>)}</div></div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cardClass}>
        <h3 className="text-xl font-semibold mb-4">Current Detection Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={innerCardClass}><div className="flex items-center justify-between mb-2"><span className={isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Face Authentication</span><div className={`w-2 h-2 rounded-full ${realtimeData?.faceAuth?.verified ? 'bg-green-500' : 'bg-red-500'}`}></div></div><div className="text-2xl font-bold mb-1">{realtimeData?.faceAuth?.verified ? 'Verified' : 'Not Verified'}</div><div className={isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Confidence: {((realtimeData?.faceAuth?.confidence || 0) * 100).toFixed(0)}%</div></div>
          <div className={innerCardClass}><div className="flex items-center justify-between mb-2"><span className={isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Distraction Detection</span><div className={`w-2 h-2 rounded-full ${realtimeData?.distraction?.detected ? 'bg-red-500' : 'bg-green-500'}`}></div></div><div className="text-2xl font-bold mb-1">{realtimeData?.distraction?.detected ? 'Distracted' : 'Focused'}</div><div className={isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>{realtimeData?.distraction?.type || 'None'} {realtimeData?.distraction?.duration > 0 && ` (${(realtimeData.distraction.duration / 1000).toFixed(1)}s)`}</div></div>
          <div className={innerCardClass}><div className="flex items-center justify-between mb-2"><span className={isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Audio Analysis</span><div className={`w-2 h-2 rounded-full ${realtimeData?.audioAlcohol?.detected ? 'bg-red-500' : 'bg-green-500'}`}></div></div><div className="text-2xl font-bold mb-1">{realtimeData?.audioAlcohol?.detected ? 'Detected' : 'Clear'}</div><div className={isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Slurring: {((realtimeData?.audioAlcohol?.slurringScore || 0) * 100).toFixed(0)}%</div></div>
          <div className={innerCardClass}><div className="flex items-center justify-between mb-2"><span className={isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Harsh Braking</span><div className={`w-2 h-2 rounded-full ${realtimeData?.rashDriving?.harshBraking ? 'bg-red-500' : 'bg-green-500'}`}></div></div><div className="text-2xl font-bold mb-1">{realtimeData?.rashDriving?.harshBraking ? 'Detected' : 'Normal'}</div></div>
          <div className={innerCardClass}><div className="flex items-center justify-between mb-2"><span className={isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Drifting</span><div className={`w-2 h-2 rounded-full ${realtimeData?.rashDriving?.drifting ? 'bg-red-500' : 'bg-green-500'}`}></div></div><div className="text-2xl font-bold mb-1">{realtimeData?.rashDriving?.drifting ? 'Detected' : 'Normal'}</div></div>
          <div className={innerCardClass}><div className="flex items-center justify-between mb-2"><span className={isDark ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Over Speeding</span><div className={`w-2 h-2 rounded-full ${realtimeData?.rashDriving?.overSpeeding ? 'bg-red-500' : 'bg-green-500'}`}></div></div><div className="text-2xl font-bold mb-1">{realtimeData?.rashDriving?.overSpeeding ? 'Yes' : 'No'}</div></div>
        </div>
      </motion.div>

      <style>{scrollbarCss}</style>
    </div>
  );
};

export default DriverMonitor;
