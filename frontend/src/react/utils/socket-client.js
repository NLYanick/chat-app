import io from 'socket.io-client';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000';

let socket = null;

function getSocket() {
  if (!socket) {
    const user = JSON.parse(sessionStorage.getItem('user'));

    socket = io(BACKEND_BASE_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      auth: {
        userId: user?.uid || null,
      },
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
  socket.on(event, callback);

  return () => socket.off(event, callback);
}

export function emitEvent(event, data) {
  getSocket().emit(event, data);
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
