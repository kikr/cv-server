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
app.use(bodyParser.json());

// User's past work project
const ProjectSchema = mongoose.Schema({
  title: String,
  // When did the project start 
  start: Date,
  // When did it end
  end: Date,
  description: String
});

const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
});

const CvSchema = mongoose.Schema({
  title: String,
  user: UserSchema,
  projects: [ ProjectSchema ]
});
//Compile schema into a model
const Cv = mongoose.model('Cv', CvSchema);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);



app.put('/cvs/:cvId', function (req, res, next) {
  console.log('Updating CV...');
  const cvId = req.params.cvId;

  if(!cvId) return next(new Error('Missing CV ID'));

  Cv.findByIdAndUpdate(cvId,
     { $set: { 
      title: req.body.title,
      user: { 
        firstName: req.body.user.firstName, 
        lastName: req.body.user.lastName,
      },
      projects: req.body.projects
    }}, 
    { new: true },
    function (err, cv) {
      if (err) return next(err);
      res.send(cv);
    }
  );
});

app.post('/cvs', function (req, res) {
  console.log('Creating CV...');
  const projects = req && req.body && Array.isArray(req.body.projects) && req.body.projects || [];

  // Remove any client-generated IDs, because they're not actual ObjectIds
  projects.forEach(project => {
    project._id = undefined;
  });

  Cv.create({ 
    title: req.body.title,
    user: { 
      firstName: req.body.user.firstName, 
      lastName: req.body.user.lastName,
    },
    projects: req.body.projects
  })
  .then(cv => res.send(cv))
  .catch(err => res.send(err));
});

app.get('/cvs', function (req, res) {
  console.log('Returning CVs...');

  Cv
  .find()
  .then(cvs => res.send(cvs))
  .catch(err => res.send(err));
});