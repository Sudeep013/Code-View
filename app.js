var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cors = require('cors');

var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

require('./passport');
var config = require('./config');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var taskRouter = require('./routes/task');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(config.dbConnstring,{ useNewUrlParser: true,useUnifiedTopology: true });

global.User = require('./models/user');
global.Task = require('./models/task');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

app.use(cookieParser());
app.use(session({
    secret : config.sessionkey,
    resave: false,
    saveUninitialized : true,
    sameSite: true, 
    cookie: {secure: true}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next) =>{
    if(req.isAuthenticated) {
      res.locals.isAuthenticated = req.isAuthenticated();
      res.locals.user = res.user;
    }
    next();
});

app.use((req,res,next)=>{
  if(req.isAuthenticated) res.locals.isAuthenticated = req.isAuthenticated();
  next();
});


app.use('/', indexRouter);
app.use('/',authRouter);
app.use('/',taskRouter);

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
