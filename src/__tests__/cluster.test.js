import * as data from '../../testData';

import { agnes } from '..';

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
  expect(indices).toStrictEqual([6, 5, 9, 8, 7, 0, 3, 1, 4, 2]);
});
