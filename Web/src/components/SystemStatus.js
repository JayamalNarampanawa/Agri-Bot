import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Database, Server, Activity } from 'lucide-react';

const SystemStatus = () => {
    const [connectionStatus, setConnectionStatus] = useState('connected');
    const [lastUpdate, setLastUpdate] = useState(new Date());

    useEffect(() => {
        // Simulate connection monitoring
        const checkConnection = () => {
            if (typeof window !== 'undefined' && window.db) {
                setConnectionStatus('connected');
                setLastUpdate(new Date());
            } else {
                setConnectionStatus('disconnected');
            }
        };

        const interval = setInterval(checkConnection, 5000);
        checkConnection();

        return () => clearInterval(interval);
    }, []);

    const statusItems = [
        {
            label: 'Firebase',
            status: connectionStatus,
            icon: Database,
            color: connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'
        },
        {
            label: 'IoT Sensors',
            status: 'active',
            icon: Activity,
            color: 'text-blue-400'
        },
        {
            label: 'Network',
            status: navigator.onLine ? 'connected' : 'disconnected',
            icon: navigator.onLine ? Wifi : WifiOff,
            color: navigator.onLine ? 'text-green-400' : 'text-red-400'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-8 z-40 backdrop-blur-xl bg-dark-800/80 border border-primary-500/20 rounded-2xl p-4 shadow-2xl"
        >
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-primary-400 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-300">System Status</span>
                </div>

                <div className="flex items-center space-x-3">
                    {statusItems.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-1 group"
                            title={`${item.label}: ${item.status}`}
                        >
                            <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform duration-300`} />
                            <motion.div
                                animate={{
                                    scale: item.status === 'connected' || item.status === 'active' ? [1, 1.2, 1] : 1,
                                    opacity: item.status === 'connected' || item.status === 'active' ? [0.5, 1, 0.5] : 0.5
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`w-1.5 h-1.5 rounded-full ${item.status === 'connected' || item.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                                    }`}
                            />
                        </motion.div>
                    ))}
                </div>

                <div className="text-xs text-gray-500">
                    {lastUpdate.toLocaleTimeString()}
                </div>
            </div>
        </motion.div>
    );
};

export default SystemStatus;