var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var hbs = require("hbs");
var app = express();

// configuring express session
var session = require('express-session')

app.use(session({
  secret: 'super secret',
  resave: false,
  saveUninitialized: true,
}))
// end configuring express session

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var booksRouter = require("./routes/books");

mongoose.connect("mongodb://localhost/library2")
  .then(()=> {
    console.log("connected to mongo!");
  })
  .catch((error)=> {
    console.log("Connecting to mongodb failed, reason: ", error)
  })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

// set up middleware
// these will always run before every request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// defining custom route protection middleware
let protectRoute = function(req, res, next) {
  if(req.session.user) next();
  else res.redirect("/users/login")
}

// attaching session data to res.locals, 
// making it available to all hbs files after this middleware
app.use(function(req,res,next) {
  if(req.session.user) res.locals.user = req.session.user;
  next();
})

app.use('/users', usersRouter);
app.use('/books', protectRoute, booksRouter);
app.use('/', indexRouter);

// catch all requests that are neither part of userRouter
// booksRouter nor indexRouter
app.use(function(req, res, next) {
  next({message: "Page not found.", status: 404});
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
