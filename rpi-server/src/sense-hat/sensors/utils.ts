import { vector } from "../../models/IMUmodel";
import { format } from "util"

export const print_vector3 = (name: string, data: vector) => {
  let sx = data.x >= 0 ? ' ' : '';
  let sy = data.y >= 0 ? ' ' : '';
  let sz = data.z >= 0 ? ' ' : '';
  return format('%s: %s%s %s%s %s%s ', name, sx, data.x.toFixed(2), sy, data.y.toFixed(2), sz, data.z.toFixed(2));
}

export const headingCorrection = (heading: number, offset: number) => {
  if (typeof offset === 'undefined')
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

export const headingToDegree = (heading: number) => {
  // Convert radians to degrees for readability.
  return heading * 180 / Math.PI;
}