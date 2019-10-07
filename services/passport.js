const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

// Create local strategy
const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  console.log("===============================");
  console.log("attempting Local Strategy auth");
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      console.log("error finding User with given email - " + err);
      return done(err);
    }
    if (!user) {
      console.log("no user with given email");
      return done(null, false);
    }

    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        console.log("error comparing passwords - " + err);
        return done(err);
      }
      if (!isMatch) {
        console.log("isMatch is false");
        return done(null, false);
      }

      console.log("user is successfully authenticated: - " + user);
      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub, (err, user) => {
    if (err) {
      return done(err, false);
    }

    if (user) {
      return done(null, user);
    }

    done(null, false);
  });
});

// Tell Passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
