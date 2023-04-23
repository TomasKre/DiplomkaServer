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

module.exports.getMapTimeRange = function getMap(req, res, next) {
  // Ošetření nevalidních vstupů
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  const from = req.query.from;
  const to = req.query.to;
  if (!regex.test(from)) {
    utils.writeJson(401, response);
    return;
  }
  if (!regex.test(to)) {
    utils.writeJson(401, response);
    return;
  }
  const dateFrom = new Date(from);
  const dateTo = new Date(to);
  const unixFrom = dateFrom.getTime();
  console.log(unixFrom);
  const unixTo = dateTo.getTime();
  console.log(unixTo);
  Map.getMapTimeRange(unixFrom, unixTo)
    .then(function (response) {
      // render the Pug view with the map data
      res.render('map', { heatmapData: response });
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};