// Relay test for ESP32 (GPIO27)
const int RELAY_PIN = 27;

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  // ensure OFF on start — most relay modules are active LOW so HIGH = OFF
  digitalWrite(RELAY_PIN, HIGH);
  Serial.println("Relay test starting. Watch for clicking and bulb ON/OFF.");
}

void loop() {
  Serial.println("Turning RELAY ON (drive LOW)"); // active LOW modules
  digitalWrite(RELAY_PIN, LOW);
  delay(3000);

  Serial.println("Turning RELAY OFF (drive HIGH)");
  digitalWrite(RELAY_PIN, HIGH);
  delay(3000);
}
