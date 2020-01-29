const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const url = 'mongodb://mongos1:27017,mongos2:27017/akwebdb';

mongoose.connect(url, { useNewUrlParser: true });
mongoose.connection.once('open', () =>
	console.log(`Connected to mongo at ${url}`)
);
