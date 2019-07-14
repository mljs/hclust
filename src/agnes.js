import { euclidean } from 'ml-distance-euclidean';
import distanceMatrix from 'ml-distance-matrix';
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

/**
 * Continuously merge nodes that have the least dissimilarity
 * @param {Array<Array<number>>} data - Array of points to be clustered
 * @param {object} [options]
 * @param {Function} [options.distanceFunction]
 * @param {string} [options.method]
 * @param {boolean} [options.isDistanceMatrix] - Is the input already a distance matrix?
 * @constructor
 */
export function agnes(data, options = {}) {
  const {
    distanceFunction = euclidean,
    method = 'single',
    isDistanceMatrix = false,
  } = options;

  let methodFunc;
  if (!isDistanceMatrix) {
    data = distanceMatrix(data, distanceFunction);
  }
  let distance = new Matrix(data);
  const numLeaves = distance.rows;

  // allows to use a string or a given function
  if (typeof method === 'string') {
    switch (method.toLowerCase()) {
      case 'single':
        methodFunc = singleLink;
        break;
      case 'complete':
        methodFunc = completeLink;
        break;
      case 'average':
      case 'upgma':
        methodFunc = averageLink;
        break;
      case 'wpgma':
        methodFunc = weightedAverageLink;
        break;
      case 'centroid':
      case 'upgmc':
        methodFunc = centroidLink;
        break;
      case 'median':
      case 'wpgmc':
        methodFunc = medianLink;
        break;
      case 'ward':
        methodFunc = wardLink;
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
    const [row, column, value] = getSmallestDistance(distance);
    const cluster1 = clusters[row];
    const cluster2 = clusters[column];
    const newCluster = new Cluster();
    newCluster.size = cluster1.size + cluster2.size;
    newCluster.children.push(cluster1, cluster2);
    newCluster.height = value;

    const newClusters = [newCluster];
    const newDistance = new Matrix(distance.rows - 1, distance.rows - 1);
    const previous = (newIndex) =>
      getPreviousIndex(newIndex, Math.min(row, column), Math.max(row, column));

    for (let i = 1; i < newDistance.rows; i++) {
      const prevI = previous(i);
      const prevICluster = clusters[prevI];
      newClusters.push(prevICluster);
      for (let j = 0; j < i; j++) {
        if (j === 0) {
          const dKI = distance.get(row, prevI);
          const dKJ = distance.get(prevI, column);
          const val = methodFunc(
            dKI,
            dKJ,
            value,
            cluster1.size,
            cluster2.size,
            prevICluster.size,
          );
          newDistance.set(i, j, val);
          newDistance.set(j, i, val);
        } else {
          // Just copy distance from previous matrix
          const val = distance.get(prevI, previous(j));
          newDistance.set(i, j, val);
          newDistance.set(j, i, val);
        }
      }
    }

    clusters = newClusters;
    distance = newDistance;
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
