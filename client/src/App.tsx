import { useAppState } from "./app.state"

function App() {

  const {
    inputRef,
    onCreateRoom,
    onJoinRoom,
    videoRef
  } = useAppState();
  return (
    <>
      <form>
        <input type='text' ref={inputRef}/>
        <button type="button" onClick={onJoinRoom}>Join</button>
        <button type="button" onClick={onCreateRoom}>Create</button>
      </form>
      <video width="500" ref={videoRef}/>
    </>
  )
}

export default App
