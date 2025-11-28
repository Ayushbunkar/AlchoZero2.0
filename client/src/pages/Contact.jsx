import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram, Moon } from 'lucide-react';
import { saveContact } from '../firebaseConfig';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await saveContact(formData);
      
      if (result.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(result.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      value: 'infoalcozero@gmail.com',
      link: 'mailto:infoalcozero@gmail.com',
    },
    {
      icon: '📞',
      title: 'Phone',
      value: '+91 0755 618 5300',
      link: 'tel:+91 07556185300',
    },
    {
      icon: '📍',
      title: 'Address',
      value: 'Raisen Rd, nr. Hanuman Mandir, Kalchuri Nagar, Bhopal, Madhya Pradesh 462022',
      link: 'https://www.google.com/maps/dir//LNCT+Group+of+Colleges,+Raisen+Rd,+nr.+Hanuman+Mandir,+Kalchuri+Nagar,+Bhopal,+Madhya+Pradesh+462022/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x397c4244c97d6f29:0x72457a4e85fd116c?sa=X&ved=1t:57443&ictx=111',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto text-center mb-16"
      >
        <h1 className="section-title mb-6">Get In Touch</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Have questions about AlcoZero? We're here to help. Send us a message 
          and we'll respond as soon as possible.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8 h-full flex flex-col"
          >
            <h2 className="text-2xl font-bold text-primary mb-6">Send us a Message</h2>
            
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-cyan-500/20 border border-cyan-500/50 rounded-lg"
              >
                <p className="text-cyan-400 text-sm">
                  ✓ Message sent successfully! We'll get back to you soon.
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
              >
                <p className="text-red-400 text-sm">✗ {error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-bg border border-(--glass-border) rounded-lg text-primary placeholder-gray-500 focus:outline-none focus-border-neon-blue transition-colors"
                  placeholder="Full Name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="email@example.com"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="+91 12345 67890 "
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-dark-bg border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors resize-none"
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="mt-4">
                <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full py-4 rounded-lg font-semibold text-primary transition-all duration-300 ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-linear-to-r from-(--primary-blue) to-(--accent-blue) hover:shadow-lg hover:shadow-(--primary-blue)/50'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Moon className="-ml-1 mr-3 h-5 w-5 text-white" />
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className="text-3xl mr-4">{info.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-primary mb-1">
                        {info.title}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-neon-blue transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-400">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">Quick Help</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-neon-blue mb-2">
                    How does installation work?
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Our team provides complete installation support with step-by-step 
                    guidance. The process typically takes 2-3 hours.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neon-blue mb-2">
                    Is technical support available?
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Yes! We offer 24/7 technical support via email and phone for all 
                    AlchoZero users.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neon-blue mb-2">
                    What's the warranty period?
                  </h3>
                  <p className="text-gray-400 text-sm">
                    All hardware components come with a 2-year warranty, and software 
                    updates are free for life.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">Follow Us</h2>
              <div className="flex space-x-4">
                {[
                  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/LNCTGroupOfCollege/' },
                  { name: 'Twitter', icon: Twitter, href: 'https://x.com/lnct_group' },
                  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/lnct-group-of-colleges-bhopal/?originalSubdomain=in' },
                  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/lnct_group_of_colleges/' },
                ].map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full bg-white/6 flex items-center justify-center hover:bg-neon-blue/20 transition-colors"
                      title={social.name}
                      aria-label={social.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="w-5 h-5 text-gray-200" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
