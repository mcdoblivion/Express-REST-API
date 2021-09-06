const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');

const passport = require('passport');

const indexRouter = require('./routes/index');
const cors = require('./routes/cors');

var app = express();

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

connect.then(
  (db) => {
    console.log('Connected correctly to mongo server!');
  },
  (err) => {
    console.log(err);
  }
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// create custom token to get real remote IP address
logger.token('real-ip', (req, res) => {
  return req.headers['x-forwarded-for'];
})

app.use(
  logger(
    ':date[web] :real-ip :method :url :status :response-time ms - :req[Content-Length]'
  )
);

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logger.log'), {
  flags: 'a',
});

app.use(
  logger(
    ':date[web] :real-ip :method :url :status :response-time ms - :req[Content-Length]',
    { stream: accessLogStream }
  )
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors.corsWithOptions);
app.use('/api/v1', indexRouter);

// catch 404 and forward to error handler
app.use('*', (req, res, next) => {
  const err = new Error('URL not exist!');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // send response with error code
  res.status(err.status || 500).json({ success: false, msg: err.toString() });
});

module.exports = app;
