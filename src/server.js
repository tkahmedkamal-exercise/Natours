const { mongoConnect } = require('./utils/mongo');

const app = require('./app');

const PORT = process.env.PORT || 3000;

(async () => {
  await mongoConnect();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

// Handled Rejection
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION, Shutting down...');
  app.listen(PORT).close(() => {
    process.exit(1);
  });
});
