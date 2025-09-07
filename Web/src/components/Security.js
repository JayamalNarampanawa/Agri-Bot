import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Clock, AlertTriangle } from 'lucide-react';
import { database } from '../firebase/config';
import { ref, onValue, off } from 'firebase/database';

const Security = () => {
  const [lastMotion, setLastMotion] = useState('--');

  useEffect(() => {
    const motionRef = ref(database, "/security/last_motion_time");
    
    const unsubscribe = onValue(motionRef, (snapshot) => {
      const motionTime = snapshot.val();
      console.log('Security motion data received:', motionTime); // Debug log
      setLastMotion(motionTime || '--');
    }, (error) => {
      console.error('Error reading security motion data:', error);
      setLastMotion('--');
    });

    return () => off(motionRef, 'value', unsubscribe);
  }, []);

  const isRecentMotion = () => {
    if (lastMotion === '--') return false;
    // You can add logic here to check if motion was recent
    // For now, we'll assume any motion data means recent activity
    return lastMotion !== '--';
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.0 }}
      viewport={{ once: true }}
      className="group backdrop-blur-xl bg-gradient-to-br from-dark-800/80 to-dark-700/60 border border-primary-500/20 rounded-3xl p-8 shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:scale-[1.02]" 
      id="security"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
          <motion.i 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="fas fa-shield-alt text-4xl text-purple-400"
          />
          <span>Security System</span>
        </h2>
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium flex items-center space-x-2"
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 bg-green-400 rounded-full"
          />
          <Shield className="w-4 h-4" />
          <span>Active</span>
        </motion.div>
      </div>
      
      <div className="space-y-6">
        {/* Main security display */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-center p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 relative overflow-hidden"
        >
          {/* Animated background */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl"
          />

          {/* Security eye animation */}
          <motion.i 
            animate={{ 
              scale: [1, 1.1, 1],
              rotateY: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="fas fa-eye text-8xl mb-6 relative z-10 text-purple-400"
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Eye className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-bold text-purple-400">Motion Detection</h3>
            </div>
            
            <div className="text-lg text-gray-300 mb-4">Last Motion Detected:</div>
            
            <motion.div 
              key={lastMotion}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-purple-400 mb-4 flex items-center justify-center space-x-2"
            >
              <Clock className="w-6 h-6" />
              <span>{lastMotion}</span>
            </motion.div>

            {/* Status indicator */}
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
              lastMotion === '--' ? 'bg-gray-500/20 text-gray-400' :
              isRecentMotion() ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                lastMotion === '--' ? 'bg-gray-400' :
                isRecentMotion() ? 'bg-orange-400 animate-pulse' : 'bg-green-400'
              }`}></div>
              <span>
                {lastMotion === '--' ? 'No Motion Data' :
                 isRecentMotion() ? 'Motion Detected' : 'All Clear'}
              </span>
            </div>
          </motion.div>

          {/* Scanning animation */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center opacity-20"
          >
            <div className="w-32 h-32 border-2 border-purple-400 rounded-full border-dashed"></div>
          </motion.div>
        </motion.div>

        {/* Security features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-dark-800/50 rounded-xl border border-gray-600 text-center"
          >
            <motion.i
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              className="fas fa-search text-2xl mb-2 text-blue-400"
            />
            <div className="text-sm font-medium text-gray-300">Motion Tracking</div>
            <div className="text-xs text-gray-500 mt-1">Real-time Detection</div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-dark-800/50 rounded-xl border border-gray-600 text-center"
          >
            <motion.i
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="fas fa-mobile-alt text-2xl mb-2 text-green-400"
            />
            <div className="text-sm font-medium text-gray-300">Smart Alerts</div>
            <div className="text-xs text-gray-500 mt-1">Instant Notifications</div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-dark-800/50 rounded-xl border border-gray-600 text-center"
          >
            <motion.i
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="fas fa-lock text-2xl mb-2 text-purple-400"
            />
            <div className="text-sm font-medium text-gray-300">Secure Access</div>
            <div className="text-xs text-gray-500 mt-1">Protected System</div>
          </motion.div>
        </div>

        {/* Alert section */}
        {isRecentMotion() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center space-x-3"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </motion.div>
            <div>
              <div className="font-medium text-orange-400">Recent Activity Detected</div>
              <div className="text-sm text-gray-400">Security system is monitoring the area</div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default Security;