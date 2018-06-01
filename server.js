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
  extended: true
}));

const UserSchema = mongoose.Schema({
  name: String
});
  //Compile schema into a model
const User = mongoose.model('User', UserSchema);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);


app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});

app.post('/users/', function (req, res) {

  User.create(req.body);

  res.render('index', { title: 'User added', message: 'Hello there!', toast: 'User added successfully' })
});

app.get('/users/', function (req, res) {
  User.find(function (err, users) {
    let userNames = "";
    if (err) return console.error(err);
    
    users.forEach((user) => {
      userNames = userNames + `${user.name} & `;
    });
    res.render('users', { title: 'All users', userNames: userNames })
  });

});