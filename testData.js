import { euclidean } from 'ml-distance-euclidean';

export const features1 = [
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

export const distanceMatrix1 = (function () {
  var distance = new Array(features1.length);
  for (var i = 0; i < features1.length; ++i) {
    distance[i] = new Array(features1.length);
    for (var j = 0; j < features1.length; ++j) {
      distance[i][j] = euclidean(features1[i], features1[j]);
    }
  }
  return distance;
})();

export const distanceMatrix2 = [
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 0.7, 0.79, 0.94, 1, 0.25, 0.57],
  [1, 1, 0, 1, 1, 1, 1, 0.96, 1, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 0.7, 1, 1, 0, 0.21, 0.95, 1, 0.79, 0.7],
  [1, 0.79, 1, 1, 0.21, 0, 0.95, 1, 0.67, 0.79],
  [1, 0.94, 1, 1, 0.95, 0.95, 0, 1, 0.94, 0.94],
  [1, 1, 0.96, 1, 1, 1, 1, 0, 1, 1],
  [1, 0.25, 1, 1, 0.79, 0.67, 0.94, 1, 0, 0.69],
  [1, 0.57, 1, 1, 0.7, 0.79, 0.94, 1, 0.69, 0]
];
