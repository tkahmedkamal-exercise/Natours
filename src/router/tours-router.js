const express = require('express');
const {
  getAllTours,
  getTour,
  newTour,
  updateTour,
  deleteTour,
  getTourStats,
  monthStats,
  getToursWithin
} = require('../controller/tours-controller');
const { topFiveCheap } = require('../middlewares/top-five-cheap');
const { protect } = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');
const { tourUploadImages } = require('../middlewares/image-upload');
const { resizeTourImages } = require('../middlewares/image-processing');
const reviewsRouter = require('./reviews-router');

const router = express.Router();

router.use('/:tourId/reviews', reviewsRouter);

router.get('/', getAllTours);

router.get('/top-5-cheap', topFiveCheap, getAllTours);

router.get('/stats', getTourStats);

router.get('/month-stats/:year', protect, restrictTo('admin', 'lead-guid', 'guid'), monthStats);

router.get('/:id', getTour);

router.get('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithin);

router.post('/', protect, restrictTo('admin', 'lead-guid'), newTour);

router.patch(
  '/:id',
  protect,
  restrictTo('admin', 'lead-guid'),
  tourUploadImages,
  resizeTourImages,
  updateTour
);

router.delete('/:id', protect, restrictTo('admin', 'lead-guid'), deleteTour);

module.exports = router;
