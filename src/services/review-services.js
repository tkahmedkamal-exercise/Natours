const Review = require('../model/review-model');

exports.getAllReviews = async params => {
  const filter = {};
  const tour = params.tourId;
  if (tour) {
    filter.tour = tour;
  }
  return await Review.find(filter);
};

exports.getReview = async id => {
  return await Review.findById(id);
};

exports.newReview = async req => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  return await Review.create(req.body);
};

exports.updateReview = async (id, body) => {
  return await Review.findByIdAndUpdate(id, body, { new: true, runValidators: true });
};

exports.deleteReview = async id => {
  return await Review.findByIdAndDelete(id);
};
