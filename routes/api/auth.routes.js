const express = require('express');
const User = require('../../models/User');
const passport = require('passport');
const auth = require('../../middlewares/auth');
const AppError = require('../../utils/AppError');

const router = express.Router();

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new AppError(info.message, info.status, info.statusCode));
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res
        .status(200)
        .json({ status: 'success', message: 'Logged in!', user: user });
    });
  })(req, res, next);
});

router.get('/logout', function (req, res, next) {
  req.logout();
  res.status(200).json({ status: 'success', message: 'Logged out!' });
});

module.exports = router;
