import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import SoilMoisture from '../components/SoilMoisture';
import Irrigation from '../components/Irrigation';
import Weather from '../components/Weather';
import LightSensor from '../components/LightSensor';
import Tank from '../components/Tank';
import Camera from '../components/Camera';
import Security from '../components/Security';
import About from '../components/About';
import Footer from '../components/Footer';
import FloatingActions from '../components/FloatingActions';
import SystemStatus from '../components/SystemStatus';
import AgriBotChatbot from '../components/AgriBotChatbot';

const Dashboard = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleChatbotToggle = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };
  return (
    <div className="min-h-screen">
      <Loader />
      <Navigation />
      <Hero />
      
      {/* Main Content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="max-w-7xl mx-auto px-6 py-12 space-y-12"
      >
        <SoilMoisture />
        <Irrigation />
        <Weather />
        <LightSensor />
        <Tank />
        <Camera />
        <Security />
        <About />
      </motion.main>

      <Footer />
      <FloatingActions onChatbotToggle={handleChatbotToggle} />
      <SystemStatus />
      <AgriBotChatbot isOpen={isChatbotOpen} onToggle={handleChatbotToggle} />
    </div>
  );
};

export default Dashboard;