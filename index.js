const express = require('express');
//const cors = require('cors');
const fs = require('fs');
const https = require('https');
const app = express();

function downloadFile(url, filename) {
  try {
    https.get(url, (res) => {
      const fileStream = fs.createWriteStream(filename);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log('Download finished')
      });
    })
  } catch (error) {
    console.log(error);
  }
}
// 1000 = 1 s, 60000 = 1 min, 3600000 = 1 h, 86400000 = 1 den
setInterval(downloadFile, 3600000, 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBLdRQxi5WAdTLhn2QyN3TTaHkDa4gNaH0&libraries=visualization', 'resources/scripts/google_maps_script.js');

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
app.get('/resources/scripts/google_maps_script.js', (req, res) => {
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