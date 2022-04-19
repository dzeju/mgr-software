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
  setSensorsData(data);
}

export const startDataCollection = () => {
  setInterval(() => {
    IMU.getValue(printData)
  }, 500);
}

