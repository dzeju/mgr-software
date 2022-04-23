import {
  AttributeIds,
  ClientSubscription,
  TimestampsToReturn,
  MonitoringParametersOptions,
  ReadValueIdOptions,
  ClientMonitoredItem,
  DataValue,
  ClientSession,
  NodeIdLike
} from "node-opcua";

import { setSensorVariable } from "../data/sensorsData"

async function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const subscribe = async (session: ClientSession, nodeId: NodeIdLike, varName: string) => {
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
        "subscription started - subscriptionId =",
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
    samplingInterval: 500,
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
    // console.log(" value has changed : ", dataValue.value.toString());
    setSensorVariable(dataValue.value.value, varName)
  });

  monitoredItem.on("err", (message: string) => console.log(message));

  await timeout(100)

  // console.log("now terminating subscription");
  // await subscription.terminate();
}