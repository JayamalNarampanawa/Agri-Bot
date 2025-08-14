import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Zap, Settings, HelpCircle, RefreshCw, Bot } from 'lucide-react';

const FloatingActions = ({ onChatbotToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { 
      icon: RefreshCw, 
      label: 'Refresh Data', 
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => window.location.reload()
    },
    { 
      icon: Bot, 
      label: 'Agri-Bot Chat', 
      color: 'bg-green-500 hover:bg-green-600',
      badge: true,
      action: () => {
        if (onChatbotToggle) onChatbotToggle();
        setIsOpen(false);
      }
    },
    { 
      icon: Zap, 
      label: 'Quick Actions', 
      color: 'bg-yellow-500 hover:bg-yellow-600',
      action: () => console.log('Quick actions')
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      color: 'bg-gray-500 hover:bg-gray-600',
      action: () => console.log('Settings')
    },
    { 
      icon: HelpCircle, 
      label: 'Help', 
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => console.log('Help')
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 20, y: 20 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={action.action}
                className={`relative flex items-center space-x-3 px-4 py-3 ${action.color} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group`}
              >
                <action.icon size={20} />
                <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
                {action.badge && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus size={24} />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default FloatingActions;