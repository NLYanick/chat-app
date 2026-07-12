const socketIO = require('socket.io');
const mongoose = require('mongoose');
const UserStatus = require('../models/enums/user-status');

const User = mongoose.model('User');
const Room = mongoose.model('Room');

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

    const user = await User.findOneAndUpdate({ uid: userId }, { status: UserStatus.ONLINE }, { returnDocument: 'after' }).populate('rooms');
    user.rooms.forEach(room => socket.join(`room:${room.uid}`));

    const rooms = await Room.find();
    rooms.forEach(room => socket.join(`room:${room.uid}`));

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

    handleSocket(io, socket, user.rooms, user.friends, rooms);
  });

  return io;
};

function handleSocket(io, socket, userRooms, userFriends, allRooms) {
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

  socket.on('send_message', (data) => {
    const { message, room_id, attachments } = data;

    io.to(`room:${room_id}`).emit('message_sent', { message, room_id, attachments });
  });
  socket.on('edit_message', (data) => {
    const { message_id, text, room_id, updated_at } = data;

    io.to(`room:${room_id}`).emit('message_edited', { message_id, text, room_id, updated_at });
  });
  socket.on('delete_message', (data) => {
    const { message_id, room_id } = data;

    io.to(`room:${room_id}`).emit('message_deleted', { message_id, room_id });
  });

  socket.on('notification', (data) => {
    const { user_id, notification } = data;

    socket.to(`user:${user_id}`).emit('notification_received', { user_id, notification });
  });

  socket.on('started_typing', (data) => {
    const { room_id, username } = data;

    socket.to(`room:${room_id}`).emit('typing_started', { room_id, username });
  });
  socket.on('stopped_typing', (data) => {
    const { room_id, username } = data;

    socket.to(`room:${room_id}`).emit('typing_stopped', { room_id, username });
  });

  socket.on('add_friend', (data) => {
    const { user_id, my_id } = data;

    io.to(`user:${user_id}`).emit('friend_added', { user_id, my_id });
  });
  socket.on('remove_friend', (data) => {
    const { user_id, my_id } = data;

    io.to(`user:${user_id}`).emit('friend_removed', { user_id, my_id });
  });

  socket.on('update_room', (data) => {
    const { room } = data;

    io.to(`room:${room.uid}`).emit('room_updated', { room });
  });
  socket.on('joined_room', (data) => {
    const { room, user } = data;

    io.to(`user:${user.uid}`).emit('room_joined', { room, user });
    io.to(`room:${room.uid}`).emit('user_joined', { room, user });
  });
  socket.on('left_room', (data) => {
    const { room_id, user_id } = data;

    io.to(`user:${user_id}`).emit('room_left', { room_id, user_id });
    io.to(`room:${room_id}`).emit('user_left', { room_id, user_id });
  });
}

module.exports = initializeSocket