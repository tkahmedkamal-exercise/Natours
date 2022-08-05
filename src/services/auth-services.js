const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../model/user-model');
const Email = require('../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = async req => {
  const { name, email, role, password, confirmPassword, passwordChangedAt } = req.body;
  const user = await User.create({
    name,
    email,
    role,
    password,
    confirmPassword,
    passwordChangedAt
  });

  const url = `${req.protocol}://${req.get('host')}/me`;

  await new Email(user, url).sendWelcome();

  const token = signToken(user._id);

  return { user, token };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  const token = signToken(user._id);

  return {
    user,
    token,
    userPassword: user ? user.correctPassword(password, user.password) : null
  };
};

exports.forgotPassword = async req => {
  // 1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });

  // 2) Generate the random reset token
  const resetToken = user ? user.createPasswordResetToken() : null;

  if (user) {
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const url = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;

    try {
      await new Email(user, url).sendPasswordReset();
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new Error(`There was an error sending the email. Try agin later! => ${err}`);
    }
  }

  return { user };
};

exports.resetPassword = async req => {
  // 1) Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return { user };
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) Update changePasswordAt property for the user
  // => pre save in user model

  // 4) Login the user in, send JWT
  const token = signToken(user._id);

  return { user, token };
};

exports.updateCurrentUserPassword = async req => {
  const user = await User.findById(req.user.id).select('+password');
  const currentPassword = await user.correctPassword(req.body.currentPassword, user.password);

  if (!currentPassword) {
    return { currentPassword };
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  const token = signToken(user._id);

  return { currentPassword, token, user };
};
