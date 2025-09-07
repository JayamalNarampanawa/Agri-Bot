import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Lightbulb } from 'lucide-react';
import { database } from '../firebase/config';
import { ref, onValue, off } from 'firebase/database';

const LightSensor = () => {
  const [isDark, setIsDark] = useState(null);

  useEffect(() => {
    const lightRef = ref(database, "/light/state");
    
    const unsubscribe = onValue(lightRef, (snapshot) => {
      const lightState = snapshot.val();
      console.log('Light sensor data received:', lightState); // Debug log
      // Convert "DARK"/"BRIGHT" to boolean for compatibility
      setIsDark(lightState === "DARK");
    }, (error) => {
      console.error('Error reading light sensor data:', error);
      setIsDark(null);
    });

    return () => off(lightRef, 'value', unsubscribe);
  }, []);

  const getLightStatus = () => {
    if (isDark === null) return { text: 'Unknown', icon: 'fas fa-question', color: 'gray' };
    return isDark 
      ? { text: 'Dark', icon: 'fas fa-moon', color: 'purple' }
      : { text: 'Bright', icon: 'fas fa-sun', color: 'yellow' };
  };

  const lightStatus = getLightStatus();

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      viewport={{ once: true }}
      className="group backdrop-blur-xl bg-gradient-to-br from-dark-800/80 to-dark-700/60 border border-primary-500/20 rounded-3xl p-8 shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:scale-[1.02]" 
      id="light"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
          <i className="fas fa-lightbulb text-4xl text-yellow-400" />
          <span>Light Sensor</span>
        </h2>
        <motion.div 
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${
            isDark === null ? 'bg-gray-500/20 text-gray-400' :
            isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-yellow-500/20 text-yellow-400'
          }`}
        >
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-2 h-2 rounded-full ${
              isDark === null ? 'bg-gray-400' :
              isDark ? 'bg-purple-400' : 'bg-yellow-400'
            }`}
          />
          <span>Monitoring</span>
        </motion.div>
      </div>
      
      <div className="text-center">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className={`p-8 bg-gradient-to-br rounded-2xl border relative overflow-hidden ${
            isDark === null ? 'from-gray-500/20 to-gray-600/20 border-gray-500/30' :
            isDark ? 'from-purple-500/20 to-indigo-500/20 border-purple-500/30' : 
            'from-yellow-500/20 to-amber-500/20 border-yellow-500/30'
          }`}
        >
          {/* Animated background */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute inset-0 rounded-2xl ${
              isDark === null ? 'bg-gray-500/10' :
              isDark ? 'bg-purple-500/10' : 'bg-yellow-500/10'
            }`}
          />

          {/* Main light indicator */}
          <motion.i 
            key={isDark}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className={`${lightStatus.icon} text-8xl mb-6 relative z-10 ${
              isDark === null ? 'text-gray-400' :
              isDark ? 'text-purple-400' : 'text-yellow-400'
            }`}
          />
          
          {/* Status text */}
          <motion.div 
            key={lightStatus.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-3xl font-bold mb-3 flex items-center justify-center space-x-3 relative z-10 ${
              isDark === null ? 'text-gray-400' :
              isDark ? 'text-purple-400' : 'text-yellow-400'
            }`}
          >
            {isDark === null ? (
              <Lightbulb className="w-8 h-8" />
            ) : isDark ? (
              <Moon className="w-8 h-8" />
            ) : (
              <Sun className="w-8 h-8" />
            )}
            <span>{lightStatus.text}</span>
          </motion.div>
          
          <div className="text-sm text-gray-400 relative z-10 font-medium">
            Current Light Condition
          </div>



          {/* Stars animation for dark condition */}
          {isDark && (
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full"
                  style={{
                    left: `${20 + (i * 12)}%`,
                    top: `${15 + (i % 2) * 20}%`
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Additional info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
            isDark === null ? 'bg-gray-500/20 text-gray-400' :
            isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isDark === null ? 'bg-gray-400' :
              isDark ? 'bg-purple-400 animate-pulse' : 'bg-yellow-400'
            }`}></div>
            <span>
              {isDark === null ? 'Sensor Offline' :
               isDark ? 'Night Mode Active' : 'Day Mode Active'}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default LightSensor;