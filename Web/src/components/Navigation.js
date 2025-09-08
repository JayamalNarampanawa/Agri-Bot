import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Menu, X } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const isContactPage = location.pathname === '/contact';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '#soil', icon: 'fas fa-seedling', label: 'Soil', color: 'text-green-400' },
    { href: '#irrigation', icon: 'fas fa-tint', label: 'Irrigation', color: 'text-blue-400' },
    { href: '#weather', icon: 'fas fa-cloud-sun', label: 'Weather', color: 'text-yellow-400' },
    { href: '#light', icon: 'fas fa-lightbulb', label: 'Light', color: 'text-amber-400' },
    { href: '#tank', icon: 'fas fa-tint', label: 'Tank', color: 'text-cyan-400' },
    { href: '#camera', icon: 'fas fa-video', label: 'Camera', color: 'text-red-400' },
    { href: '#security', icon: 'fas fa-shield-alt', label: 'Security', color: 'text-purple-400' },
    { href: '#about', icon: 'fas fa-users', label: 'About', color: 'text-primary-400' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            animate={{
              scale: isScrolled ? 0.95 : 1,
              y: isScrolled ? 10 : 0
            }}
            transition={{ duration: 0.3 }}
            className={`backdrop-blur-xl border rounded-2xl shadow-2xl transition-all duration-300 ${
              isScrolled 
                ? 'bg-dark-900/95 border-primary-500/30' 
                : 'bg-dark-800/80 border-primary-500/20'
            }`}
          >
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                {/* Logo Section */}
                <Link to="/" className="flex items-center space-x-4 group">
                  <div className="relative">
                    <motion.img 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                      src="/assets/images/agri-bot_logo.png" 
                      alt="Agri-Bot Logo" 
                      className="w-12 h-12 rounded-full border-2 border-primary-500 shadow-lg transition-transform duration-300 group-hover:scale-110" 
                    />
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -inset-1 bg-primary-500/20 rounded-full blur"
                    />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                    Agri-Bot
                  </span>
                </Link>

                {/* Desktop Navigation */}
                {!isContactPage ? (
                  <div className="hidden lg:flex items-center">
                    <ul className="flex items-center space-x-2 mr-6">
                      {navItems.map((item, index) => (
                        <motion.li 
                          key={item.href}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 * index }}
                        >
                          <motion.a 
                            href={item.href} 
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative px-4 py-3 rounded-xl text-gray-300 hover:text-white transition-all duration-300 font-medium flex items-center space-x-3 group overflow-hidden"
                          >
                            {/* Background hover effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              whileHover={{ scale: 1.1 }}
                            />
                            
                            {/* Icon with color */}
                            <motion.i 
                              className={`${item.icon} text-lg ${item.color} group-hover:scale-110 transition-all duration-300 relative z-10`}
                              whileHover={{ rotate: 10 }}
                            />
                            
                            {/* Label */}
                            <span className="relative z-10 text-sm font-semibold">{item.label}</span>
                            
                            {/* Hover indicator */}
                            <motion.div
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              layoutId="navIndicator"
                            />
                          </motion.a>
                        </motion.li>
                      ))}
                    </ul>
                    
                    {/* Contact Button */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <Link 
                        to="/contact" 
                        className="relative px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-primary-500/25 transform hover:scale-105 flex items-center space-x-2 overflow-hidden group"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ scale: 1.1 }}
                        />
                        <MessageCircle size={18} className="relative z-10" />
                        <span className="relative z-10">Contact</span>
                      </Link>
                    </motion.div>
                  </div>
                ) : (
                  <Link 
                    to="/" 
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-primary-500/25 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Dashboard</span>
                  </Link>
                )}

                {/* Mobile Menu Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors duration-300"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-24 left-6 right-6 z-40 lg:hidden"
          >
            <div className="backdrop-blur-xl bg-dark-900/95 border border-primary-500/30 rounded-2xl shadow-2xl p-6">
              <ul className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-4 p-3 rounded-xl text-gray-300 hover:text-white hover:bg-primary-500/10 transition-all duration-300 group"
                    >
                      <i className={`${item.icon} text-xl ${item.color} group-hover:scale-110 transition-transform duration-300`}></i>
                      <span className="font-medium">{item.label}</span>
                    </a>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                  className="pt-4 border-t border-gray-700"
                >
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-semibold"
                  >
                    <MessageCircle size={18} />
                    <span>Contact Us</span>
                  </Link>
                </motion.li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;