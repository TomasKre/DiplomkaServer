'use strict';
const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'localhost',
     database: 'ulice',
     user:'ulice',
     password: 've9ZTyC2I63p3b5M',
     connectionLimit: 5
});

/**
 * Get map data
 *
 * returns array
 **/
exports.getMap = function () {
  return new Promise(function (resolve, reject) {
    pool.getConnection()
    .then(conn => {
      conn.query('SELECT lat, lon, noise FROM DataPoints UNION' +
      'SELECT lat, lon, noise FROM DataPointsShort')
        .then(rows => {
          console.log(rows); // rows contains rows returned by server
          conn.release(); // release the connection back to the pool
          resolve(rows); // send back template with data
        })
        .catch(err => {
          console.log(err);
          conn.release(); // release the connection back to the pool
        });
    })
    .catch(err => {
      console.log(err);
    });
  });
};