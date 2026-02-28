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
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.use(verifyApiKey);


app.use('/', indexRouter);
app.use('/authenticate', authRouter);
app.use('/users', usersRouter);
app.use('/rooms', roomsRouter);
app.use('/messages', messagesRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(handleError);

module.exports = app;
