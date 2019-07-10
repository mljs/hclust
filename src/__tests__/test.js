import * as data from '../../testData';

import { agnes, diana } from '..';

describe('Hierarchical clustering test', () => {
  it('AGNES test', () => {
    var clust = agnes(data.features1);
    expect(clust.distance).toBeCloseTo(3.1623, 4);
  });

  it('AGNES second test', () => {
    var clust = agnes(data.distanceMatrix2, { isDistanceMatrix: true });
    expect(clust.distance).not.toBeGreaterThan(1);
  });

  it('AGNES centroid', () => {
    var clust = agnes(data.distanceMatrix2, {
      isDistanceMatrix: true,
      method: 'centroid',
    });

    clust.traverse((node) => {
      expect(typeof node.distance).toBe('number');
      expect(node.distance).not.toBe(NaN);
      expect(node.distance).not.toBeLessThan(0);
    });
  });

  it('AGNES based on distance matrix test', () => {
    var clust = agnes(data.distanceMatrix1, { isDistanceMatrix: true });
    expect(clust.distance).toBeCloseTo(3.1623, 4);
  });

  it('DIANA test', () => {
    var clust = diana(data.features1);
    expect(clust.distance).toBeCloseTo(3.136, 3);
  });

  it('cut test', () => {
    var clust = agnes(data.features1);
    expect(clust.cut(1.5)).toHaveLength(5);
  });

  it('group test', () => {
    var clust = agnes(data.features1);
    var group = clust.group(8);
    expect(group.distance).toBeCloseTo(clust.distance, 4);
  });
});
