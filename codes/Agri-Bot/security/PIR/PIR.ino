#include <WiFi.h>
#include <FirebaseESP32.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

// WiFi credentials
#define WIFI_SSID "Dialog 4G 495"
#define WIFI_PASSWORD "56771CC7"

// Firebase credentials
#define FIREBASE_HOST "https://agri-bot-17548-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "GIAZZQjvR6LE5lJzkSQqPU1gZ5VWL8OupY6KQgCn"

// PIR and buzzer pins
#define PIR_PIN 13
#define BUZZER_PIN 12

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 19800); // IST offset = 5.5 hours = 19800s

bool motionDetected = false;

void setup() {
  Serial.begin(115200);

  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi Connected");

  // Setup time
  timeClient.begin();
  timeClient.update();

  // Firebase configuration
  config.database_url = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Serial.println("✅ Firebase & Time Sync Ready");
}

void loop() {
  int pirValue = digitalRead(PIR_PIN);

  if (pirValue == HIGH && !motionDetected) {
    motionDetected = true;

    Serial.println("🚨 Motion Detected!");

    // Trigger buzzer
    digitalWrite(BUZZER_PIN, HIGH);
    delay(500);
    digitalWrite(BUZZER_PIN, LOW);

    // Get timestamp
    timeClient.update();
    String currentTime = timeClient.getFormattedTime();  // hh:mm:ss
    String fullTime = "Detected at " + currentTime;

    // Send to Firebase
    if (Firebase.setString(fbdo, "/security/last_motion_time", fullTime)) {
      Serial.println("✅ Motion time updated in Firebase: " + fullTime);
    } else {
      Serial.print("❌ Firebase error: ");
      Serial.println(fbdo.errorReason());
    }
  }

  if (pirValue == LOW && motionDetected) {
    motionDetected = false;
    Serial.println("✅ Motion Stopped");
  }

  delay(50); // debounce
}
