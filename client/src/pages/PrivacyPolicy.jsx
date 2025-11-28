import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="section-title mb-6">Privacy Policy</h1>
        <p className="text-gray-400 mb-6">
          This Privacy Policy explains how AlcoZero collects, uses, and discloses
          information when you use our services. We take your privacy seriously
          and aim to be transparent about data practices.
        </p>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-primary mb-3">Data We Collect</h2>
          <p className="text-gray-400">A short summary of what data we collect and why.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
