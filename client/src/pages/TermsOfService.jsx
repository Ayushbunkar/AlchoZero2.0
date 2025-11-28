import React from 'react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="section-title mb-6">Terms of Service</h1>
        <p className="text-gray-400 mb-6">
          These Terms of Service govern your use of AlcoZero's products and services.
          By using our service you agree to these terms. Please read them carefully.
        </p>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-primary mb-3">Usage Rules</h2>
          <p className="text-gray-400">Key points and legal disclaimers for users.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsOfService;
