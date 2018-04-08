const mongoose = require('mongoose');

const ShortURL = mongoose.model('ShortURL', new mongoose.Schema({
  _id: Number,
  url: String,
}));

const Counter = mongoose.model('Counter', new mongoose.Schema({
  _id: String,
  count: Number,
}));

module.exports = { ShortURL, Counter };
