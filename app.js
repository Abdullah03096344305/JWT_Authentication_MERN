const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("./models/user");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", (req, res) => {
  let { username, email, password, age } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({
        username,
        email,
        password: hash,
        age,
      });
      let token = jwt.sign({ email }, "shhhhhhhhhhhhh");
      res.cookie("token", token);

      res.send(createdUser);
    });
  });
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", async function (req, res) {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.send("Something went wrong");
  }
  //console.log(user.password, req.body.password);
  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (result === true) {
      let token = jwt.sign({ email: user.email }, "shhhhhhhhhhhhh");
      res.cookie("token", token);
      res.send("Logged In Successfully");
    } else res.send("wrong Password");
  });
});

app.get("/logout", (req, res) => {
  //must change this from get to post
  res.clearCookie("token");
  res.redirect("/");
});

app.listen(3000);
