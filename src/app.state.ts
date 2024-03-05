import { useRef } from "react"

export function useAppState() {

  const inputRef = useRef<HTMLInputElement>(null);

  const onCreateRoom = () => {
    console.log("Create room")
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