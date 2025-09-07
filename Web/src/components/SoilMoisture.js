import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import { database } from '../firebase/config';
import { ref, onValue, off } from 'firebase/database';

const MoistureCard = ({ title, path }) => {
  const [value, setValue] = useState("--");

  useEffect(() => {
    const moistureRef = ref(database, path);
    
    const unsubscribe = onValue(moistureRef, (snapshot) => {
      const val = snapshot.val();
      console.log(`${title} data received:`, val); // Debug log
      setValue(val !== null ? val : "--");
    }, (error) => {
      console.error(`Error reading ${title} data:`, error);
      setValue("--");
    });

    return () => off(moistureRef, 'value', unsubscribe);
  }, [path, title]);

  const getMoistureColor = (val) => {
    if (val === "--") return "from-gray-500 to-gray-600";
    if (val < 30) return "from-red-500 to-red-600";
    if (val < 60) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-green-600";
  };

  const getStatus = (val) => {
    if (val === "--") return "No Data";
    if (val < 30) return "Dry - Needs Water";
    if (val < 60) return "Moderate";
    return "Well Hydrated";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex-1 group backdrop-blur-xl bg-gradient-to-br from-dark-800/80 to-dark-700/60 border border-primary-500/20 rounded-3xl p-6 shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 hover:scale-[1.02]"
    >
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>

      <div className="flex items-center justify-center">
        <div className="relative">
          <motion.div
            className="w-40 h-40 rounded-full bg-gradient-to-br from-dark-700 to-dark-800 shadow-inner flex items-center justify-center relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`absolute inset-0 rounded-full bg-gradient-to-t ${getMoistureColor(
                value
              )} opacity-20`}
              initial={{ scale: 0 }}
              animate={{
                scale: value === "--" ? 0 : Math.min(1, value / 100),
                opacity: value === "--" ? 0 : 0.3,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />

            <div className="w-32 h-32 rounded-full bg-dark-900 flex items-center justify-center shadow-2xl relative z-10">
              <div className="text-center">
                <motion.div
                  key={value}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold text-primary-400 flex items-center justify-center space-x-1"
                >
                  <Droplets className="w-6 h-6" />
                  <span>{value}%</span>
                </motion.div>
                <div className="text-sm text-gray-400 mt-1">Moisture</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-center"
      >
        <div
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
            value === "--"
              ? "bg-gray-500/20 text-gray-400"
              : value < 30
              ? "bg-red-500/20 text-red-400"
              : value < 60
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-green-500/20 text-green-400"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              value === "--"
                ? "bg-gray-400"
                : value < 30
                ? "bg-red-400 animate-pulse"
                : value < 60
                ? "bg-yellow-400"
                : "bg-green-400"
            }`}
          ></div>
          <span>{getStatus(value)}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SoilMoisture = () => {
  return (
    <section
      id="soil"
      className="backdrop-blur-xl bg-gradient-to-br from-dark-900/60 to-dark-800/40 border border-primary-500/20 rounded-3xl p-8 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
          <motion.i
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="fas fa-seedling text-4xl text-primary-400"
          />
          <span>Soil Moistures</span>
        </h2>
      </div>

      {/* Two moisture cards side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MoistureCard title="Soil Moisture 1" path="/soil/sensor1_percent" />
        <MoistureCard title="Soil Moisture 2" path="/soil/sensor2_percent" />
      </div>
    </section>
  );
};

export default SoilMoisture;