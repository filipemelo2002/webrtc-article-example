import { useRef } from "react"
import { WebsocketService } from "./websocket.service";
import { WebRTCService } from "./webrtc.service";

const socketService = new WebsocketService();
const webRTCService = new WebRTCService();

export function useAppState() {

  const inputRef = useRef<HTMLInputElement>(null);

  const onCreateRoom = () => {
    if (!inputRef.current?.value) {
      return;
    }

    const roomName = inputRef.current.value
    socketService.createRoom(roomName)
    socketService.onNewUserJoined(async () => {
      const offer = await webRTCService.makeOffer();
      webRTCService.setLocalOffer(offer);
      socketService.sendOffer(roomName, offer);
    })

    socketService.receiveAnswer(async (answer) => {
      await webRTCService.setRemoteOffer(answer);
    })
  }
  
  const onJoinRoom = () => {
    if (!inputRef.current?.value) {
      return;
    }

    const roomName = inputRef.current.value

    socketService.joinRoom(roomName);
    socketService.receiveOffer(async (offer) => {
      await webRTCService.setRemoteOffer(offer);
      const answer = await webRTCService.makeAnswer();
      await webRTCService.setLocalOffer(answer);
      socketService.sendAnswer(roomName, answer);
    })
  }

  return {
    onCreateRoom,
    onJoinRoom,
    inputRef
  }
}