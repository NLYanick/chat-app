const socketIO = require('socket.io');

function initializeSocket(server) {
  const io = new socketIO.Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL, process.env.BASE_URL],
      methods: '*'
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });

    handleSocket(socket);
  });

  return io;
};

function handleSocket(socket) {
  socket.on('message', (message) => {
    console.log('Received message from client:', message);
  });
}

module.exports = initializeSocket