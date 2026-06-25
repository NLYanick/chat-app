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

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    console.log('User connected:', userId);

    socket.join(`user:${userId}`);

    const user = await User.findOne({ uid: userId }).populate('rooms');
    user.rooms.forEach(room => socket.join(`room:${room.uid}`));

    socket.on('disconnect', async () => {
      const userId = socket.userId;
      console.log('User disconnected:', userId);

      await User.findOneAndUpdate({ uid: userId }, { status: UserStatus.OFFLINE });
      
      user.rooms.forEach(room => {
        io.to(`room:${room.uid}`).emit("user_status_change", { userId, status: UserStatus.OFFLINE });
      });
      user.friends.forEach(friend => {
        io.to(`user:${friend}`).emit("user_status_change", { userId, status: UserStatus.OFFLINE });
      });
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });

    handleSocket(socket, user.rooms, user.friends);
  });

  return io;
};

function handleSocket(socket, userRooms, userFriends) {
  const userId = socket.userId;

  userFriends.forEach(friend => {
    socket.to(`user:${friend}`).emit("user_status_change", { userId, status: UserStatus.ONLINE });
  });
  userRooms.forEach(room => {
    socket.to(`room:${room.uid}`).emit('user_status_change', { userId, status: UserStatus.ONLINE });
  });

  socket.on('status_change', (status) => {
    userFriends.forEach(friend => {
      socket.to(`user:${friend}`).emit("user_status_change", { userId, status });
    });
    userRooms.forEach(room => {
      socket.to(`room:${room.uid}`).emit('user_status_change', { userId, status });
    });
  });

  socket.on('message', (message) => {
    console.log('Received message from client:', message);
  });
}

module.exports = initializeSocket