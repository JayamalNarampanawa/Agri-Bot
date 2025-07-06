#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <DHT.h>

// Wi-Fi credentials
#define WIFI_SSID "Dialog 4G 495"
#define WIFI_PASSWORD "56771CC7"

// Firebase credentials
#define DATABASE_URL "https://agri-bot-17548-default-rtdb.firebaseio.com"
#define DATABASE_SECRET "GIAZZQjvR6LE5lJzkSQqPU1gZ5VWL8OupY6KQgCn"

// DHT Sensor
#define DHTPIN 15
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Firebase objects
FirebaseData fbdo;
FirebaseConfig config;

unsigned long lastSendTime = 0;
const unsigned long sendInterval = 10000;

void setup() {
  Serial.begin(115200);
  dht.begin();

  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" connected!");

  // Firebase config
  config.database_url = DATABASE_URL;
  config.signer.tokens.legacy_token = DATABASE_SECRET;

  Firebase.begin(&config, nullptr);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if (millis() - lastSendTime > sendInterval) {
    lastSendTime = millis();

    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("❌ Failed to read from DHT sensor!");
      return;
    }

    Serial.printf("Temp: %.2f °C, Humidity: %.2f %%\n", temperature, humidity);

    if (Firebase.RTDB.setFloat(&fbdo, "/weather/temperature", temperature)) {
      Serial.println("✅ Temperature updated to Firebase");
    } else {
      Serial.print("✗ Temp error: ");
      Serial.println(fbdo.errorReason());
    }

    if (Firebase.RTDB.setFloat(&fbdo, "/weather/humidity", humidity)) {
      Serial.println("✅ Humidity updated to Firebase");
    } else {
      Serial.print("✗ Humidity error: ");
      Serial.println(fbdo.errorReason());
    }
  }
}
