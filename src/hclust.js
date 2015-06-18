'use strict';
var distance = require('ml-distance');

/**
 * Removes repeated elements of an array
 * @param {Array} array
 * @returns {Array} same array but without repeated elements
 */
function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}

/**
 * Continuously merge nodes that have the least dissimilarity
 * @param {Array <Array <number>>} data - Array of points to be clustered
 * @param {string} sim - The kind of distance or similarity to use between vectors
 * @param {string} kind - The kind of similarity to use between clusters
 * @returns {json} returns the hierarchical clustering tree by levels
 */
function agnes(data, sim, kind) {
    var k = data.length;
    var d = {},
        dis = 0,
        dataList;
    var min = 10e5;
    var T = {};
    if (k > 1) {
        var level = 1;
        while (k > 1) {
            d = {};
            min = 10e5;
            for (var i = 0; i < k; i++) {
                for (var j = (i + 1); j < k; j++) {
                    dis = D(data[i], data[j], sim, kind).toFixed(4);
                    if (dis in d) {
                        d[dis].push([i, j]);
                    }
                    else {
                        d[dis] = [[i, j]];
                    }
                    min = Math.min(dis, min);
                }
            }
            T[level] = {};
            T[level].d = min;
            var dmin = d[min.toFixed(4)];
            var clustered = [];
            var aux,
                inter;
            while (dmin.length > 0) {
                aux = dmin.shift();
                for (var q = dmin.length - 1; q >= 0; q--) {
                    inter = dmin[q].filter(function(n) {
                        //noinspection JSReferencingMutableVariableFromClosure
                        return aux.indexOf(n) != -1
                    });
                    if (inter.length > 0) {
                        aux = arrayUnique(aux.concat(dmin[q]));
                        q = dmin.length - 1;
                        dmin.splice(q,1);
                    }
                }
                clustered.push(aux);
            }
            dataList = [];
            T[level].cl = [];
            for (var z = 0; z < clustered.length; z++) {
                dataList = dataList.concat(clustered[z]);
                aux = [];
                for (var zz = 0; zz < clustered[z].length; zz++) {
                    aux = aux.concat(data[clustered[z][zz]]);
                }
                T[level].cl.push(aux);
            }
            for (var c = 0; c < k; c++) {
                if (dataList.indexOf(c) === -1) {
                    T[level].cl.push(data[c]);
                }
            }
            //console.log(T);
            console.log('');
            data = T[level].cl.concat();
            k = data.length;
            level++;
        }
        return T;
    }
    else
        return {1:{d:0, cl:data}};
}

/**
 * Splits the higher level clusters
 * @param {Array <Array <number>>} data - Array of points to be clustered
 * @param {string} sim - The kind of distance or similarity to use between vectors
 * @param {string} kind -  kind of similarity to use between clusters
 * @returns {json} returns the hierarchical clustering tree by levels
 */
function diana(data, sim, kind) {
    var disFun= distance[sim];
    if (!disFun)
        throw new TypeError('Invalid distance function');
    var dianaT = {};
    var level = 1;
    var k = data.length;
    data = [data];
    var m, M, clId,
        dist, rebel,
        sG;
    if (k > 1) {
        //noinspection UnnecessaryLocalVariableJS
        var goal = k;
        do {
            dianaT[level] = {};
            if (data[0] === undefined || data[0][0] === undefined)
                break;
            M = 0;
            clId = 0;
            for (var i = 0; i < data.length; i++) {
                m = 0;
                for (var j = 0; j < data[i].length; j++)
                    for (var l = (j + 1); l < data[i].length; l++)
                        m = Math.max(disFun(data[i][j], data[i][l]),m);
                if (m > M) {
                    M = m;
                    clId = i;
                }
            }
            M = 0;
            for (var ii = 0; ii < data[clId].length; ii++) {
                dist = 0;
                for (var jj = 0; jj < data[clId].length; jj++)
                    if (ii !== jj)
                        dist += disFun(data[clId][jj], data[clId][ii]);
                dist /= (data[clId].length - 1);
                if (dist > M) {
                    M = dist;
                    rebel = ii;
                }
            }
            sG = [data[clId][rebel]];
            data[clId].splice(rebel,1);
            dist = diff(data[clId], sG, disFun);
            while (dist.d > 0) {
                sG.push(data[clId][dist.p]);
                data[clId].splice(dist.p, 1);
                dist = diff(data[clId], sG, disFun);
            }
            dianaT[level].d = D(sG, data[0], sim, kind);
            data = data.concat([sG]);
            dianaT[level].cl = JSON.parse(JSON.stringify(data));
            level++;
            k = data.length;
        }
        while (k !== goal);
        return dianaT;
    }
    else {
        return {1:{d:0, cl:data}};
    }
}


// function birch(data, sim) {}

// function cure(data, sim) {}
// function chameleon(data, sim) {}

/**
 * Returns the most distant point and his distance
 * @param {Array <Array <number>>} Ci - Original cluster
 * @param {Array <Array <number>>} Cj - Splinter cluster
 * @param {function} disFun - Distance function
 * @returns {{d: number, p: number}} - d: maximum difference between points, p: the point more distant
 */
function diff(Ci, Cj, disFun) {
    var ans = {
        d:0,
        p:0
    };
    var dist, ndist;
    for (var i = 0; i < Ci.length; i++) {
        dist = 0;
        for (var j = 0; j < Ci.length; j++)
            if (i !== j)
                dist += disFun(Ci[i], Ci[j]);
        dist /= (Ci.length - 1);
        ndist = 0;
        for (var k = 0; k < Cj.length; k++)
            ndist += disFun(Ci[i], Cj[k]);
        ndist /= Cj.length;
        if ((dist - ndist) > ans.d) {
            ans.d = (dist - ndist);
            ans.p = i;
        }
    }
    return ans;
}

/**
 * Distance between clusters
 * @param {Array <Array <number>>} cluster1 - first input cluster
 * @param {Array <Array <number>>} cluster2 - second input cluster
 * @param {string} sim - kind of distance or similarity to use between vectors
 * @param {string} kind -  kind of similarity to use between clusters
 * @returns {number} the number is the distance between clusters
 */
function D(cluster1, cluster2, sim, kind) {
    var disFun= distance[sim];
    if (!disFun)
        throw new TypeError('Invalid distance function');
    var m,
        d;
    switch (kind) {
        case 'single':
            m = 10e100;
            for (var i = 0; i < cluster1.length; i++)
                for (var j = i; j < cluster2.length; j++) {
                    d = disFun(cluster1[i], cluster2[j]);
                    m = Math.min(d,m);
                }
            return m;
            break;
        case 'complete':
            m = -1;
            for (var i = 0; i < cluster1.length; i++)
                for (var j = i; j < cluster2.length; j++) {
                    d = disFun(cluster1[i], cluster2[j]);
                    m = Math.max(d,m);
                }
            return m;
            break;
        case 'average':
            m = 0;
            for (var i = 0; i < cluster1.length; i++)
                for (var j = 0; j < cluster2.length; j++)
                    m += disFun(cluster1[i], cluster2[j]);
            return m / (cluster1.length * cluster2.length);
            break;
        case 'centroid':
            var x1 = 0,
                y1 = 0,
                x2 = 0,
                y2 = 0;
            for (var i = 0; i < cluster1.length; i++) {
                x1 += cluster1[i][0];
                y1 += cluster1[i][1];
            }
            for (var i = 0; i < cluster2.length; i++) {
                x2 += cluster2[i][0];
                y2 += cluster2[i][1];
            }
            x1 /= cluster1.length;
            y1 /= cluster1.length;
            x2 /= cluster2.length;
            y2 /= cluster2.length;
            return disFun([x1,y1], [x2,y2]);
            break;
        case 'ward':
            var x1 = 0,
                y1 = 0,
                x2 = 0,
                y2 = 0;
            for (var i = 0; i < cluster1.length; i++) {
                x1 += cluster1[i][0];
                y1 += cluster1[i][1];
            }
            for (var i = 0; i < cluster2.length; i++) {
                x2 += cluster2[i][0];
                y2 += cluster2[i][1];
            }
            x1 /= cluster1.length;
            y1 /= cluster1.length;
            x2 /= cluster2.length;
            y2 /= cluster2.length;
            return disFun([x1,y1], [x2,y2]) * cluster1.length * cluster2.length / (cluster1.length + cluster2.length);
            break;
        default:
            throw new TypeError('Undefined kind of similarity');
    }
}

var defaultOptions = {
    name: 'agnes',
    sim: 'euclidean',
    kind: 'single'
};

/**
 * Instantiates the hierarchical clustering
 * @param {json} options - clustering options
 * @constructor
 */
function Hclust(options) {
    options = options || {};
    this.options = {};
    for (var o in defaultOptions) {
        if (options.hasOwnProperty(o)) {
            this.options[o] = options[o];
        } else {
            this.options[o] = defaultOptions[o];
        }
    }
}

/**
 * Creates the tree based in the data
 * @param {Array <Array <number>>} data - Array of points to be clustered
 */
Hclust.prototype.cluster = function (data) {
    var l = data.length;
    switch (this.options.name) {
        case 'agnes':
            var aux = new Array(l);
            for (var i = 0; i < l; i++)
                aux[i] = [data[i]];
            this.tree = agnes(aux, this.options.sim, this.options.kind);
            break;
        case 'diana':
            this.tree = diana(data, this.options.sim, this.options.kind);
            break;
        case 'birch':
            break;
        case 'cure':
            break;
        case 'chameleon':
            break;
        default:
            throw new TypeError('invalid function');
    }
};

/**
 * Returns the clusters in the L level
 * @param {number} L - level of the hierarchical tree
 * @returns {Array} clusters at the L level
 */
Hclust.prototype.getLevel = function (L) {
    if (L in this.tree)
        return this.tree[L].cl;
    else
        throw new RangeError('Non-existent level');
};

/**
 * Let's have a JSON to recreate the model
 * @returns {json}
 */
Hclust.prototype.export = function () {
    var model = {
        name: 'HCL'
    };
    model.options = this.options;
    model.tree = this.tree;
    return model;
};

/**
 * Recreates a Hclust based in the exported model
 * @param {json} model
 * @returns {Hclust}
 */
Hclust.load = function (model) {
    if (model.name === 'HCL') {
        var HCL = new Hclust(model.options);
        HCL.tree = model.tree;
        return HCL;
    } else {
        throw new TypeError('expecting a SVM model');
    }
};

module.exports = Hclust;