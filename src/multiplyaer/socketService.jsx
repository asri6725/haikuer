import { io } from 'socket.io-client';

const socket = io('http://api.haikuer.auguilin.com:80/');

export function initializeSocket() {
  socket.connect();
}

export function disconnectSocket() {
  if (socket) socket.disconnect();
}

export default socket;
