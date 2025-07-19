#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

// Custom characters
byte openEye[] = {
  B00000,
  B00000,
  B01110,
  B10001,
  B10001,
  B01110,
  B00000,
  B00000
};

byte closedEye[] = {
  B00000,
  B00000,
  B00000,
  B01110,
  B00000,
  B00000,
  B00000,
  B00000
};

// Mouth parts: \ _ /
byte mouthLeft[] = {
  B00000,
  B00000,
  B10000,
  B01000,
  B00100,
  B00010,
  B00001,
  B00000
};

byte mouthCenter[] = {
  B00000,
  B00000,
  B00000,
  B00000,
  B00000,
  B00000,
  B11111,
  B00000
};

byte mouthRight[] = {
  B00000,
  B00000,
  B00001,
  B00010,
  B00100,
  B01000,
  B10000,
  B00000
};

void setup() {
  lcd.init();
  lcd.backlight();

  // Create custom characters
  lcd.createChar(0, openEye);     // char 0: open eye
  lcd.createChar(1, closedEye);   // char 1: closed eye
  lcd.createChar(2, mouthLeft);   // char 2: 
  lcd.createChar(3, mouthCenter); // char 3: _
  lcd.createChar(4, mouthRight);  // char 4: /

  lcd.clear();
}

void loop() {
  // Open eyes and smile
  lcd.setCursor(4, 0); lcd.write(byte(0));  // open eye
  lcd.setCursor(12, 0); lcd.write(byte(0)); // open eye
  lcd.setCursor(7, 1); lcd.write(byte(2));  // 
  lcd.setCursor(8, 1); lcd.write(byte(3));  // 
  lcd.setCursor(9, 1); lcd.write(byte(4));  // /
  delay(800);

  // Blink eyes
  lcd.setCursor(4, 0); lcd.write(byte(1));  // closed eye
  lcd.setCursor(12, 0); lcd.write(byte(1)); // closed eye
  delay(300);

  // Open eyes again
  lcd.setCursor(4, 0); lcd.write(byte(0));
  lcd.setCursor(12, 0); lcd.write(byte(0));
  lcd.setCursor(7, 1); lcd.write(byte(2));  // 
  lcd.setCursor(8, 1); lcd.write(byte(3));  // 
  lcd.setCursor(9, 1); lcd.write(byte(4));  // /
  delay(800);
}
