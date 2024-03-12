import { Socket, io } from "socket.io-client";

export class WebsocketService {
  websocket: Socket;
  constructor() {
    this.websocket = io("http://localhost:3000");
  }

  createRoom(roomName: string) {
    this.websocket.emit("room/create", {
      roomName,
    });
  }

  joinRoom(roomName: string) {
    this.websocket.emit("room/join", {
      roomName,
    });
  }

  onNewUserJoined(callback: () => void) {
    this.websocket.on("user/joined", callback);
  }

  sendOffer(roomName: string, offer: RTCSessionDescriptionInit) {
    this.websocket.emit("offer/send", {
      offer,
      roomName,
    });
  }

  receiveOffer(callback: (offer: RTCSessionDescriptionInit) => void) {
    this.websocket.on("offer/receive", ({ offer }) => callback(offer));
  }

  sendAnswer(roomName: string, answer: RTCSessionDescriptionInit) {
    this.websocket.emit("answer/send", {
      answer,
      roomName,
    });
  }

  receiveAnswer(callback: (answer: RTCSessionDescriptionInit) => void) {
    this.websocket.on("answer/receive", ({ answer }) => callback(answer));
  }

  sendIceCandidate(roomName: string, iceCandidate: RTCIceCandidate) {
    this.websocket.emit("ice/send", {
      roomName,
      iceCandidate
    })
  }

  receiveIceCandidate(cb: (arg: RTCIceCandidate) => void ) {
    this.websocket.on("ice/receive", ({iceCandidate}) => {
      cb(iceCandidate);
    })
  }
}
