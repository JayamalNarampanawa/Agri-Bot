// Agri-Bot Compact Plain Chassis in OpenSCAD
// Minimum size 2-layer structure with vertical expandability

//////////////////// PARAMETERS ////////////////////
length = 160;     // Minimized length to fit all components
width = 130;      // Minimized width to fit all components
frameHeight = 20; // 2cm frame height for each layer
wallThickness = 3;
screwHoleRadius = 2.5;
screwInset = 5;

//////////////////// MODULES ////////////////////

module screwHoles() {
  for (x = [screwInset, length - screwInset])
    for (y = [screwInset, width - screwInset])
      translate([x, y, 0])
        cylinder(h = frameHeight + 1, r = screwHoleRadius, $fn = 30);
}

module layerFrame() {
  difference() {
    cube([length, width, frameHeight]);

    // Hollow out the inside
    translate([wallThickness, wallThickness, 0])
      cube([length - 2 * wallThickness, width - 2 * wallThickness, frameHeight]);

    // Screw holes in four corners
    screwHoles();
  }
}

//////////////////// ASSEMBLY ////////////////////

translate([0, 0, 0])
  layerFrame();

translate([0, 0, frameHeight])
  layerFrame();

// Optional: you can stack more frames by adding more translate([...]) layerFrame();
