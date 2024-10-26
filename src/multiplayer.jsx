import React, { useState, useEffect } from 'react'
import { TextInput , Button, Title, Container, Space, Alert } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react';

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
      console.log(data)
      updateHaiku(data)
    })

    socket.on('clean_slate', () => {
      cleanSlate()
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

export default Multiplayer
