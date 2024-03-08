import { useRef } from "react"
import { WebsocketService } from "./websocket.service";

const socketService = new WebsocketService();

export function useAppState() {

  const inputRef = useRef<HTMLInputElement>(null);

  const onCreateRoom = () => {
    if (!inputRef.current?.value) {
      return;
    }
    socketService.createRoom(inputRef.current.value)
  }
  
  const onJoinRoom = () => {
    console.log("Join room")
  }

  return {
    onCreateRoom,
    onJoinRoom,
    inputRef
  }
}