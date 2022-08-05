const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/user-model');

const isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verification token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

      // 2) Check if user still exists in database
      const user = await User.findById(decoded.id);
      if (!user) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (user.changedPasswordAfter(decoded)) {
        return next();
      }

      // 4) There's a logged in user
      // locals => Sets the variables that can be accessed from the all templates
      res.locals.user = user;

      return next();
    } catch (err) {
      return next();
    }
  }
  return next();
};

module.exports = isLoggedIn;
