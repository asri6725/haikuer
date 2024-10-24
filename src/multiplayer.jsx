import React, { useState, useEffect } from 'react'

function Multiplayer({ updateHaiku, setRoomMode, socket, setRoomId, cleanSlate, roomId }) {
  const [username, setUsername] = useState('')
  const [roomPassword, setRoomPassword] = useState('')
  const [isInRoom, setIsInRoom] = useState(false)
  const [roomStatus, setRoomStatus] = useState([])

  useEffect(() => {
    // Room creation response
    socket.on('room_created', (data) => {
      setRoomId(data.room_id)
      alert('Room created successfully!')
    })

    // Room join response
    socket.on('room_joined', (data) => {
      if(!isInRoom){
        setRoomId(data.room_id)
        setIsInRoom(true)
        setRoomMode(true)
      }
      setRoomStatus((prevStatus) => [...prevStatus, data.message])
    })

    socket.on('new_line', (data) => {
      updateHaiku(data.haiku)
    })

    socket.on('clean_slate', (data) => {
      cleanSlate(data.haiku)
    })

    // Clean up the listener when the component unmounts
    return () => {
      socket.off('message')
      socket.off('room_created')
      socket.off('room_joined')
      socket.off('new_line')
      socket.off('clean_slate')
    }
  }, [])

  const createRoom = () => {
    if (roomPassword) {
      socket.emit('create_room', { password: roomPassword })
    }
  }

  const joinRoom = () => {
    if (roomId && roomPassword && username) {
      socket.emit('join', { username, room: roomId, password: roomPassword })
    }
  }

  // const otherHaiku = ()

  return (
    <div style={{ padding: '20px' }}>
      {!isInRoom && (
        <div>
          <h3>Create or Join a Room</h3>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Room Password"
            value={roomPassword}
            onChange={(e) => setRoomPassword(e.target.value)}
          />
          <button onClick={createRoom}>Create Room</button>
          <input
            type="text"
            placeholder="Enter Room ID to Join"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      )}
      {isInRoom && (
        <div>
          <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
            {roomStatus.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Multiplayer
