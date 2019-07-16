import { agnes } from './src';

const d = [
  [0, 17, 21, 31, 23],
  [17, 0, 30, 34, 21],
  [21, 30, 0, 28, 39],
  [31, 34, 28, 0, 43],
  [23, 21, 39, 43, 0],
];

const c = agnes(d, {
  method: 'ward',
  isDistanceMatrix: true,
});

const heights = [];
c.traverse((cluster) => {
  if (cluster.isLeaf) {
    console.log(cluster.index + 1);
  }
  if (cluster.height > 0) {
    heights.push(cluster.height);
  }
});

heights.sort((h1, h2) => h1 - h2);

console.log(heights);
// console.log(require('util').inspect(c, { depth: Infinity, colors: true }));
