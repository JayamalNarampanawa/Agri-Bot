#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <SoftwareSerial.h>  // For Arduino UART

// ==================== WiFi credentials ====================
#define WIFI_SSID "Dialog 4G 495"
#define WIFI_PASSWORD "56771CC7"

// ==================== Firebase credentials ====================
#define FIREBASE_HOST "agri-bot-17548-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "GIAZZQjvR6LE5lJzkSQqPU1gZ5VWL8OupY6KQgCn"

FirebaseData firebaseData;
FirebaseConfig firebaseConfig;
FirebaseAuth firebaseAuth;

// ==================== ESP8266 Pins ====================
const int sensorPin = A0;      // Built-in soil moisture sensor
const int relayPin = D1;       // Relay for tank pump
const int lightSensorPin = D5; // HW-072 light sensor (digital)
const int ledPin = D2;         // LED indicator

// ==================== Thresholds ====================
const int lowerThreshold = 20;  // Pump ON threshold
const int upperThreshold = 50;  // Pump OFF threshold

bool pumpState = false;
bool lastPumpState = false;
bool lastLightState = false;

// ==================== UART from Arduino ====================
// D6 → RX from Arduino, D7 → TX to Arduino
SoftwareSerial arduinoSerial(D7, D6); // RX, TX
String incomingData = "";
int moisture1_ext = 0;
int moisture2_ext = 0;

void setup() {
  Serial.begin(115200);         // Debugging
  arduinoSerial.begin(115200);  // Match Arduino baud

  pinMode(sensorPin, INPUT);
  pinMode(relayPin, OUTPUT);
  pinMode(lightSensorPin, INPUT);
  pinMode(ledPin, OUTPUT);

  digitalWrite(relayPin, LOW);
  digitalWrite(ledPin, LOW);

  // WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");

  // Firebase
  firebaseConfig.host = FIREBASE_HOST;
  firebaseAuth.user.email = "";
  firebaseAuth.user.password = "";
  firebaseConfig.signer.tokens.legacy_token = FIREBASE_AUTH;

  Firebase.begin(&firebaseConfig, &firebaseAuth);
  Firebase.reconnectWiFi(true);
  Serial.println("Firebase initialized");
}

void loop() {
  // ==================== Receive Arduino Moisture ====================
  if (arduinoSerial.available()) {
    incomingData = arduinoSerial.readStringUntil('\n'); // Format: "value1,value2"
    int commaIndex = incomingData.indexOf(',');
    if (commaIndex > 0) {
      moisture1_ext = incomingData.substring(0, commaIndex).toInt();
      moisture2_ext = incomingData.substring(commaIndex + 1).toInt();

      Serial.println("Arduino Moisture 1: " + String(moisture1_ext));
      Serial.println("Arduino Moisture 2: " + String(moisture2_ext));

      Firebase.setInt(firebaseData, "/moisture1_ext", moisture1_ext);
      Firebase.setInt(firebaseData, "/moisture2_ext", moisture2_ext);
    }
  }

  // ==================== ESP8266 Built-in Moisture ====================
  int rawValue = analogRead(sensorPin);
  int moisture = map(rawValue, 1024, 300, 0, 100);
  moisture = constrain(moisture, 0, 100);

  Serial.print("Built-in Moisture: ");
  Serial.println(moisture);
  Firebase.setInt(firebaseData, "/moisture", moisture);

  // ==================== Tank Pump Control ====================
  if (!pumpState && moisture < lowerThreshold) {
    pumpState = true;
  } else if (pumpState && moisture >= upperThreshold) {
    pumpState = false;
  }

  if (pumpState != lastPumpState) {
    digitalWrite(relayPin, pumpState ? HIGH : LOW);
    Serial.println(pumpState ? "💧 Tank Pump ON" : "🌱 Tank Pump OFF");

    if (Firebase.setBool(firebaseData, "/pump", pumpState)) {
      Serial.println("✅ Tank pump state sent to Firebase");
    } else {
      Serial.print("❌ Firebase pump error: ");
      Serial.println(firebaseData.errorReason());
    }
    lastPumpState = pumpState;
  }

  // ==================== Light Sensor ====================
  bool isDark = (digitalRead(lightSensorPin) == HIGH);
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

  delay(2000); // Reduce loop to 2 seconds to match Arduino updates
}
