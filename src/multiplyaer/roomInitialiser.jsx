import React, { useState, useEffect } from 'react'
import { TextInput , Button, Title, Container, Space, Alert } from '@mantine/core'
import socket from './socketService'

function RoomInitialiser({ setRoomId, roomId, setIsMultiplayer }) {
  const [username, setUsername] = useState('')
  const [roomPassword, setRoomPassword] = useState('')
  const [isInRoom, setIsInRoom] = useState(false)
  const [roomStatus, setRoomStatus] = useState([])

  useEffect(() => {
    // Room creation response
    socket.on('room-created', (data) => {
      setRoomId(data.room_id)
      alert('Room created successfully!')
    })

    // Room join response
    socket.on('room-joined', (data) => {
      if(!isInRoom){
        setRoomId(data.room_id)
        setIsInRoom(true)
        setIsMultiplayer(true)
      }
      setRoomStatus((prevStatus) => [...prevStatus, data.message])
    })

    // other messages from server
    socket.on('message', (data) => {
      setRoomStatus((prevStatus) => [...prevStatus, data.message])
    })

    // Clean up the listener when the component unmounts
    return () => {
      socket.off('message')
      socket.off('room_created')
      socket.off('room_joined')
    }
  }, [])

  const createRoom = () => {
    if (roomPassword) {
      console.log('creat')
      socket.emit('create-room', { password: roomPassword })
    }
  }

  const joinRoom = () => {
    if (roomId && roomPassword && username) {
      socket.emit('join', { username, room: roomId, password: roomPassword })
    }
  }

  // const otherHaiku = ()

  return (
    <Container className='container-class'>
      {!isInRoom && (
        <div>
          <Title order={3}>Haike with someone</Title>
          <TextInput 
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Space h="xs" />
          <TextInput 
            type="text"
            placeholder="Enter Room Password"
            value={roomPassword}
            onChange={(e) => setRoomPassword(e.target.value)}
          />
          <Space h="sm" />
          <Button onClick={createRoom}>Create Room</Button>
          <Space h="md" />
          <TextInput 
            type="text"
            placeholder="Enter Room ID to Join"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <Button onClick={joinRoom}>Join Room</Button>
        </div>
      )}
      {isInRoom && (
        <div style={{width: '100%'}}>
          {/* <Alert variant="light" color="grape" radius="lg" title="" icon={IconInfoCircle}>
            Joined room: {roomId}, room_pw: {roomPassword}
          </Alert> */}
          <Alert variant="light" color="grape" radius="lg" title="Room Details">
          room: {roomId}<br />room pw: {roomPassword}
          </Alert>
          <Space h="xs" />
          <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
            {roomStatus.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
        </div>
      )}
    </Container>
  )
}

export default RoomInitialiser