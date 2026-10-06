import React from 'react';
import { motion } from 'framer-motion';

// Shared section title: big mono heading with an animated underline
const SectionHeading = ({ title, align = 'left' }) => {
  const centered = align === 'center';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-16 flex flex-col ${centered ? 'items-center text-center' : 'items-start'}`}
    >
      <h2 className="text-4xl md:text-6xl font-mono font-bold uppercase">
        {title}
      </h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`h-1 w-24 bg-black dark:bg-white mt-6 ${centered ? 'origin-center' : 'origin-left'}`}
      />
    </motion.div>
  );
};

export default SectionHeading;
