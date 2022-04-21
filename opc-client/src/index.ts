import express, { Request, Response, Application } from 'express';
const app: Application = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response): void => {
  console.log("request at /")
  res.send("hi mom")
});

app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});

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
  DataValue
} from "node-opcua";
import { subscribe } from './opc-client/subscription';

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

const endpointUrl = "opc.tcp://" + require("os").hostname() + ":4334";



async function main() {
  try {
    // step 1 : connect to
    await client.connect(endpointUrl);
    console.log("connected !");

    // step 2 : createSession
    const session = await client.createSession();
    console.log("session created !");

    // step 3 : browse
    const browseResult = await session.browse("RootFolder");

    console.log("references of RootFolder :");
    if (browseResult.references)
      for (const reference of browseResult.references) {
        console.log("   -> ", reference.browseName.toString());
      }

    // step 4 : read a variable with readVariableValue
    const dataValue2 = await session.read({
      nodeId: "ns=1;i=1018",
      attributeId: AttributeIds.Value
    });
    console.log("pressure value = ", dataValue2.toString());

    // step 4' : read a variable with read
    const maxAge = 0;
    const nodeToRead = {
      nodeId: "ns=1;i=1020",
      attributeId: AttributeIds.Value
    };
    const dataValue = await session.read(nodeToRead, maxAge);
    console.log("humidity value ", dataValue.toString());

    // step 5: install a subscription and install a monitored item for 10 seconds
    await subscribe(session, "ns=1;i=1018");

    // step 6: finding the nodeId of a node by Browse name
    const browsePath = makeBrowsePath(
      "RootFolder",
      "/Objects/Server.ServerStatus.BuildInfo.ProductName"
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
main();
