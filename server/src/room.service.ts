import { Server, Socket } from "socket.io";

interface Room {
  owner: string;
  guest: string | null;
}

export class RoomService {
  rooms = new Map<string, Room>();

  constructor(private server: Server) {}

  initialize() {
    this.server.on("connection", (socket) => {
      this.handleOnCreateRoom(socket);
      this.handleOnJoinRoom(socket);
      this.handleOnSendOffer(socket);
      this.handleOnSendAnswer(socket);
      this.handleOnSendIceCandidate(socket);
    });
  }

  handleOnCreateRoom(socket: Socket) {
    socket.on("room/create", (payload) => {
      const { roomName } = payload;
      this.rooms.set(roomName, {
        owner: socket.id,
        guest: null,
      });
    });
  }

  handleOnJoinRoom(socket: Socket) {
    socket.on("room/join", (payload) => {
      const { roomName } = payload;

      const room = this.rooms.get(roomName);

      if (!room) {
        return;
      }
      room.guest = socket.id;
      socket.to(room.owner).emit("user/joined");
    });
  }

  handleOnSendOffer(socket: Socket) {
    socket.on("offer/send", (payload) => {
      const { roomName, offer } = payload;

      const room = this.rooms.get(roomName);

      if (!room || !room.guest) {
        return;
      }
      socket.to(room.guest).emit("offer/receive", {
        offer,
      });
    });
  }

  handleOnSendAnswer(socket: Socket) {
    socket.on("answer/send", (payload) => {
      const { answer, roomName } = payload;

      const room = this.rooms.get(roomName);

      if (!room) {
        return;
      }

      socket.to(room.owner).emit("answer/receive", {
        answer,
      });
    });
  }

  handleOnSendIceCandidate(socket: Socket) {
    socket.on("ice/send", (payload) => {
      const { roomName, iceCandidate } = payload;
      console.log({roomName, iceCandidate});
      const room = this.rooms.get(roomName);

      if (!room || !room.guest) {
        return;
      }

      const isOwner = room.owner === socket.id;
      const to = isOwner ? room.guest : room.owner;
      console.log(socket.id, to)
      socket.to(to).emit("ice/receive", {
        iceCandidate,
      });
    });
  }
}
