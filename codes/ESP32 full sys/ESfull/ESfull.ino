#include <WiFi.h>
#include <FirebaseESP32.h>

// -------- WiFi --------
#define WIFI_SSID "Dialog 4G 495"
#define WIFI_PASSWORD "56771CC7"

// -------- Firebase --------
#define FIREBASE_HOST "agri-bot-17548-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "GIAZZQjvR6LE5lJzkSQqPU1gZ5VWL8OupY6KQgCn"

FirebaseData fbdo;
FirebaseConfig config;

// -------- Pin Assignments --------
#define SENSOR1_PIN 34
#define SENSOR2_PIN 35
#define TANK_SENSOR_PIN 33
#define LIGHT_SENSOR_PIN 32  // Light sensor (analog input)
#define LED_PIN 27           // LED / Bulb

#define PUMP1_PIN 22
#define PUMP2_PIN 25
#define TANK_PUMP_PIN 26

// -------- Thresholds --------
int dryThreshold = 3000;   // Soil dry → pump ON
int wetThreshold = 2500;   // Soil wet → pump OFF
int tankLow = 1500;        // Tank empty
int tankHigh = 2500;       // Tank full
int darkThreshold = 1000;  // Light sensor: below → dark

// States
bool pump1State = false;
bool pump2State = false;
bool tankPumpState = false;
bool ledState = false;

void setup() {
  Serial.begin(115200);

  // Relays & LED setup
  pinMode(PUMP1_PIN, OUTPUT);
  pinMode(PUMP2_PIN, OUTPUT);
  pinMode(TANK_PUMP_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);

  // All relays OFF at start
  digitalWrite(PUMP1_PIN, HIGH);
  digitalWrite(PUMP2_PIN, HIGH);
  digitalWrite(TANK_PUMP_PIN, HIGH);
  digitalWrite(LED_PIN, LOW);

  // WiFi connection
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi connected");

  // Firebase config for database secret
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;

  // Initialize Firebase
  Firebase.begin(&config, nullptr);
  Firebase.reconnectWiFi(true);

  Serial.println("✅ Firebase initialized using database secret");
}

void loop() {
  // --- Read sensors ---
  int sensor1 = analogRead(SENSOR1_PIN);
  int sensor2 = analogRead(SENSOR2_PIN);
  int tankSensor = analogRead(TANK_SENSOR_PIN);
  int lightSensor = analogRead(LIGHT_SENSOR_PIN);

  // Convert to %
  int sensor1Pct = map(sensor1, 4095, 0, 0, 100);
  int sensor2Pct = map(sensor2, 4095, 0, 0, 100);
  int tankPct = map(tankSensor, 0, 4095, 0, 100);

  // --- Pump logic ---
  pump1State = sensor1 > dryThreshold ? true : (sensor1 < wetThreshold ? false : pump1State);
  pump2State = sensor2 > dryThreshold ? true : (sensor2 < wetThreshold ? false : pump2State);
  tankPumpState = tankSensor < tankLow ? true : (tankSensor > tankHigh ? false : tankPumpState);

  // --- Light logic (NEW SYSTEM) ---
  if (lightSensor < darkThreshold) {
    ledState = true;   // Dark → turn ON
  } else {
    ledState = false;  // Bright → turn OFF
  }
  digitalWrite(LED_PIN, ledState ? HIGH : LOW);

  // --- Apply pump relay states ---
  digitalWrite(PUMP1_PIN, pump1State ? LOW : HIGH);
  digitalWrite(PUMP2_PIN, pump2State ? LOW : HIGH);
  digitalWrite(TANK_PUMP_PIN, tankPumpState ? LOW : HIGH);

  // --- Debug output ---
  Serial.printf("Soil1: %d%% Pump1: %s || Soil2: %d%% Pump2: %s || Tank: %d%% Pump: %s || Light Value: %d LED: %s\n",
                sensor1Pct, pump1State ? "ON" : "OFF",
                sensor2Pct, pump2State ? "ON" : "OFF",
                tankPct, tankPumpState ? "ON" : "OFF",
                lightSensor, ledState ? "ON" : "OFF");

  // --- Send data to Firebase ---
  if (Firebase.ready()) {
    Firebase.setInt(fbdo, "/soil/sensor1_percent", sensor1Pct);
    Firebase.setBool(fbdo, "/soil/pump1", pump1State);

    Firebase.setInt(fbdo, "/soil/sensor2_percent", sensor2Pct);
    Firebase.setBool(fbdo, "/soil/pump2", pump2State);

    Firebase.setInt(fbdo, "/tank/level_percent", tankPct);
    Firebase.setBool(fbdo, "/tank/pump", tankPumpState);

    Firebase.setInt(fbdo, "/light/raw_value", lightSensor); // raw value (0–4095)
    Firebase.setBool(fbdo, "/light/LED", ledState);
  }

  delay(2000);
}
