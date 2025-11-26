// import { euclidean } from 'ml-distance-euclidean';

// import ClusterLeaf from './ClusterLeaf';
// import Cluster from './Cluster';

// /**
//  * @private
//  * Returns the most distant point and his distance
//  * @param {Array <Array <number>>} splitting - Clusters to split
//  * @param {Array <Array <number>>} data - Original data
//  * @param {function} disFun - Distance function
//  * @returns {{d: number, p: number}} - d: maximum difference between points, p: the point more distant
//  */
// function diff(splitting, data, disFun) {
//   var ans = {
//     d: 0,
//     p: 0
//   };

//   var Ci = new Array(splitting[0].length);
//   for (var e = 0; e < splitting[0].length; e++) {
//     Ci[e] = data[splitting[0][e]];
//   }
//   var Cj = new Array(splitting[1].length);
//   for (var f = 0; f < splitting[1].length; f++) {
//     Cj[f] = data[splitting[1][f]];
//   }

//   var dist, ndist;
//   for (var i = 0; i < Ci.length; i++) {
//     dist = 0;
//     for (var j = 0; j < Ci.length; j++) {
//       if (i !== j) {
//         dist += disFun(Ci[i], Ci[j]);
//       }
//     }
//     dist /= Ci.length - 1;
//     ndist = 0;
//     for (var k = 0; k < Cj.length; k++) {
//       ndist += disFun(Ci[i], Cj[k]);
//     }
//     ndist /= Cj.length;
//     if (dist - ndist > ans.d) {
//       ans.d = dist - ndist;
//       ans.p = i;
//     }
//   }
//   return ans;
// }

// /**
//  * @private
//  * Intra-cluster distance
//  * @param {Array} index
//  * @param {Array} data
//  * @param {function} disFun
//  * @returns {number}
//  */
// function intrDist(index, data, disFun) {
//   var dist = 0;
//   var count = 0;
//   for (var i = 0; i < index.length; i++) {
//     for (var j = i; j < index.length; j++) {
//       dist += disFun(data[index[i].index], data[index[j].index]);
//       count++;
//     }
//   }
//   return dist / count;
// }

// /**
//  * Splits the higher level clusters
//  * @param {Array <Array <number>>} data - Array of points to be clustered
//  * @param {object} [options]
//  * @param {Function} [options.distanceFunction]
//  * @constructor
//  */
// export function diana(data, options = {}) {
//   const { distanceFunction = euclidean } = options;
//   var tree = new Cluster();
//   tree.children = new Array(data.length);
//   tree.index = new Array(data.length);
//   for (var ind = 0; ind < data.length; ind++) {
//     tree.children[ind] = new ClusterLeaf(ind);
//     tree.index[ind] = new ClusterLeaf(ind);
//   }

//   tree.distance = intrDist(tree.index, data, distanceFunction);
//   var m, M, clId, dist, rebel;
//   var list = [tree];
//   while (list.length > 0) {
//     M = 0;
//     clId = 0;
//     for (var i = 0; i < list.length; i++) {
//       m = 0;
//       for (var j = 0; j < list[i].length; j++) {
//         for (var l = j + 1; l < list[i].length; l++) {
//           m = Math.max(
//             distanceFunction(
//               data[list[i].index[j].index],
//               data[list[i].index[l].index]
//             ),
//             m
//           );
//         }
//       }
//       if (m > M) {
//         M = m;
//         clId = i;
//       }
//     }
//     M = 0;
//     if (list[clId].index.length === 2) {
//       list[clId].children = [list[clId].index[0], list[clId].index[1]];
//       list[clId].distance = distanceFunction(
//         data[list[clId].index[0].index],
//         data[list[clId].index[1].index]
//       );
//     } else if (list[clId].index.length === 3) {
//       list[clId].children = [
//         list[clId].index[0],
//         list[clId].index[1],
//         list[clId].index[2]
//       ];
//       var d = [
//         distanceFunction(
//           data[list[clId].index[0].index],
//           data[list[clId].index[1].index]
//         ),
//         distanceFunction(
//           data[list[clId].index[1].index],
//           data[list[clId].index[2].index]
//         )
//       ];
//       list[clId].distance = (d[0] + d[1]) / 2;
//     } else {
//       var C = new Cluster();
//       var sG = new Cluster();
//       var splitting = [new Array(list[clId].index.length), []];
//       for (var spl = 0; spl < splitting[0].length; spl++) {
//         splitting[0][spl] = spl;
//       }
//       for (var ii = 0; ii < splitting[0].length; ii++) {
//         dist = 0;
//         for (var jj = 0; jj < splitting[0].length; jj++) {
//           if (ii !== jj) {
//             dist += distanceFunction(
//               data[list[clId].index[splitting[0][jj]].index],
//               data[list[clId].index[splitting[0][ii]].index]
//             );
//           }
//         }
//         dist /= splitting[0].length - 1;
//         if (dist > M) {
//           M = dist;
//           rebel = ii;
//         }
//       }
//       splitting[1] = [rebel];
//       splitting[0].splice(rebel, 1);
//       dist = diff(splitting, data, distanceFunction);
//       while (dist.d > 0) {
//         splitting[1].push(splitting[0][dist.p]);
//         splitting[0].splice(dist.p, 1);
//         dist = diff(splitting, data, distanceFunction);
//       }
//       var fData = new Array(splitting[0].length);
//       C.index = new Array(splitting[0].length);
//       for (var e = 0; e < fData.length; e++) {
//         fData[e] = data[list[clId].index[splitting[0][e]].index];
//         C.index[e] = list[clId].index[splitting[0][e]];
//         C.children[e] = list[clId].index[splitting[0][e]];
//       }
//       var sData = new Array(splitting[1].length);
//       sG.index = new Array(splitting[1].length);
//       for (var f = 0; f < sData.length; f++) {
//         sData[f] = data[list[clId].index[splitting[1][f]].index];
//         sG.index[f] = list[clId].index[splitting[1][f]];
//         sG.children[f] = list[clId].index[splitting[1][f]];
//       }
//       C.distance = intrDist(C.index, data, distanceFunction);
//       sG.distance = intrDist(sG.index, data, distanceFunction);
//       list.push(C);
//       list.push(sG);
//       list[clId].children = [C, sG];
//     }
//     list.splice(clId, 1);
//   }
//   return tree;
// }
