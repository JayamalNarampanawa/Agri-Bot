import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Target, Heart } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "Jayamal",
      role: "Team Lead",
      image: "/assets/images/jayamal_aiya.jpg",
      description: "Leading the vision and strategy for sustainable farming solutions"
    },
    {
      name: "Poornima", 
      role: "Hardware Engineer",
      image: "/assets/images/pooki_akki.jpg",
      description: "Designing and implementing IoT hardware systems"
    },
    {
      name: "Mihiranga",
      role: "Software Developer", 
      image: "/assets/images/mihi.jpg",
      description: "Building robust software solutions and user interfaces"
    },
    {
      name: "Malith",
      role: "IoT Specialist",
      image: "/assets/images/me.jpg", 
      description: "Integrating sensors and connectivity solutions"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="backdrop-blur-xl bg-gradient-to-br from-dark-800/80 to-dark-700/60 border border-primary-500/20 rounded-3xl p-12 shadow-2xl" 
      id="about"
    >
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent mb-6 flex items-center justify-center space-x-4">
          <motion.i 
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="fas fa-users text-6xl text-primary-400"
          />
          <span>About Us</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          We are a passionate team from NIBM dedicated to transforming traditional agriculture through 
          real-time smart farming technologies. Agri-Bot is our capstone project for a sustainable future.
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-4xl mb-4"
          >
            <Target className="w-12 h-12 mx-auto text-blue-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-blue-400 mb-2">Our Mission</h3>
          <p className="text-gray-300 text-sm">
            Revolutionizing agriculture with smart IoT solutions for sustainable and efficient farming practices.
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="text-4xl mb-4"
          >
            <Award className="w-12 h-12 mx-auto text-green-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-green-400 mb-2">Our Vision</h3>
          <p className="text-gray-300 text-sm">
            Creating a world where technology empowers farmers to grow more with less environmental impact.
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="text-4xl mb-4"
          >
            <Heart className="w-12 h-12 mx-auto text-purple-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-purple-400 mb-2">Our Values</h3>
          <p className="text-gray-300 text-sm">
            Innovation, sustainability, and dedication to improving agricultural productivity worldwide.
          </p>
        </motion.div>
      </motion.div>
      
      {/* Team Members */}
      <motion.div variants={itemVariants}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
            <Users className="w-8 h-8 text-primary-400" />
            <span>Meet Our Team</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div 
              key={member.name}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group text-center"
            >
              <div className="relative mb-6">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  src={member.image} 
                  alt={member.name} 
                  className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-primary-500/50 shadow-2xl group-hover:border-primary-400 transition-all duration-300" 
                />
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                  className="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-primary-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-75 transition-opacity duration-500"
                />
                
                {/* Role badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full shadow-lg"
                >
                  {member.role.split(' ')[0]}
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-primary-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed px-2">
                  {member.description}
                </p>
              </motion.div>

              {/* Hover effect overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-primary-500/10 to-transparent rounded-2xl pointer-events-none"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Project Stats */}
      <motion.div 
        variants={itemVariants}
        className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {[
          { number: "4", label: "Team Members", icon: "fas fa-users" },
          { number: "6+", label: "Sensors", icon: "fas fa-satellite-dish" },
          { number: "24/7", label: "Monitoring", icon: "fas fa-clock" },
          { number: "100%", label: "Dedication", icon: "fas fa-heart" }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05 }}
            className="text-center p-4 bg-dark-800/50 rounded-xl border border-gray-600"
          >
            <motion.i
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: index * 0.2
              }}
              className={`${stat.icon} text-2xl mb-2 text-primary-400`}
            />
            <div className="text-2xl font-bold text-primary-400 mb-1">{stat.number}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default About;