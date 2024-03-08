import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { RoomService } from "./room.service";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const roomService = new RoomService(io);
roomService.initialize();

httpServer.listen(3000);
