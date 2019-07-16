import * as data from '../../testData';

import { agnes } from '..';

test('AGNES with feature matrix', () => {
  const clust = agnes(data.features1);
  expect(clust.height).toBeCloseTo(3.1623, 4);
});

test('AGNES with distance matrix', () => {
  var clust = agnes(data.distanceMatrix1, { isDistanceMatrix: true });
  expect(clust.height).toBeCloseTo(3.1623, 4);
});

test('AGNES with distance matrix 2', () => {
  const clust = agnes(data.distanceMatrix2, { isDistanceMatrix: true });
  expect(clust.height).not.toBeGreaterThan(1);
});

test('AGNES centroid', () => {
  const clust = agnes(data.distanceMatrix2, {
    isDistanceMatrix: true,
    method: 'centroid',
  });

  clust.traverse((node) => {
    expect(typeof node.height).toBe('number');
    expect(node.height).not.toBe(NaN);
    expect(node.height).not.toBeLessThan(0);
  });
});
