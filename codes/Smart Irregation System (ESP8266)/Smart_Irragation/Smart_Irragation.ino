#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>

// WiFi credentials
#define WIFI_SSID "Dialog 4G 495"
#define WIFI_PASSWORD "56771CC7"

// Firebase project credentials
#define FIREBASE_HOST "agri-bot-17548-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "GIAZZQjvR6LE5lJzkSQqPU1gZ5VWL8OupY6KQgCn"

FirebaseData firebaseData;
FirebaseConfig firebaseConfig;
FirebaseAuth firebaseAuth;

const int sensorPin = A0;    // Soil moisture sensor (analog)
const int relayPin = D1;     // Relay for pump
const int lightSensorPin = D5; // HW-072 light sensor digital output
const int ledPin = D2;         // LED indicator

const int lowerThreshold = 20;  // Pump ON moisture threshold
const int upperThreshold = 50;  // Pump OFF moisture threshold

bool pumpState = false;  // Track pump status
bool ledState = false;   // Track LED state

unsigned long previousLightCheck = 0;
const unsigned long lightCheckInterval = 2UL * 60UL * 60UL * 1000UL; // 4 hours in milliseconds

void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(sensorPin, INPUT);
  pinMode(relayPin, OUTPUT);
  pinMode(lightSensorPin, INPUT);
  pinMode(ledPin, OUTPUT);

  digitalWrite(relayPin, LOW);
  digitalWrite(ledPin, LOW);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");

  // Firebase setup
  firebaseConfig.host = FIREBASE_HOST;
  firebaseAuth.user.email = "";
  firebaseAuth.user.password = "";
  firebaseConfig.signer.tokens.legacy_token = FIREBASE_AUTH;

  Firebase.begin(&firebaseConfig, &firebaseAuth);
  Firebase.reconnectWiFi(true);

  Serial.println("Firebase initialized");

  // Initial light check time
  previousLightCheck = millis() - lightCheckInterval;  // So first check runs immediately
}

void loop() {
  // Soil moisture reading
  int rawValue = analogRead(sensorPin);
  int moisture = map(rawValue, 1024, 300, 0, 100);
  moisture = constrain(moisture, 0, 100);

  Serial.print("Moisture: ");
  Serial.println(moisture);

  // Send moisture to Firebase
  if (Firebase.setInt(firebaseData, "/moisture", moisture)) {
    Serial.println("✅ Moisture data sent to Firebase");
  } else {
    Serial.print("❌ Firebase moisture error: ");
    Serial.println(firebaseData.errorReason());
  }

  // Pump control logic
  if (!pumpState && moisture < lowerThreshold) {
    digitalWrite(relayPin, HIGH);  // Turn ON pump
    pumpState = true;
    Serial.println("💧 Soil is dry → Pump ON");
    Firebase.setBool(firebaseData, "/pump", true);
  } else if (pumpState && moisture >= upperThreshold) {
    digitalWrite(relayPin, LOW);  // Turn OFF pump
    pumpState = false;
    Serial.println("🌱 Soil is wet enough → Pump OFF");
    Firebase.setBool(firebaseData, "/pump", false);
  }

  // Check light sensor every 4 hours
  if (millis() - previousLightCheck >= lightCheckInterval) {
    previousLightCheck = millis();

    bool isDark = (digitalRead(lightSensorPin) == LOW); // Assuming LOW means dark

    // LED ON if dark, OFF if light
    digitalWrite(ledPin, isDark ? HIGH : LOW);
    ledState = isDark;

    Serial.print("Light sensor: ");
    Serial.println(isDark ? "Dark" : "Light");

    // Send light state to Firebase
    if (Firebase.setBool(firebaseData, "/isDark", isDark)) {
      Serial.println("✅ Light data sent to Firebase");
    } else {
      Serial.print("❌ Firebase light error: ");
      Serial.println(firebaseData.errorReason());
    }
  }

  delay(5000); // Main loop delay to reduce CPU usage
}
