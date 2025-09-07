# Agri-Bot Dashboard - React Version

A modern, responsive React application for the Agri-Bot Smart Farming System with enhanced UI/UX, animations, and real-time IoT data visualization.

## 🚀 Features

- **Modern React Architecture** - Built with React 18 and functional components
- **Beautiful UI/UX** - Enhanced with Framer Motion animations and Tailwind CSS
- **Real-time Data** - Live IoT sensor data from Firebase
- **Responsive Design** - Works perfectly on all devices
- **Rich Icons** - Lucide React icons for better visual appeal
- **Smooth Animations** - Engaging micro-interactions and transitions
- **Component-based** - Modular and maintainable code structure

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Firebase** - Real-time database for IoT data
- **Responsive Design** - Mobile-first approach

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── About.js        # Team and project information
│   ├── Camera.js       # Live camera feed component
│   ├── Footer.js       # Footer with branding
│   ├── Hero.js         # Landing hero section
│   ├── Irrigation.js   # Water pump controls
│   ├── LightSensor.js  # Light condition monitoring
│   ├── Loader.js       # Loading animation
│   ├── Navigation.js   # Main navigation bar
│   ├── Security.js     # Motion detection display
│   ├── SoilMoisture.js # Soil moisture gauge
│   └── Weather.js      # Temperature and humidity
├── firebase/           # Firebase configuration
│   └── config.js       # Firebase setup
├── pages/              # Main page components
│   ├── Contact.js      # Contact form page
│   └── Dashboard.js    # Main dashboard page
├── App.js              # Main app component
├── index.js            # React entry point
└── index.css           # Global styles
```

## 🎨 Key Improvements

### Enhanced UI/UX
- **Glassmorphism effects** with backdrop blur
- **Gradient backgrounds** and borders
- **Hover animations** and micro-interactions
- **Loading states** and smooth transitions
- **Status indicators** with color coding

### Better Components
- **Modular architecture** - Each sensor has its own component
- **Reusable patterns** - Consistent design language
- **Responsive layouts** - Grid and flexbox layouts
- **Accessibility** - Proper ARIA labels and keyboard navigation

### Rich Animations
- **Page transitions** with Framer Motion
- **Staggered animations** for lists and grids
- **Hover effects** on interactive elements
- **Loading animations** and spinners
- **Scroll-triggered animations** using viewport detection

## 🔧 Configuration

### Firebase Setup
The Firebase configuration is preserved from your original `script.js`:
- Database URL: `https://agri-bot-17548-default-rtdb.firebaseio.com`
- Real-time listeners for all sensor data
- Pump control functionality maintained

### Environment Variables
No additional environment variables needed - Firebase config is included in the build.

## 📱 Responsive Design

- **Mobile-first** approach with Tailwind CSS
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Flexible layouts** that adapt to screen size
- **Touch-friendly** interactions on mobile devices

## 🎯 IoT Integration

Your existing IoT functionality is preserved:
- **Soil moisture** monitoring with visual gauge
- **Water pump** control with status feedback  
- **Weather data** (temperature & humidity)
- **Light sensor** day/night detection
- **Camera feed** from ESP32-CAM
- **Motion detection** security system

## 🚀 Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your web server or hosting platform

3. **Update camera URL** in `src/components/Camera.js` with your ESP32-CAM IP

## 🔄 Migration from HTML

Your original functionality is preserved:
- ✅ All Firebase listeners maintained
- ✅ Pump control logic intact  
- ✅ Real-time data updates working
- ✅ Camera stream integration
- ✅ Motion detection alerts
- ✅ Responsive design improved

## 🎨 Customization

### Colors
Modify the color scheme in `tailwind.config` within `public/index.html`:
```javascript
colors: {
  primary: {
    // Your custom color palette
  }
}
```

### Animations
Adjust animation settings in individual components using Framer Motion props:
```javascript
animate={{ scale: [1, 1.1, 1] }}
transition={{ duration: 2, repeat: Infinity }}
```

## 📞 Support

For technical support or questions about the Agri-Bot system, use the contact form in the application or reach out to the development team.

---

**Built with ❤️ by the Agri-Bot Team at NIBM**