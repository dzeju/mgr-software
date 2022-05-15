import { IMUmodel } from "../models/IMUmodel";
import _ from "lodash"

export let sensorsData: IMUmodel;

export const setSensorsData = (data: IMUmodel) => {
  sensorsData = data;
}

export const setSensorVariable = (data: any, varName: string) => {
  // sensorsData = Object.assign(sensorsData || {}, { [varName]: data })
  sensorsData = _.set(sensorsData || {}, varName, data)
  return { val: _.get(sensorsData, varName), path: varName }
}