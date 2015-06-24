'use strict';

/**
 * calculates the euclidean distance
 * @param {Array <number>} a
 * @param {Array <number>} b
 * @returns {number}
 */
function euclidean(a, b) {
    var i = 0,
        ii = a.length,
        d = 0;
    for (; i < ii; i++) {
        d += (a[i] - b[i]) * (a[i] - b[i]);
    }
    return Math.sqrt(d);
}

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
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {number}
 */
function simpleLink(cluster1, cluster2, disFun) {
    var m = 10e100;
    for (var i = 0; i < cluster1.length; i++)
        for (var j = i; j < cluster2.length; j++) {
            var d = disFun(cluster1[i], cluster2[j]);
            m = Math.min(d,m);
        }
    return m;
}

/**
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {number}
 */
function completeLink(cluster1, cluster2, disFun) {
    var m = -1;
    for (var i = 0; i < cluster1.length; i++)
        for (var j = i; j < cluster2.length; j++) {
            var d = disFun(cluster1[i], cluster2[j]);
            m = Math.max(d,m);
        }
    return m;
}

/**
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {number}
 */
function averageLink(cluster1, cluster2, disFun) {
    var m = 0;
    for (var i = 0; i < cluster1.length; i++)
        for (var j = 0; j < cluster2.length; j++)
            m += disFun(cluster1[i], cluster2[j]);
    return m / (cluster1.length * cluster2.length);
}

/**
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {*}
 */
function centroidLink(cluster1, cluster2, disFun) {
    var x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0;
    for (var i = 0; i < cluster1.length; i++) {
        x1 += cluster1[i][0];
        y1 += cluster1[i][1];
    }
    for (var j = 0; j < cluster2.length; j++) {
        x2 += cluster2[j][0];
        y2 += cluster2[j][1];
    }
    x1 /= cluster1.length;
    y1 /= cluster1.length;
    x2 /= cluster2.length;
    y2 /= cluster2.length;
    return disFun([x1,y1], [x2,y2]);
}

/**
 * @param cluster1
 * @param cluster2
 * @param disFun
 * @returns {number}
 */
function wardLink(cluster1, cluster2, disFun) {
    var x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0;
    for (var i = 0; i < cluster1.length; i++) {
        x1 += cluster1[i][0];
        y1 += cluster1[i][1];
    }
    for (var j = 0; j < cluster2.length; j++) {
        x2 += cluster2[j][0];
        y2 += cluster2[j][1];
    }
    x1 /= cluster1.length;
    y1 /= cluster1.length;
    x2 /= cluster2.length;
    y2 /= cluster2.length;
    return disFun([x1,y1], [x2,y2])*cluster1.length*cluster2.length / (cluster1.length+cluster2.length);
}

var defaultOptions = {
    sim: euclidean,
    kind: 'single'
};

/**
 * Continuously merge nodes that have the least dissimilarity
 * @param {Array <Array <number>>} data - Array of points to be clustered
 * @param options
 * @constructor
 */
function Agnes(data, options) {
    options = options || {};
    this.options = {};
    for (var o in defaultOptions) {
        if (options.hasOwnProperty(o)) {
            this.options[o] = options[o];
        } else {
            this.options[o] = defaultOptions[o];
        }
    }
    this.len = data.length;
    var dataAux = new Array(this.len);
    for (var b = 0; b < this.len; b++)
        dataAux[b] = [data[b]];
    data = dataAux.concat();
    if (typeof this.options.kind === "string") {
        switch (this.options.kind) {
            case 'single':
                this.options.kind = simpleLink;
                break;
            case 'complete':
                this.options.kind = completeLink;
                break;
            case 'average':
                this.options.kind = averageLink;
                break;
            case 'centroid':
                this.options.kind = centroidLink;
                break;
            case 'ward':
                this.options.kind = wardLink;
                break;
            default:
                throw new RangeError('Unknown kind of similarity');
        }
    }
    else if (typeof this.options.kind !== "function")
        throw new TypeError('Undefined kind of similarity');

    var list = new Array(data.length);
    for (var i = 0; i < data.length; i++)
        list[i] = {
            index: i,
            dis: undefined,
            data: data[i].concat(),
            children: []
        };
    var min  = 10e5,
        d = {},
        dis = 0;

    while (list.length > 1) {
        d = {};
        min = 10e5;
        for (var j = 0; j < list.length; j++)
            for (var k = j + 1; k < list.length; k++) {
                dis = this.options.kind(list[j].data, list[k].data, this.options.sim).toFixed(4);
                if (dis in d) {
                    d[dis].push([j, k]);
                }
                else {
                    d[dis] = [[j, k]];
                }
                min = Math.min(dis, min);
            }

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

        for (var ii = 0; ii < clustered.length; ii++) {
            var obj = {
                dis: undefined,
                data: undefined,
                children: []
            };
            var newData = [];
            for (var jj = 0; jj < clustered[ii].length; jj++) {
                var ind = clustered[ii][jj];
                newData = newData.concat(list[ind].data);
                list[ind].dis = min;
                obj.children.push(list[ind]);
                delete list[ind];
            }
            obj.data = newData.concat();
            list.push(obj);
        }
        for (var l = 0; l < list.length; l++)
            if (list[l] === undefined) {
                list.splice(l,1);
                l--;
            }
    }
    list[0].dis = 0;
    this.tree = list[0];
}

module.exports = Agnes;