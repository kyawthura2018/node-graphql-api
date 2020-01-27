const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const url = 'mongodb://127.0.0.1:27017/test';

mongoose.connect(url, { useNewUrlParser: true });
mongoose.connection.once('open', () =>
  console.log(`Connected to mongo at ${url}`)
);
