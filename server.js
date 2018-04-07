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

mongoose.connect(process.env.MONGOLAB_URI);

/*** DB object ***/
const ShortURL = mongoose.model('ShortURL', new mongoose.Schema({
  url: String,
}));

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
  const hostname = new URL(url).hostname;
  dns.lookup(hostname, err => {
    if (err) {
      return res.status(500).send(`Couldn't resolve hostname: ${hostname}`);
    }
    ShortURL.create({ url }, (err, shortURL) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.json({ original_url: url, short_url: shortURL._id });
    });
  });
});

// Retrieve shortened URL
app.get('/api/shorturl/:id', (req, res) => {
  ShortURL.findById(req.params.id, (err, shortURL) => {
    if (err) {
      return res.status(400).end();
    }
    res.redirect(shortURL.url);
  });
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});