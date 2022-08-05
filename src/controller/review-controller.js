const {
  getAllReviews,
  getReview,
  newReview,
  updateReview,
  deleteReview
} = require('../services/review-services');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await getAllReviews(req.params);

  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews
    }
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await getReview(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', '404'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

exports.newReview = catchAsync(async (req, res, next) => {
  const review = await newReview(req);

  res.status(201).json({
    status: 'success',
    data: {
      review
    }
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  const review = await updateReview(id, body);

  if (!review) {
    return next(new AppError('No review found with that ID', '404'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await deleteReview(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', '404'));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
