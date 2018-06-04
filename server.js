'use strict';

const express = require('express');
const mongoose = require('mongoose');
const assert = require('assert');
// Constants
const PORT = 80;
const HOST = '0.0.0.0';

const connectionString = process.env.DATABASE_URL;
assert(connectionString, 'Database URL is missing. Please set it in DATABASE_URL-environment variable. Gooble!');
console.log(`Connecting to DB: ${connectionString}`);
mongoose.connect(connectionString);
const db = mongoose.connection;

// Required to access POST params
const bodyParser = require("body-parser");


// App
const app = express();

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
  extended: false
}));

const CvSchema = mongoose.Schema({
  title: String
});

const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  cv: CvSchema
});
  //Compile schema into a model
const User = mongoose.model('User', UserSchema);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

app.post('/cvs', function (req, res) {
  console.log('Creating CV...');
  const cvTitle = req.body.title;

  User.create({ 
    firstName: req.body.firstName, 
    lastName: req.body.lastName, 
    cv: [{ title: cvTitle }]
  })
  .then(user => res.send(user))
  .catch(err => res.send(err));
});

app.get('/cvs', function (req, res) {
  console.log('Returning CVs...');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  User
  .find()
  .populate('cv')
  .then(users => res.json(users))
  .catch(err => res.send(err));
});