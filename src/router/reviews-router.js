const express = require('express');
const {
  getAllReviews,
  getReview,
  newReview,
  updateReview,
  deleteReview
} = require('../controller/review-controller');
const { protect } = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router({ mergeParams: true });

router.get('/', protect, getAllReviews);
router.get('/:id', protect, getReview);
router.post('/', protect, restrictTo('user'), newReview);
router.patch('/:id', protect, restrictTo('user', 'admin'), updateReview);
router.delete('/:id', protect, restrictTo('user', 'admin'), deleteReview);

module.exports = router;
