const { updateMe, deleteMe, getUsers, deleteUser } = require('../services/users-services');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');

exports.updateMe = catchAsync(async (req, res, next) => {
  const user = await updateMe(req);

  if (user.error) {
    return next(
      new AppError(
        'This route is not for password updates. Please user /updateCurrentUserPassword',
        '400'
      )
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: user.user
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await deleteMe(req);

  res.status(200).json({
    status: 'success',
    data: null
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await getUsers();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await deleteUser(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', '404'));
  }

  res.status(402).json({
    status: 'success',
    data: null
  });
});
