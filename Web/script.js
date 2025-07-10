const firebaseConfig = {
  apiKey: "AIzaSyCvvvs04KJ0M-OxbldlV78-yxOVJyhAnCE",
  authDomain: "agri-bot-17548.firebaseapp.com",
  databaseURL: "https://agri-bot-17548-default-rtdb.firebaseio.com",
  projectId: "agri-bot-17548",
  storageBucket: "agri-bot-17548.appspot.com",
  messagingSenderId: "437600300267",
  appId: "1:437600300267:web:67baad95b4416cdc2ce2ae"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const moistureGauge = document.getElementById("moisture-gauge");
const moistureValue = document.getElementById("moisture-value");
const pumpStatusDisplay = document.getElementById("pump-status");
const tempDisplay = document.getElementById("temperature");
const humidityDisplay = document.getElementById("humidity");
const lastMotionDisplay = document.getElementById("last-motion");
const lightStatusDisplay = document.getElementById("light-status");

// Soil moisture listener
db.ref("/moisture").on("value", snapshot => {
  const value = snapshot.val();
  if (value !== null) {
    moistureValue.textContent = value + "%";
    moistureGauge.style.background = `conic-gradient(#4caf50 0% ${value}%, #444 ${value}% 100%)`;
  } else {
    moistureValue.textContent = "--%";
    moistureGauge.style.background = `conic-gradient(#444 0% 100%)`;
  }
});

// Pump status listener
db.ref("/pump").on("value", snapshot => {
  const status = snapshot.val();
  pumpStatusDisplay.textContent = "Pump Status: " + (status ? "ON" : "OFF");
});

// Weather listener
db.ref("/weather").on("value", snapshot => {
  const weather = snapshot.val();
  if (weather) {
    tempDisplay.textContent = weather.temperature ?? "--";
    humidityDisplay.textContent = weather.humidity ?? "--";
  } else {
    tempDisplay.textContent = "--";
    humidityDisplay.textContent = "--";
  }
});

// Security motion timestamp listener with debug
db.ref("/security/last_motion_time").on("value", snapshot => {
  const motionTime = snapshot.val();
  console.log("Motion timestamp from Firebase:", motionTime);  // DEBUG: Check console for this output
  lastMotionDisplay.textContent = motionTime || "--";
});

// Light sensor listener (added)
db.ref("/isDark").on("value", snapshot => {
  const isDark = snapshot.val();
  if (isDark === true) {
    lightStatusDisplay.textContent = "Dark 🌙";
  } else if (isDark === false) {
    lightStatusDisplay.textContent = "Light ☀️";
  } else {
    lightStatusDisplay.textContent = "--";
  }
});

// Pump toggle button logic
document.getElementById("toggle-pump").addEventListener("click", () => {
  db.ref("/pump").once("value").then(snapshot => {
    const current = snapshot.val();
    db.ref("/pump").set(!current);
  });
});

// Header shrink on scroll effect
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  header.classList.toggle("shrink", window.scrollY > 100);
});
