import express, { Application } from 'express';
import { connect, createSubscription } from './opc-client/OPCsetup';
import { router as RouterHome } from "./routes/home"
import { OpcObj } from './models/OpcObj';
import WebSocket from "ws";
const app: Application = express();
const PORT = process.env.PORT || 2137;
const endpointUrl = "opc.tcp://" + require("os").hostname() + ":4334";
const wsServer = new WebSocket.Server({ noServer: true });
// app.use(express);
app.use("/", RouterHome);

const server = app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});

const connectAndSubscribe = async () => {
  const session = await connect(endpointUrl);
  const opcObjects: OpcObj[] = [
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
  if (session) {
    for (const obj of opcObjects)
      await createSubscription(session, obj.NodeId, obj.name)
    console.log("subscribed")
  }
}

connectAndSubscribe();