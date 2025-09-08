// Motor test for L298N + 4 motors (2 per side)

#define ENA 5   // Left PWM
#define IN1 8
#define IN2 9
#define IN3 10
#define IN4 11
#define ENB 6   // Right PWM

const int PWM_SPEED = 120;  // Adjust to safe slow speed

void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(ENB, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);

  Serial.begin(9600);
  Serial.println("Motor test starting...");
}

void setLeft(int pwm, bool forward) {
  analogWrite(ENA, pwm);
  if (forward) { digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW); }
  else         { digitalWrite(IN1, LOW);  digitalWrite(IN2, HIGH); }
}

void setRight(int pwm, bool forward) {
  analogWrite(ENB, pwm);
  if (forward) { digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW); }
  else         { digitalWrite(IN3, LOW);  digitalWrite(IN4, HIGH); }
}

void loop() {
  Serial.println("FORWARD...");
  setLeft(PWM_SPEED, true);
  setRight(PWM_SPEED, true);
  delay(2000);

  Serial.println("STOP...");
  setLeft(0, true);
  setRight(0, true);
  delay(1000);

  Serial.println("BACKWARD...");
  setLeft(PWM_SPEED, false);
  setRight(PWM_SPEED, false);
  delay(2000);

  Serial.println("STOP...");
  setLeft(0, true);
  setRight(0, true);
  delay(2000);
}
