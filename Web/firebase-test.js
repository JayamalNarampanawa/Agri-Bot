// Firebase connectivity test script
// Run this in browser console to test Firebase connection

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCvvvs04KJ0M-OxbldlV78-yxOVJyhAnCE",
  authDomain: "agri-bot-17548.firebaseapp.com",
  databaseURL: "https://agri-bot-17548-default-rtdb.firebaseio.com",
  projectId: "agri-bot-17548",
  storageBucket: "agri-bot-17548.appspot.com",
  messagingSenderId: "437600300267",
  appId: "1:437600300267:web:67baad95b4416cdc2ce2ae"
};

// Test Firebase connection
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

console.log('Testing Firebase connection...');

// Test reading from different paths
const testPaths = ['/moisture', '/pump', '/weather', '/isDark', '/security/last_motion_time'];

testPaths.forEach(path => {
  const testRef = ref(database, path);
  onValue(testRef, (snapshot) => {
    const data = snapshot.val();
    console.log(`✅ ${path}:`, data);
  }, (error) => {
    console.error(`❌ ${path}:`, error);
  });
});

console.log('Firebase test completed. Check console for results.');

