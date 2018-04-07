'use strict';

const dns = require('dns');
const { URL } = require('url');

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cors = require('cors');

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.post("/api/shorturl/new", function (req, res) {
  const url = req.body.url;
  const hostname = new URL(url).hostname;
  dns.lookup(hostname, err => {
    if (err) {
      return res.status(500).send(`Couldn't resolve hostname: ${url}`);
    }
    return res.json({ original_url: url, short_url: 1 });
  });
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});