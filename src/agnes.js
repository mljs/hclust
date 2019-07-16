import { euclidean } from 'ml-distance-euclidean';
import getDistanceMatrix from 'ml-distance-matrix';
import { Matrix } from 'ml-matrix';

import Cluster from './Cluster';

function singleLink(dKI, dKJ) {
  return Math.min(dKI, dKJ);
}

function completeLink(dKI, dKJ) {
  return Math.max(dKI, dKJ);
}

function averageLink(dKI, dKJ, dIJ, ni, nj) {
  const ai = ni / (ni + nj);
  const aj = nj / (ni + nj);
  return ai * dKI + aj * dKJ;
}

function weightedAverageLink(dKI, dKJ) {
  return (dKI + dKJ) / 2;
}

function centroidLink(dKI, dKJ, dIJ, ni, nj) {
  const ai = ni / (ni + nj);
  const aj = nj / (ni + nj);
  const b = -(ni * nj) / (ni + nj) ** 2;
  return ai * dKI + aj * dKJ + b * dIJ;
}

function medianLink(dKI, dKJ, dIJ) {
  return dKI / 2 + dKJ / 2 - dIJ / 4;
}

function wardLink(dKI, dKJ, dIJ, ni, nj, nk) {
  const ai = (ni + nk) / (ni + nj + nk);
  const aj = (nj + nk) / (ni + nj + nk);
  const b = -nk / (ni + nj + nk);
  return ai * dKI + aj * dKJ + b * dIJ;
}

function wardLink2(dKI, dKJ, dIJ, ni, nj, nk) {
  const ai = (ni + nk) / (ni + nj + nk);
  const aj = (nj + nk) / (ni + nj + nk);
  const b = -nk / (ni + nj + nk);
  return Math.sqrt(ai * dKI * dKI + aj * dKJ * dKJ + b * dIJ * dIJ);
}

/**
 * Continuously merge nodes that have the least dissimilarity
 * @param {Array<Array<number>>} data - Array of points to be clustered
 * @param {object} [options]
 * @param {Function} [options.distanceFunction]
 * @param {string} [options.method] - Default: `'complete'`
 * @param {boolean} [options.isDistanceMatrix] - Is the input already a distance matrix?
 * @constructor
 */
export function agnes(data, options = {}) {
  const {
    distanceFunction = euclidean,
    method = 'complete',
    isDistanceMatrix = false,
  } = options;

  let updateFunc;
  if (!isDistanceMatrix) {
    data = getDistanceMatrix(data, distanceFunction);
  }
  let distanceMatrix = new Matrix(data);
  const numLeaves = distanceMatrix.rows;

  // allows to use a string or a given function
  if (typeof method === 'string') {
    switch (method.toLowerCase()) {
      case 'single':
        updateFunc = singleLink;
        break;
      case 'complete':
        updateFunc = completeLink;
        break;
      case 'average':
      case 'upgma':
        updateFunc = averageLink;
        break;
      case 'wpgma':
        updateFunc = weightedAverageLink;
        break;
      case 'centroid':
      case 'upgmc':
        updateFunc = centroidLink;
        break;
      case 'median':
      case 'wpgmc':
        updateFunc = medianLink;
        break;
      case 'ward':
        updateFunc = wardLink;
        break;
      case 'ward2':
        updateFunc = wardLink2;
        break;
      default:
        throw new RangeError(`unknown clustering method: ${method}`);
    }
  } else if (typeof method !== 'function') {
    throw new TypeError('method must be a string or function');
  }

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
    const previous = (newIndex) =>
      getPreviousIndex(newIndex, Math.min(row, column), Math.max(row, column));

    for (let i = 1; i < newDistanceMatrix.rows; i++) {
      const prevI = previous(i);
      const prevICluster = clusters[prevI];
      newClusters.push(prevICluster);
      for (let j = 0; j < i; j++) {
        if (j === 0) {
          const dKI = distanceMatrix.get(row, prevI);
          const dKJ = distanceMatrix.get(prevI, column);
          const val = updateFunc(
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
          // Just copy distance from previous matrix
          const val = distanceMatrix.get(prevI, previous(j));
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

function getSmallestDistance(distance) {
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

function getPreviousIndex(newIndex, prev1, prev2) {
  newIndex -= 1;
  if (newIndex >= prev1) newIndex++;
  if (newIndex >= prev2) newIndex++;
  return newIndex;
}
