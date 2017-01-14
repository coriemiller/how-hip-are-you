/**
 * This is built from an example of a basic node.js script that performs
 * the Implicit Grant oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#implicit_grant_flow
 */

var express = require('express'); // Express web server framework
var bodyParser = require('body-parser');
var path = require("path");
var http = require('http');
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var USERS_COLLECTION = "users";

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // support json encoded bodies

var db;
// var uri = 'mongodb://heroku_qm9j4rsd:b86aqvopik4rkfv9u3h4n9ib4o@ds111489.mlab.com:11489/heroku_qm9j4rsd';

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

//old connection
// var port = process.env.PORT || 8080;
// app.listen(port)

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}



app.post("/userhipscore", function(req, res) {
  var newUser = req.body;
  newUser.createDate = new Date();

  db.collection(USERS_COLLECTION).insertOne(newUser, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to add hipscore.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});



