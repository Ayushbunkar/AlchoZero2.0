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
      role: 'Project Lead and Hardware Engineer',
      photo: '/images/adityapatel.png',
      bio: 'Leads project management, coordination, and overall vision.'
    },
    {
      name: 'Ayush Bunkar',
      role: 'Web Developer & DevOps Lead',
      photo: '/images/ayush.png',
      bio: 'Responsible for building scalable web applications, managing deployment pipelines, automation, and ensuring smooth CI/CD operations.'
    },
    {
      name: 'Riya Palod',
      role: 'UI/UX Designer, Research Specialist & Presenter',
      photo: '/images/riya.jpg',
      bio: 'Responsible for user experience design, product research, brand design, and presenting concepts effectively.'
    },
    {
      name: 'Aditya Singh Rathore',
      role: 'Market Research Analyst & QA / Bug Hunter',
      photo: '/images/adityarathore.jpg',
      bio: 'Responsible for user research, market analysis, product testing, bug identification, and performance evaluation'
    },
    {
      name: 'Priyanshu Lohani',
      role: 'App Developer & Machine Learning Engineer',
      photo: '/images/priyanshu.png',
      bio: 'Responsible for building high-quality Android/iOS apps and integrating intelligent ML-driven features.'
    },
    {
      name: 'Shikhar Mishra',
      role: 'Hardware Engineer & Cloud Infrastructure Specialist',
      photo: '/images/shikhar.png',
      bio: 'Responsible for embedded systems, sensor integration, IoT hardware, and cloud infrastructure design.'
    },
  ];

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
          About <span className="text-neon-blue">AlcoZero</span>
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
            <h2 className="text-3xl font-bold text-neon-blue mb-4">Our Mission</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              To eliminate drunk driving accidents by implementing cutting-edge IoT technology that
              seamlessly integrates with vehicles, providing automatic protection without driver
              intervention. Our system combines hardware sensors with cloud computing to create a
              comprehensive safety solution.
            </p>
          </div>

          <div className="glass-card p-10">
            <h2 className="text-3xl font-bold text-accent-blue mb-4">Our Vision</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              A world where technology proactively protects lives, where vehicles become intelligent
              guardians that prevent accidents before they occur, and where safety is seamlessly
              integrated into every journey.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-accent-yellow mr-3">🌍</span>
                <span className="text-gray-300">Global standard for vehicle safety</span>
              </div>
              <div className="flex items-center">
                <span className="text-accent-yellow mr-3">🤝</span>
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
            <h3 className="text-2xl font-bold text-accent-yellow mb-6">AlcoZero's Solution</h3>
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
                  className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <span className="text-accent-yellow mr-3 text-xl">✓</span>
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
            <h2 className="section-title mb-4 text-neon-blue">System Highlights</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
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
              className="glass-card p-6 hover:shadow-xl transition-all duration-300"
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
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden mx-auto mb-4 border-2 border-white/10">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
              <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
              <p className="text-neon-blue font-medium mb-3">{member.role}</p>
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
                phase: 'Phase 1:Prototype Build (Aug–Sep 2025)',
                status: 'Completed',
                date: 'Aug – Sep 2025',
                items: ['Core idea and requirements', 'First working prototype', 'Internal hackathon submission'],
                color: 'success-green'
              },
              {
                phase: 'Phase 2: SIH Grand Finale Development (Oct–Dec 2025)',
                status: 'In Progress',
                date: 'Oct – Dec 2025',
                items: ['Shortlisting & mentoring', 'Feature upgrades and AI improvements', 'App integration and testing', 'Prepare final SIH model'],
                color: 'primary-blue'
              },
              {
                phase: 'Phase 3: Post-SIH Product Development (Early 2026)',
                status: 'Upcoming',
                date: 'Early 2026',
                items: ['Commercial-grade hardware design', 'Security & compliance upgrades', 'OEM and API integrations'],
                color: 'accent-blue'
              },
              {
                phase: 'Phase 4: Deployment & Scale (2026+)',
                status: 'Future',
                date: '2026+',
                items: ['Pilot rollouts', 'Nationwide deployment', 'Global expansion', 'Ongoing security & compliance improvements'],
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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${phase.status === 'Completed' ? 'bg-white/5 text-accent-yellow' :
                          phase.status === 'In Progress' ? 'bg-white/5 text-neon-blue' :
                            'bg-gray-600/20 text-gray-400'
                        }`}>
                        {phase.status}
                      </span>
                    </div>
                    <p className="text-neon-blue font-medium mb-3">{phase.date}</p>
                    <ul className="space-y-2">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center text-gray-300 text-sm">
                          <span className="text-accent-yellow mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="hidden md:block w-4 h-4 bg-white/10 rounded-full border-4 border-dark-bg relative z-10"></div>
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
            <div className="absolute top-10 left-10 w-20 h-20 border border-white/10 rounded-full"></div>
            <div className="absolute top-20 right-20 w-16 h-16 border border-white/10 rounded-full"></div>
            <div className="absolute bottom-10 left-1/4 w-12 h-12 border border-white/10 rounded-full"></div>
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block p-4 bg-linear-to-r from-white/5 to-white/5 rounded-full mb-6"
            >
              <div className="text-5xl">🚀</div>
            </motion.div>

            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to <span className="text-neon-blue">Transform</span> Vehicle Safety?
            </h2>

            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join the revolution in automotive safety. Whether you're a fleet operator, automotive manufacturer,
              or safety-conscious organization, AlcoZero provides the technology to prevent drunk driving accidents
              and save lives.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-accent-yellow mb-2">Free</div>
                <div className="text-gray-400">Pilot Program</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-neon-blue mb-2">24/7</div>
                <div className="text-gray-400">Technical Support</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-accent-blue mb-2">30-Day</div>
                <div className="text-gray-400">Money-Back Guarantee</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-linear-to-r from-white/5 to-white/5 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Start Free Pilot
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white/10 text-neon-blue font-semibold rounded-lg hover:bg-white/5 transition-all duration-300"
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
