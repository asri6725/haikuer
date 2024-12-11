import React, { useState, useEffect } from 'react'
import { TextInput , Button, Title, Container, Space, Alert, Anchor } from '@mantine/core'
import { useLocation } from 'react-router-dom'
import {getSocket} from './socketService'
import { useSnackbar } from 'notistack'

function RoomInitialiser({ setRoomId, roomId, setIsMultiplayer }) {
  const [username, setUsername] = useState('')
  const [roomPassword, setRoomPassword] = useState('')
  const [isInRoom, setIsInRoom] = useState(false)
  const [roomStatus, setRoomStatus] = useState([])
  const [disableCreateRoom, setDisableCreateRoom] = useState(true);
  const [disableJoinRoom, setDisableJoinRoom] = useState(true);

  let socket = null

  useEffect(() => {

    if (!socket) return;

    const queryParams = new URLSearchParams(location.search)
    if(queryParams.get('room_id') && queryParams.get('room_pw')){
      setRoomId(queryParams.get('room_id'))
      setRoomPassword(queryParams.get('room_pw'))
    }

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
      socket.off('room-created')
      socket.off('room-joined')
    }
  }, [username, roomPassword, roomId])

  const createRoom = async () => {
    try{
      if (roomPassword) {
        if (!socket) socket = await getSocket()
        socket.emit('create-room', { password: roomPassword })
      }
    } catch(error) {
      console.log("Failed socket conn: ", error)
    }
  }

  const joinRoom = async () => {
    try{
      if (roomId && roomPassword && username) {
        if (!socket) socket = await getSocket()
        socket.emit('join', { username, room: roomId, password: roomPassword })
      }
    } catch(error) {
      console.log("Failed socket conn: ", error)
    }
  }

  // const otherHaiku = ()

  const { enqueueSnackbar } = useSnackbar()
  
  const handleCopyLink = () => {
    const shareableLink = `${window.location.origin}/haikuer/?room_id=${roomId}&room_pw=${roomPassword}`

    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        enqueueSnackbar('Link copied to clipboard!', { variant: 'success', autoHideDuration: 3000 })
      })
      .catch((error) => {
        enqueueSnackbar('Failed to copy link.', { variant: 'error' })
      });
    };

  return (
    <Container className='container-class'>
      {!isInRoom && (
        <div>
          <Title order={3}>Haike with someone</Title>
          <TextInput 
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => {{setUsername(e.target.value)
              if (username.trim() !== '' && roomPassword.trim() !== '' && roomId.trim() !== ''){
                setDisableJoinRoom(false)
              }
              else if (username.trim() !== '' && roomPassword.trim() !== '' && roomId.trim() === ''){
                setDisableCreateRoom(false)
              }
            }}}
          />
          <Space h="xs" />
          <TextInput 
            type="text"
            placeholder="Enter Room Password"
            value={roomPassword}
            onChange={(e) => {{
                            setRoomPassword(e.target.value)
                            if (username.trim() !== '' && roomPassword.trim() !== '' && roomId.trim() !== ''){
                              setDisableJoinRoom(false)
                            }
                            else if (username.trim() !== '' && roomPassword.trim() !== '' && roomId.trim() === ''){
                              setDisableCreateRoom(false)
                            }
            }}}
          />
          <Space h="sm" />
          <Button onClick={createRoom} disabled={disableCreateRoom}>Create new room</Button>
          <Space h="md" />
          <TextInput 
            type="text"
            placeholder="Enter Room ID to Join"
            value={roomId}
            onChange={(e) => {{
                            setRoomId(e.target.value)
                            if (username.trim() !== '' && roomPassword.trim() !== '' && roomId.trim() !== ''){
                              setDisableJoinRoom(false)
                            }
                            else if (username.trim() !== '' && roomPassword.trim() !== '' && roomId.trim() === ''){
                              setDisableCreateRoom(false)
                            }
            }}}
          />
          <Button onClick={joinRoom} disabled={disableJoinRoom}>Join existing room</Button>
        </div>
      )}
      {isInRoom && (
        <div style={{width: '100%'}}>
          {/* <Alert variant="light" color="grape" radius="lg" title="" icon={IconInfoCircle}>
            Joined room: {roomId}, room_pw: {roomPassword}
          </Alert> */}
          <Anchor
            variant="gradient"
            gradient={{ from: 'pink', to: 'yellow' }}
            fw={500}
            fz="lg"
            onClick={handleCopyLink}
            style={{ cursor: 'pointer' }} // Style anchor to indicate it's clickable
          >
            Copy link to share
          </Anchor>
          <p>Room-link: `{window.location.origin}/haikuer/?room_id={roomId}&room_pw={roomPassword}`</p>
          <Space h="xs" />
          <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
            {roomStatus.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
          <p> </p>
        </div>
      )}
    </Container>
  )
}

export default RoomInitialiser