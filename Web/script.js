// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCvvvs04KJ0M-OxbldlV78-yxOVJyhAnCE",
  authDomain: "agri-bot-17548.firebaseapp.com",
  databaseURL: "https://agri-bot-17548-default-rtdb.firebaseio.com",
  projectId: "agri-bot-17548",
  storageBucket: "agri-bot-17548.firebasestorage.app",
  messagingSenderId: "437600300267",
  appId: "1:437600300267:web:67baad95b4416cdc2ce2ae"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to moisture data
const db = firebase.database();
const moistureRef = db.ref("moisture");

// Realtime listener
moistureRef.on("value", (snapshot) => {
  const value = snapshot.val();
  document.getElementById("moisture").textContent = value;
  console.log("🔥 Moisture updated:", value);
});
