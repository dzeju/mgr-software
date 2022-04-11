export interface IMUmodel {
  timestamp: Date,
  accel: {
    x: number,
    y: number,
    z: number
  },
  gyro: {
    x: number,
    y: number,
    z: number
  },
  compass: {
    x: number,
    y: number,
    z: number
  },
  fusionPose: {
    x: number,
    y: number,
    z: number
  },
  tiltHeading: number,
  pressure: number,
  temperature: number,
  humidity: number
}

export interface vector {
  x: number,
  y: number,
  z: number
}