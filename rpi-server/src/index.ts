import { initServer } from "./opcua/opcServer";
import { IMUmodel } from "./models/IMUmodel";
import { getData } from "./sense-hat/sensors/sensors"

setInterval(() => {
  getData()
}, 500);

initServer();