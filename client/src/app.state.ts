import { useRef } from "react"
import { WebsocketService } from "./websocket.service";
import { WebRTCService } from "./webrtc.service";

const socketService = new WebsocketService();
const webRTCService = new WebRTCService();

export function useAppState() {

  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onCreateRoom = async () => {
    if (!inputRef.current?.value) {
      return;
    }

    const roomName = inputRef.current.value;
    await startLocalStream();
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
    webRTCService.onStream(startStream)
  }

  async function startLocalStream () {
    const mediaStream = await webRTCService.getMediaStream();
    startStream(mediaStream, true);
  }

  function startStream(mediaStream: MediaStream, isLocal = false ) {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.srcObject = mediaStream;
    videoRef.current.muted = isLocal;
    videoRef.current.play();
  }

  return {
    onCreateRoom,
    onJoinRoom,
    inputRef,
    videoRef
  }
}