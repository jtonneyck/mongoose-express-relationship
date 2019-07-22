var express = require('express');
var router = express.Router();
var User = require("../models/User")

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  debugger
  let newUser = {
    username: req.body.username, 
    password: req.body.password
  }
  User.create(newUser)
    .then((user)=> {
      debugger
      res.redirect('/users/login');
    })
    .catch(()=> {
      res.send("error");
    })
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  User.findOne({username: req.body.username})
    .then((user)=> {
      debugger
      if(user) {
        if(user.password === req.body.password) {
          // log the user in
          req.session.user = user; // start a session for user
          res.redirect('/users/profile');
        } else {
          res.send("Invalid credentials");
        }
      } else {
        res.send("Invalid credentials");
      }
    })
    .catch((error)=> {
      res.send("error")
    })
});

router.get("/logout", (req,res)=> {
  req.session.destroy();
  res.redirect("/");
})

router.get("/profile", (req,res)=> {
  if(req.session.user) {
    res.send(`Welcome to your profile page ${req.session.user.username}`)
  } else {
    res.redirect("/users/login")
  }
})
module.exports = router;
