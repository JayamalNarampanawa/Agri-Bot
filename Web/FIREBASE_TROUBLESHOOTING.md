# Firebase Data Not Updating - Troubleshooting Guide

## Issues Fixed

### 1. **Conflicting Firebase Implementations**

- **Problem**: Both vanilla JavaScript (`script.js`) and React components were trying to initialize Firebase
- **Solution**: Removed vanilla JS implementation, updated React components to use Firebase v9 SDK

### 2. **Firebase SDK Version Mismatch**

- **Problem**: HTML was loading Firebase v8 CDN while React components expected v9
- **Solution**: Added Firebase v9 as npm dependency and updated all components

### 3. **Missing Error Handling**

- **Problem**: No error handling for Firebase connection issues
- **Solution**: Added comprehensive error handling and debug logging

## How to Run the Project

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Install Dependencies**

   ```bash
   cd Web
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm start
   ```

3. **Open Browser**
   - Navigate to `http://localhost:3000`
   - Open browser developer tools (F12)
   - Check console for Firebase connection logs

## Debugging Steps

### 1. Check Console Logs

Look for these debug messages in browser console:

- `Moisture data received: [value]`
- `Weather data received: [value]`
- `Pump status received: [value]`
- `Light sensor data received: [value]`
- `Security motion data received: [value]`

### 2. Check Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `agri-bot-17548`
3. Go to Realtime Database
4. Check if data exists at these paths:
   - `/moisture`
   - `/pump`
   - `/weather`
   - `/isDark`
   - `/security/last_motion_time`

### 3. Test Firebase Connection

Run the test script in browser console:

```javascript
// Copy and paste the contents of firebase-test.js into browser console
```

### 4. Check Network Tab

1. Open Developer Tools → Network tab
2. Look for Firebase requests to `firebaseio.com`
3. Check for any failed requests (red status codes)

## Common Issues & Solutions

### Issue: "Firebase is not defined"

**Solution**: Make sure you're running the React app (`npm start`) not opening the HTML file directly

### Issue: "Permission denied"

**Solution**: Check Firebase Realtime Database rules in Firebase Console:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### Issue: Data shows "--" or "Unknown"

**Solution**:

1. Check if data exists in Firebase Console
2. Verify the data structure matches expected format
3. Check console for error messages

### Issue: Components not updating

**Solution**:

1. Check if Firebase listeners are properly set up
2. Verify useEffect cleanup functions
3. Check for JavaScript errors in console

## Data Structure Expected

```json
{
  "moisture": 65,
  "pump": false,
  "weather": {
    "temperature": 25,
    "humidity": 60
  },
  "isDark": false,
  "security": {
    "last_motion_time": "2024-01-15 14:30:25"
  }
}
```

## Testing Data Updates

To test if the dashboard updates in real-time:

1. **Manual Test**: Update data directly in Firebase Console
2. **Arduino Test**: Ensure your Arduino/ESP32 is sending data to the correct Firebase paths
3. **Simulation**: Use Firebase Console to add test data

## Still Having Issues?

1. Check browser console for errors
2. Verify Firebase project configuration
3. Ensure internet connection is stable
4. Try refreshing the page
5. Clear browser cache and cookies

## Contact

If issues persist, check the console logs and provide the error messages for further assistance.

