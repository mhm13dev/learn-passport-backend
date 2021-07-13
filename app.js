const express = require('express');
var cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const router = require('./routes');
const AppError = require('./utils/AppError');
const passportLocal = require('./utils/passport.local');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy');
}

// Accept Signed Cookies
const corsConfig = { origin: true, credentials: true };
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

app.use(cookieParser(process.env.SESSION_SECRET));
app.use((req, res, next) => {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies);

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies);

  next();
});
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
      domain: 'mhm13.dev',
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
