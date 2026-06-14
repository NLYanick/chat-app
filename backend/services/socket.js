const socketIO = require('socket.io');
const mongoose = require('mongoose');
const UserStatus = require('../models/enums/user-status');

const User = mongoose.model('User');

function initializeSocket(server) {
  const io = new socketIO.Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL, process.env.BASE_URL],
      methods: '*'
    },
    pingInterval: 10000, // 10s
    pingTimeout: 5000, // 5s
  });

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;

    if (!userId) {
      return next(new Error('Authentication error: userId is required'));
    }

    socket.userId = userId;
    next();
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);

    socket.on('disconnect', async () => {
      const userId = socket.userId;
      console.log('User disconnected:', userId);

      await User.findOneAndUpdate({ uid: userId }, { status: "offline" });
      socket.broadcast.emit('user_status_change', { userId, status: UserStatus.OFFLINE });
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });

    handleSocket(socket);
  });

  return io;
};

function handleSocket(socket) {
  handleUserStatus(socket);
  handleMessages(socket);
}

function handleUserStatus(socket) {
  const userId = socket.userId;

  socket.broadcast.emit('user_status_change', { userId, status: UserStatus.ONLINE });

  socket.on('status_change', (status) => {
    socket.broadcast.emit('user_status_change', { userId, status });
  });
}

function handleMessages(socket) {
  socket.on('message', (message) => {
    console.log('Received message from client:', message);
  });
}

module.exports = initializeSocket