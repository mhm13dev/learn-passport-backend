const express = require('express');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const router = require('./routes');
const AppError = require('./utils/AppError');
const passportLocal = require('./utils/passport.local');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: 'passport.sid',
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      maxAge: 1000 * 60 * 60 * 24 * Number(process.env.COOKIE_MAX_AGE),
    },
  })
);

// Passport Middlewares
passport.use(passportLocal());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(router);

// Not Found
app.use((req, res, next) => {
  const error = new AppError(`${req.url} Not Found`, 'fail', 404);
  next(error);
});

// Error Handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || 'Something Went Wrong!',
  });
});

module.exports = app;
