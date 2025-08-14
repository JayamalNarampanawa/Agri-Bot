void setup() {
  Serial.begin(9600); // Send data to ESP8266
}

void loop() {
  Serial.println("Hello from Arduino!");
  delay(1000);
}
