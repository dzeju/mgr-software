import { OPCUAServer } from "node-opcua";
import { sensorsData } from "../sense-hat/sensors/sensorsData";

const opcua = require("node-opcua");

const server = new opcua.OPCUAServer({
  port: 4334,
  buildInfo: {
    productName: "RPI",
    buildNumber: "7658",
    buildDate: new Date(2014, 5, 2)
  }
});

const postInitialize = () => {
  console.log("initialized");
  const constructAddressSpace = (server: OPCUAServer) => {

    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace?.getOwnNamespace();

    const device = namespace?.addObject({
      organizedBy: addressSpace?.rootFolder.objects,
      browseName: "Sensors"
    });

    Object.keys(sensorsData).forEach((item: string) => {
      if (typeof sensorsData[item] === "number")
        namespace?.addVariable({
          componentOf: device,
          browseName: item,
          dataType: "Float",
          value: {
            get: function () {
              return new opcua.Variant({ dataType: opcua.DataType.Float, value: sensorsData[item] });
            }
          }
        })
      else {
        if (item === "timestamp") return;

        const opcObj = namespace?.addObject({
          componentOf: device,
          browseName: item
        });

        Object.keys(sensorsData[item]).forEach((vec) => {
          namespace?.addVariable({
            componentOf: opcObj,
            browseName: vec,
            dataType: "Float",
            value: {
              get: function () {
                return new opcua.Variant({ dataType: opcua.DataType.Float, value: sensorsData[item][vec] });
              }
            }
          })
        })
      }

    })
  }

  constructAddressSpace(server);

  server.start(function () {
    console.log("Server is now listening ... ( press CTRL+C to stop)");
    console.log("port ", server.endpoints[0].port);
    const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
    console.log(" the primary server endpoint url is ", endpointUrl);
  });
}

export const initServer = () =>
  server.initialize(postInitialize);