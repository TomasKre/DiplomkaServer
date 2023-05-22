'use strict';

const jwt = require("jsonwebtoken");
var utils = require('../utils/writer.js');
var User = require('../service/UserService');

exports.createUser = function createUser (req, res, next) {
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if(!emailRegexp.test(req.body.email)) {
    var responseObject = {code: "401", message: "Chybný formát emailu"}
    utils.writeJson(res, responseObject);
    return;
  }
  if (req.body.password != req.body.password2) {
    var responseObject = {code: "401", message: "Hesla se neshodují"}
    utils.writeJson(res, responseObject);
    return;
  }
  let username = escape(req.body.username);
  let password = escape(req.body.password);
  let email = escape(req.body.email);
  let firstName = escape(req.body.firstName);
  let lastName = escape(req.body.lastName);
  User.createUser(username, password, email, firstName, lastName)
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
  let username = escape(req.body.username);
  let password = escape(req.body.password);
  User.loginUser(username, password)
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