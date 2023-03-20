'use strict';

var utils = require('../utils/writer.js');
var Upload = require('../service/UploadService');

module.exports.postFullData = function postFullData (req, res, next) {
  console.log(req);
  Upload.postFullData(req.body)
    .then(function (response) {
      console.log(res);
      console.log(response);
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      console.log(res);
      console.log(response);
      utils.writeJson(res, response);
    });
};

module.exports.postDataPoints = function postDataPoints (req, res, next) {
  console.log(req);
  Upload.postDataPoints(req.body)
    .then(function (response) {
      console.log(res);
      console.log(response);
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      console.log(res);
      console.log(response);
      utils.writeJson(res, response);
    });
};