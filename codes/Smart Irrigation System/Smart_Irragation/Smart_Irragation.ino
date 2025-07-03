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

const int sensorPin = A0;
const int relayPin = D1;
const int threshold = 40;

void setup() {
  Serial.begin(115200);
  delay(1000);

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

  pinMode(sensorPin, INPUT);
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, LOW);
}

void loop() {
  int rawValue = analogRead(sensorPin);
  int moisture = map(rawValue, 1024, 300, 0, 100);
  moisture = constrain(moisture, 0, 100);

  Serial.print("Moisture: ");
  Serial.println(moisture);

  if (Firebase.setInt(firebaseData, "/moisture", moisture)) {
    Serial.println("✅ Data sent to Firebase");
  } else {
    Serial.print("❌ Firebase error: ");
    Serial.println(firebaseData.errorReason());
  }

  if (moisture < threshold) {
    digitalWrite(relayPin, HIGH);
    Serial.println("💧 Soil is dry → Pump ON");
  } else {
    digitalWrite(relayPin, LOW);
    Serial.println("🌱 Soil is wet → Pump OFF");
  }

  delay(5000);
}
