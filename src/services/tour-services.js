const Tour = require('../model/tour-model');
const { ApiFeatures } = require('../utils/api-features');

exports.getAllTours = async query => {
  const apiFeatures = new ApiFeatures(Tour, query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  // return await apiFeatures.query.explain();
  return await apiFeatures.query;
};

exports.getTour = async id => {
  return await Tour.findById(id).populate('reviews');
};

exports.newTour = async body => {
  return await Tour.create(body);
};

exports.updateTour = async (id, body) => {
  return Tour.findByIdAndUpdate(id, body, { new: true, runValidators: true });
};

exports.deleteTour = async id => {
  return Tour.findByIdAndDelete(id);
};

exports.getTourStats = async () => {
  return await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        sumPrice: { $sum: '$price' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);
};

exports.monthStats = async year => {
  return await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: { _id: 0 }
    },
    {
      $sort: { month: 1 }
    },
    {
      $limit: 12
    }
  ]);
};
// /tours-within/:distance/center/:latlng/unit/:unit'
exports.getToursWithin = async req => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return { error: true };
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  return {
    error: false,
    tours
  };
};
