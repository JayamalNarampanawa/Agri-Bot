#define IN1 8
#define IN2 9
#define IN3 10
#define IN4 11

#define TRIG 2
#define ECHO 3

long duration;
int distance;

void setup() {
  Serial.begin(9600);
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);

  // If no ENA/ENB jumpers, enable them (see notes above)
  // pinMode(5, OUTPUT); digitalWrite(5, HIGH); // ENA
  // pinMode(6, OUTPUT); digitalWrite(6, HIGH); // ENB
}

int getDistance() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  duration = pulseIn(ECHO, HIGH, 25000); // timeout ~25ms (≈ 4m)
  if (duration == 0) return 400;         // no echo -> treat as far
  return duration * 0.034 / 2;           // cm
}

void forward()  { digitalWrite(IN1,HIGH); digitalWrite(IN2,LOW);
                  digitalWrite(IN3,HIGH); digitalWrite(IN4,LOW); }
void backward() { digitalWrite(IN1,LOW);  digitalWrite(IN2,HIGH);
                  digitalWrite(IN3,LOW);  digitalWrite(IN4,HIGH); }
void stopAll()  { digitalWrite(IN1,LOW);  digitalWrite(IN2,LOW);
                  digitalWrite(IN3,LOW);  digitalWrite(IN4,LOW); }

void loop() {
  int d = getDistance();
  Serial.println(d);

  if (d > 20) forward();       // clear path -> go forward fast
  else        backward();      // obstacle -> go backward
}
