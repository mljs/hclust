import distanceMatrix from 'ml-distance-matrix';
import { euclidean } from 'ml-distance-euclidean';

import { agnes } from './src';

// const m = [[1, 4, 7], [2, 5, 8], [3, 6, 9]];

// const d = distanceMatrix(m, euclidean);

const d = [
  [0, 17, 21, 31, 23],
  [17, 0, 30, 34, 21],
  [21, 30, 0, 28, 39],
  [31, 34, 28, 0, 43],
  [23, 21, 39, 43, 0],
];

const c = agnes(d, {
  method: 'average',
  isDistanceMatrix: true,
});

console.log(require('util').inspect(c, { depth: Infinity, colors: true }));
