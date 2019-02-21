/* eslint-disable no-console */

const mongoose = require('mongoose');
const config = require('./config');

mongoose.Promise = global.Promise;

try {
  mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true
  });
} catch (error) {
  mongoose.createConnection(config.mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true
  });
}

mongoose.connection
  .once('open', () => console.log('MongoDB running'))
  .on('error', (err) => {
    throw err;
  });
