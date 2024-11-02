import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export function initializeSocket() {
  // Add any setup or configuration here if needed
  socket.connect();
}

export function disconnectSocket() {
  if (socket) socket.disconnect();
}

export default socket;
