'use strict';
const bcrypt = require('bcryptjs');
const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'localhost',
     database: 'ulice',
     user:'ulice',
     password: 've9ZTyC2I63p3b5M',
     connectionLimit: 5
});


/**
 * Create user
 *
 * body User Created user object (optional)
 * returns User
 **/
exports.createUser = function(username, password, email, firstName, lastName) {
  return new Promise(function (resolve, reject) {
    pool.getConnection()
    .then(conn => {
      conn.query('SELECT username FROM Users WHERE username = "' + username + '" OR email = "' + email + '"')
      .then(rows => {
        if (rows == null || rows.length < 1) {
          const hashedPassword = bcrypt.hashSync(password);
          let sql = 'INSERT INTO Users (username, password, firstname, lastname, email, permission) VALUES ' +
            '("' + username + '", "' + hashedPassword + '", "' + firstName + '", "' + lastName +
            '", "' + email + '", 0);';
          conn.query(sql)
          .then(rows => {
            conn.release(); // release the connection back to the pool
            resolve('201');
          })
          .catch(err => {
            console.log(err);
            conn.release(); // release the connection back to the pool
            reject('500');
          });
        } else {
          console.log('User or email exists');
          conn.release(); // release the connection back to the pool
          reject('401');
        }
      })
      .catch(err => {
        console.log(err);
        conn.release(); // release the connection back to the pool
        reject('500');
      });
    })
    .catch(err => {
      console.log(err);
      reject('500');
    });
  });
}

/**
 * Logs user into the system
 *
 * username String The user name for login
 * password String The password for login in clear text
 * returns String
 **/
exports.loginUser = function(username, password) {
  return new Promise(function (resolve, reject) {
    pool.getConnection()
    .then(conn => {
      conn.query('SELECT username, password FROM Users WHERE username = "' + username + '"')
        .then(rows => {
          if (rows == null || rows.length < 1) {
            conn.release(); // release the connection back to the pool
            reject("404");
            return;
          } else if (!bcrypt.compareSync(password, rows[0].password)) {
            conn.release(); // release the connection back to the pool
            reject("401");
            return;
          } else {
            conn.release(); // release the connection back to the pool
            resolve("200"); // send back template with data
          }
        })
        .catch(err => {
          console.log(err);
          conn.release(); // release the connection back to the pool
          reject("500");
        });
    })
    .catch(err => {
      console.log(err);
      reject("500");
    });
  });
}

/**
 * Checks permissions of user
 *
 **/
exports.checkPermissions = function(username) {
  return new Promise(function (resolve, reject) {
    pool.getConnection()
    .then(conn => {
      conn.query('SELECT permission FROM Users WHERE username = "' + username + '"')
        .then(rows => {
          if (rows == null || rows.length < 1) {
            conn.release(); // release the connection back to the pool
            reject("401");
            return;
          } else {
            conn.release(); // release the connection back to the pool
            resolve(rows[0].permission); // send back template with data
          }
        })
        .catch(err => {
          console.log(err);
          conn.release(); // release the connection back to the pool
          reject("500");
        });
    })
    .catch(err => {
      console.log(err);
      reject("500");
    });
  });
}