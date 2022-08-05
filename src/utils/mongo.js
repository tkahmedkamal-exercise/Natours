const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const DB_URL = process.env.DB_URL.replace('<password>', process.env.DB_PASSWORD);

exports.mongoConnect = async () => {
  await mongoose.connect(DB_URL);
  console.log('DB connection successful!');
};
