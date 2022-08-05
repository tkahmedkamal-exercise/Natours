const multer = require('multer');
const AppError = require('../utils/app-error');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     const uniqueSuffix = `user-${req.user.id}-${Date.now()}.${ext}`;
//     cb(null, uniqueSuffix);
//   }
// });

// User Photo image upload
const multerMemory = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  const fileType = file.mimetype.startsWith('image');
  if (fileType) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', '400'), false);
  }
};

const upload = multer({
  storage: multerMemory,
  fileFilter: multerFilter
});

const uploadImages = upload.single('photo');

// Tour images upload
const tourMulterMemory = multer.memoryStorage();

const tourMulterFilter = (req, file, cb) => {
  const fileType = file.mimetype.startsWith('image');
  if (fileType) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', '400'), false);
  }
};

const tourUpload = multer({
  storage: tourMulterMemory,
  fileFilter: tourMulterFilter
});

const tourUploadImages = tourUpload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

module.exports = { uploadImages, tourUploadImages };
