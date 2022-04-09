let Gpio = require('onoff').Gpio;
// Using the standalone hw-specific library
// const matrix = require('sense-hat-led');
// Using this library
const matrix = require('node-sense-hat').Leds;

const O = [0,0,0]//[0,128,128];
const X = [255,20,147];

const cross = [
O, O, O, X, X, O, O, O,
O, O, X, O, O, X, O, O,
O, O, O, O, O, X, O, O,
O, O, O, O, X, O, O, O,
O, O, O, X, O, O, O, O,
O, O, O, X, O, O, O, O,
O, O, O, O, O, O, O, O,
O, O, O, X, O, O, O, O
];

matrix.setPixels(cross);

// To fill with a single color instead
// matrix.clear([127, 0, 0]);
const imu = require("node-sense-hat").Imu;
let util = require('util')
const IMU = new imu.IMU();

// IMU.getValue((err, data) => {
//   if (err !== null) {
//     console.error("Could not read sensor data: ", err);
//     return;
//   }

//   console.log("Accelleration is: ", JSON.stringify(data.accel, null, "  "));
//   console.log("Gyroscope is: ", JSON.stringify(data.gyro, null, "  "));
//   console.log("Compass is: ", JSON.stringify(data.compass, null, "  "));
//   console.log("Fusion data is: ", JSON.stringify(data.fusionPose, null, "  "));

//   console.log("Temp is: ", data.temperature);
//   console.log("Pressure is: ", data.pressure);
//   console.log("Humidity is: ", data.humidity);
// });

const print_vector3 = (name, data) => {
  let sx = data.x >= 0 ? ' ' : '';
  let sy = data.y >= 0 ? ' ' : '';
  let sz = data.z >= 0 ? ' ' : '';
  return util.format('%s: %s%s %s%s %s%s ', name, sx, data.x.toFixed(2), sy, data.y.toFixed(2), sz, data.z.toFixed(2));
}

const headingCorrection = (heading, offset) => {
  if (typeof offset ==='undefined')
      offset = 0;

  // Once you have your heading, you must then add your 'Declination Angle', which is the 'Error' of the magnetic field in your location.
  // Find yours here: http://www.magnetic-declination.com/
  let declinationAngle = 0.03106686;

  heading += declinationAngle + offset;

  // Correct for when signs are reversed.
  if (heading < 0)
    heading += 2 * Math.PI;

  // Check for wrap due to addition of declination.
  if (heading > 2 * Math.PI)
    heading -= 2 * Math.PI;

  return heading;
}

const  headingToDegree = (heading) => {
  // Convert radians to degrees for readability.
  return heading * 180 / Math.PI;
}

let tic = new Date();
const callb = (e, data) => {
  let toc = new Date();

  if (e) {
    console.log(e);
    return;
  }

  let str = print_vector3('Accel', data.accel)
  str += print_vector3('Gyro', data.gyro)
  str += print_vector3('Compass', data.compass)
  str += print_vector3('Fusion', data.fusionPose)
  str += util.format('TiltHeading: %s ', headingToDegree(headingCorrection(data.tiltHeading, Math.PI / 2)).toFixed(0));

  let str2 = "";
  if (data.temperature && data.pressure && data.humidity) {
    str2 = util.format('Temp: %s Pressure: %s Humidity: %s', data.temperature.toFixed(2), data.pressure.toFixed(2), data.humidity.toFixed(2));
  }
  console.log(str + str2);

  setTimeout(() => { tic = new Date(); IMU.getValue(callb); } , 100 - (toc - tic));
}

IMU.getValue(callb);

