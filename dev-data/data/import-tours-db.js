const fs = require('fs');
const path = require('path');
const Tour = require('../../src/model/tour-model');
const Review = require('../../src/model/review-model');
const User = require('../../src/model/user-model');
const { mongoConnect } = require('../../src/utils/mongo');

const tours = JSON.parse(fs.readFileSync(path.join(__dirname, '/tours.json'), 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(path.join(__dirname, '/reviews.json'), 'utf-8'));
const users = JSON.parse(fs.readFileSync(path.join(__dirname, '/users.json'), 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    await Review.create(reviews);
    await User.create(users, { validateBeforeSave: false });
    console.log('Import data successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    console.log('Delete data successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const { argv } = process;

if (argv[2] === '--import') {
  importData();
} else if (argv[2] === '--delete') {
  deleteData();
}

(async () => {
  await mongoConnect();
})();
