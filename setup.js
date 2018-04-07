const mongo = require('mongodb');
const mongoose = require('mongoose');

const { Counter } = require('./model');

const counter = Counter.create({ _id: 'shorturls', count: 0 }, (err) => (
  err 
    ? console.error(`Couldn't setup db: ${err}`) 
    : console.log('Successfully setup DB')
));

