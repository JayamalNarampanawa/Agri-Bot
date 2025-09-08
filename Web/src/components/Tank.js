import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Power, AlertTriangle } from 'lucide-react';
import { database } from '../firebase/config';
import { ref, onValue, off, get, set } from 'firebase/database';

const Tank = () => {
  const [tankLevel, setTankLevel] = useState('--');
  const [tankPumpStatus, setTankPumpStatus] = useState(null);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const tankLevelRef = ref(database, "/tank/level_percent");
    const tankPumpRef = ref(database, "/tank/pump");
    
    const unsubscribeLevel = onValue(tankLevelRef, (snapshot) => {
      const level = snapshot.val();
      console.log('Tank level data received:', level); // Debug log
      setTankLevel(level !== null ? level : '--');
    }, (error) => {
      console.error('Error reading tank level data:', error);
      setTankLevel('--');
    });

    const unsubscribePump = onValue(tankPumpRef, (snapshot) => {
      const status = snapshot.val();
      console.log('Tank pump status received:', status); // Debug log
      setTankPumpStatus(status);
    }, (error) => {
      console.error('Error reading tank pump status:', error);
      setTankPumpStatus(null);
    });

    return () => {
      off(tankLevelRef, 'value', unsubscribeLevel);
      off(tankPumpRef, 'value', unsubscribePump);
    };
  }, []);

  const toggleTankPump = async () => {
    if (!isToggling) {
      setIsToggling(true);
      try {
        const tankPumpRef = ref(database, "/tank/pump");
        const snapshot = await get(tankPumpRef);
        const current = snapshot.val();
        await set(tankPumpRef, !current);
        console.log('Tank pump toggled to:', !current); // Debug log
      } catch (error) {
        console.error("Error toggling tank pump:", error);
      } finally {
        setTimeout(() => setIsToggling(false), 1000);
      }
    }
  };

  const getTankColor = (level) => {
    if (level === '--') return 'from-gray-500 to-gray-600';
    if (level < 20) return 'from-red-500 to-red-600';
    if (level < 50) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  const getTankPercentage = (level) => {
    return level === '--' ? 0 : Math.min(100, Math.max(0, level));
  };

  const isLowLevel = () => {
    return tankLevel !== '--' && tankLevel < 20;
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      viewport={{ once: true }}
      className="group backdrop-blur-xl bg-gradient-to-br from-dark-800/80 to-dark-700/60 border border-primary-500/20 rounded-3xl p-8 shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:scale-[1.02]" 
      id="tank"
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
            className="fas fa-tint text-4xl text-cyan-400"
          />
          <span>Water Tank</span>
        </h2>
        <motion.div 
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${
            tankLevel === '--' ? 'bg-gray-500/20 text-gray-400' :
            isLowLevel() ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
          }`}
        >
          <motion.div 
            animate={{ scale: isLowLevel() ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 1, repeat: isLowLevel() ? Infinity : 0 }}
            className={`w-2 h-2 rounded-full ${
              tankLevel === '--' ? 'bg-gray-400' :
              isLowLevel() ? 'bg-red-400' : 'bg-green-400'
            }`}
          />
          <span>
            {tankLevel === '--' ? 'Unknown' : 
             isLowLevel() ? 'Low Level' : 'Normal'}
          </span>
        </motion.div>
      </div>
      
      <div className="space-y-6">
        {/* Tank Level Display */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <motion.div 
              className="w-48 h-48 rounded-full bg-gradient-to-br from-dark-700 to-dark-800 shadow-inner flex items-center justify-center relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {/* Tank level indicator */}
              <motion.div
                className={`absolute inset-0 rounded-full bg-gradient-to-t ${getTankColor(tankLevel)} opacity-20`}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: getTankPercentage(tankLevel) / 100,
                  opacity: tankLevel === '--' ? 0 : 0.3
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              
              <div className="w-40 h-40 rounded-full bg-dark-900 flex items-center justify-center shadow-2xl relative z-10">
                <div className="text-center">
                  <motion.div 
                    key={tankLevel}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-cyan-400 flex items-center justify-center space-x-1"
                  >
                    <Droplets className="w-8 h-8" />
                    <span>{tankLevel}%</span>
                  </motion.div>
                  <div className="text-sm text-gray-400 mt-1">Tank Level</div>
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
              className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 rounded-full blur-xl"
            />
          </div>
        </div>

        {/* Tank Pump Control */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white text-center">Tank Pump Control</h3>
          <motion.button 
            onClick={toggleTankPump}
            disabled={isToggling}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
              isToggling 
                ? 'bg-gray-500 cursor-not-allowed' 
                : tankPumpStatus 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-red-500/25' 
                  : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 hover:shadow-cyan-500/25'
            } text-white`}
          >
            {isToggling ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Power className="w-6 h-6" />
                <span>{tankPumpStatus ? 'Turn OFF Tank Pump' : 'Turn ON Tank Pump'}</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Tank Status */}
        <div className="text-center space-y-4">
          <motion.div
            key={tankPumpStatus}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center space-x-3"
          >
            <Droplets className={`w-6 h-6 ${
              tankPumpStatus === null ? 'text-gray-400' :
              tankPumpStatus ? 'text-cyan-400' : 'text-gray-400'
            }`} />
            <p className="text-xl text-gray-300 font-medium">
              Tank Pump Status: {' '}
              <span className={`font-bold ${
                tankPumpStatus === null ? 'text-gray-400' :
                tankPumpStatus ? 'text-cyan-400' : 'text-gray-400'
              }`}>
                {tankPumpStatus === null ? 'Unknown' : tankPumpStatus ? 'ON' : 'OFF'}
              </span>
            </p>
          </motion.div>

          {/* Low Level Alert */}
          {isLowLevel() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-3"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </motion.div>
              <div>
                <div className="font-medium text-red-400">Low Water Level Alert</div>
                <div className="text-sm text-gray-400">Tank level is critically low</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Visual tank animation */}
        <div className="flex justify-center mt-8">
          <div className="relative">
            <motion.div
              animate={tankPumpStatus ? {
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              } : {}}
              transition={{
                duration: 1.5,
                repeat: tankPumpStatus ? Infinity : 0,
                ease: "easeInOut"
              }}
              className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${
                tankPumpStatus ? 'border-cyan-400 bg-cyan-500/20' : 'border-gray-500 bg-gray-500/20'
              }`}
            >
              <motion.div
                animate={tankPumpStatus ? { rotate: 360 } : {}}
                transition={{
                  duration: 2,
                  repeat: tankPumpStatus ? Infinity : 0,
                  ease: "linear"
                }}
              >
                <Droplets className={`w-8 h-8 ${tankPumpStatus ? 'text-cyan-400' : 'text-gray-400'}`} />
              </motion.div>
            </motion.div>
            
            {tankPumpStatus && (
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                className="absolute inset-0 rounded-full border-2 border-cyan-400"
              />
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Tank;

