const express = require("express");
const path = require("path");
if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
} else if (process.env.NODE_ENV === "Udevelopment") {
  require("dotenv").config();
}
var app = express();
const server = require("http").createServer(app);
var io = require("socket.io").listen(server);
const PORT = process.env.PORT || 5000;
var register = require("./register");
var session = require("express-session");
var sharedsession = require("express-socket.io-session");
var flash = require("connect-flash");
var passport = require("passport");
app.set("trust proxy", 1); // trust first proxy
/*app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))*/

var session = require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  }),
  sharedsession = require("express-socket.io-session");

app.use(session);
io.use(sharedsession(session));

app.use(flash());
app.use(function(req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

require("./lib/routes.js")(app);
require("./socket/socket.js")(io);

app
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"));

server.listen(PORT, console.log(`Server started on port ${PORT}`));
