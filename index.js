require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;

const { MONGO_URI } = process.env;

MongoClient.connect(MONGO_URI, {useNewUrlParser: true}, function(err, db) {
	if(err) {
		console.log('Cannot connect to MongoDB!', err);
	} else {
		console.log('Connected to MongoDB!', MONGO_URI);
	}
});
