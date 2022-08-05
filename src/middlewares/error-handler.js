const AppError = require('../utils/app-error');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, '400');
};

const handleDuplicateFieldDB = err => {
  const message = `Duplicate Field Value: ( ${err.keyValue.name} ) please use anther value.`;
  return new AppError(message, '400');
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(error => error.properties.message);
  const message = `Invalid input Data. [ ${errors.join(', ')} ]`;
  return new AppError(message, '400');
};

const handleTokenError = () => {
  const message = 'Invalid token. Please log in agin!';
  return new AppError(message, '401');
};

const handleTokenExpiredError = () => {
  const message = 'Your token has expired. Please log in agin!';
  return new AppError(message, '401');
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(+err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    res.status(+err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // Programming or other unknown error
  if (req.originalUrl.startsWith('/api')) {
    if (!err.isOperational) {
      console.error('ERROR', err);

      return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
      });
    }
    // Operation, trusted error
    res.status(+err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    if (!err.isOperational) {
      return res.status(+err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
      });
    }
    // Operation, trusted error
    return res.status(+err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'Please try agin later.'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleTokenError();
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError();
    sendErrorProd(error, req, res);
  }
};
