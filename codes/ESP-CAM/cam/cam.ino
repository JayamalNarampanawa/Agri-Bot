#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

Adafruit_PWMServoDriver srituhobby = Adafruit_PWMServoDriver();

#define servo1 0
#define servo2 1
#define servo3 2
#define servo4 3

void setup() {
  Serial.begin(9600);
  srituhobby.begin();
  srituhobby.setPWMFreq(60);  // Standard servo frequency

  Serial.println("Starting servo test...");
  delay(1000);
}

void loop() {
  testServo(servo1, 330, 450, 10);
  testServo(servo2, 150, 380, 10);
  testServo(servo3, 300, 380, 10);
  testServo(servo4, 410, 510, 10);

  Serial.println("All servos tested. Looping again...");
  delay(2000);  // Wait before repeating test
}

// Function to test a single servo
void testServo(int servoNum, int start, int end, int stepDelay) {
  Serial.print("Testing servo ");
  Serial.println(servoNum);

  // Move from start to end
  for (int pos = start; pos <= end; pos++) {
    srituhobby.setPWM(servoNum, 0, pos);
    delay(stepDelay);
  }

  // Move back from end to start
  for (int pos = end; pos >= start; pos--) {
    srituhobby.setPWM(servoNum, 0, pos);
    delay(stepDelay);
  }

  Serial.print("Servo ");
  Serial.print(servoNum);
  Serial.println(" test done.\n");
}
