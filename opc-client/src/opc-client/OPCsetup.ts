import {
  OPCUAClient,
  MessageSecurityMode,
  SecurityPolicy,
  AttributeIds,
  makeBrowsePath,
  ClientSubscription,
  TimestampsToReturn,
  MonitoringParametersOptions,
  ReadValueIdOptions,
  ClientMonitoredItem,
  DataValue,
  NodeIdLike,
  ClientSession
} from "node-opcua";
import { subscribe } from './subscription';

const connectionStrategy = {
  initialDelay: 1000,
  maxRetry: 3
};

const client = OPCUAClient.create({
  applicationName: "MyClient",
  connectionStrategy: connectionStrategy,
  securityMode: MessageSecurityMode.None,
  securityPolicy: SecurityPolicy.None,
  endpointMustExist: false
});


export const connect = async (endpointUrl: string) => {
  try {
    // step 1 : connect to
    await client.connect(endpointUrl);
    console.log("connected !");

    // step 2 : createSession
    const session = await client.createSession();
    console.log("session created !");

    return session;
  } catch (err) {
    console.log("An error has occured : ", err);
  }
}

export const createSubscription = async (session: ClientSession, NodeId: NodeIdLike | NodeIdLike[], varName: string, setSensorVariable: any) => {
  if (!Array.isArray(NodeId)) await subscribe(session, NodeId, varName, setSensorVariable);
}

async function main(session: ClientSession) {
  try {


    // step 3 : browse //? maybe
    const browseResult = await session.browse("RootFolder");

    console.log("references of RootFolder :");
    if (browseResult.references)
      for (const reference of browseResult.references) {
        console.log("   -> ", reference.browseName.toString());
      }

    // step 4 : read a variable with readVariableValue //?maybe
    const dataValue2 = await session.read({
      nodeId: "ns=1;i=1018",
      attributeId: AttributeIds.Value
    });
    console.log("pressure value = ", dataValue2.toString());

    // step 4' : read a variable with read //?maybe
    const maxAge = 0;
    const nodeToRead = {
      nodeId: "ns=1;i=1020",
      attributeId: AttributeIds.Value
    };
    const dataValue = await session.read(nodeToRead, maxAge);
    console.log("humidity value ", dataValue.toString());

    // step 5: install a subscription and install a monitored item for 10 seconds
    // await subscribe(session, "ns=1;i=1018");

    // step 6: finding the nodeId of a node by Browse name //! PROBABLY WILL NOT USE
    const browsePath = makeBrowsePath(
      "RootFolder",
      "/Objects/Sensors.gyro.x"
    );
    const result = await session.translateBrowsePath(browsePath);
    if (result && result?.targets) {
      const productNameNodeId = result.targets[0].targetId;
      console.log(" Product Name nodeId = ", productNameNodeId.toString());
    }

    // close session
    setTimeout(async () => {
      await session.close();

      // disconnecting
      await client.disconnect();
      console.log("done !");
    }, 1000)
  } catch (err) {
    console.log("An error has occured : ", err);
  }
}
// main();