const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updateCurrentUserPassword
} = require('../services/auth-services');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');

const cookieToken = (res, user) => {
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true // Don't access cookie token or modified cookie token with browser, store cookie token and send this every requests
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', user.token, cookieOptions);

  // remove password from output
  user.user.password = undefined;
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await signup(req);

  cookieToken(res, user);

  res.status(201).json({
    status: 'success',
    token: user.token,
    data: {
      user: user.user
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and Password', '400'));
  }

  const user = await login({ email, password });

  if (!user || !(await user.userPassword)) {
    return next(new AppError('Incorrect email or password', '401'));
  }

  cookieToken(res, user);

  res.status(200).json({
    status: 'success',
    token: user.token
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await forgotPassword(req);

  if (!user.user) {
    return next(new AppError('There is not user with email address', '404'));
  }

  try {
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    return next(new AppError(err.message, '500'));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = await resetPassword(req);

  if (!user.user) {
    return next(new AppError('Token is invalid or has expired', '400'));
  }

  cookieToken(res, user);

  res.status(200).json({
    status: 'success',
    token: user.token
  });
});

exports.updateCurrentUserPassword = catchAsync(async (req, res, next) => {
  const user = await updateCurrentUserPassword(req);
  if (!(await user.currentPassword)) {
    return next(new AppError('Your current password is wrong!', '401'));
  }

  cookieToken(res, user);

  res.status(200).json({
    status: 'success',
    token: user.token
  });
});

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success'
  });
};
