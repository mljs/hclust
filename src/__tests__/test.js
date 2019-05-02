import { agnes, diana } from '..';

import * as data from '../../testData';

describe('Hierarchical clustering test', function () {
  it('AGNES test', function () {
    var clust = agnes(data.features1);
    expect(clust.distance).toBeCloseTo(3.1623, 4);
  });

  it('AGNES second test', function () {
    var clust = agnes(data.distanceMatrix2, { isDistanceMatrix: true });
    expect(clust.distance).not.toBeGreaterThan(1);
  });

  it('AGNES centroid', function () {
    var clust = agnes(data.distanceMatrix2, {
      isDistanceMatrix: true,
      method: 'centroid'
    });

    clust.traverse(function (node) {
      expect(typeof node.distance).toBe('number');
      expect(node.distance).not.toBe(NaN);
      expect(node.distance).not.toBeLessThan(0);
    });
  });

  it('AGNES based on distance matrix test', function () {
    var clust = agnes(data.distanceMatrix1, { isDistanceMatrix: true });
    expect(clust.distance).toBeCloseTo(3.1623, 4);
  });

  it('DIANA test', function () {
    var clust = diana(data.features1);
    expect(clust.distance).toBeCloseTo(3.136, 3);
  });

  it('cut test', function () {
    var clust = agnes(data.features1);
    expect(clust.cut(1.5)).toHaveLength(5);
  });

  it('group test', function () {
    var clust = agnes(data.features1);
    var group = clust.group(8);
    expect(group.distance).toBeCloseTo(clust.distance, 4);
  });
});
