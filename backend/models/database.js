const mongoose = require('mongoose');

const fallbackURL = "mongodb://localhost:27017";
mongoose.connect(`${process.env.MONGODB_URL || fallbackURL}/${process.env.DATABASE_NAME || 'chat-app'}`)
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Could not connect...', err));

require('./user');
require('./message');
require('./room');
require('./room-invite');
require('./friend-request');
require('./file');
