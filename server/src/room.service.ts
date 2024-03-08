import { Server } from "socket.io";

interface Room {
  owner: string;
  guest?: string;
};

export class RoomService {
  rooms = new Map<string, Room>();

  constructor(private server: Server) {
  }

  initialize() {
    this.server.on("connection", (socket) => {
      console.log("user connected", socket.id)
    })
  }

}