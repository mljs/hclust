import { agnes } from '..';
import * as data from '../../testData';

test('AGNES with feature matrix', () => {
  const clust = agnes(data.features1);
  expect(clust.height).toBeCloseTo(7.2111, 4);
});

test('AGNES with distance matrix', () => {
  const clust = agnes(data.distanceMatrix1, { isDistanceMatrix: true });
  expect(clust.height).toBeCloseTo(7.2111, 4);
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
    expect(node.height).not.toBeNaN();
    expect(node.height).not.toBeLessThan(0);
  });
});
