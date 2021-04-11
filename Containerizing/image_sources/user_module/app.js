const express = require('express');
const path = require('path');
const passport = require('passport');
// const cors = require("cors");

// const bodyParser = require("body-parser"); // commented out since we using app.use(express.json()); // app.use(express.urlencoded({extended: true}));

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Create the Express application
var app = express();

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require('./config/database');
// Must first load the models
require('./models/user');
require('./models/push_user');
		
		
// Pass the global passport object into the configuration function
require('./config/passport')(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(require('./routes'));


// --------------------------PUSH NOTIFICATIONS start here-------------------------------

const webpush = require("web-push");
app.use(express.static(path.join(__dirname, "push_notifications")));

// app.use(bodyParser.json()); // commented out since we using express own alternative for it

// public and private keys are generated using some command on terminal
const publicVapidKey =
  "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
const privateVapidKey = "3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM";

// SEARCH ABOUT BOTTOM ???
webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

// --------------------------PUSH NOTIFICATIONS ends here-------------------------------

const env = require("dotenv").config({ path: "./.env" });


module.exports = app;