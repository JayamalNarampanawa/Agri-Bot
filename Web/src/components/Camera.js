import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera as CameraIcon, Wifi, WifiOff, RefreshCw } from 'lucide-react';

const Camera = () => {
  const [imageError, setImageError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setImageError(false);
    // Reset refresh state after animation
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      viewport={{ once: true }}
      className="group backdrop-blur-xl bg-gradient-to-br from-dark-800/80 to-dark-700/60 border border-primary-500/20 rounded-3xl p-8 shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:scale-[1.02]" 
      id="camera"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
          <motion.i 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="fas fa-video text-4xl text-red-400"
          />
          <span>Live Camera Feed</span>
        </h2>
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={handleRefresh}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-primary-500/20 text-primary-400 rounded-full hover:bg-primary-500/30 transition-colors duration-300"
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: 1, ease: "linear" }}
            >
              <RefreshCw className="w-5 h-5" />
            </motion.div>
          </motion.button>
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
              imageError ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
            }`}
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className={`w-2 h-2 rounded-full ${
                imageError ? 'bg-red-400' : 'bg-green-400'
              }`}
            />
            {imageError ? (
              <>
                <WifiOff className="w-4 h-4" />
                <span>OFFLINE</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4" />
                <span>LIVE</span>
              </>
            )}
          </motion.div>
        </div>
      </div>
      
      <div className="relative overflow-hidden rounded-2xl border border-gray-600 bg-dark-900">
        {!imageError ? (
          <>
            <motion.img 
              key={isRefreshing ? Date.now() : 'camera'}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src="http://<ESP32-CAM-IP>/stream" 
              alt="Camera Stream" 
              className="w-full h-auto min-h-[300px] object-cover"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 to-transparent pointer-events-none"></div>
            
            {/* Live indicator overlay */}
            <motion.div 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-4 right-4 bg-red-500/90 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-2"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </motion.div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[300px] text-center p-8"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl mb-6 text-gray-500"
            >
              <CameraIcon className="w-16 h-16 mx-auto" />
            </motion.div>
            
            <h3 className="text-xl font-bold text-gray-400 mb-2">Camera Offline</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Unable to connect to the camera feed. Please check your ESP32-CAM connection and network settings.
            </p>
            
            <motion.button
              onClick={handleRefresh}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-medium shadow-lg flex items-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Retry Connection</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Camera controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex justify-center space-x-4"
      >
        <div className="flex items-center space-x-2 px-4 py-2 bg-dark-800/50 rounded-xl border border-gray-600">
          <CameraIcon className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">ESP32-CAM Stream</span>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-dark-800/50 rounded-xl border border-gray-600">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Real-time Monitoring</span>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Camera;