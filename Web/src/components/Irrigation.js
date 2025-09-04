import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Power, Droplets } from 'lucide-react';

const Irrigation = () => {
  const [pumpStatus, setPumpStatus] = useState(null);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.db) {
      const pumpRef = window.db.ref("/pump");
      pumpRef.on("value", snapshot => {
        const status = snapshot.val();
        setPumpStatus(status);
      });

      return () => pumpRef.off();
    }
  }, []);

  const togglePump = async () => {
    if (typeof window !== 'undefined' && window.db && !isToggling) {
      setIsToggling(true);
      try {
        const snapshot = await window.db.ref("/pump").once("value");
        const current = snapshot.val();
        await window.db.ref("/pump").set(!current);
      } catch (error) {
        console.error("Error toggling pump:", error);
      } finally {
        setTimeout(() => setIsToggling(false), 1000);
      }
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      className="group backdrop-blur-xl bg-gradient-to-br from-dark-800/80 to-dark-700/60 border border-primary-500/20 rounded-3xl p-8 shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:scale-[1.02]" 
      id="irrigation"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
          <motion.i 
            animate={{ 
              rotate: pumpStatus ? [0, 360] : 0,
              scale: pumpStatus ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              rotate: { duration: 2, repeat: pumpStatus ? Infinity : 0, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
            className="fas fa-tint text-4xl text-blue-400"
          />
          <span>Water Pump</span>
        </h2>
        <motion.div 
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${
            pumpStatus === null ? 'bg-gray-500/20 text-gray-400' :
            pumpStatus ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
          }`}
        >
          <motion.div 
            animate={{ scale: pumpStatus ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 1, repeat: pumpStatus ? Infinity : 0 }}
            className={`w-2 h-2 rounded-full ${
              pumpStatus === null ? 'bg-gray-400' :
              pumpStatus ? 'bg-blue-400' : 'bg-gray-400'
            }`}
          />
          <span>
            {pumpStatus === null ? 'Unknown' : pumpStatus ? 'Active' : 'Inactive'}
          </span>
        </motion.div>
      </div>
      
      <div className="space-y-6">
        <motion.button 
          onClick={togglePump}
          disabled={isToggling}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
            isToggling 
              ? 'bg-gray-500 cursor-not-allowed' 
              : pumpStatus 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-red-500/25' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/25'
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
              <span>{pumpStatus ? 'Turn OFF Pump' : 'Turn ON Pump'}</span>
            </>
          )}
        </motion.button>

        <div className="text-center">
          <motion.div
            key={pumpStatus}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center space-x-3"
          >
            <Droplets className={`w-6 h-6 ${
              pumpStatus === null ? 'text-gray-400' :
              pumpStatus ? 'text-blue-400' : 'text-gray-400'
            }`} />
            <p className="text-xl text-gray-300 font-medium">
              Pump Status: {' '}
              <span className={`font-bold ${
                pumpStatus === null ? 'text-gray-400' :
                pumpStatus ? 'text-blue-400' : 'text-gray-400'
              }`}>
                {pumpStatus === null ? 'Unknown' : pumpStatus ? 'ON' : 'OFF'}
              </span>
            </p>
          </motion.div>
        </div>

        {/* Visual pump animation */}
        <div className="flex justify-center mt-8">
          <div className="relative">
            <motion.div
              animate={pumpStatus ? {
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              } : {}}
              transition={{
                duration: 1.5,
                repeat: pumpStatus ? Infinity : 0,
                ease: "easeInOut"
              }}
              className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${
                pumpStatus ? 'border-blue-400 bg-blue-500/20' : 'border-gray-500 bg-gray-500/20'
              }`}
            >
              <motion.div
                animate={pumpStatus ? { rotate: 360 } : {}}
                transition={{
                  duration: 2,
                  repeat: pumpStatus ? Infinity : 0,
                  ease: "linear"
                }}
              >
                <Droplets className={`w-8 h-8 ${pumpStatus ? 'text-blue-400' : 'text-gray-400'}`} />
              </motion.div>
            </motion.div>
            
            {pumpStatus && (
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
                className="absolute inset-0 rounded-full border-2 border-blue-400"
              />
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Irrigation;