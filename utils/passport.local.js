const passport = require('passport');
const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      return done(err);
    }
    done(null, user);
  });
});

module.exports = () => {
  return new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, async function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.',
          status: 'fail',
          statusCode: 404,
        });
      }
      if (!(await user.validPassword(password))) {
        return done(null, false, {
          message: 'Incorrect password.',
          status: 'fail',
          statusCode: 401,
        });
      }
      return done(null, user);
    });
  });
};
