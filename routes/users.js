var express = require('express');
var router = express.Router();
var User = require("../models/User")
var bcrypt = require('bcrypt');

router.get('/signup', function(req, res, next) {
  res.render('signup', {s});
});

router.post('/signup', function(req, res, next) {
  

  bcrypt.hash(req.body.password, 10, function(error, hash) {
    debugger;
    if(error) throw new Error("Encryption error");

    let newUser = {
      username: req.body.username, 
      password: hash
    }

    User.create(newUser)
    .then((user)=> {
      debugger
      res.redirect('/users/login');
    })
    .catch((err)=> {
      res.send("error");
    })
  });

});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  debugger
  User.findOne({username: req.body.username})
    .then((user)=> {
      debugger
      if(user) {
        bcrypt.compare(req.body.password, user.password, function(err, match) {
          if(err) throw new Error("Encryption error");
          if(match) {
            req.session.user = user;
            res.redirect("/users/profile");
          } else {
            // password incorrect
            res.send("Invalid credentials.")
          }
        });
      } else {
        // user not found
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
