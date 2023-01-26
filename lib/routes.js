var express = require("express");
var app = express();
const passport = require("passport");
const uuidv4 = require("uuid/v4");
const bcrypt = require("bcryptjs");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const db = require("../db");
var test = require("../test");
const passportConfig = require("../config/auth");
//app.use(express.static('public'));

module.exports = function(app) {
  app.use(express.json()); // for parsing application/json
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/test", test);

  app.get("/lobby", passportConfig.isAuthenticated, function(req, res, next) {
    if (req.user) {
      req.session.userInfo = req.user;
    }
    res.render("pages/lobby");
  });

  app.get("/rooms", passportConfig.isAuthenticated, function(req, res, next) {
    if (req.user) {
      req.session.userInfo = req.user;
    }
    db.any('SELECT id, name FROM "rooms"')
      .then(rooms => {
        res.render("pages/rooms", {
          rooms: rooms
        });
      })
      .catch(err => {
        throw err;
      });
  });

  app.get("/room/:id", function(req, res) {
    //will be used later passportConfig.isAuthenticated
    if (req.user) {
      req.session.userInfo = req.user;
    }

    //will be removed later
    req.session.userInfo = {
      id: 1,
      firstName: "atif",
      lastName: "ali",
      email: "atif@codenterprise.com",
      password: "$2a$10$fBzURYSHaq2pY2f7OxAVoeS1lRQLM57mze.EJUWihqxN/xySgnCn6",
      createdAt: "2019-12-04T06:26:41.604Z"
    };

    let roomId = req.params.id;
    db.any('SELECT * FROM "rooms" WHERE "id"=$1', roomId).then(room => {
      room = room[0];

      res.render("pages/room", {
        data: {
          info: req.session.userInfo,
          room: room
        }
      });
    });
  });

  app.get("/logout", passportConfig.isAuthenticated, function(req, res, next) {
    req.logout();
    res.redirect("/");
  });

  app.get("/game", passportConfig.isAuthenticated, function(req, res, next) {
    if (typeof req.session.room == "undefined") {
      req.flash("error_msg", "Wrong access key, please try again.");
      return res.redirect("/lobby");
    }
    res.render("pages/game", { data: req.session });
  });

  app.get("/register", function(req, res, next) {
    res.render("pages/register");
  });

  app.post("/", async function(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("errors", info);
        return res.redirect("/");
      }
      req.logIn(user, err => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Success! You are logged in.");
        res.redirect("/lobby");
      });
    })(req, res, next);
  });

  app.post("/register", async function(req, res) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    db.any('SELECT id FROM "users" WHERE "email"=$1', [req.body.email])
      .then(results => {
        if (results.length > 0) {
          req.flash("error", "This email is already registered!");
          res.redirect("/register");
        } else {
          db.any(
            `INSERT INTO users ("firstName","lastName","email","password") VALUES ('${req.body.firstName}','${req.body.lastName}','${req.body.email}','${hash}')`
          )
            .then(data => {
              req.flash("success", "New user registered!");
              res.redirect("/");
            })
            .catch(error => {
              console.log(error);
              res.json({ error });
            });
        }
      })
      .catch(error => {
        console.log(error);
        res.json({ error });
      });
  });
};
