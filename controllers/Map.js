'use strict';
const pug = require('pug');

var utils = require('../utils/writer.js');
var Map = require('../service/MapService');

module.exports.getMap = function getMap(req, res, next) {
  Map.getMap()
    .then(function (response) {
      // render the Pug view with the map data
      res.render('map', { heatmapData: response });
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};