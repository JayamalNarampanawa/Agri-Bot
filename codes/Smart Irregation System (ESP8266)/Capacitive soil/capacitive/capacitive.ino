// Arduino Uno R3 code for sending moisture data to ESP8266 via UART

// Pin definitions
const int moisturePin1 = A0;  
const int moisturePin2 = A1;  

void setup() {
  Serial.begin(115200); // Match ESP8266 baud rate
}

void loop() {
  // Read analog values
  int raw1 = analogRead(moisturePin1);
  int raw2 = analogRead(moisturePin2);

  // Convert to percentage (adjust calibration if needed)
  int moisture1 = map(raw1, 1023, 300, 0, 100);
  int moisture2 = map(raw2, 1023, 300, 0, 100);

  // Constrain values to valid range
  moisture1 = constrain(moisture1, 0, 100);
  moisture2 = constrain(moisture2, 0, 100);

  // Send as "moisture1,moisture2"
  Serial.print(moisture1);
  Serial.print(",");
  Serial.println(moisture2);

  delay(2000); // Send every 2 seconds
}
