export interface Vector {
  x: number,
  y: number,
  z: number,
}

export interface IMUmodel {
  timestamp: Date,
  accel: Vector
  gyro: Vector
  compass: Vector
  fusionPose: Vector
  tiltHeading: number,
  pressure: number,
  temperature: number,
  humidity: number,
  [key: string]: any,
}