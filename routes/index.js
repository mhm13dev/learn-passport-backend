const express = require('express');
const AppError = require('../utils/AppError');
const passport = require('passport');
const apiRouter = require('./api.routes');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Home!',
  });
});

router.use('/api', apiRouter);

module.exports = router;
