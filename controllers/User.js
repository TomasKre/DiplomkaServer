'use strict';

const jwt = require("jsonwebtoken");
var utils = require('../utils/writer.js');
var User = require('../service/UserService');

exports.createUser = function createUser (req, res, next) {
  if (req.body.password != req.body.password2) {
    var responseObject = {code: "401", message: "Hesla se neshodují"}
    utils.writeJson(res, responseObject);
  }
  User.createUser(req.body.username, req.body.password, req.body.email, req.body.firstName, req.body.lastName)
    .then(function (response) {
      if (response == "201") {
        const token = jwt.sign({ username: req.body.username }, "fdg561*5-d5E1fLOk", { // secret
          expiresIn: 86400, // 24 hours
        });
        req.session.token = token;
        var responseObject = {token: token};//sending cookie back in body, might delete later
        utils.writeJson(res, responseObject);
      } else {
        utils.writeJson(res, response);
      }
    })
    .catch(function (response) {
      var responseObject = {code: response, message: "Chyba při registraci"}
      utils.writeJson(res, responseObject);
    });
};

exports.loginUser = function loginUser (req, res, next) {
  User.loginUser(req.body.username, req.body.password)
    .then(function (response) {
      if (response == "200") {
        const token = jwt.sign({ username: req.body.username }, "fdg561*5-d5E1fLOk", { // secret
          expiresIn: 86400, // 24 hours
        });
        req.session.token = token;
        var responseObject = {token: token};//sending cookie back in body, might delete later
        utils.writeJson(res, responseObject);
      } else {
        utils.writeJson(res, response);
      }
    })
    .catch(function (response) {
      if (response == "500") {
        var responseObject = {code: response, message: "Chyba při přihlašování"}
      } else if (response == "404") {
        var responseObject = {code: response, message: "Uživatel neexistuje"}
      } else if (response == "401") {
        var responseObject = {code: response, message: "Špatné heslo"}
      }
      utils.writeJson(res, responseObject);
    });
};

exports.logoutUser = function logoutUser (req, res, next) {
    req.session = null; //destroy session
    var responseObject = {code: 200, message: "Odhlášení úspěšné"}
    utils.writeJson(res, responseObject);
};

exports.loginOrRegisterUser = function loginOrRegisterUser (req, res, next) {
  var responseObject = {code: 200, message: ""}
  res.render('user', { responseObject: responseObject });
};