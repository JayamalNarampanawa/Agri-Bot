// Firebase configuration - keeping your existing script.js logic intact
const firebaseConfig = {
  apiKey: "AIzaSyCvvvs04KJ0M-OxbldlV78-yxOVJyhAnCE",
  authDomain: "agri-bot-17548.firebaseapp.com",
  databaseURL: "https://agri-bot-17548-default-rtdb.firebaseio.com",
  projectId: "agri-bot-17548",
  storageBucket: "agri-bot-17548.appspot.com",
  messagingSenderId: "437600300267",
  appId: "1:437600300267:web:67baad95b4416cdc2ce2ae"
};

// Initialize Firebase (using global firebase from CDN)
if (typeof window !== 'undefined' && window.firebase) {
  window.firebase.initializeApp(firebaseConfig);
  window.db = window.firebase.database();
}

export default firebaseConfig;