require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

require('./models/database');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const mailRouter = require('./routes/mails');
const usersRouter = require('./routes/users');
const roomsRouter = require('./routes/rooms');
const messagesRouter = require('./routes/messages');
const roomInvitesRouter = require('./routes/room-invites');
const friendRequestRouter = require('./routes/friend-requests');

const { handleError, verifyApiKey, requireAuth } = require('./middleware/middleware');

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.text({ type: "text/plain" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));


const v1Router = express.Router();

v1Router.use('/public', express.static(path.join(__dirname, 'public')));
v1Router.use(verifyApiKey);

v1Router.use('/authenticate', authRouter);
v1Router.use(requireAuth);

v1Router.use('/', indexRouter);
v1Router.use('/users', usersRouter);
v1Router.use('/mails', mailRouter);
v1Router.use('/rooms', roomsRouter);
v1Router.use('/messages', messagesRouter);
v1Router.use('/room-invites', roomInvitesRouter);
v1Router.use('/friend-requests', friendRequestRouter);

app.use('/api/' + process.env.API_VERSION, v1Router);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  return res.status(404).json({ message: "Not Found", success: false });
});

app.use(handleError);

module.exports = app;
