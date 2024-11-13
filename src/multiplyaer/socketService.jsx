import { io } from 'socket.io-client';

const socket = io('https://api.haikuer.auguilin.com/');

export function initializeSocket() {
  socket.connect();
}

export function disconnectSocket() {
  if (socket) socket.disconnect();
}

export default socket;
