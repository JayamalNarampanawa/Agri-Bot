import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" id="header">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900/90 via-dark-800/80 to-primary-900/20"></div>
      <div className="absolute inset-0 bg-[url('/assets/images/bg.jpeg')] bg-cover bg-center opacity-30"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl"
        />
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="backdrop-blur-xl bg-white/5 border border-primary-500/20 rounded-3xl p-12 shadow-2xl"
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent mb-6"
          >
            Agri-Bot Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-xl md:text-2xl text-gray-300 font-medium"
          >
            Real-time smart farming control system
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mt-8 flex justify-center space-x-2"
          >
            {[0, 0.1, 0.2].map((delay, index) => (
              <motion.div
                key={index}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeInOut"
                }}
                className={`w-3 h-3 ${index === 0 ? 'bg-primary-500' : index === 1 ? 'bg-primary-400' : 'bg-primary-300'} rounded-full`}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
};

export default Hero;