'use strict';

const euclidean = require('ml-distance-euclidean');
const ClusterLeaf = require('./ClusterLeaf');
const Cluster = require('./Cluster');
const distanceMatrix = require('ml-distance-matrix');

/**
 * @private
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {number}
 */
function simpleLink(cluster1, cluster2, disFun) {
    var m = 10e100;
    for (var i = 0; i < cluster1.length; i++) {
        for (var j = 0; j < cluster2.length; j++) {
            var d = disFun[cluster1[i]][ cluster2[j]];
            m = Math.min(d, m);
        }
    }
    return m;
}

/**
 * @private
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {number}
 */
function completeLink(cluster1, cluster2, disFun) {
    var m = -1;
    for (var i = 0; i < cluster1.length; i++) {
        for (var j = 0; j < cluster2.length; j++) {
            var d = disFun[cluster1[i]][ cluster2[j]];
            m = Math.max(d, m);
        }
    }
    return m;
}

/**
 * @private
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {number}
 */
function averageLink(cluster1, cluster2, disFun) {
    var m = 0;
    for (var i = 0; i < cluster1.length; i++) {
        for (var j = 0; j < cluster2.length; j++) {
            m += disFun[cluster1[i]][ cluster2[j]];
        }
    }
    return m / (cluster1.length * cluster2.length);
}

/**
 * @private
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {*}
 */
function centroidLink(cluster1, cluster2, disFun) {
    var dist = new Array(cluster1.length * cluster2.length);
    for (var i = 0; i < cluster1.length; i++) {
        for (var j = 0; j < cluster2.length; j++) {
            dist[i * cluster2.length + j] = (disFun[cluster1[i]][ cluster2[j]]);
        }
    }
    return median(dist);
}

/**
 * @private
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {number}
 */
function wardLink(cluster1, cluster2, disFun) {
    return centroidLink(cluster1, cluster2, disFun)
        * cluster1.length * cluster2.length / (cluster1.length + cluster2.length);
}

function compareNumbers(a, b) {
    return a - b;
}

function median(values, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }
    var l = values.length;
    var half = Math.floor(l / 2);
    if (l % 2 === 0) {
        return (values[half - 1] + values[half]) * 0.5;
    } else {
        return values[half];
    }
}

var defaultOptions = {
    disFunc: euclidean,
    kind: 'single',
    isDistanceMatrix: false

};

/**
 * Continuously merge nodes that have the least dissimilarity
 * @param {Array <Array <number>>} distance - Array of points to be clustered
 * @param {json} options
 * @option isDistanceMatrix: Is the input a distance matrix?
 * @constructor
 */
function agnes(data, options) {
    options = Object.assign({}, defaultOptions, options);
    var len = data.length;
    var distance = data;//If source
    if (!options.isDistanceMatrix) {
        distance = distanceMatrix(data, options.disFunc);
    }


    // allows to use a string or a given function
    if (typeof options.kind === 'string') {
        switch (options.kind) {
            case 'single':
                options.kind = simpleLink;
                break;
            case 'complete':
                options.kind = completeLink;
                break;
            case 'average':
                options.kind = averageLink;
                break;
            case 'centroid':
                options.kind = centroidLink;
                break;
            case 'ward':
                options.kind = wardLink;
                break;
            default:
                throw new RangeError('Unknown kind of similarity');
        }
    } else if (typeof options.kind !== 'function') {
        throw new TypeError('Undefined kind of similarity');
    }

    var list = new Array(len);
    for (var i = 0; i < distance.length; i++) {
        list[i] = new ClusterLeaf(i);
    }
    var min = 10e5,
        d = {},
        dis = 0;

    while (list.length > 1) {
        // calculates the minimum distance
        d = {};
        min = 10e5;
        for (var j = 0; j < list.length; j++) {
            for (var k = j + 1; k < list.length; k++) {
                var fdistance, sdistance;
                if (list[j] instanceof ClusterLeaf) {
                    fdistance = [list[j].index];
                } else {
                    fdistance = new Array(list[j].index.length);
                    for (var e = 0; e < fdistance.length; e++) {
                        fdistance[e] = list[j].index[e].index;
                    }
                }
                if (list[k] instanceof ClusterLeaf) {
                    sdistance = [list[k].index];
                } else {
                    sdistance = new Array(list[k].index.length);
                    for (var f = 0; f < sdistance.length; f++) {
                        sdistance[f] = list[k].index[f].index;
                    }
                }
                dis = options.kind(fdistance, sdistance, distance).toFixed(4);
                if (dis in d) {
                    d[dis].push([list[j], list[k]]);
                } else {
                    d[dis] = [[list[j], list[k]]];
                }
                min = Math.min(dis, min);
            }
        }
        // cluster dots
        var dmin = d[min.toFixed(4)];
        var clustered = new Array(dmin.length);
        var aux,
            count = 0;
        while (dmin.length > 0) {
            aux = dmin.shift();
            for (var q = 0; q < dmin.length; q++) {
                var int = dmin[q].filter(function (n) {
                    //noinspection JSReferencingMutableVariableFromClosure
                    return aux.indexOf(n) !== -1;
                });
                if (int.length > 0) {
                    var diff = dmin[q].filter(function (n) {
                        //noinspection JSReferencingMutableVariableFromClosure
                        return aux.indexOf(n) === -1;
                    });
                    aux = aux.concat(diff);
                    dmin.splice(q--, 1);
                }
            }
            clustered[count++] = aux;
        }
        clustered.length = count;

        for (var ii = 0; ii < clustered.length; ii++) {
            var obj = new Cluster();
            obj.children = clustered[ii].concat();
            obj.distance = min;
            obj.index = new Array(len);
            var indCount = 0;
            for (var jj = 0; jj < clustered[ii].length; jj++) {
                if (clustered[ii][jj] instanceof ClusterLeaf) {
                    obj.index[indCount++] = clustered[ii][jj];
                } else {
                    indCount += clustered[ii][jj].index.length;
                    obj.index = clustered[ii][jj].index.concat(obj.index);
                }
                list.splice((list.indexOf(clustered[ii][jj])), 1);
            }
            obj.index.length = indCount;
            list.push(obj);
        }
    }
    return list[0];
}

module.exports = agnes;
