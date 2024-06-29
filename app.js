var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts =  require('express-ejs-layouts');
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const dotenv = require('dotenv')
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs")
dotenv.config()


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI || dev_db_url;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

// view engine setup
app.use(limiter);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);
app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); // Compress all routes
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;