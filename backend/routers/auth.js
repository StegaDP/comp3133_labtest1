const express = require("express");
const user = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

async function comparePassword(password, targetPassword) {
  return await bcrypt.compare(password, targetPassword);
}

function generateAuthToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "100h" },
  );
}

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  user.findOne({ username }).then((user) => {
    if (!user) return res.status(400).send("Invalid username or password");

    comparePassword(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).send("Invalid username or password");

      const token = generateAuthToken(user);
      res.header("x-auth-token", token).send(token);
    });
  });
});

router.post("/register", async (req, res) => {
  const { username, firstname, lastname, password } = req.body;

  const newUser = new user({
    username,
    firstname,
    lastname,
    password: await bcrypt.hash(password, 10),
    createon: Date.now(),
  });

  newUser
    .save()
    .then(() => res.send("User registered"))
    .catch((err) => res.status(400).send(err));
});

module.exports = router;
