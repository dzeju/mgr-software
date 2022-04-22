import express, { Application } from 'express';
import { connect, createSubscription } from './opc-client/OPCsetup';
import { router as RouterHome } from "./routes/home"
const app: Application = express();
const PORT = process.env.PORT || 8000;

// app.use(express);
app.use("/", RouterHome);

app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});

const endpointUrl = "opc.tcp://" + require("os").hostname() + ":4334";

const session = connect(endpointUrl);
createSubscription()