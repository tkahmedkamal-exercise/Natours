const {
  getAllTours,
  getTour,
  newTour,
  updateTour,
  deleteTour,
  getTourStats,
  monthStats,
  getToursWithin
} = require('../services/tour-services');
const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');

exports.getAllTours = catchAsync(async (req, res, next) => {
  const { query } = req;

  const tours = await getAllTours(query);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await getTour(id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', '404'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.newTour = catchAsync(async (req, res, next) => {
  const tour = await newTour(req.body);

  res.status(201).json({
    status: 'success',
    tour
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  const tour = await updateTour(id, body);

  if (!tour) {
    return next(new AppError('No tour found with that ID', '404'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await deleteTour(id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', '404'));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await getTourStats();

  res.status(200).json({
    status: 'success',
    stats
  });
});

exports.monthStats = catchAsync(async (req, res, next) => {
  const { year } = req.params;

  const stats = await monthStats(year);

  res.status(200).json({
    status: 'success',
    stats
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const tours = await getToursWithin(req);

  if (tours.error) {
    return next(new AppError('Please provide latitude and longitude in tha format lat, lng.', '400'));
  }

  res.status(200).json({
    status: 'success',
    results: tours.tours.length,
    data: {
      data: tours.tours
    }
  });
});
