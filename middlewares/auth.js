const AppError = require('../utils/AppError');

exports.authenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return next(
      new AppError(
        'You are not authorized to access this resource!',
        'fail',
        401
      )
    );
  }
};
