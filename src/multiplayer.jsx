import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Multiplayer() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [roomPassword, setRoomPassword] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);

  useEffect(() => {
    // Listen for messages from the server
    socket.on('message', (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    // Room creation response
    socket.on('room_created', (data) => {
      setRoomId(data.room_id);
      alert('Room created successfully!');
    });

    // Clean up the listener when the component unmounts
    return () => {
      socket.off('message');
      socket.off('room_created');
    };
  }, []);

  const createRoom = () => {
    if (roomPassword) {
      socket.emit('create_room', { password: roomPassword });
    }
  };

  const joinRoom = () => {
    if (roomId && roomPassword && username) {
      socket.emit('join', { username, room: roomId, password: roomPassword });
      setIsInRoom(true);
    }
  };

  const sendMessage = () => {
    if (message && roomId) {
      socket.emit('message', { room: roomId, message });
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chat Room</h1>
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
            {chat.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default Multiplayer;
