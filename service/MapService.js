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
      conn.query('SELECT lat, lon, noise FROM DataPoints UNION ' +
      'SELECT lat, lon, noise FROM DataPointsShort')
        .then(rows => {
          //console.log(rows); // rows contains rows returned by server
          conn.release(); // release the connection back to the pool
          resolve(rows); // send back template with data
        })
        .catch(err => {
          console.log(err);
          conn.release(); // release the connection back to the pool
          reject("401");
        });
    })
    .catch(err => {
      console.log(err);
      reject("500");
    });
  });
};

/**
 * Get map data in time range
 *
 * returns array
 **/
exports.getMapTimeRange = function (from, to) {
  return new Promise(function (resolve, reject) {
    pool.getConnection()
    .then(conn => {
      conn.query(`SELECT lat, lon, noise FROM DataPoints WHERE dt BETWEEN ${from} AND ${to} UNION ` +
          `SELECT lat, lon, noise FROM DataPointsShort WHERE dt BETWEEN ${from} AND ${to}`)
        .then(rows => {
          //console.log(rows); // rows contains rows returned by server
          conn.release(); // release the connection back to the pool
          resolve(rows); // send back template with data
        })
        .catch(err => {
          console.log(err);
          conn.release(); // release the connection back to the pool
          reject("401");
        });
    })
    .catch(err => {
      console.log(err);
      reject("500");
    });
  });
};

/**
 * Get map data in selected hour of the day
 *
 * returns array
 **/
exports.getMapTimeOfDay = function (unixTime, unixTimePlusOne) {
  return new Promise(function (resolve, reject) {
    pool.getConnection()
    .then(conn => {
      var select = "";
      if (unixTimePlusOne < 3600000) {
        select = `SELECT lat, lon, noise FROM DataPoints WHERE ((dt % 86400000) BETWEEN ${unixTime} AND 86400000) ` +
        `AND ((dt % 86400000) BETWEEN 0 AND ${unixTimePlusOne}) UNION SELECT lat, lon, noise FROM DataPointsShort ` +
        `WHERE ((dt % 86400000) BETWEEN ${unixTime} AND 86400000) AND ((dt % 86400000) BETWEEN 0 AND ${unixTimePlusOne})`;
      } else {
        select = `SELECT lat, lon, noise FROM DataPoints WHERE (dt % 86400000) BETWEEN ` +
        `${unixTime} AND ${unixTimePlusOne} UNION SELECT lat, lon, noise FROM DataPointsShort ` +
        `WHERE (dt % 86400000) BETWEEN ${unixTime} AND ${unixTimePlusOne}`;
      }
      conn.query(select)
        .then(rows => {
          //console.log(rows); // rows contains rows returned by server
          conn.release(); // release the connection back to the pool
          resolve(rows); // send back template with data
        })
        .catch(err => {
          console.log(err);
          conn.release(); // release the connection back to the pool
          reject("401");
        });
    })
    .catch(err => {
      console.log(err);
      reject("500");
    });
  });
};