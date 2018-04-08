'use strict';

const dns = require('dns');
const { URL } = require('url');

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const { ShortURL, Counter } = require('./model');

mongoose.connect(process.env.MONGOLAB_URI, { useMongoClient: true });

/*** Middleware ***/
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(process.cwd() + '/public'));

/*** Handlers ***/
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Create new shortened URL
app.post('/api/shorturl/new', (req, res) => {
  const url = req.body.url;
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch (e) {
    return res.status(404).json({ error: 'Invalid URL' });
  }
  dns.lookup(hostname, err => {
    if (err) {
      return res.status(404).json({ error: `Couldn't resolve hostname: ${hostname}` });
    }
    Counter.findByIdAndUpdate('shorturls', { $inc: 'count' }, (err, counter) => {
      if (err) {
        return res.status(500).send(err);
      }
      const count = counter.count + 1;
      ShortURL.create({ _id: counter.count + 1, url }, (err, shortURL) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        res.json({ original_url: url, short_url: counter.count + 1 });
      });
    });
  }); 
});

// Retrieve shortened URL
app.get('/api/shorturl/:id', (req, res) => {
  ShortURL.findById(req.params.id, (err, shortURL) => {
    if (err) {
      return res.status(404).end();
    }
    res.redirect(shortURL.url);
  });
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});