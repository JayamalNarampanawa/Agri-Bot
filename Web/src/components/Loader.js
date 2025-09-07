import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="fixed inset-0 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center z-50"
    >
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div 
          className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-400 rounded-full animate-spin" 
          style={{ animationDelay: '-0.15s' }}
        ></div>
      </div>
    </motion.div>
  );
};

export default Loader;