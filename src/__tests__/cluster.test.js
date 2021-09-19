import { agnes, Cluster } from '..';
import * as data from '../../testData';

test('size', () => {
  const clust = agnes(data.features1);
  expect(clust.size).toBe(10);
  const [child1, child2] = clust.children;
  expect(child1.size).toBe(5);
  expect(child2.size).toBe(5);
});

test('cut', () => {
  const clust = agnes(data.features1);
  expect(clust.cut(1.5)).toHaveLength(5);
});

test('group', () => {
  const clust = agnes(data.features1);
  const group = clust.group(8);
  expect(group.children).toHaveLength(8);
});

test('indices', () => {
  const clust = agnes(data.features1);
  const indices = clust.indices();
  expect(indices).toHaveLength(data.features1.length);
  expect(indices).toStrictEqual([6, 5, 9, 8, 7, 3, 1, 0, 4, 2]);
});

test('traverse, isLeaf and index', () => {
  const clust = agnes(data.features1);
  let other = 0;
  let leaves = 0;
  clust.traverse((cluster) => {
    if (cluster.isLeaf) {
      leaves++;
      expect(cluster.index).toBeGreaterThan(-1);
    } else {
      other++;
      expect(cluster.index).toBe(-1);
    }
  });
  expect(other).toBe(9);
  expect(leaves).toBe(10);
});

test('class access', () => {
  const clust = new Cluster();
  expect(clust.children).toStrictEqual([]);
});
