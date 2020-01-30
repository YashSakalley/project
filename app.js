var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//routers variable
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fir = require('./routes/fir');

const session = require('express-session');
var app = express();

//for database (MongoDB)
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/data", {useNewUrlParser : true, useUnifiedTopology : true})
.then((data) => {
  console.log("DB connected successfully");
})
.catch((err) => {
  console.log("error occured in database : ", err);
})

//session
app.use(session({
  secret: 'secret key',
  saveUninitialized: false,
  resave: false
}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//flash messages
app.use(require('connect-flash')());
//middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//router middlewares
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', fir);


//handling self created aadhar api
var aadhaarAPI = require("./routes/aadhaarAPI");
app.use('/aadhaarAPI', aadhaarAPI);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.user = req.flash('num');
  console.log('Num', req.flash('num'));

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
