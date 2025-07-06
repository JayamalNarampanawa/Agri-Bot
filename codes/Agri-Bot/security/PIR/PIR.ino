#include <WiFi.h>
#include <FirebaseESP32.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <TimeLib.h>  // Library for time formatting

// Wi-Fi credentials
#define WIFI_SSID "Dialog 4G 495"
#define WIFI_PASSWORD "56771CC7"

// Firebase credentials
#define FIREBASE_HOST "https://agri-bot-17548-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "GIAZZQjvR6LE5lJzkSQqPU1gZ5VWL8OupY6KQgCn"

// PIR and Buzzer pins
#define PIR_PIN 13
#define BUZZER_PIN 12

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// NTP time client (IST = UTC + 5.5 hrs = 19800 seconds)
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 19800); // IST offset

bool motionDetected = false;

void setup() {
  Serial.begin(115200);

  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi Connected");

  // Start NTP client
  timeClient.begin();
  timeClient.update();

  // Set up Firebase
  config.database_url = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Serial.println("✅ Firebase and Time Sync Ready");
}

void loop() {
  int pirState = digitalRead(PIR_PIN);

  if (pirState == HIGH && !motionDetected) {
    motionDetected = true;

    Serial.println("🚨 Motion Detected");

    // Buzzer alert
    digitalWrite(BUZZER_PIN, HIGH);
    delay(500);
    digitalWrite(BUZZER_PIN, LOW);

    // Get full time
    timeClient.update();
    time_t rawTime = timeClient.getEpochTime();
    setTime(rawTime);

    // Format to: YYYY-MM-DD HH:MM:SS
    char timestamp[25];
    snprintf(timestamp, sizeof(timestamp), "%04d-%02d-%02d %02d:%02d:%02d",
             year(), month(), day(), hour(), minute(), second());

    Serial.print("🕒 Timestamp: ");
    Serial.println(timestamp);

    // Send to Firebase
    if (Firebase.setString(fbdo, "/security/last_motion_time", timestamp)) {
      Serial.println("✅ Timestamp sent to Firebase");
    } else {
      Serial.print("❌ Firebase Error: ");
      Serial.println(fbdo.errorReason());
    }
  }

  if (pirState == LOW && motionDetected) {
    motionDetected = false;
    Serial.println("✅ Motion stopped");
  }

  delay(100);
}
