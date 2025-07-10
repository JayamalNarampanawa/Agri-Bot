#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>

// WiFi credentials
#define WIFI_SSID "Dialog 4G 495"
#define WIFI_PASSWORD "56771CC7"

// Firebase credentials
#define FIREBASE_HOST "agri-bot-17548-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "GIAZZQjvR6LE5lJzkSQqPU1gZ5VWL8OupY6KQgCn"

FirebaseData firebaseData;
FirebaseConfig firebaseConfig;
FirebaseAuth firebaseAuth;

// Pins
const int analogPin = A0;  // Shared between sensors
const int relayPin = D1;
const int lightLedPin = D2;

// Moisture threshold
const int lowerThreshold = 20;
const int upperThreshold = 50;

bool pumpState = false;

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected");

  firebaseConfig.host = FIREBASE_HOST;
  firebaseAuth.user.email = "";
  firebaseAuth.user.password = "";
  firebaseConfig.signer.tokens.legacy_token = FIREBASE_AUTH;

  Firebase.begin(&firebaseConfig, &firebaseAuth);
  Firebase.reconnectWiFi(true);
  Serial.println("Firebase Initialized");

  pinMode(relayPin, OUTPUT);
  pinMode(lightLedPin, OUTPUT);

  digitalWrite(relayPin, LOW);  // Pump OFF
  digitalWrite(lightLedPin, LOW);  // LED OFF
}

void loop() {
  // === Moisture Sensor ===
  int moistureRaw = analogRead(analogPin);
  int moisture = map(moistureRaw, 1024, 300, 0, 100);
  moisture = constrain(moisture, 0, 100);

  Serial.print("Moisture: ");
  Serial.println(moisture);

  if (Firebase.setInt(firebaseData, "/moisture", moisture)) {
    Serial.println("✅ Moisture sent to Firebase");
  }

  if (!pumpState && moisture < lowerThreshold) {
    digitalWrite(relayPin, HIGH);
    pumpState = true;
    Serial.println("💧 Pump ON");
    Firebase.setBool(firebaseData, "/pump", true);
  } else if (pumpState && moisture >= upperThreshold) {
    digitalWrite(relayPin, LOW);
    pumpState = false;
    Serial.println("🌱 Pump OFF");
    Firebase.setBool(firebaseData, "/pump", false);
  }

  delay(1000);  // Short delay before switching sensor

  // === Light Sensor ===
  int lightRaw = analogRead(analogPin);
  Serial.print("Light Raw Value: ");
  Serial.println(lightRaw);

  // Adjust this threshold based on ambient light
  if (lightRaw < 500) {  // It's dark
    digitalWrite(lightLedPin, HIGH);
    Serial.println("🌙 Dark → LED ON");
  } else {
    digitalWrite(lightLedPin, LOW);
    Serial.println("☀️ Bright → LED OFF");
  }

  delay(4000);  // Wait before next loop
}
