import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io('https://api.haikuer.auguilin.com');
    console.log('Socket initialized');
  }
};

export const getSocket = async () => {
  return new Promise((resolve) => {
    if (socket) {
      if (socket.connected) {
        resolve(socket); // Return if already connected
      } else {
        socket.on('connect', () => resolve(socket)); // Wait for connection
      }
    } else {
      initializeSocket();
      socket.on('connect', () => resolve(socket)); // Wait for connection
    }
  });
};
