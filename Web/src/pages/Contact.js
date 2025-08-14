import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import Loader from '../components/Loader';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });

      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <Loader />
      <Navigation />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="pt-32 pb-16"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="backdrop-blur-xl bg-white/5 border border-primary-500/20 rounded-3xl p-12 shadow-2xl">
            <motion.h2
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-6xl font-bold bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent mb-6 flex items-center justify-center space-x-4"
            >
              <motion.i
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="fas fa-phone text-6xl text-primary-400"
              />
              <span>Contact Us</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-xl text-gray-300 leading-relaxed"
            >
              Thank you for using the Agri-Bot Smart Farming System.<br />
              For inquiries, support, or feedback, feel free to reach out to us:
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-8 flex justify-center space-x-2"
            >
              {[0, 0.1, 0.2].map((delay, index) => (
                <motion.div
                  key={index}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: delay,
                    ease: "easeInOut"
                  }}
                  className={`w-3 h-3 ${index === 0 ? 'bg-primary-500' : index === 1 ? 'bg-primary-400' : 'bg-primary-300'} rounded-full`}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Contact Content */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="backdrop-blur-xl bg-gradient-to-br from-dark-800/80 to-dark-700/60 border border-primary-500/20 rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center space-x-3">
                <MessageCircle className="w-8 h-8 text-primary-400" />
                <span>Send Us a Message</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative group"
                >
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 bg-dark-800/50 border border-gray-600 rounded-2xl text-white placeholder-transparent focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 peer"
                    placeholder="Full Name"
                  />
                  <label className="absolute left-6 -top-3 bg-dark-800 px-2 text-sm text-primary-400 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-primary-400 peer-focus:text-sm peer-focus:bg-dark-800">
                    Full Name
                  </label>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative group"
                >
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 bg-dark-800/50 border border-gray-600 rounded-2xl text-white placeholder-transparent focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 peer"
                    placeholder="Email"
                  />
                  <label className="absolute left-6 -top-3 bg-dark-800 px-2 text-sm text-primary-400 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-primary-400 peer-focus:text-sm peer-focus:bg-dark-800">
                    Email Address
                  </label>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="relative group"
                >
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 bg-dark-800/50 border border-gray-600 rounded-2xl text-white placeholder-transparent focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 peer"
                    placeholder="Phone Number"
                  />
                  <label className="absolute left-6 -top-3 bg-dark-800 px-2 text-sm text-primary-400 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-primary-400 peer-focus:text-sm peer-focus:bg-dark-800">
                    Phone Number
                  </label>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="relative group"
                >
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="w-full px-6 py-4 bg-dark-800/50 border border-gray-600 rounded-2xl text-white placeholder-transparent focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 peer resize-none"
                    placeholder="Your Message..."
                  ></textarea>
                  <label className="absolute left-6 -top-3 bg-dark-800 px-2 text-sm text-primary-400 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-primary-400 peer-focus:text-sm peer-focus:bg-dark-800">
                    Your Message
                  </label>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-3 ${isSubmitting
                    ? 'bg-gray-500 cursor-not-allowed'
                    : submitStatus === 'success'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 hover:shadow-primary-500/25 transform hover:scale-105'
                    } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Sending...</span>
                    </>
                  ) : submitStatus === 'success' ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 text-white"
                      >
                        ✓
                      </motion.div>
                      <span>Message Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="backdrop-blur-xl bg-gradient-to-br from-dark-800/80 to-dark-700/60 border border-primary-500/20 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email Us</h3>
                    <p className="text-gray-400">agribot.team@nibm.lk</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="backdrop-blur-xl bg-gradient-to-br from-dark-800/80 to-dark-700/60 border border-primary-500/20 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <Phone className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Call Us</h3>
                    <p className="text-gray-400">+94 71 108 8627</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="backdrop-blur-xl bg-gradient-to-br from-dark-800/80 to-dark-700/60 border border-primary-500/20 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <MapPin className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Visit Us</h3>
                    <p className="text-gray-400"> No:2, Asgiri Vihara Mawatha, Kandy, Sri Lanka</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="backdrop-blur-xl bg-gradient-to-br from-dark-800/80 to-dark-700/60 border border-primary-500/20 rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-xl font-bold text-white mb-4">Why Contact Us?</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span>Technical support and troubleshooting</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span>Feature requests and suggestions</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span>Partnership and collaboration opportunities</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span>General inquiries about Agri-Bot</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;