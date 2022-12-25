var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//session dan flash
const session = require('express-session');
const flash = require('connect-flash');


// method override 
const methodOverRide = require('method-override');

//import mongoose
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://staycation:bwamern@cluster0.7g6ldcp.mongodb.net/db_staycation?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false

});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//router admin
const adminRouter = require('./routes/admin');

//router api
const apiRouter = require('./routes/api');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const twoHours = 1000 * 60 * 60 * 24;
//session dan flash
app.use(session({
  secret: 'keyborad cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: twoHours
  }
}));

app.use(flash());

// method override 
app.use(methodOverRide('_method'));

// sb-admin
app.use('/sb-admin-2', express.static(path.join(__dirname, 'node_modules/startbootstrap-sb-admin-2')));
//ckeditor4
app.use('/ckeditor', express.static(path.join(__dirname, 'node_modules/ckeditor4')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


//admin
app.use('/admin', adminRouter);

//api
app.use('/api/v1', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;