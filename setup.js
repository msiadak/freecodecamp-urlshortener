const mongo = require('mongodb');
const mongoose = require('mongoose');

const { Counter } = require('./model');

mongoose.connect(process.env.MONGOLAB_URI, { useMongoClient: true });

Counter.create({ _id: 'shorturls', count: 0 }, (err) => {
  if (err) {
    console.error(`Couldn't setup db: ${err}`);
  } else {
    console.log('Successfully setup DB');
  }
  process.exit();
});

