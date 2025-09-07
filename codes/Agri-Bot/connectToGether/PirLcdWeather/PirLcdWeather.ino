#include <WiFi.h>
#include <FirebaseESP32.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <TimeLib.h>
#include <DHT.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// WiFi credentials
#define WIFI_SSID "Dialog 4G 495"
#define WIFI_PASSWORD "56771CC7"

// Firebase credentials
#define FIREBASE_HOST "https://agri-bot-17548-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "GIAZZQjvR6LE5lJzkSQqPU1gZ5VWL8OupY6KQgCn"

// Pins
#define PIR_PIN 13
#define BUZZER_PIN 12
#define DHT_PIN 14
#define DHT_TYPE DHT11

// LCD
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// NTP
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 19800); // IST offset

// DHT sensor
DHT dht(DHT_PIN, DHT_TYPE);

// Motion
bool motionDetected = false;
unsigned long lastSensorUpload = 0;
unsigned long lastLCDUpdate = 0;
bool showFace = true;

byte openEye[] = {
  B00000,
  B00000,
  B01110,
  B10001,
  B10001,
  B01110,
  B00000,
  B00000
};

byte closedEye[] = {
  B00000,
  B00000,
  B01110,
  B00000,
  B00000,
  B01110,
  B00000,
  B00000
};

void setup() {
  Serial.begin(115200);

  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  dht.begin();
  lcd.init();
  lcd.backlight();

  lcd.createChar(0, openEye);
  lcd.createChar(1, closedEye);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi Connected");

  timeClient.begin();
  timeClient.update();

  config.database_url = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Serial.println("✅ Firebase and Time Sync Ready");
}

void loop() {
  int pirState = digitalRead(PIR_PIN);
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  unsigned long now = millis();

  if (pirState == HIGH && !motionDetected) {
    motionDetected = true;
    Serial.println("🚨 Motion Detected");

    digitalWrite(BUZZER_PIN, HIGH);
    delay(500);
    digitalWrite(BUZZER_PIN, LOW);

    timeClient.update();
    time_t rawTime = timeClient.getEpochTime();
    setTime(rawTime);

    char timestamp[25];
    snprintf(timestamp, sizeof(timestamp), "%04d-%02d-%02d %02d:%02d:%02d",
             year(), month(), day(), hour(), minute(), second());

    Serial.print("🕒 Timestamp: ");
    Serial.println(timestamp);

    Firebase.setString(fbdo, "/security/last_motion_time", timestamp);
    Firebase.setBool(fbdo, "/security/motion_status", true);
  }

  if (pirState == LOW && motionDetected) {
    motionDetected = false;
    Serial.println("✅ Motion stopped");
    Firebase.setBool(fbdo, "/security/motion_status", false);
  }

  // Upload sensor data every 5 seconds
  if (now - lastSensorUpload > 5000) {
    lastSensorUpload = now;
    if (!isnan(temp) && !isnan(hum)) {
      Firebase.setFloat(fbdo, "/weather/temperature", temp);
      Firebase.setFloat(fbdo, "/weather/humidity", hum);
      Serial.printf("🌡 Temp: %.1f°C  💧 Humidity: %.1f%%\n", temp, hum);
    } else {
      Serial.println("❌ DHT Read Error");
    }
  }

  // Alternate LCD display every 3 seconds
  if (now - lastLCDUpdate > 3000) {
    lastLCDUpdate = now;
    lcd.clear();
    if (showFace) {
      lcd.setCursor(5, 0);
      lcd.write(byte(0)); // Open Eye
      lcd.setCursor(6, 0);
      lcd.write(byte(1)); // Closed Eye
      lcd.setCursor(4, 1);
      lcd.print("Agri-Bot");
    } else {
      lcd.setCursor(0, 0);
      lcd.print("T:");
      lcd.print(temp);
      lcd.print((char)223);
      lcd.print("C ");

      lcd.print("H:");
      lcd.print(hum);
      lcd.print("%");

      lcd.setCursor(0, 1);
      lcd.print("Motion: ");
      lcd.print(motionDetected ? "YES" : "NO ");
    }
    showFace = !showFace;
  }

  delay(100);
}
