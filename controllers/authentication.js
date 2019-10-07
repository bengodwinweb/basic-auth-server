const jwt = require('jwt-simple');
const User = require("../models/user");
const config = require('../config');

function generateToken(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide email and password" });
  }

  // See if a user with given email exists
  User.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    // If user with email does exist, return error
    if (existingUser) {
      return res.status(422).send({ error: "Email is in use" });
    }

    // If a user with email does NOT exist, create and save user record
    const newUser = new User({
      email,
      password
    });
    newUser
      .save()
      .then(res.json({ token: generateToken(newUser) }))
      .catch(err => next(err));
  });
};

exports.signin = (req, res, next) => {
  res.send({ token: generateToken(req.user) });
};
