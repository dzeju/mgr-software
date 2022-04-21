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
  ClientSession,
  NodeIdLike
} from "node-opcua";

async function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const subscribe = async (session: ClientSession, nodeId: NodeIdLike) => {
  const subscription = ClientSubscription.create(session, {
    requestedPublishingInterval: 1000,
    requestedLifetimeCount: 100,
    requestedMaxKeepAliveCount: 10,
    maxNotificationsPerPublish: 100,
    publishingEnabled: true,
    priority: 10
  });

  subscription
    .on("started", function () {
      console.log(
        "subscription started for 2 seconds - subscriptionId=",
        subscription.subscriptionId
      );
    })
    .on("keepalive", function () {
      console.log("keepalive");
    })
    .on("terminated", function () {
      console.log("terminated");
    });

  // install monitored item

  const itemToMonitor: ReadValueIdOptions = {
    nodeId: nodeId,
    attributeId: AttributeIds.Value
  };
  const parameters: MonitoringParametersOptions = {
    samplingInterval: 100,
    discardOldest: true,
    queueSize: 10
  };

  const monitoredItem = ClientMonitoredItem.create(
    subscription,
    itemToMonitor,
    parameters,
    TimestampsToReturn.Both
  );

  monitoredItem.on("changed", (dataValue: DataValue) => {
    console.log("temperature value has changed : ", dataValue.value.toString());
  });

  await timeout(9000)

  console.log("now terminating subscription");
  await subscription.terminate();
}