'use strict';
/*const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'localhost',
     database: 'ulice',
     user:'ulice',
     password: 've9ZTyC2I63p3b5M',
     connectionLimit: 5
});/*

/**
 * Get map data
 *
 * returns array
 **/
exports.getMap = function () {
  return new Promise(function (resolve, reject) {
    // return some example heatmap data for now
    const heatmapData = [
      { location: { lat: 37.7749, lng: -122.4194 }, weight: 1.5 },
      { location: { lat: 37.7747, lng: -122.4192 }, weight: 0.5 },
      { location: { lat: 37.7745, lng: -122.4190 }, weight: 1.5 },
      { location: { lat: 37.7743, lng: -122.4192 }, weight: 0.5 },
      { location: { lat: 37.7741, lng: -122.4194 }, weight: 1.5 },
      // add more heatmap data points here
    ];

    resolve(heatmapData);
  });
};