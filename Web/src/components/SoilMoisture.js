import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';

const SoilMoisture = () => {
  const [moistureValue, setMoistureValue] = useState('--');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.db) {
      const moistureRef = window.db.ref("/moisture");
      moistureRef.on("value", snapshot => {
        const value = snapshot.val();
        setMoistureValue(value !== null ? value : '--');
      });

      return () => moistureRef.off();
    }
  }, []);

  const getMoistureColor = (value) => {
    if (value === '--') return 'from-gray-500 to-gray-600';
    if (value < 30) return 'from-red-500 to-red-600';
    if (value < 60) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  const getMoisturePercentage = (value) => {
    return value === '--' ? 0 : Math.min(100, Math.max(0, value));
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="group backdrop-blur-xl bg-gradient-to-br from-dark-800/80 to-dark-700/60 border border-primary-500/20 rounded-3xl p-8 shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:scale-[1.02]" 
      id="soil"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
          <motion.i 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="fas fa-seedling text-4xl text-primary-400"
          />
          <span>Soil Moisture</span>
        </h2>
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
          <span>Live Data</span>
        </motion.div>
      </div>
      
      <div className="flex items-center justify-center">
        <div className="relative">
          <motion.div 
            className="w-48 h-48 rounded-full bg-gradient-to-br from-dark-700 to-dark-800 shadow-inner flex items-center justify-center relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {/* Moisture level indicator */}
            <motion.div
              className={`absolute inset-0 rounded-full bg-gradient-to-t ${getMoistureColor(moistureValue)} opacity-20`}
              initial={{ scale: 0 }}
              animate={{ 
                scale: getMoisturePercentage(moistureValue) / 100,
                opacity: moistureValue === '--' ? 0 : 0.3
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            
            <div className="w-40 h-40 rounded-full bg-dark-900 flex items-center justify-center shadow-2xl relative z-10">
              <div className="text-center">
                <motion.div 
                  key={moistureValue}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl font-bold text-primary-400 flex items-center justify-center space-x-1"
                >
                  <Droplets className="w-8 h-8" />
                  <span>{moistureValue}%</span>
                </motion.div>
                <div className="text-sm text-gray-400 mt-1">Moisture Level</div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-primary-400/20 rounded-full blur-xl"
          />
        </div>
      </div>

      {/* Status indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
          moistureValue === '--' ? 'bg-gray-500/20 text-gray-400' :
          moistureValue < 30 ? 'bg-red-500/20 text-red-400' :
          moistureValue < 60 ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-green-500/20 text-green-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            moistureValue === '--' ? 'bg-gray-400' :
            moistureValue < 30 ? 'bg-red-400 animate-pulse' :
            moistureValue < 60 ? 'bg-yellow-400' :
            'bg-green-400'
          }`}></div>
          <span>
            {moistureValue === '--' ? 'No Data' :
             moistureValue < 30 ? 'Dry - Needs Water' :
             moistureValue < 60 ? 'Moderate' :
             'Well Hydrated'}
          </span>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default SoilMoisture;