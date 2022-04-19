import { initServer } from "./opcua/opcServer";
import { startDataCollection } from "./sense-hat/sensors/sensors"

startDataCollection()
initServer();