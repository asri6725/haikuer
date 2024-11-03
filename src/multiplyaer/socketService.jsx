import { io } from 'socket.io-client';

const socket = io('https://4725-13-236-193-140.ngrok-free.app');

export function initializeSocket() {
  socket.connect();
}

export function disconnectSocket() {
  if (socket) socket.disconnect();
}

export default socket;
