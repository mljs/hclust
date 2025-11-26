import { euclidean } from 'ml-distance-euclidean';
import getDistanceMatrix from 'ml-distance-matrix';
import { Matrix } from 'ml-matrix';

import { Cluster } from './cluster.ts';

export type AgglomerationMethod =
  | 'single'
  | 'complete'
  | 'average'
  | 'upgma'
  | 'wpgma'
  | 'median'
  | 'wpgmc'
  | 'centroid'
  | 'upgmc'
  | 'ward'
  | 'ward2';

function singleLink(dKI: number, dKJ: number) {
  return Math.min(dKI, dKJ);
}

function completeLink(dKI: number, dKJ: number) {
  return Math.max(dKI, dKJ);
}

function averageLink(
  dKI: number,
  dKJ: number,
  dIJ: number,
  ni: number,
  nj: number,
) {
  const ai = ni / (ni + nj);
  const aj = nj / (ni + nj);
  return ai * dKI + aj * dKJ;
}

function weightedAverageLink(dKI: number, dKJ: number) {
  return (dKI + dKJ) / 2;
}

function centroidLink(
  dKI: number,
  dKJ: number,
  dIJ: number,
  ni: number,
  nj: number,
) {
  const ai = ni / (ni + nj);
  const aj = nj / (ni + nj);
  const b = -(ni * nj) / (ni + nj) ** 2;
  return ai * dKI + aj * dKJ + b * dIJ;
}

function medianLink(dKI: number, dKJ: number, dIJ: number) {
  return dKI / 2 + dKJ / 2 - dIJ / 4;
}

function wardLink(
  dKI: number,
  dKJ: number,
  dIJ: number,
  ni: number,
  nj: number,
  nk: number,
) {
  const ai = (ni + nk) / (ni + nj + nk);
  const aj = (nj + nk) / (ni + nj + nk);
  const b = -nk / (ni + nj + nk);
  return ai * dKI + aj * dKJ + b * dIJ;
}

function wardLink2(
  dKI: number,
  dKJ: number,
  dIJ: number,
  ni: number,
  nj: number,
  nk: number,
) {
  const ai = (ni + nk) / (ni + nj + nk);
  const aj = (nj + nk) / (ni + nj + nk);
  const b = -nk / (ni + nj + nk);
  return Math.sqrt(ai * dKI * dKI + aj * dKJ * dKJ + b * dIJ * dIJ);
}

type DistanceFunction<T> = (a: T, b: T) => number;

export interface AgnesOptions<T> {
  distanceFunction?: DistanceFunction<T>;
  /**
   * @default 'complete'
   */
  method?: AgglomerationMethod;
  /**
   * Is the input already a distance matrix?
   */
  isDistanceMatrix?: boolean;
}

/**
 * Continuously merge nodes that have the least dissimilarity
 * @param data - Array of points to be clustered
 * @param options
 */
export function agnes<T>(data: T[], options: AgnesOptions<T> = {}): Cluster {
  const {
    distanceFunction = euclidean,
    method = 'complete',
    isDistanceMatrix = false,
  } = options;

  let distanceData: number[][];

  if (!isDistanceMatrix) {
    distanceData = getDistanceMatrix(
      data,
      distanceFunction as DistanceFunction<T>,
    );
  } else {
    distanceData = data as number[][];
  }
  let distanceMatrix = new Matrix(distanceData);
  const numLeaves = distanceMatrix.rows;

  const updateFunction = getUpdateFunction(method);

  let clusters = [];
  for (let i = 0; i < numLeaves; i++) {
    const cluster = new Cluster();
    cluster.isLeaf = true;
    cluster.index = i;
    clusters.push(cluster);
  }

  for (let n = 0; n < numLeaves - 1; n++) {
    const [row, column, distance] = getSmallestDistance(distanceMatrix);

    const cluster1 = clusters[row];
    const cluster2 = clusters[column];
    const newCluster = new Cluster();
    newCluster.size = cluster1.size + cluster2.size;
    newCluster.children.push(cluster1, cluster2);
    newCluster.height = distance;

    const newClusters = [newCluster];
    const newDistanceMatrix = new Matrix(
      distanceMatrix.rows - 1,
      distanceMatrix.rows - 1,
    );

    for (let i = 1; i < newDistanceMatrix.rows; i++) {
      const prevI = previous(i, row, column);
      const prevICluster = clusters[prevI];
      newClusters.push(prevICluster);
      for (let j = 0; j < i; j++) {
        if (j === 0) {
          const dKI = distanceMatrix.get(row, prevI);
          const dKJ = distanceMatrix.get(prevI, column);
          const val = updateFunction(
            dKI,
            dKJ,
            distance,
            cluster1.size,
            cluster2.size,
            prevICluster.size,
          );
          newDistanceMatrix.set(i, j, val);
          newDistanceMatrix.set(j, i, val);
        } else {
          // Just copy distance from the previous matrix.
          const val = distanceMatrix.get(prevI, previous(j, row, column));
          newDistanceMatrix.set(i, j, val);
          newDistanceMatrix.set(j, i, val);
        }
      }
    }

    clusters = newClusters;
    distanceMatrix = newDistanceMatrix;
  }

  return clusters[0];
}

function getSmallestDistance(
  distance: Matrix,
): [smallestI: number, smallestJ: number, smallest: number] {
  let smallest = Infinity;
  let smallestI = 0;
  let smallestJ = 0;
  for (let i = 1; i < distance.rows; i++) {
    for (let j = 0; j < i; j++) {
      if (distance.get(i, j) < smallest) {
        smallest = distance.get(i, j);
        smallestI = i;
        smallestJ = j;
      }
    }
  }
  return [smallestI, smallestJ, smallest];
}

function previous(newIndex: number, row: number, column: number) {
  return getPreviousIndex(
    newIndex,
    Math.min(row, column),
    Math.max(row, column),
  );
}

function getPreviousIndex(newIndex: number, prev1: number, prev2: number) {
  newIndex -= 1;
  if (newIndex >= prev1) newIndex++;
  if (newIndex >= prev2) newIndex++;
  return newIndex;
}

type UpdateFunction = (...args: any[]) => number;

function getUpdateFunction(method: AgglomerationMethod): UpdateFunction {
  switch (method.toLowerCase()) {
    case 'single':
      return singleLink;
    case 'complete':
      return completeLink;
    case 'average':
    case 'upgma':
      return averageLink;
    case 'wpgma':
      return weightedAverageLink;
    case 'centroid':
    case 'upgmc':
      return centroidLink;
    case 'median':
    case 'wpgmc':
      return medianLink;
    case 'ward':
      return wardLink;
    case 'ward2':
      return wardLink2;
    default:
      throw new RangeError(`unknown clustering method: ${method}`);
  }
}
