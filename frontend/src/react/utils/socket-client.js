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
      console.log('Connected to server');
    });

    socket.on('disconnect', async () => {
      console.log('Disconnected from server');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });
  } else if (!socket.connected) {
    console.warn('Socket exists but is not connected. Attempting to reconnect...');
    socket.connect();
  }

  return socket;
}

export default function initializeSocket() {
  return getSocket();
}

// ============================
//          Functions
// ============================

export function subscribeToEvent(event, callback) {
  const socket = getSocket();
  if (socket.connected) {
    socket.on(event, callback);
  } else {
    console.warn('Cannot subscribe to event, socket not connected');
  }

  return () => {
    if (socket) 
      socket.off(event, callback);
  };
}
