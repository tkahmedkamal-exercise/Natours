const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/user-model');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  const tokenStr = authorization ? authorization.split(' ')[0] : '';

  // 1) Getting token and check of it's there
  let token;
  if (authorization && tokenStr === 'Bearer') {
    token = authorization.slice(7);
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (!token) {
    return next(new AppError('You are not logged in! please log in to get access', '401'));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists in database
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('The user belonging to this token does no longer exist.', '401'));
  }

  // 4) Check if user changed password after the token was issued
  if (user.changedPasswordAfter(decoded)) {
    return next(new AppError('User recently changed password! Please log in agin', '401'));
  }

  // 5) Adding the data of the currently logged user to the request
  req.user = user;
  res.locals.user = user;

  next();
});
