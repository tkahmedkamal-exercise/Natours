const AppError = require('../utils/app-error');

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("you don't have permission to perform this action", '403'));
    }

    next();
  };
};

module.exports = restrictTo;
