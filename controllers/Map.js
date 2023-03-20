'use strict';

var utils = require('../utils/writer.js');
var Map = require('../service/MapService');

module.exports.getMap = function getMap (req, res, next) {
  Map.getMap()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
