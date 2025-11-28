import React from 'react';
import { motion } from 'framer-motion';

const HelpCenter = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="section-title mb-6">Help Center</h1>
        <p className="text-gray-400 mb-6">
          Welcome to the Help Center. Find guides, troubleshooting steps, and answers
          to common questions about AlcoZero. If you don't find what you're looking for,
          please contact our support team from the Contact page.
        </p>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-primary mb-3">Getting Started</h2>
          <p className="text-gray-400">Quick setup steps to get your device up and running.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpCenter;
