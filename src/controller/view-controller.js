const { getOverview, getTour, updateUserData } = require('../services/view-services');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await getOverview();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await getTour(req.params.slug);

  if (!tour) {
    return next(new AppError('There is no tour with that name.', '404'));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = async (req, res) => {
  res.status(200).render('login', {
    title: 'Login'
  });
};

exports.getAccount = async (req, res) => {
  res.status(200).render('account', {
    title: 'My Account'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const user = await updateUserData(userId, req.body);

  res.status(200).render('account', {
    title: 'My Account',
    user
  });
});
