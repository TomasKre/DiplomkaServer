const express = require('express');
//const cors = require('cors');
const fs = require('fs');
const app = express();

var serverPort = (process.env.PORT || 5000);

const userController = require('./controllers/User');
const uploadController = require('./controllers/Upload');
const mapController = require('./controllers/Map');

//app.use(cors());

app.use(express.json());

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', function(req, res) {
  res.redirect('/map');
  //res.redirect('/user'); po přihlašování
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

// Resources routes
app.get('/resources/scripts/google_map_script.js', (req, res) => {
  fs.readFile(__dirname + '/resources/scripts/google_maps_script.js', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    } else {
      res.type('text/javascript').send(data);
    }
  });
});


app.listen(serverPort, function() {
  console.log('Express server listening on port ' + serverPort);
});