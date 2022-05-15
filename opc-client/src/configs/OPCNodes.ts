import { OpcObj } from '../models/OpcObj';

export const nodes: OpcObj[] = [
    { NodeId: "ns=1;i=1018", name: "pressure" },
    { NodeId: "ns=1;i=1020", name: "humidity" },
    { NodeId: "ns=1;i=1017", name: "tiltHeading" },
    { NodeId: "ns=1;i=1019", name: "temperature" },
    { NodeId: "ns=1;i=1006", name: "gyro.x" },
    { NodeId: "ns=1;i=1007", name: "gyro.y" },
    { NodeId: "ns=1;i=1008", name: "gyro.z" },
    { NodeId: "ns=1;i=1014", name: "fusionPose.x" },
    { NodeId: "ns=1;i=1015", name: "fusionPose.y" },
    { NodeId: "ns=1;i=1016", name: "fusionPose.z" },
    { NodeId: "ns=1;i=1010", name: "compass.x" },
    { NodeId: "ns=1;i=1011", name: "compass.y" },
    { NodeId: "ns=1;i=1012", name: "compass.z" },
    { NodeId: "ns=1;i=1002", name: "accel.x" },
    { NodeId: "ns=1;i=1003", name: "accel.y" },
    { NodeId: "ns=1;i=1004", name: "accel.z" }
  ]