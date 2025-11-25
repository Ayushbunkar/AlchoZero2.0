import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
  const mainFeatures = [
    {
      icon: '🔬',
      title: 'Real-time Sensor Monitoring',
      description: 'Continuous monitoring of breath alcohol content using precision MQ-3 sensors',
      details: [
        'High sensitivity to alcohol vapor',
        'Quick response time (< 1 second)',
        'Temperature compensated readings',
        'Self-calibrating sensor technology',
      ],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '🔒',
      title: 'Automated Engine Lock',
      description: 'Instant engine immobilization when unsafe alcohol levels are detected',
      details: [
        'Relay-based engine control',
        'Fail-safe locking mechanism',
        'Manual override for emergencies',
        'Visual and audio indicators',
      ],
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: '🚨',
      title: 'Multi-Channel Alerts',
      description: 'Comprehensive alert system for immediate incident notification',
      details: [
        'Real-time dashboard updates',
        'Email notifications',
        'SMS alerts (optional)',
        'Push notifications',
      ],
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: '☁️',
      title: 'Firebase Integration',
      description: 'Cloud-powered backend for scalability and reliability',
      details: [
        'Realtime Database for live updates',
        'Firestore for historical logs',
        'Cloud Functions for automation',
        'Secure authentication',
      ],
      color: 'from-yellow-500 to-green-500',
    },
    {
      icon: '📊',
      title: 'Live Dashboard',
      description: 'Comprehensive web dashboard for monitoring all devices',
      details: [
        'Real-time device status',
        'Interactive charts and graphs',
        'Historical data analysis',
        'Export reports (PDF/CSV)',
      ],
      color: 'from-teal-500 to-blue-500',
    },
    {
      icon: '🔌',
      title: 'Device Integration',
      description: 'Easy integration with ESP32/NodeMCU microcontrollers',
      details: [
        'Plug-and-play installation',
        'Wi-Fi connectivity',
        'OTA firmware updates',
        'Multiple devices support',
      ],
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  const technicalSpecs = [
    {
      category: 'Sensor Specifications',
      specs: [
        { label: 'Type', value: 'MQ-3 Alcohol Sensor' },
        { label: 'Detection Range', value: '0.04 - 4 mg/L' },
        { label: 'Response Time', value: '< 1 second' },
        { label: 'Operating Voltage', value: '5V DC' },
      ],
    },
    {
      category: 'System Requirements',
      specs: [
        { label: 'Microcontroller', value: 'ESP32 / NodeMCU' },
        { label: 'Power Supply', value: '5V, 2A minimum' },
        { label: 'Internet', value: 'Wi-Fi connectivity' },
        { label: 'Operating Temp', value: '-10°C to 50°C' },
      ],
    },
    {
      category: 'Software Features',
      specs: [
        { label: 'Frontend', value: 'React + Tailwind' },
        { label: 'Backend', value: 'Firebase Services' },
        { label: 'Auth', value: 'Email/Password' },
        { label: 'Database', value: 'Firestore + RTDB' },
      ],
    },
  ];

  const advantages = [
    {
      title: 'No Manual Intervention',
      description: 'System operates automatically without requiring driver input',
      icon: '🤖',
    },
    {
      title: 'Tamper Resistant',
      description: 'Secure hardware design prevents bypassing or manipulation',
      icon: '🛡️',
    },
    {
      title: 'Scalable Architecture',
      description: 'Firebase backend support devices and users',
      icon: '📈',
    },
    {
      title: 'Cost Effective',
      description: 'Affordable hardware and minimal maintenance costs',
      icon: '💰',
    },
    {
      title: 'Easy Maintenance',
      description: 'Remote diagnostics and updates reduce maintenance',
      icon: '🔧',
    },
    {
      title: 'Regulatory Compliant',
      description: 'Meets international safety and emission standards',
      icon: '✅',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto text-center mb-20"
      >
        <h1 className="section-title mb-6">Comprehensive Features</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Explore the powerful features that make AlcoZero the most advanced 
          alcohol detection system for vehicles
        </p>
      </motion.div>

      {/* Main Features Grid */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="glass-card p-8 hover:shadow-xl hover:shadow-neon-blue/20 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                {feature.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <span className="text-neon-blue mr-2 mt-1">✓</span>
                    <span className="text-gray-300">{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="max-w-7xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-4">Technical Specifications</h2>
          <p className="text-gray-400 text-lg">
            Detailed technical information about the system
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {technicalSpecs.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-neon-blue mb-6">
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.specs.map((spec, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-gray-400 text-sm">{spec.label}</span>
                    <span className="text-white font-semibold text-sm">{spec.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Advantages */}
      <div className="max-w-7xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-4">Key Advantages</h2>
          <p className="text-gray-400 text-lg">
            Why choose AlcoZero over traditional solutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 text-center hover:shadow-xl hover:shadow-neon-purple/20 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{advantage.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">
                {advantage.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {advantage.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Integration Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <div className="glass-card p-12">
          <h2 className="text-3xl font-bold text-center text-neon-blue mb-12">
            System Integration Flow
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-4">
            {[
              { label: 'MQ-3 Sensor', icon: '🔬' },
              { label: 'Raspberry Pi 5', icon: '💻' },
              { label: 'Firebase', icon: '☁️' },
              { label: 'Dashboard', icon: '📊' },
              { label: 'Admin', icon: '👤' },
            ].map((item, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-3xl mb-3">
                    {item.icon}
                  </div>
                  <span className="text-white font-semibold">{item.label}</span>
                </div>
                {index < 4 && (
                  <div className="hidden md:block text-neon-blue text-2xl">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Features;
