import { useState, useRef, useEffect } from 'react'
import viteLogo from '/vite.svg'
import { MantineProvider } from '@mantine/core'
import RoomInitialiser from './multiplyaer/roomInitialiser.jsx'
import SinglePlayer from './singlePlayer.jsx'
import MultiPlayer from './multiplyaer/multiPlayer.jsx'

function App() {
  const [ roomId, setRoomId ] = useState('')
  const [ isMultiplayer, setIsMultiplayer ] = useState(false)
  
  return (
    <MantineProvider>
      {isMultiplayer ? <MultiPlayer roomId={roomId} /> : <SinglePlayer />}
      <RoomInitialiser setRoomId={setRoomId} roomId={roomId} setIsMultiplayer={setIsMultiplayer} />
    </MantineProvider>
  )
}

export default App
