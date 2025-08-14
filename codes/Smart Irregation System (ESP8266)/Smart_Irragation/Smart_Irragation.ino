#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>

// ==================== WiFi credentials ====================
#define WIFI_SSID "Dialog 4G 495"
#define WIFI_PASSWORD "56771CC7"

// ==================== Firebase credentials ====================
#define FIREBASE_HOST "agri-bot-17548-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "GIAZZQjvR6LE5lJzkSQqPU1gZ5VWL8OupY6KQgCn"

FirebaseData firebaseData;
FirebaseConfig firebaseConfig;
FirebaseAuth firebaseAuth;

// ==================== Pin setup ====================
const int sensorPin = A0;      // Built-in soil moisture sensor
const int relayPin = D1;       // Relay for pump
const int lightSensorPin = D5; // HW-072 light sensor (digital)
const int ledPin = D2;         // LED indicator

// ==================== Thresholds ====================
const int lowerThreshold = 20;  // Pump ON threshold
const int upperThreshold = 50;  // Pump OFF threshold

bool pumpState = false;
bool lastPumpState = false; // for change detection
bool lastLightState = false; // for change detection

// ==================== UART moisture data ====================
String incomingData = "";
int moisture1_ext = 0;
int moisture2_ext = 0;

void setup() {
  Serial.begin(115200); // UART for Arduino UNO
  delay(1000);

  pinMode(sensorPin, INPUT);
  pinMode(relayPin, OUTPUT);
  pinMode(lightSensorPin, INPUT);
  pinMode(ledPin, OUTPUT);

  digitalWrite(relayPin, LOW);
  digitalWrite(ledPin, LOW);

  // WiFi connection
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
}

void loop() {
  // === Receive external moisture sensor data from Arduino ===
  if (Serial.available()) {
    incomingData = Serial.readStringUntil('\n'); // "value1,value2"
    int commaIndex = incomingData.indexOf(',');
    if (commaIndex > 0) {
      moisture1_ext = incomingData.substring(0, commaIndex).toInt();
      moisture2_ext = incomingData.substring(commaIndex + 1).toInt();

      Serial.println("External Moisture 1: " + String(moisture1_ext));
      Serial.println("External Moisture 2: " + String(moisture2_ext));

      Firebase.setInt(firebaseData, "/moisture1_ext", moisture1_ext);
      Firebase.setInt(firebaseData, "/moisture2_ext", moisture2_ext);
    }
  }

  // === Built-in soil moisture sensor reading ===
  int rawValue = analogRead(sensorPin);
  int moisture = map(rawValue, 1024, 300, 0, 100);
  moisture = constrain(moisture, 0, 100);

  Serial.print("Built-in Moisture: ");
  Serial.println(moisture);

  Firebase.setInt(firebaseData, "/moisture", moisture);

  // === Pump control with change detection ===
  if (!pumpState && moisture < lowerThreshold) {
    pumpState = true;  // ON
  } else if (pumpState && moisture >= upperThreshold) {
    pumpState = false; // OFF
  }

  // Only send pump status if it changed
  if (pumpState != lastPumpState) {
    digitalWrite(relayPin, pumpState ? HIGH : LOW);
    Serial.println(pumpState ? "💧 Soil dry → Pump ON" : "🌱 Soil wet → Pump OFF");

    if (Firebase.setBool(firebaseData, "/pump", pumpState)) {
      Serial.println("✅ Pump state sent to Firebase");
    } else {
      Serial.print("❌ Firebase pump error: ");
      Serial.println(firebaseData.errorReason());
    }
    lastPumpState = pumpState;
  }

  // === Light check with change detection ===
  bool isDark = (digitalRead(lightSensorPin) == HIGH); // HIGH means dark
  digitalWrite(ledPin, isDark ? HIGH : LOW);

  if (isDark != lastLightState) {
    Serial.print("Light sensor changed → ");
    Serial.println(isDark ? "Dark" : "Light");

    if (Firebase.setBool(firebaseData, "/isDark", isDark)) {
      Serial.println("✅ Light data sent to Firebase");
    } else {
      Serial.print("❌ Firebase light error: ");
      Serial.println(firebaseData.errorReason());
    }
    lastLightState = isDark;
  }

  delay(5000); // Main loop delay
}
