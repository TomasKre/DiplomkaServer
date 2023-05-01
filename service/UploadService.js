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
 * Upload data points and street data
 *
 * body List Array of points
 * returns ApiResponse
 **/
exports.postFullData = async function(body) {
  return new Promise(function(resolve, reject) {
    let conn;
    conn = pool.getConnection().then(conn => {
      // neřeší sql injection!
      let sql = "INSERT INTO DataPoints (dt, lat, lon, noise, sidewalk, " +
        "sidewalk_width, green, comfort) VALUES ";
      //body.data.length null nebo 0
      for(let i = 0; i < body.data.length; i++) {
        sql = sql + "(" + body.data[i].dt + ", " + body.data[i].lat + ", " + body.data[i].lon + ", " + 
        body.data[i].noise + ", " + body.data[i].sidewalk + ", " + body.data[i].sidewalk_width + ", " + 
        body.data[i].green + ", " + body.data[i].comfort + ")";
        if (body.data.length - 1 == i) {
          sql = sql + ";";
        } else {
          sql = sql + ",\n";
        }
      }

      conn.query(sql)
        .then(rows => {
          console.log("OK");
          conn.end();
          resolve("200");
        })
        .catch(err => {
          console.log("NOK");
          console.log(err);
          reject("401");
          //handle query error
        });
    })
    .catch(err => {
      console.log(err);
      reject("500");
      //handle connection error
    });
  });
}

/**
 * Upload data points
 *
 * body List Array of points
 * returns ApiResponse
 **/
exports.postDataPoints = async function(body) {
  return new Promise(function(resolve, reject) {
    let conn;
    conn = pool.getConnection().then(conn => {
      // neřeší sql injection!
      let sql = "INSERT INTO DataPointsShort (dt, lat, lon, noise) VALUES ";
      //body.data.length null nebo 0
      for(let i = 0; i < body.data.length; i++) {
        sql = sql + "(" + body.data[i].dt + ", " + body.data[i].lat + ", " + body.data[i].lon + ", " + 
        body.data[i].noise + ")";
        if (body.data.length - 1 == i) {
          sql = sql + ";";
        } else {
          sql = sql + ",\n";
        }
      }
      conn.query(sql)
        .then(rows => {
          console.log("OK");
          console.log(rows);
          conn.end();
          resolve("200");
        })
        .catch(err => {
          console.log("NOK");
          console.log(err);
          reject("401");
          //handle query error
        });
    })
    .catch(err => {
      console.log(err);
      reject("500");
      //handle connection error
    });
  });
}