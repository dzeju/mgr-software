// let Gpio = require('onoff').Gpio;
import { IMUmodel } from "../../models/IMUmodel";
import { print_vector3, headingCorrection, headingToDegree } from "./utils";
import { format } from "util"
import { setSensorsData } from "./sensorsData";
const imu = require("node-sense-hat").Imu;
const IMU = new imu.IMU()


const printData = (err: Event, data: IMUmodel) => {
  if (err) {
    console.log(err);
    return;
  }
  // console.log(data)
  setSensorsData(data);
  // let str = print_vector3('Accel', data.accel)
  // str += print_vector3('Gyro', data.gyro)
  // str += print_vector3('Compass', data.compass)
  // str += print_vector3('Fusion', data.fusionPose)
  // str += format('TiltHeading: %s ', headingToDegree(headingCorrection(data.tiltHeading, Math.PI / 2)).toFixed(0));

  // let str2 = "";
  // if (data.temperature && data.pressure && data.humidity) {
  //   str2 = format('Temp: %s Pressure: %s Humidity: %s', data.temperature.toFixed(2), data.pressure.toFixed(2), data.humidity.toFixed(2));
  // }
  // console.log(str + str2);

  // setTimeout(() => IMU.getValue(printData), 1000);
}

export const getData = () => { IMU.getValue(printData) };

