import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Code, Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="mt-20 py-12 bg-gradient-to-r from-dark-900 to-dark-800 border-t border-primary-500/20"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Main footer content */}
        <div className="text-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <div className="relative">
              <img 
                src="/assets/images/agri-bot_logo.png" 
                alt="Agri-Bot Logo" 
                className="w-12 h-12 rounded-full border-2 border-primary-500 shadow-lg" 
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-1 bg-primary-500/20 rounded-full blur"
              />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Agri-Bot
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto"
          >
            Empowering sustainable agriculture through innovative IoT solutions and real-time monitoring systems.
          </motion.p>

          {/* Features highlight */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mb-8"
          >
            {[
              { icon: Leaf, text: "Sustainable Farming", color: "text-green-400" },
              { icon: Code, text: "Smart Technology", color: "text-blue-400" },
              { icon: Heart, text: "Made with Love", color: "text-red-400" }
            ].map((item, index) => (
              <motion.div
                key={item.text}
                whileHover={{ scale: 1.1, y: -2 }}
                className="flex items-center space-x-2 px-4 py-2 bg-dark-800/50 rounded-full border border-gray-600"
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-gray-300 text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-gray-400 text-lg flex items-center space-x-2"
            >
              <span>&copy; 2025 Agri-Bot Team NIBM. All rights reserved.</span>
            </motion.p>

            {/* Tech stack */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center space-x-4 text-sm text-gray-500"
            >
              <span>Built with</span>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">React</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">Firebase</span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">IoT</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Animated dots */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-6 flex justify-center space-x-6"
        >
          {[0, 0.2, 0.4].map((delay, index) => (
            <motion.div
              key={index}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
              }}
              className={`w-2 h-2 ${index === 0 ? 'bg-primary-500' : index === 1 ? 'bg-primary-400' : 'bg-primary-300'} rounded-full`}
            />
          ))}
        </motion.div>

        {/* Additional info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full">
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
            <span className="text-primary-400 text-sm font-medium">
              Transforming Agriculture, One Farm at a Time
            </span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;