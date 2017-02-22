'use strict';

const features1 = [
    [2, 6],
    [3, 4],
    [3, 8],
    [4, 5],
    [4, 7],
    [6, 2],
    [7, 2],
    [7, 4],
    [8, 4],
    [8, 5]
];

module.exports = {
    features1,
    distanceMatrix1: (function () {
        var data = features1;
        var euclidean = require('ml-distance-euclidean');

        var distance = new Array(data.length);
        for (var i = 0; i < data.length; ++i) {
            distance[i] = new Array(data.length);
            for (var j = 0; j < data.length; ++j) {
                distance[i][j] = euclidean(data[i], data[j]);
            }
        }
        return distance;
    })(),
    distanceMatrix2: [
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 0.7, 0.79, 0.94, 1, 0.25, 0.57],
        [1, 1, 0, 1, 1, 1, 1, 0.96, 1, 1], [1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 0.7, 1, 1, 0, 0.21, 0.95, 1, 0.79, 0.7],
        [1, 0.79, 1, 1, 0.21, 0, 0.95, 1, 0.67, 0.79],
        [1, 0.94, 1, 1, 0.95, 0.95, 0, 1, 0.94, 0.94],
        [1, 1, 0.96, 1, 1, 1, 1, 0, 1, 1],
        [1, 0.25, 1, 1, 0.79, 0.67, 0.94, 1, 0, 0.69],
        [1, 0.57, 1, 1, 0.7, 0.79, 0.94, 1, 0.69, 0]
    ]
};