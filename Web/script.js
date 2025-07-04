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

// Elements
const gaugeText = document.getElementById("moisture-value");
const needle = document.getElementById("needle");
const pumpStatusDisplay = document.getElementById("pump-status");
const tempDisplay = document.getElementById("temperature");
const humidityDisplay = document.getElementById("humidity");

// Live data from Firebase
db.ref("/moisture").on("value", snapshot => {
  const value = snapshot.val();
  gaugeText.textContent = `${value}%`;
  const angle = Math.min(180, Math.max(0, (value / 100) * 180));
  needle.style.transform = `rotate(${angle}deg)`;
});

db.ref("/pump").on("value", snapshot => {
  const status = snapshot.val();
  pumpStatusDisplay.textContent = "Pump Status: " + (status ? "ON" : "OFF");
});

db.ref("/weather").on("value", snapshot => {
  const weather = snapshot.val();
  tempDisplay.textContent = weather.temperature;
  humidityDisplay.textContent = weather.humidity;
});

// Toggle Pump
document.getElementById("toggle-pump").addEventListener("click", () => {
  db.ref("/pump").once("value").then(snapshot => {
    db.ref("/pump").set(!snapshot.val());
  });
});

// Shrink header on scroll
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  header.classList.toggle("shrink", window.scrollY > 100);
});
