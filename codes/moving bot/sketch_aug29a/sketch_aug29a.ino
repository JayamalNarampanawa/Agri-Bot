// Straight-line robot using 2x HC-SR04 + L298N + 4 DC motors (software fix for left/right wiring)
// Behavior:
// - FRONT < THRESH → BACKWARD
// - REAR  < THRESH → FORWARD
// - BOTH blocked → STOP
// - ELSE → default forward

#define FRONT_TRIG 2
#define FRONT_ECHO 3
#define REAR_TRIG  4
#define REAR_ECHO  7

// L298N pins
#define ENA 5   // Left PWM
#define IN1 8
#define IN2 9
#define IN3 10
#define IN4 11
#define ENB 6   // Right PWM

// Tunables
const int PWM_SLOW = 90;
const int PWM_STOP = 0;
const int THRESH_CM = 25;
const bool DEFAULT_FORWARD = true;
const uint32_t MEAS_TIMEOUT_US = 30000UL;
const uint8_t SAMPLES = 3;
const uint16_t MIN_SWITCH_MS = 200;

enum State {STOPPED, FORWARD, BACKWARD};
State current = STOPPED;
unsigned long lastSwitch = 0;

// ---- Ultrasonic helpers ----
unsigned long readEchoUS(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW); delayMicroseconds(3);
  digitalWrite(trigPin, HIGH); delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  return pulseIn(echoPin, HIGH, MEAS_TIMEOUT_US);
}

float readDistanceCM(int trigPin, int echoPin) {
  unsigned long us[SAMPLES];
  for (uint8_t i=0; i<SAMPLES; i++) {
    us[i] = readEchoUS(trigPin, echoPin);
    delay(10);
  }
  // sort
  for (uint8_t i=0; i<SAMPLES; i++)
    for (uint8_t j=i+1; j<SAMPLES; j++)
      if (us[j]<us[i]) { unsigned long t=us[i]; us[i]=us[j]; us[j]=t; }

  return (us[SAMPLES/2]==0) ? 9999.0 : (us[SAMPLES/2]/58.0);
}

// ---- Motor helpers ----

// Left side (software fix: invert forward/backward)
void setLeft(int pwm, bool forward) {
  analogWrite(ENA, pwm);
  if(forward) { digitalWrite(IN1, LOW);  digitalWrite(IN2, HIGH); } // inverted
  else        { digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);  }
}

// Right side (normal)
void setRight(int pwm, bool forward) {
  analogWrite(ENB, pwm);
  if(forward) { digitalWrite(IN3, LOW);  digitalWrite(IN4, HIGH); }
  else        { digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);  }
}

void drive(State s) {
  switch(s) {
    case FORWARD:
      setLeft(PWM_SLOW, true);
      setRight(PWM_SLOW, true);
      break;
    case BACKWARD:
      setLeft(PWM_SLOW, false);
      setRight(PWM_SLOW, false);
      break;
    default:
      setLeft(PWM_STOP, true);
      setRight(PWM_STOP, true);
      break;
  }
}

void setState(State next) {
  if(next!=current && (millis()-lastSwitch)>=MIN_SWITCH_MS){
    current = next;
    lastSwitch = millis();
    drive(current);
  }
}

void setup() {
  pinMode(FRONT_TRIG, OUTPUT);
  pinMode(FRONT_ECHO, INPUT);
  pinMode(REAR_TRIG, OUTPUT);
  pinMode(REAR_ECHO, INPUT);

  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(ENB, OUTPUT);

  drive(STOPPED);

  Serial.begin(9600);
  Serial.println("Robot ready.");
}

void loop() {
  float dFront = readDistanceCM(FRONT_TRIG, FRONT_ECHO);
  float dRear  = readDistanceCM(REAR_TRIG, REAR_ECHO);

  bool frontBlocked = (dFront <= THRESH_CM);
  bool rearBlocked  = (dRear  <= THRESH_CM);

  State wanted;
  if(frontBlocked && !rearBlocked)      wanted = BACKWARD;
  else if(rearBlocked && !frontBlocked) wanted = FORWARD;
  else if(frontBlocked && rearBlocked)  wanted = STOPPED;
  else                                   wanted = DEFAULT_FORWARD ? FORWARD : STOPPED;

  setState(wanted);

  // Debug
  Serial.print("Front: "); Serial.print(dFront);
  Serial.print(" cm | Rear: "); Serial.print(dRear);
  Serial.print(" cm | State: ");
  if(current==FORWARD) Serial.println("FORWARD");
  else if(current==BACKWARD) Serial.println("BACKWARD");
  else Serial.println("STOPPED");

  delay(30);
}
