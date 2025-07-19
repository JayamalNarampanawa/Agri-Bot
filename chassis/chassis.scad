// Agri-Bot Modular Chassis in OpenSCAD
// Compact length, expandable vertically, screw-stacked layers

//////////////////// PARAMETERS ////////////////////
length = 180;     // Compact length of the chassis
width = 150;      // Width of each layer
layerHeight = 5;  // Thickness of each layer
spacerHeight = 40; // Height between layers
screwHoleRadius = 2;
numSpacers = 4;   // Four corners

module screwHoleGrid() {
  for (x = [0, length])
    for (y = [0, width])
      translate([x, y, 0])
        cylinder(h = layerHeight + 1, r = screwHoleRadius, $fn = 30);
}

module baseLayer() {
  difference() {
    cube([length, width, layerHeight]);
    screwHoleGrid();
    // Motor wire holes
    translate([length/2 - 5, 10, 0]) cube([10, 10, layerHeight + 1]);
    translate([length/2 - 5, width - 20, 0]) cube([10, 10, layerHeight + 1]);
  }
}

module controlLayer() {
  difference() {
    cube([length, width, layerHeight]);
    screwHoleGrid();
    // Arduino UNO slot (68.6 x 53.4mm)
    translate([20, 10, 0]) cube([70, 55, layerHeight + 1]);
    // L298N slot (43 x 43mm)
    translate([100, 10, 0]) cube([45, 45, layerHeight + 1]);
    // Ultrasonic cutout (20x40mm)
    translate([length/2 - 10, width - 5, 0]) cube([20, 5, layerHeight + 1]);
  }
}

module sensorLayer() {
  difference() {
    cube([length, width, layerHeight]);
    screwHoleGrid();
    // ESP32 slot (25x50mm)
    translate([10, 10, 0]) cube([25, 50, layerHeight + 1]);
    // ESP32-CAM + servo base
    translate([40, 10, 0]) cube([30, 40, layerHeight + 1]);
    // LCD (16x2) cutout (80x25mm)
    translate([length/2 - 40, width - 30, 0]) cube([80, 25, layerHeight + 1]);
    // Relay or battery slot
    translate([100, 60, 0]) cube([40, 50, layerHeight + 1]);
    // Breadboard area
    translate([20, width - 45, 0]) cube([55, 35, layerHeight + 1]);
  }
}

module standoffs() {
  for (x = [0, length])
    for (y = [0, width])
      translate([x, y, layerHeight])
        cylinder(h = spacerHeight, r = 3, $fn = 30);
}

//////////////////// FINAL ASSEMBLY ////////////////////
translate([0, 0, 0])
  baseLayer();

translate([0, 0, spacerHeight + layerHeight])
  controlLayer();

translate([0, 0, (spacerHeight + layerHeight) * 2])
  sensorLayer();

// Standoffs (between layers)
translate([0, 0, layerHeight])
  standoffs();
translate([0, 0, layerHeight + spacerHeight + layerHeight])
  standoffs();