import { io } from 'socket.io-client';

const socket = io('13.210.86.120:80');

export function initializeSocket() {
  socket.connect();
}

export function disconnectSocket() {
  if (socket) socket.disconnect();
}

export default socket;
