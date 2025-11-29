import React from 'react';
import { motion } from 'framer-motion';

const FAQ = () => {
  const faqs = [
    { q: 'How do I install AlcoZero?', a: 'Follow the installation guide in the Help Center.' },
    { q: 'What happens when alcohol is detected?', a: 'The system locks the engine and sends alerts to admins.' },
    { q: 'Is my data private?', a: 'Yes — see our Privacy Policy for details.' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="section-title mb-6">FAQ</h1>
        <p className="text-gray-400 mb-6">Common questions and answers about AlcoZero.</p>

        //hgf

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="glass-card p-4">
              <h3 className="text-primary font-semibold">{f.q}</h3>
              <p className="text-gray-400 mt-2">{f.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FAQ;
