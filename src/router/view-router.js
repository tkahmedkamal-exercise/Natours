const express = require('express');
const { protect } = require('../middlewares/protect');
const isLoggedIn = require('../middlewares/isLoggedIn');

const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  updateUserData
} = require('../controller/view-controller');

const router = express.Router();

router.get('/', isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);
router.post('/submit-user-data', protect, updateUserData);

module.exports = router;
