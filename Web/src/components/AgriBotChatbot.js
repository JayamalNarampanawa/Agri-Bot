import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Lightbulb, Droplets, Thermometer, ChevronDown } from 'lucide-react';

const AgriBotChatbot = ({ isOpen: externalIsOpen, onToggle }) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    // Use external control if provided, otherwise use internal state
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
    const setIsOpen = onToggle || setInternalIsOpen;
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            message: "Hello! I'm Agri-Bot Assistant 🌱 I can help you with farming problems, crop advice, and analyze your sensor data. How can I assist you today?",
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const messagesEndRef = useRef(null);

    // Agricultural knowledge base
    const farmingKnowledge = {
        soilMoisture: {
            low: "Your soil moisture is low. Consider watering your crops. For most vegetables, soil should be kept consistently moist but not waterlogged.",
            high: "Your soil moisture is high. Ensure proper drainage to prevent root rot. Reduce watering frequency.",
            optimal: "Your soil moisture levels are perfect! Continue your current watering schedule."
        },
        temperature: {
            low: "Temperature is low. Consider using row covers or greenhouse protection. Most crops grow best between 65-75°F (18-24°C).",
            high: "Temperature is high. Provide shade cloth, increase watering, and ensure good ventilation. Heat stress can damage crops.",
            optimal: "Temperature is in the optimal range for most crops. Great growing conditions!"
        },
        humidity: {
            low: "Low humidity can stress plants. Consider misting or using humidity trays. Most plants prefer 40-60% humidity.",
            high: "High humidity can promote fungal diseases. Ensure good air circulation and avoid overhead watering.",
            optimal: "Humidity levels are ideal for healthy plant growth."
        },
        lightConditions: {
            dark: "It's currently dark. Most plants need 6-8 hours of sunlight daily. Consider supplemental grow lights if needed.",
            bright: "Good light conditions! Plants are getting the sunlight they need for photosynthesis."
        },
        commonProblems: {
            "yellowing leaves": "Yellow leaves can indicate overwatering, nutrient deficiency (especially nitrogen), or natural aging. Check soil moisture and consider fertilizing.",
            "wilting": "Wilting usually means underwatering, but can also indicate root problems or disease. Check soil moisture first.",
            "brown spots": "Brown spots often indicate fungal diseases. Improve air circulation, avoid overhead watering, and remove affected leaves.",
            "slow growth": "Slow growth can be due to insufficient light, poor soil, lack of nutrients, or wrong temperature. Check all growing conditions.",
            "pest control": "For organic pest control, try neem oil, insecticidal soap, or beneficial insects. Identify the pest first for targeted treatment.",
            "fertilizer": "Use balanced fertilizer (10-10-10) for general feeding. Nitrogen for leaves, phosphorus for roots/flowers, potassium for overall health.",
            "watering": "Water deeply but less frequently. Check soil 1-2 inches down - if dry, it's time to water. Morning watering is best.",
            "pruning": "Prune dead, diseased, or crossing branches. For vegetables, pinch flowers to encourage leaf growth, or vice versa."
        },
        crops: {
            "tomatoes": "Tomatoes need warm soil (60°F+), consistent watering, and support structures. Watch for blight and hornworms.",
            "lettuce": "Lettuce prefers cool weather and consistent moisture. Harvest outer leaves first. Bolt in hot weather.",
            "peppers": "Peppers need warm conditions and well-draining soil. Don't overwater - slightly dry soil intensifies flavor.",
            "herbs": "Most herbs prefer well-draining soil and moderate watering. Pinch flowers to keep leaves tender.",
            "carrots": "Carrots need loose, deep soil. Thin seedlings to prevent crowding. Keep soil consistently moist.",
            "beans": "Beans fix nitrogen in soil. Don't over-fertilize with nitrogen. Provide support for climbing varieties."
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getCurrentSensorData = () => {
        // Get real sensor data from Firebase (same as your other components)
        const sensorData = {
            soilMoisture: 45, // Default values
            temperature: 22,
            humidity: 55,
            isDark: false
        };

        // Try to get real data from Firebase if available
        if (typeof window !== 'undefined' && window.db) {
            // This would be updated with real-time data
            // For now, using default values but structure is ready for integration
        }

        return sensorData;
    };

    const analyzeSensorData = () => {
        const data = getCurrentSensorData();
        let analysis = "📊 Current Sensor Analysis:\n\n";

        // Soil moisture analysis
        if (data.soilMoisture < 30) {
            analysis += `🌱 ${farmingKnowledge.soilMoisture.low}\n\n`;
        } else if (data.soilMoisture > 70) {
            analysis += `🌱 ${farmingKnowledge.soilMoisture.high}\n\n`;
        } else {
            analysis += `🌱 ${farmingKnowledge.soilMoisture.optimal}\n\n`;
        }

        // Temperature analysis
        if (data.temperature < 18) {
            analysis += `🌡️ ${farmingKnowledge.temperature.low}\n\n`;
        } else if (data.temperature > 30) {
            analysis += `🌡️ ${farmingKnowledge.temperature.high}\n\n`;
        } else {
            analysis += `🌡️ ${farmingKnowledge.temperature.optimal}\n\n`;
        }

        // Light analysis
        if (data.isDark) {
            analysis += `☀️ ${farmingKnowledge.lightConditions.dark}`;
        } else {
            analysis += `☀️ ${farmingKnowledge.lightConditions.bright}`;
        }

        return analysis;
    };

    const generateBotResponse = (userMessage) => {
        const message = userMessage.toLowerCase();

        // Check for sensor data requests
        if (message.includes('sensor') || message.includes('data') || message.includes('analysis')) {
            return analyzeSensorData();
        }

        // Check for specific crop questions
        for (const [crop, advice] of Object.entries(farmingKnowledge.crops)) {
            if (message.includes(crop)) {
                return `🌿 ${crop.charAt(0).toUpperCase() + crop.slice(1)} Growing Tips:\n${advice}`;
            }
        }

        // Check for common problems
        for (const [problem, solution] of Object.entries(farmingKnowledge.commonProblems)) {
            if (message.includes(problem)) {
                return `💡 ${problem.charAt(0).toUpperCase() + problem.slice(1)} Solution:\n${solution}`;
            }
        }

        // General farming keywords
        if (message.includes('water') || message.includes('irrigation')) {
            return "💧 Watering Tips:\n" + farmingKnowledge.commonProblems.watering;
        }

        if (message.includes('fertiliz') || message.includes('nutrient')) {
            return "🌱 Fertilizer Advice:\n" + farmingKnowledge.commonProblems.fertilizer;
        }

        if (message.includes('pest') || message.includes('bug') || message.includes('insect')) {
            return "🐛 Pest Control:\n" + farmingKnowledge.commonProblems["pest control"];
        }

        if (message.includes('prune') || message.includes('trim')) {
            return "✂️ Pruning Guide:\n" + farmingKnowledge.commonProblems.pruning;
        }

        // Weather-related questions
        if (message.includes('weather') || message.includes('climate')) {
            return "🌤️ Weather Considerations:\nMonitor your local weather and adjust watering, protection, and harvesting schedules accordingly. Your sensors help track microclimatic conditions!";
        }

        // Seasonal advice
        if (message.includes('season') || message.includes('when to plant')) {
            return "🗓️ Seasonal Planting Guide:\n• Spring: Lettuce, peas, carrots, herbs, spinach\n• Summer: Tomatoes, peppers, beans, squash, cucumbers\n• Fall: Broccoli, cabbage, spinach, winter lettuce\n• Winter: Plan and prepare for next season, start seeds indoors!";
        }

        // NPK and fertilizer ratios
        if (message.includes('npk') || message.includes('ratio')) {
            return "🧮 NPK Ratios Explained:\n• N (Nitrogen): Promotes leaf growth - use 20-10-10 for leafy greens\n• P (Phosphorus): Root and flower development - use 10-20-10 for flowering plants\n• K (Potassium): Overall plant health and disease resistance\n• Balanced 10-10-10 works for most vegetables\n• Higher N for leafy crops, higher P for fruiting crops";
        }

        // Organic fertilizers
        if (message.includes('organic fertilizer')) {
            return "🌿 Organic Fertilizer Options:\n• Compost: Slow-release, improves soil structure\n• Fish emulsion: Quick nitrogen boost\n• Bone meal: Phosphorus for root development\n• Kelp meal: Potassium and micronutrients\n• Worm castings: Gentle, all-purpose nutrition\n• Coffee grounds: Nitrogen for acid-loving plants";
        }

        // Fungal diseases
        if (message.includes('fungal') || message.includes('fungus')) {
            return "🍄 Fungal Disease Management:\n• Improve air circulation around plants\n• Water at soil level, avoid wetting leaves\n• Remove infected plant material immediately\n• Apply neem oil or copper fungicide\n• Use resistant varieties when possible\n• Rotate crops to break disease cycles";
        }

        // Greenhouse growing
        if (message.includes('greenhouse')) {
            return "🏠 Greenhouse Growing Tips:\n• Maintain 65-75°F during day, 60-65°F at night\n• Ensure good ventilation to prevent disease\n• Monitor humidity levels (50-70% ideal)\n• Use grow lights if natural light is insufficient\n• Water carefully to avoid overwatering\n• Consider beneficial insects for pest control";
        }

        // Soil-related questions
        if (message.includes('soil') && !message.includes('moisture')) {
            return "🌍 Soil Health Tips:\n• Test pH (6.0-7.0 for most crops)\n• Add compost for nutrients\n• Ensure good drainage\n• Rotate crops to prevent depletion\n• Your soil moisture sensor helps monitor watering needs!";
        }

        // Disease identification
        if (message.includes('disease') || message.includes('sick') || message.includes('dying')) {
            return "🏥 Plant Disease Diagnosis:\n• Yellow leaves: Overwatering or nitrogen deficiency\n• Brown/black spots: Fungal infection\n• Wilting: Root problems or underwatering\n• Stunted growth: Nutrient deficiency or poor soil\nSend me more specific symptoms for better diagnosis!";
        }

        // Harvest timing
        if (message.includes('harvest') || message.includes('ready') || message.includes('ripe')) {
            return "🌾 Harvest Timing:\n• Tomatoes: When fully colored but still firm\n• Lettuce: Outer leaves first, before bolting\n• Peppers: When full size and colored\n• Herbs: Before flowering for best flavor\nWhat crop are you asking about?";
        }

        // Default responses for farming context
        const defaultResponses = [
            "🌱 I specialize in agricultural advice! Ask me about:\n• Crop care and planting\n• Soil management\n• Pest and disease control\n• Sensor data analysis\n• Watering and fertilization",
            "🚜 I can help with farming problems like:\n• Plant diseases and pests\n• Watering schedules\n• Fertilization timing\n• Interpreting your IoT sensor readings\n• Seasonal planting advice",
            "🌾 Try asking about:\n• Specific crops (tomatoes, lettuce, etc.)\n• Common plant problems\n• 'Analyze sensors' for current data\n• Seasonal growing tips\n• Soil and water management",
            "🌿 I'm your agricultural assistant! I can help with:\n• Plant care and troubleshooting\n• Soil and water conditions\n• Pest control strategies\n• Harvest timing\n• Smart farming with your IoT sensors"
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            message: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const botResponse = {
                id: Date.now() + 1,
                type: 'bot',
                message: generateBotResponse(inputMessage),
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const topicCategories = [
        {
            category: "🌱 Crop Care",
            topics: [
                { text: "Tomato growing tips", icon: "🍅" },
                { text: "Lettuce cultivation", icon: "🥬" },
                { text: "Pepper growing guide", icon: "🌶️" },
                { text: "Herb gardening", icon: "�" }
            ]
        },
        {
            category: "💧 Water & Soil",
            topics: [
                { text: "Watering schedule", icon: "💧" },
                { text: "Soil health check", icon: "🌍" },
                { text: "Drainage problems", icon: "🚰" },
                { text: "Fertilizer timing", icon: "🌱" }
            ]
        },
        {
            category: "🐛 Problems & Solutions",
            topics: [
                { text: "Pest identification", icon: "🐛" },
                { text: "Disease diagnosis", icon: "🏥" },
                { text: "Yellow leaves help", icon: "🍂" },
                { text: "Plant wilting", icon: "🥀" }
            ]
        },
        {
            category: "📊 Smart Farming",
            topics: [
                { text: "Analyze my sensors", icon: "📊" },
                { text: "Weather impact", icon: "🌤️" },
                { text: "Harvest timing", icon: "🌾" },
                { text: "Seasonal planning", icon: "📅" },
                { text: "IoT monitoring", icon: "📡" },
                { text: "Data interpretation", icon: "📈" }
            ]
        },
        {
            category: "🌱 Fertilizers & Nutrients",
            topics: [
                { text: "NPK ratios explained", icon: "🧮" },
                { text: "Organic fertilizers", icon: "🌿" },
                { text: "Nutrient deficiency", icon: "⚠️" },
                { text: "Fertilizer timing", icon: "⏰" },
                { text: "Micronutrients", icon: "🔬" }
            ]
        },
        {
            category: "🏥 Plant Diseases",
            topics: [
                { text: "Fungal infections", icon: "🍄" },
                { text: "Bacterial diseases", icon: "🦠" },
                { text: "Blight prevention", icon: "🛡️" },
                { text: "Root rot treatment", icon: "🩺" },
                { text: "Powdery mildew", icon: "☁️" }
            ]
        },
        {
            category: "🌾 Harvesting & Storage",
            topics: [
                { text: "Harvest timing", icon: "⏰" },
                { text: "Ripeness indicators", icon: "🎯" },
                { text: "Post-harvest care", icon: "📦" },
                { text: "Storage methods", icon: "🏪" },
                { text: "Seed saving", icon: "💾" }
            ]
        },
        {
            category: "🌤️ Weather & Climate",
            topics: [
                { text: "Frost protection", icon: "❄️" },
                { text: "Heat stress management", icon: "🌡️" },
                { text: "Wind protection", icon: "💨" },
                { text: "Greenhouse growing", icon: "🏠" },
                { text: "Season extension", icon: "📏" }
            ]
        }
    ];

    const quickActions = [
        { text: "Analyze my sensors", icon: "📊" },
        { text: "Watering advice", icon: "💧" },
        { text: "Pest control help", icon: "🐛" },
        { text: "Fertilizer tips", icon: "🌱" }
    ];

    // Daily farming tips
    const dailyTips = [
        "💡 Tip: Water plants early morning to reduce evaporation and prevent fungal diseases!",
        "💡 Tip: Companion planting - grow basil near tomatoes to improve flavor and repel pests!",
        "💡 Tip: Check soil pH regularly - most vegetables prefer 6.0-7.0 pH for optimal nutrient uptake!",
        "💡 Tip: Mulch around plants to retain moisture and suppress weeds naturally!",
        "💡 Tip: Rotate crops each season to prevent soil depletion and reduce pest buildup!"
    ];

    // Add a daily tip when chatbot opens
    useEffect(() => {
        if (isOpen && messages.length === 1) {
            const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
            setTimeout(() => {
                const tipMessage = {
                    id: Date.now(),
                    type: 'bot',
                    message: randomTip,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, tipMessage]);
            }, 2000);
        }
    }, [isOpen]);

    return (
        <>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-4 left-4 w-[420px] h-[500px] bg-dark-800/95 backdrop-blur-xl border border-primary-500/20 rounded-2xl shadow-2xl z-40 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <Bot className="w-8 h-8 text-green-400" />
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Agri-Bot Assistant</h3>
                                        <p className="text-xs text-gray-400">Agricultural Expert</p>
                                    </div>
                                </div>
                                <motion.button
                                    onClick={() => setIsOpen(false)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-1 text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>

                            {/* Topic Dropdown */}
                            <div className="relative">
                                <motion.button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    whileHover={{ scale: 1.02 }}
                                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors duration-200"
                                >
                                    <span>Choose a topic...</span>
                                    <motion.div
                                        animate={{ rotate: showDropdown ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown size={16} />
                                    </motion.div>
                                </motion.button>

                                <AnimatePresence>
                                    {showDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto"
                                        >
                                            {topicCategories.map((category, categoryIndex) => (
                                                <div key={categoryIndex} className="p-2">
                                                    <div className="text-xs font-semibold text-gray-400 px-2 py-1 mb-1">
                                                        {category.category}
                                                    </div>
                                                    {category.topics.map((topic, topicIndex) => (
                                                        <motion.button
                                                            key={topicIndex}
                                                            whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.5)" }}
                                                            onClick={() => {
                                                                setInputMessage(topic.text);
                                                                setShowDropdown(false);
                                                                setTimeout(handleSendMessage, 100);
                                                            }}
                                                            className="w-full flex items-center space-x-2 px-2 py-2 text-left text-gray-300 hover:text-white rounded text-sm transition-colors duration-200"
                                                        >
                                                            <span>{topic.icon}</span>
                                                            <span>{topic.text}</span>
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-start space-x-2 max-w-[90%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${msg.type === 'user' ? 'bg-primary-500' : 'bg-green-500'
                                            }`}>
                                            {msg.type === 'user' ? <User size={14} /> : <Bot size={14} />}
                                        </div>
                                        <div className={`p-4 rounded-2xl max-w-full ${msg.type === 'user'
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-700 text-gray-100'
                                            }`}>
                                            <p className="text-sm whitespace-pre-line leading-relaxed">{msg.message}</p>
                                            <p className="text-xs opacity-70 mt-2">
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex items-start space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                            <Bot size={14} />
                                        </div>
                                        <div className="bg-gray-700 p-3 rounded-2xl">
                                            <div className="flex space-x-1">
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        <div className="p-3 border-t border-gray-700">
                            <div className="text-xs text-gray-400 mb-2 font-medium">Quick Actions:</div>
                            <div className="grid grid-cols-2 gap-2">
                                {quickActions.map((action, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setInputMessage(action.text);
                                            setTimeout(handleSendMessage, 100);
                                        }}
                                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-xs transition-colors duration-200 flex items-center space-x-2"
                                    >
                                        <span>{action.icon}</span>
                                        <span className="truncate">{action.text}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-700">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask about farming, crops, or sensors..."
                                    className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim()}
                                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white p-2 rounded-lg transition-colors duration-200"
                                >
                                    <Send size={16} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AgriBotChatbot;