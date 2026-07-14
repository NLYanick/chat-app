const socketIO = require('socket.io');
const mongoose = require('mongoose');
const UserStatus = require('../models/enums/user-status');
const Logger = require('./logger');

const User = mongoose.model('User');
const Room = mongoose.model('Room');

function initializeSocket(server) {
  try {
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

      let user;
      try {
        user = await User.findOneAndUpdate(
          { uid: userId }, 
          { status: UserStatus.ONLINE }, 
          { returnDocument: 'after' }
        ).populate('rooms');

        if (!user) {
          console.error(`User connection rejected: ${userId} not found in DB`);
          return socket.disconnect(true);
        }

        if (user.rooms) {
          user.rooms.forEach(room => socket.join(`room:${room.uid}`));
        }

      } catch (dbError) {
        console.error('Fatal DB error during socket connection setup:', dbError);
        return socket.disconnect(true);
      }

      socket.on('disconnect', async () => {
        const userId = socket.userId;
        console.log('User disconnected:', userId);

        try {
          const freshUser = await User.findOneAndUpdate(
            { uid: userId }, 
            { status: UserStatus.OFFLINE },
            { returnDocument: 'after' }
          ).populate('rooms');

          if (freshUser) {
            if (freshUser.rooms) {
              freshUser.rooms.forEach(room => {
                io.to(`room:${room.uid}`).emit("user_status_change", { userId: currentUserId, status: UserStatus.OFFLINE });
              });
            }

            if (freshUser.friends) {
              freshUser.friends.forEach(friend => {
                io.to(`user:${friend}`).emit("user_status_change", { userId: currentUserId, status: UserStatus.OFFLINE });
              });
            }
          }
        } catch (disconnectError) {
          console.error('Failed to clean up user status on disconnect gracefully:', disconnectError);
          Logger.logError(disconnectError);
        }
      });

      socket.on('error', (error) => {
          console.error('Socket error:', error);
      });

      socket.use((packet, next) => {
        const [eventName, data] = packet;

        if (!data) {
          console.warn(`[Socket Protection] Event "${eventName}" dropped: Payload is null/undefined.`);
          return;
        }

        try {
          next(); 
        } catch (err) {
          console.error(`[Socket Protection] Prevented crash in event "${eventName}":`, err);
        }
      });

      handleSocket(io, socket, user.rooms, user.friends);
    });

    return io;
  } catch (error) {
    console.error('[SocketError] Error in socket.io:', error);
    Logger.logError(error);
  }
};

function handleSocket(io, socket, userRooms = [], userFriends = []) {
  try {
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

      if (!room || !room.uid) {
        console.warn('Invalid update_room data received:', data);
        return; 
      }

      io.to(`room:${room.uid}`).emit('room_updated', { room });
    });
    socket.on('joined_room', (data) => {
      const { room, user } = data;

      if (!user || !user.uid || !room || !room.uid) {
        console.warn('Invalid joined_room data received:', data);
        return; 
      }

      io.to(`user:${user.uid}`).emit('room_joined', { room, user });
      io.to(`room:${room.uid}`).emit('user_joined', { room, user });
    });
    socket.on('left_room', (data) => {
      const { room_id, user_id } = data;

      if (!user_id || !room_id) {
        console.warn('Invalid left_room data received:', data);
        return; 
      }

      io.to(`user:${user_id}`).emit('room_left', { room_id, user_id });
      io.to(`room:${room_id}`).emit('user_left', { room_id, user_id });
    });
  } catch (error) {
    console.error('[SocketError] Error in handleSocket:', error);
    Logger.logError(error);
  }
}

module.exports = initializeSocket