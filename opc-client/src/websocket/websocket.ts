import express, { Application } from 'express';
import WebSocket, { Server } from "ws";
import { router as RouterHome } from "../routes/home"

const app: Application = express();
const PORT = process.env.PORT || 2112;

const wsServer = new WebSocket.Server({ noServer: true });
// app.use(express);
export let clients: WebSocket.WebSocket[] = [];

app.use("/", RouterHome);


export const runServer = () => {
  const server = app.listen(PORT, (): void => {
    console.log(`Server Running here 👉 https://localhost:${PORT}`);
  });

  server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
      wsServer.emit('connection', socket, request);
    });
    wsServer.on('connection', (socket) => {
      clients.push(socket)
      console.log("new connection!")
      console.log(clients)
    })
    wsServer.on("sendMsg", (value) => {
      clients.forEach((client) => {
        client.send(value)
      })
    })
  });

  return { server, wsServer };
}

