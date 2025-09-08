import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets } from 'lucide-react';
import { database } from '../firebase/config';
import { ref, onValue, off } from 'firebase/database';

const Weather = () => {
  const [temperature, setTemperature] = useState('--');
  const [humidity, setHumidity] = useState('--');

  useEffect(() => {
    // Note: Weather data is not currently being sent by Arduino
    // This component shows placeholder data until weather sensors are added
    console.log('Weather component loaded - no data source available');
    setTemperature('--');
    setHumidity('--');
  }, []);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      viewport={{ once: true }}
      className="group backdrop-blur-xl bg-gradient-to-br from-dark-800/80 to-dark-700/60 border border-primary-500/20 rounded-3xl p-8 shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:scale-[1.02]" 
      id="weather"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
          <motion.i 
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="fas fa-cloud-sun text-4xl text-yellow-400"
          />
          <span>Weather Station</span>
        </h2>
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span>Live Weather</span>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temperature Card */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
          className="text-center p-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl border border-orange-500/30 relative overflow-hidden"
        >
          <motion.i
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="fas fa-thermometer-half text-5xl mb-4 text-orange-400"
          />
          
          <motion.div 
            key={temperature}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-orange-400 mb-2 flex items-center justify-center space-x-2"
          >
            <Thermometer className="w-6 h-6" />
            <span>{temperature}°C</span>
          </motion.div>
          
          <div className="text-sm text-gray-400 font-medium">Temperature</div>
          
          {/* Temperature status */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3"
          >
            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
              temperature === '--' ? 'bg-gray-500/20 text-gray-400' :
              temperature < 15 ? 'bg-blue-500/20 text-blue-400' :
              temperature > 30 ? 'bg-red-500/20 text-red-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                temperature === '--' ? 'bg-gray-400' :
                temperature < 15 ? 'bg-blue-400' :
                temperature > 30 ? 'bg-red-400' :
                'bg-green-400'
              }`}></div>
              <span>
                {temperature === '--' ? 'No Data' :
                 temperature < 15 ? 'Cold' :
                 temperature > 30 ? 'Hot' :
                 'Optimal'}
              </span>
            </div>
          </motion.div>

          {/* Background animation */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl"
          />
        </motion.div>

        {/* Humidity Card */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
          className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30 relative overflow-hidden"
        >
          <motion.i
            animate={{ 
              y: [0, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="fas fa-wind text-5xl mb-4 text-blue-400"
          />
          
          <motion.div 
            key={humidity}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-blue-400 mb-2 flex items-center justify-center space-x-2"
          >
            <Droplets className="w-6 h-6" />
            <span>{humidity}%</span>
          </motion.div>
          
          <div className="text-sm text-gray-400 font-medium">Humidity</div>
          
          {/* Humidity status */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3"
          >
            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
              humidity === '--' ? 'bg-gray-500/20 text-gray-400' :
              humidity < 40 ? 'bg-yellow-500/20 text-yellow-400' :
              humidity > 70 ? 'bg-blue-500/20 text-blue-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                humidity === '--' ? 'bg-gray-400' :
                humidity < 40 ? 'bg-yellow-400' :
                humidity > 70 ? 'bg-blue-400' :
                'bg-green-400'
              }`}></div>
              <span>
                {humidity === '--' ? 'No Data' :
                 humidity < 40 ? 'Dry' :
                 humidity > 70 ? 'Humid' :
                 'Comfortable'}
              </span>
            </div>
          </motion.div>

          {/* Background animation */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
            className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Weather;