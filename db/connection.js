const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

const connection = mongoose.createConnection(
  process.env.DB_URL,
  options,
  (err) => {
    if (err) {
      console.log('Error in Initial Connection to Database!');
      console.log(err);
    }
  }
);

connection.on('connected', () => {
  console.log('Connected To Database!');
});

connection.on('error', (err) => {
  console.log('Error After Initial Connection to Database!');
  console.log(err);
});

connection.on('disconnected', () => {
  console.log('Mongoose Disconnected From MongoDB Database!');
});

module.exports = connection;
