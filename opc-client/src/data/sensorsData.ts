import { IMUmodel } from "../models/IMUmodel";

export let sensorsData: IMUmodel;

export const setSensorsData = (data: IMUmodel) => {
  sensorsData = data;
}