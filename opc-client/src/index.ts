import { connect, createSubscription } from './opc-client/OPCsetup';
import { OpcObj } from './models/OpcObj';
import { nodes } from './configs/OPCNodes';
import { runServer, clients } from './websocket/websocket';
const endpointUrl = "opc.tcp://" + require("os").hostname() + ":4334";
import { sensorsData, setSensorVariable } from "./data/sensorsData"
import { ClientSession } from 'node-opcua-client';

const { server, wsServer } = runServer();


const handleSubscriptionData = (data: any, varName: string) => {
  const value = setSensorVariable(data, varName);
  wsServer.emit("sendMsg", JSON.stringify(value))
  // clients.forEach((client) => {
  //   client.send({
  //     value
  //   })
  //   console.log("sent")
  // })
}

const connectOPC = async () => {
  const session = await connect(endpointUrl);
  return session;
}

const subscribeData = async (session: ClientSession) => {
  const opcObjects: OpcObj[] = nodes;

  for (const obj of opcObjects)
    await createSubscription(session, obj.NodeId, obj.name, handleSubscriptionData)
  console.log("subscribed")
}

const connectOPCAndSubscribe = async () => {
  const session = await connectOPC();
  if (session)
    await subscribeData(session);
}


connectOPCAndSubscribe();
