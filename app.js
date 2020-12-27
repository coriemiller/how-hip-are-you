var express = require('express'); // Express web server framework
var bodyParser = require('body-parser');
var path = require("path");
var http = require('http');
// testing no db
// var mongodb = require("mongodb");
// var ObjectID = mongodb.ObjectID;
// var USERS_COLLECTION = "users";

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // support json encoded bodies

// testing no db
// var db;

// testing no db
// Connect to the database before starting the application server.
// mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
//   if (err) {
//     console.log(err);
//     process.exit(1);
//   }

// testing no db
  // Save database object from the callback for reuse.
  // db = database;
  // console.log("Database connection ready");

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


// testing no db
// app.post("/userhipscore", function(req, res) {
//   var newUser = req.body;
//   newUser.createDate = new Date();

//   db.collection(USERS_COLLECTION).insertOne(newUser, function(err, doc) {
//     if (err) {
//       handleError(res, err.message, "Failed to add hipscore.");
//     } else {
//       res.status(201).json(doc.ops[0]);
//     }
//   });
// });



