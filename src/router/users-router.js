const express = require('express');

const { uploadImages } = require('../middlewares/image-upload');
const { resizeUserPhoto } = require('../middlewares/image-processing');
const { updateMe, deleteMe, getUsers, deleteUser } = require('../controller/users-controller');
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updateCurrentUserPassword
} = require('../controller/auth-controller');
const { protect } = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router.get('/', protect, restrictTo('admin'), getUsers);
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.patch('/update-me', protect, uploadImages, resizeUserPhoto, updateMe);
router.patch('/update-password', protect, updateCurrentUserPassword);
router.delete('/delete-me', protect, deleteMe);
router.delete('/:id', protect, restrictTo('admin'), deleteUser);
router.get('/logout', logout);

module.exports = router;
