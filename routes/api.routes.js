const express = require('express');
const authRouter = require('./api/auth.routes');
const userRouter = require('./api/users.routes');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to API!',
  });
});

router.use('/auth', authRouter);
router.use('/users', userRouter);

module.exports = router;
