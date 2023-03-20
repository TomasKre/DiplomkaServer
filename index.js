const express = require('express');
//const cors = require('cors');
const app = express();

var serverPort = (process.env.PORT || 5000);

const userController = require('./controllers/User');
const uploadController = require('./controllers/Upload');
const mapController = require('./controllers/Map');

//app.use(cors());

app.use(express.json());

app.get('/', function(req, res) {
  res.send('Hello World!');
});

// User routes
app.get('/user/login', userController.loginUser);
app.get('/user/logout', userController.logoutUser);
app.get('/user/:name', userController.getUserByName);
app.post('/user', userController.createUser);

// Upload routes
app.post('/upload/points', uploadController.postDataPoints);
app.post('/upload/fulldata', uploadController.postFullData);

// Map routes
app.get('/map', mapController.getMap);

app.listen(serverPort, function() {
  console.log('Express server listening on port ' + serverPort);
});