#include <Servo.h> 
Servo Myservo;

// Ultrasonic Sensor Pins
#define trigPin 9
#define echoPin 8

// Motor Pins
#define MLa 4
#define MLb 5
#define MRa 6
#define MRb 7

long duration, distance;

void setup() {
  Serial.begin(9600);
  
  pinMode(MLa, OUTPUT);
  pinMode(MLb, OUTPUT);
  pinMode(MRa, OUTPUT);
  pinMode(MRb, OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  Myservo.attach(10);
  Myservo.write(90);  // Center the servo at start
  delay(1000);        // Let servo settle
}

void loop() {
  distance = getDistance();
  Serial.print("Distance: ");
  Serial.println(distance);

  if (distance > 15) {
    // Move forward
    Myservo.write(90);
    moveForward();
  }
  else if (distance < 10 && distance > 0) {
    stopMotors();
    delay(200);

    // Look around
    Myservo.write(0);   // Look left
    delay(500);
    Myservo.write(180); // Look right
    delay(500);
    Myservo.write(90);  // Back to center
    delay(500);

    moveBackward();
    delay(700);
    stopMotors();
    delay(300);

    turnLeft();
    delay(700);
    stopMotors();
    delay(200);
  }

  delay(100);
}

// ========== Functions ==========

long getDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2); 
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH, 30000); // Timeout after 30ms
  long dist = duration / 58.2;
  if (dist == 0) dist = 400;  // In case of timeout (no echo)
  return dist;
}

void moveForward() {
  digitalWrite(MLa, LOW);
  digitalWrite(MLb, HIGH);
  digitalWrite(MRa, LOW);
  digitalWrite(MRb, HIGH);
}

void moveBackward() {
  digitalWrite(MLa, HIGH);
  digitalWrite(MLb, LOW);
  digitalWrite(MRa, HIGH);
  digitalWrite(MRb, LOW);
}

void turnLeft() {
  digitalWrite(MLa, LOW);
  digitalWrite(MLb, HIGH);
  digitalWrite(MRa, HIGH);
  digitalWrite(MRb, LOW);
}

void stopMotors() {
  digitalWrite(MLa, LOW);
  digitalWrite(MLb, LOW);
  digitalWrite(MRa, LOW);
  digitalWrite(MRb, LOW);
}
