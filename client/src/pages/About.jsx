import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png';

const About = () => {
  const timeline = [
    {
      phase: 'Detection Phase',
      steps: [
        'Driver approaches vehicle',
        'MQ-3 sensor activates automatically',
        'Breath alcohol content (BAC) is measured',
        'Data sent to ESP32 microcontroller',
      ],
    },
    {
      phase: 'Analysis Phase',
      steps: [
        'ESP32 processes sensor readings',
        'Compares BAC with safe threshold (0.03%)',
        'Sends data to Firebase Realtime Database',
        'Firebase Cloud Functions triggered',
      ],
    },
    {
      phase: 'Action Phase',
      steps: [
        'If BAC > threshold, relay locks engine',
        'Alert saved to Firestore',
        'Admin receives email notification',
        'Dashboard updates in real-time',
      ],
    },
  ];

  const team = [
    {
      name: 'Aditya Singh Patel',
      role: 'Project Leader',
      photo: '/images/adityapatel.png',
      bio: 'Leads project management, coordination, and overall vision.'
    },
    {
      name: 'Ayush Bunkar',
      role: 'Frontend Backend & AI/ML Engineer',
      photo: '/images/ayush.png',
      bio: 'Owns system design, APIs, database models, and integrations.'
    },
    {
      name: 'Riya Palod',
      role: 'Researcher and UI/UX Designer',
      photo: '/images/riya.jpg',
      bio: 'Researcher and UI/UX designer creating intuitive, data-driven products.'
    },
    {
      name: 'Aditya Singh Rathore',
      role: 'Circuit Designer and hardware integrator',
      photo: '/images/adityarathore.jpg',
      bio: 'Designs circuits, PCB layouts, and ensures hardware reliability.'
    },
    {
      name: 'Priyanshu Lohani',
      role: 'App developer & AI/ML Engineer',
      photo: '/images/priyanshu.png',
      bio: 'Develops mobile app and implements AI algorithms for detection.'
    },
    {
      name: 'Shikhar Mishra',
      role: 'Hardware and Embedded Systems Engineer',
      photo: '/images/shikhar.png',
      bio: 'Programs microcontrollers and optimizes sensor integration.'
    },
  ];


  // const achievements = [
  //   {
  //     icon: '🏆',
  //     title: 'SIH 2025 Finalist',
  //     description: 'Selected as finalist in Smart India Hackathon 2025 for innovative safety solution'
  //   },
  //   {
  //     icon: '🔬',
  //     title: 'Patent Pending',
  //     description: 'Proprietary AI algorithms and IoT integration methods under patent protection'
  //   },
  //   {
  //     icon: '🌟',
  //     title: 'Industry Recognition',
  //     description: 'Featured in automotive safety publications and industry conferences'
  //   },
  //   {
  //     icon: '📈',
  //     title: 'Growing Adoption',
  //     description: 'Deployed in 50+ vehicles across pilot programs with 99.9% success rate'
  //   },
  // ];

  const highlights = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Detection and response in under 500ms with real-time processing'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'End-to-end encryption and privacy protection'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Comprehensive dashboard with live monitoring and detailed reporting'
    },
    {
      icon: '🔧',
      title: 'Easy Integration',
      description: 'Plug-and-play installation with minimal vehicle modifications'
    },
    {
      icon: '🌐',
      title: 'Cloud Connected',
      description: 'Seamless data synchronization across all devices and locations'
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      description: 'Responsive dashboard accessible from any device, anywhere'
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      {/* Enhanced Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto text-center mb-24"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-block mb-6"
        >
          <img src={logo} alt="AlcoZero Logo" className="h-35 w-35" />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          About <span className="text-(--primary-blue)">AlcoZero</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
          Revolutionizing vehicle safety through intelligent alcohol detection technology.
          Our AI-powered system prevents drunk driving accidents before they happen.
        </p>

      </motion.div>

      {/* Mission & Vision - Side by side */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto mb-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-10">
            <h2 className="text-3xl font-bold text-(--primary-blue) mb-4">Our Mission</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              To eliminate drunk driving accidents by implementing cutting-edge IoT technology that
              seamlessly integrates with vehicles, providing automatic protection without driver
              intervention. Our system combines hardware sensors with cloud computing to create a
              comprehensive safety solution.
            </p>
          </div>

          <div className="glass-card p-10">
            <h2 className="text-3xl font-bold text-(--accent-blue) mb-4">Our Vision</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              A world where technology proactively protects lives, where vehicles become intelligent
              guardians that prevent accidents before they occur, and where safety is seamlessly
              integrated into every journey.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-(--success-green) mr-3">🌍</span>
                <span className="text-gray-300">Global standard for vehicle safety</span>
              </div>
              <div className="flex items-center">
                <span className="text-(--success-green) mr-3">🤝</span>
                <span className="text-gray-300">Partnerships with automotive industry</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Problem Statement */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto mb-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            The <span className="text-red-400">Critical</span> Problem
          </h2>

        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="glass-card p-6 border-l-4 border-red-500">
              <h3 className="text-xl font-bold text-white mb-3">Global Crisis Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="text-3xl font-bold text-red-400">1.2M</div>
                  <div className="text-sm text-gray-400">Deaths Worldwide</div>
                </div>
                <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <div className="text-3xl font-bold text-orange-400">50M</div>
                  <div className="text-sm text-gray-400">Injuries Annually</div>
                </div>
                <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="text-3xl font-bold text-yellow-400">1.6%</div>
                  <div className="text-sm text-gray-400">Percentage increase Annually</div>
                </div>
                <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="text-3xl font-bold text-purple-400">32%</div>
                  <div className="text-sm text-gray-400">Drinking Driving</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Why Traditional Solutions Fail</h3>
              <ul className="space-y-3">
                {[
                  'Human judgment is unreliable under influence',
        
                  'No prevention, even after detection',
                  'High cost of implementation and maintenance'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-red-400 mr-3">✗</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold text-(--success-green) mb-6">AlcoZero's Solution</h3>
            <div className="space-y-4">
              {[
                'Automated detection without human intervention',
                'In case of detection the car won\'t start',
                'Real-time alerts and monitoring',
                'Scalable across entire vehicle fleets',
                'Cost-effective with rapid ROI'
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center p-3 bg-(--success-green)/10 rounded-lg border border-(--success-green)/20"
                >
                  <span className="text-(--success-green) mr-3 text-xl">✓</span>
                  <span className="text-gray-300 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* How It Works Timeline */}


      {/* Feature Highlights */}
      <div className="max-w-7xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">System Highlights</h2>
          <p className="text-gray-400 text-lg">
            What makes AlcoZero the best choice for vehicle safety
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 hover:shadow-xl hover:shadow-(--primary-blue)/20 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{highlight.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">
                {highlight.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {highlight.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Technical Stack */}

      {/* Stats Section */}

      {/* Achievements Section */}

      {/* Team Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto mb-20"
      >
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">Meet Our Team</h2>
          <p className="text-gray-400 text-lg">
            Cross-functional builders with focus on reliability and UX
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300"
            >
              <img
                src={member.photo}
                alt={member.name}
                className="w-30 h-30 rounded-full object-cover object-top mx-auto mb-4 border-2 border-(--primary-blue)/30"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
              <p className="text-(--primary-blue) font-medium mb-3">{member.role}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Roadmap Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto mb-20"
      >
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">Development Roadmap</h2>
          <p className="text-gray-400 text-lg">
            Our journey from prototype to global deployment
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-linear-to-b from-(--primary-blue) to-(--accent-blue) rounded-full hidden md:block"></div>

          <div className="space-y-12">
            {[
              {
                phase: 'Phase 1: Prototype',
                status: 'Completed',
                date: 'Q4 2024',
                items: ['Core detection algorithm', 'ESP32 integration', 'Firebase backend', 'Basic dashboard'],
                color: 'success-green'
              },
              {
                phase: 'Phase 2: Enhancement',
                status: 'In Progress',
                date: 'Q1 2025',
                items: ['Advanced AI features', 'Mobile app', 'Multi-device support', 'Enhanced analytics'],
                color: 'primary-blue'
              },
              {
                phase: 'Phase 3: Commercial',
                status: 'Upcoming',
                date: 'Q2-Q3 2025',
                items: ['Fleet management', 'OEM partnerships', 'International deployment', 'Regulatory approval'],
                color: 'accent-blue'
              },
              {
                phase: 'Phase 4: Scale',
                status: 'Future',
                date: '2026+',
                items: ['Global expansion', 'Advanced AI models', 'Autonomous integration', 'Industry standard'],
                color: 'secondary-blue'
              }
            ].map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="md:w-1/2 mb-6 md:mb-0 md:px-8">
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{phase.phase}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${phase.status === 'Completed' ? 'bg-(--success-green)/20 text-(--success-green)' :
                          phase.status === 'In Progress' ? 'bg-(--primary-blue)/20 text-(--primary-blue)' :
                            'bg-gray-600/20 text-gray-400'
                        }`}>
                        {phase.status}
                      </span>
                    </div>
                    <p className="text-(--primary-blue) font-medium mb-3">{phase.date}</p>
                    <ul className="space-y-2">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center text-gray-300 text-sm">
                          <span className="text-(--success-green) mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="hidden md:block w-4 h-4 bg-(--primary-blue) rounded-full border-4 border-dark-bg relative z-10"></div>
                <div className="md:w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Contact CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto mb-20"
      >
        <div className="glass-card p-12 text-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-20 h-20 border border-(--primary-blue) rounded-full"></div>
            <div className="absolute top-20 right-20 w-16 h-16 border border-(--accent-blue) rounded-full"></div>
            <div className="absolute bottom-10 left-1/4 w-12 h-12 border border-(--success-green) rounded-full"></div>
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block p-4 bg-linear-to-r from-(--primary-blue)/10 to-(--accent-blue)/10 rounded-full mb-6"
            >
              <div className="text-5xl">🚀</div>
            </motion.div>

            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to <span className="text-(--primary-blue)">Transform</span> Vehicle Safety?
            </h2>

            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join the revolution in automotive safety. Whether you're a fleet operator, automotive manufacturer,
              or safety-conscious organization, AlcoZero provides the technology to prevent drunk driving accidents
              and save lives.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-(--success-green) mb-2">Free</div>
                <div className="text-gray-400">Pilot Program</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-(--primary-blue) mb-2">24/7</div>
                <div className="text-gray-400">Technical Support</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-(--accent-blue) mb-2">30-Day</div>
                <div className="text-gray-400">Money-Back Guarantee</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-linear-to-r from-(--primary-blue) to-(--accent-blue) text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-(--primary-blue)/25 transition-all duration-300"
              >
                Start Free Pilot
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-(--primary-blue) text-(--primary-blue) font-semibold rounded-lg hover:bg-(--primary-blue)/10 transition-all duration-300"
              >
                Schedule Demo
              </motion.button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Join 500+ organizations already protecting lives with AlcoZero
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer Quote */}

    </div>
  );
};

export default About;
