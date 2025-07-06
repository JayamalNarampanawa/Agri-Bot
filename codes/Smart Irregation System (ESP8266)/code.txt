#include <WiFi.h>
#include <FirebaseESP32.h>

// WiFi credentials
const char* ssid = "Dialog 4G 495";
const char* password = "56771CC7";

// Firebase credentials
#define FIREBASE_HOST "https://agri-bot-17548-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "GIAZZQjvR6LE5lJzkSQqPU1gZ5VWL8OupY6KQgCn"

// Firebase and data object
FirebaseData firebaseData;
FirebaseAuth firebaseAuth;
FirebaseConfig firebaseConfig;

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Connect to WiFi
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ Connected to WiFi");

  // Setup Firebase config
  firebaseConfig.database_url = FIREBASE_HOST;
  firebaseAuth.user.email = "";
  firebaseAuth.user.password = "";
  firebaseConfig.signer.tokens.legacy_token = FIREBASE_AUTH;

  // Initialize Firebase
  Firebase.begin(&firebaseConfig, &firebaseAuth);
  Firebase.reconnectWiFi(true);

  Serial.println("✅ Firebase Initialized");
}

void loop() {
  if (Firebase.getInt(firebaseData, "/moisture")) {
    if (firebaseData.dataType() == "int") {
      int moistureValue = firebaseData.intData();
      Serial.print("🌱 Soil Moisture: ");
      Serial.print(moistureValue);
      Serial.println("%");
    }
  } else {
    Serial.print("❌ Failed to read from Firebase: ");
    Serial.println(firebaseData.errorReason());
  }

  delay(2000);
}
