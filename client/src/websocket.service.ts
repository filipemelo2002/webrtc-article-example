import { Socket, io } from "socket.io-client";

export class WebsocketService {
  websocket: Socket; 
  constructor() {
    this.websocket = io("http://localhost:3000")
  }

  createRoom(
    roomName: string
  ) {
    this.websocket.emit("room/create", {
      roomName
    });
  }

  joinRoom(roomName: string) {
    this.websocket.emit("room/join", {
      roomName
    });
  }

  onNewUserJoined(callback: () => void) {
    this.websocket.on("user/joined", callback);
  }

  sendOffer(roomName: string, offer: RTCSessionDescription) {
    this.websocket.emit("offer/send", {
      offer,
      roomName,
    })
  }

  receiveOffer(callback: (offer: RTCSessionDescription) => void) {
    this.websocket.on("offer/receive", callback);
  }
  
  sendAnswer(roomName: string, answer: RTCSessionDescription) {
    this.websocket.emit("answer/send", {
      answer,
      roomName
    })
  }

  receiveAnswer(callback: (answer: RTCSessionDescription) => void) {
    this.websocket.on("answer/receive", callback);
  }
}