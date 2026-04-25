import io from 'socket.io-client';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000';

let socket = null;

function getSocket() {
  if (!socket) {
    socket = io(BACKEND_BASE_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  return socket;
}

export default function initializeSocket() {
  return getSocket();
}

export function sendSocketMessage(message) {
  const socket = getSocket();
  if (socket.connected) {
    socket.emit('message', message);
    console.log('Sent message to server:', message);
  } else {
    console.warn('Cannot send message, socket not connected');
  }
}
