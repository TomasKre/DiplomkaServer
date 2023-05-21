'use strict';

const jwt = require("jsonwebtoken");
var User = require('../service/UserService');

function parseCookies (request) {
  const list = {};
  const cookieHeader = request.headers?.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(`;`).forEach(function(cookie) {
      let [ name, ...rest] = cookie.split(`=`);
      name = name?.trim();
      if (!name) return;
      const value = rest.join(`=`).trim();
      if (!value) return;
      list[name] = decodeURIComponent(value);
  });

  return list;
}

exports.verifyToken = function(req, res, next) {
  const cookies = parseCookies(req);

  if (!cookies.session || !cookies.token) {
    var responseObject = {code: 403, message: "Nepřihlášený uživatel, prosím, přihlašte se"}
    res.render('user', { responseObject: responseObject });
  }

  jwt.verify(cookies.token, "fdg561*5-d5E1fLOk", (err, decoded) => { // token, secret
    if (err) {
      var responseObject = {code: 403, message: "Nepřihlášený uživatel, prosím, přihlašte se"}
      res.render('user', { responseObject: responseObject });
    }
    User.checkPermissions(decoded.username)
    .then(function (response) {
      if (response > 0) {
        next(); // pokračuj do další funkce
      } else {
        var responseObject = {code: 401, message: "Nedostatečná oprávnění, pokud si myslíte, že se jedná o chybu, kontaktujte administrátora"}
        res.render('user', { responseObject: responseObject });
      }
    })
    .catch(function (response) {
      if (response == "500") {
        var responseObject = {code: 500, message: "Chyba ověřování oprávnění"}
        res.render('user', { responseObject: responseObject });
      } else if (response == "401") {
        var responseObject = {code: 401, message: "Uživatel neexistuje"}
        res.render('user', { responseObject: responseObject });
      }
    });
  });
};