const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

require('./models/database');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const roomsRouter = require('./routes/rooms');
const messagesRouter = require('./routes/messages');

const { handleError, verifyApiKey } = require('./middleware/middleware');

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());


const v1Router = express.Router();

v1Router.use('/public', express.static(path.join(__dirname, 'public')));
v1Router.use(verifyApiKey);

v1Router.use('/', indexRouter);
v1Router.use('/authenticate', authRouter);
v1Router.use('/users', usersRouter);
v1Router.use('/rooms', roomsRouter);
v1Router.use('/messages', messagesRouter);

app.use('/api/' + process.env.API_VERSION, v1Router);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(handleError);

module.exports = app;
