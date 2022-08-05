const User = require('../model/user-model');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });

  return newObj;
};

exports.updateMe = async req => {
  const { password, confirmPassword } = req.body;

  if (password || confirmPassword) {
    return { error: true };
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  return { user };
};

exports.deleteMe = async req => {
  return await User.findByIdAndUpdate(req.user.id, { active: false });
};

exports.getUsers = async () => {
  return await User.find();
};

exports.deleteUser = async id => {
  return await User.findByIdAndDelete(id);
};
