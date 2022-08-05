const Tour = require('../model/tour-model');
const User = require('../model/user-model');

exports.getOverview = async () => {
  return await Tour.find();
};

exports.getTour = async slug => {
  return await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
};

exports.updateUserData = async (userId, { name, email }) => {
  return await User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true });
};
