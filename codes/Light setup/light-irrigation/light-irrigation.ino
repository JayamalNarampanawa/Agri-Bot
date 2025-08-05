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

const int sensorPin = A0;       // Soil moisture sensor (analog)
const int relayPin = D1;        // Relay for pump
const int lightSensorPin = D5;  // HW-072 or MH sensor digital output
const int ledPin = D2;          // LED indicator

const int lowerThreshold = 20;  // Pump ON moisture threshold
const int upperThreshold = 50;  // Pump OFF moisture threshold

bool pumpState = false;
bool ledState = false;

unsigned long previousLightCheck = 0;
const unsigned long lightCheckInterval = 1000UL; // 1 minute = 60s = 60,000 milliseconds

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
  Serial.println("\n✅ Connected to WiFi");

  // Firebase setup
  firebaseConfig.host = FIREBASE_HOST;
  firebaseAuth.user.email = "";
  firebaseAuth.user.password = "";
  firebaseConfig.signer.tokens.legacy_token = FIREBASE_AUTH;

  Firebase.begin(&firebaseConfig, &firebaseAuth);
  Firebase.reconnectWiFi(true);
  Serial.println("✅ Firebase initialized");

  previousLightCheck = millis() - lightCheckInterval; // First check runs immediately
}

void loop() {
  Serial.println("\n===== 🌱 Agri-Bot Status Update =====");

  // Read and send soil moisture
  int rawValue = analogRead(sensorPin);
  int moisture = map(rawValue, 1024, 300, 0, 100);
  moisture = constrain(moisture, 0, 100);
  Serial.print("💧 Soil Moisture: ");
  Serial.print(moisture);
  Serial.println("%");

  if (Firebase.setInt(firebaseData, "/moisture", moisture)) {
    Serial.println("✅ Moisture data sent to Firebase");
  } else {
    Serial.print("❌ Firebase moisture error: ");
    Serial.println(firebaseData.errorReason());
  }

  // Pump control
  if (!pumpState && moisture < lowerThreshold) {
    digitalWrite(relayPin, HIGH);
    pumpState = true;
    Serial.println("🔄 Pump Status: ON (Soil is dry)");
    Firebase.setBool(firebaseData, "/pump", true);
  } else if (pumpState && moisture >= upperThreshold) {
    digitalWrite(relayPin, LOW);
    pumpState = false;
    Serial.println("🔄 Pump Status: OFF (Soil is moist)");
    Firebase.setBool(firebaseData, "/pump", false);
  } else {
    Serial.print("🔄 Pump Status: ");
    Serial.println(pumpState ? "ON" : "OFF");
  }

  // Light sensor check every 1 minute
  if (millis() - previousLightCheck >= lightCheckInterval) {
    previousLightCheck = millis();

    bool isDark = (digitalRead(lightSensorPin) == HIGH); // HIGH means dark
    ledState = isDark;
    digitalWrite(ledPin, isDark ? HIGH : LOW);

    Serial.print("🔦 Light Status: ");
    Serial.println(isDark ? "DARK → LED ON" : "BRIGHT → LED OFF");

    if (Firebase.setBool(firebaseData, "/isDark", isDark)) {
      Serial.println("✅ Light data sent to Firebase");
    } else {
      Serial.print("❌ Firebase light error: ");
      Serial.println(firebaseData.errorReason());
    }
  }

  Serial.println("======================================\n");

  delay(2000);  // Main loop delay
}
