// Agri-Bot 3D Printed Chassis
// Author: ChatGPT for Jayamal
// Components: ESP32, ESP32-CAM, Relay, Battery, PIR x4, Light Sensor, Buzzer, Motor Driver, LCD, Handle, Weather Sensor, Ultrasonic, Arduino UNO

// === Base Parameters ===
base_length = 320;
base_width = 240;
base_thickness = 3;
wall_height = 30;
wall_thickness = 3;

mount_hole_dia = 3;
post_dia = 10;
post_height = 30;

// === Positions ===
esp32_pos = [30, 180];
esp32_size = [68, 52];

esp32cam_pos = [base_length - 70, 180];
esp32cam_post = [esp32cam_pos[0] + 15, esp32cam_pos[1] + 10];

arduino_pos = [30, 100];
arduino_size = [70, 55];

relay_pos = [150, 100];
relay_size = [50, 25];

battery_pos = [100, 20];
battery_size = [100, 60, 25];

motor_driver_pos = [220, 20];
motor_driver_size = [40, 40];

buzzer_pos = [base_length - 40, 80];
light_sensor_pos = [base_length - 40, 110];

lcd_pos = [(base_length - 80) / 2, 10];

pir_positions = [
    [15, 15],
    [base_length - 25, 15],
    [15, base_width - 25],
    [base_length - 25, base_width - 25]
];

weather_sensor_pos = [180, base_width - 40];
ultrasonic_pos = [(base_length - 40) / 2, base_width - wall_thickness]; // front center
handle_pos = [(base_length - 40) / 2, base_width - 25];

// === Modules ===
module baseplate() {
    cube([base_length, base_width, base_thickness]);
}

module outer_walls() {
    difference() {
        cube([base_length, base_width, wall_height]);
        translate([wall_thickness, wall_thickness, 0])
            cube([base_length - 2*wall_thickness, base_width - 2*wall_thickness, wall_height + 1]);
    }
}

module mount_holes(center_pos, x_count, y_count, spacing_x, spacing_y) {
    for (i = [0:x_count-1])
        for (j = [0:y_count-1])
            translate([
                center_pos[0] + i*spacing_x,
                center_pos[1] + j*spacing_y,
                base_thickness
            ])
                cylinder(h=10, d=mount_hole_dia, $fn=30);
}

module component_mounts() {
    // ESP32
    mount_holes(esp32_pos, 2, 2, esp32_size[0]-10, esp32_size[1]-10);
    
    // ESP32-CAM post
    translate([esp32cam_post[0], esp32cam_post[1], base_thickness])
        cylinder(h=post_height, d=post_dia, $fn=40);
    
    // Relay
    mount_holes(relay_pos, 2, 1, relay_size[0]-10, 0);
    
    // Arduino UNO R3
    mount_holes(arduino_pos, 2, 2, arduino_size[0]-10, arduino_size[1]-10);
    
    // Motor driver
    mount_holes(motor_driver_pos, 2, 1, motor_driver_size[0]-10, 0);
    
    // Light sensor
    translate([light_sensor_pos[0], light_sensor_pos[1], base_thickness])
        cylinder(h=5, d=6, $fn=30);
    
    // Buzzer
    translate([buzzer_pos[0], buzzer_pos[1], base_thickness])
        cylinder(h=5, d=12, $fn=30);
    
    // PIR sensors
    for (p = pir_positions)
        translate([p[0], p[1], base_thickness])
            cylinder(h=post_height, d=post_dia, $fn=30);

    // Weather sensor
    translate([weather_sensor_pos[0], weather_sensor_pos[1], base_thickness])
        cylinder(h=post_height, d=post_dia, $fn=40);

    // LCD Mount (cutout for 16x2)
    translate([lcd_pos[0], lcd_pos[1], base_thickness])
        cube([80, 25, 5]);

    // Ultrasonic sensor cutout (HC-SR04 type)
    translate([ultrasonic_pos[0], ultrasonic_pos[1], wall_height/2])
        cube([40, wall_thickness + 1, 15]);
}

module battery_compartment() {
    translate([battery_pos[0], battery_pos[1], base_thickness])
        cube([battery_size[0], battery_size[1], battery_size[2]]);

    // Side walls
    translate([battery_pos[0], battery_pos[1], base_thickness])
        cube([2, battery_size[1], battery_size[2]]);
    translate([battery_pos[0] + battery_size[0] - 2, battery_pos[1], base_thickness])
        cube([2, battery_size[1], battery_size[2]]);
    translate([battery_pos[0], battery_pos[1] + battery_size[1] - 2, base_thickness])
        cube([battery_size[0], 2, battery_size[2]]);
}

module handle() {
    translate([handle_pos[0], handle_pos[1], wall_height])
        cube([40, 6, 30]);
}

module wheel_mounts() {
    for (x = [15, base_length - 15])
        for (y = [15, base_width - 15]) {
            translate([x, y, 0])
                cylinder(h=wall_height, d=10, $fn=40);
            translate([x, y, 0])
                cylinder(h=wall_height+1, d=5, $fn=40);
        }
}

// === Build Chassis ===
difference() {
    union() {
        baseplate();
        translate([0, 0, base_thickness]) outer_walls();
        wheel_mounts();
        component_mounts();
        battery_compartment();
        handle();
    }
}
