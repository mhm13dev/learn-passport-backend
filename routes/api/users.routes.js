const express = require('express');
const User = require('../../models/User');
const auth = require('../../middlewares/auth');
const AppError = require('../../utils/AppError');

const router = express.Router();

router.get('/me', auth.authenticate, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'My Account',
    user: req.user,
  });
});

router.post('/', async (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  try {
    await user.save();
  } catch (error) {
    return next(error);
  }

  res.status(201).json({
    status: 'success',
    message: 'User Created Successfully!',
  });
});

module.exports = router;
