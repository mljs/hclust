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
 * @returns {number}
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
 * Splits the higher level clusters
 * @param {Array <Array <number>>} data - Array of points to be clustered
 * @param options
 * @constructor
 */
function Diana(data, options) {
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
    var dict = {};
    for (var dot = 0; dot < data.length; dot++) {
        if (dict[data[dot][0]])
            dict[data[dot][0]][data[dot][1]] = dot;
        else {
            dict[data[dot][0]] = {};
            dict[data[dot][0]][data[dot][1]] = dot;
        }
    }

    this.tree = {
        dis: 0,
        data: data,
        children: []
    };
    var m, M, clId,
        dist, rebel;
    var list = [this.tree];
    while (list.length !== 0) {
        M = 0;
        clId = 0;
        for (var i = 0; i < list.length; i++) {
            m = 0;
            for (var j = 0; j < list[i].length; j++) {
                for (var l = (j + 1); l < list[i].length; l++) {
                    m = Math.max(this.options.sim(list[i].data[j], list[i].data[l]), m);
                }
            }
            if (m > M) {
                M = m;
                clId = i;
            }
        }
        M = 0;
        var C = {
            dis: undefined,
            data: list[clId].data.concat(),
            children: []
        };
        var sG = {
            dis: undefined,
            data: [],
            children: []
        };
        list[clId].children = [C, sG];
        list.splice(clId,1);
        for (var ii = 0; ii < C.data.length; ii++) {
            dist = 0;
            for (var jj = 0; jj < C.data.length; jj++)
                if (ii !== jj)
                    dist += this.options.sim(C.data[jj], C.data[ii]);
            dist /= (C.data.length - 1);
            if (dist > M) {
                M = dist;
                rebel = ii;
            }
        }
        sG.data = [C.data[rebel]];
        C.data.splice(rebel,1);
        dist = diff(C.data, sG.data, this.options.sim);
        while (dist.d > 0) {
            sG.data.push(C.data[dist.p]);
            C.data.splice(dist.p, 1);
            dist = diff(C.data, sG.data, this.options.sim);
        }
        C.dis = this.options.kind(C.data,sG.data,this.options.sim);
        sG.dis = C.dis;
        if (C.data.length === 1)
            C.index = dict[C.data[0][0]][C.data[0][1]];
        else
            list.push(C);
        if (sG.data.length === 1)
            sG.index = dict[sG.data[0][0]][sG.data[0][1]];
        else
            list.push(sG);
    }
}

Diana.prototype.getDendogram = function (input) {
    input = input || {length:this.len, ND: true};
    if (input.length !== this.len)
        throw new Error('Invalid input size');
    var ans = JSON.parse(JSON.stringify(this.tree));
    var queue = [ans];
    while (queue.length > 0) {
        var pointer = queue.shift();
        if (pointer.data.length === 1) {
            if (input.ND)
                pointer.data = pointer.data[0];
            else
                pointer.data = input[pointer.index];
            delete pointer.index;
        }
        else {
            delete pointer.data;
            delete pointer.index;
            for (var i = 0; i < pointer.children.length; i++)
                queue.push(pointer.children[i]);
        }
    }
    return ans;
};

Diana.prototype.nClusters = function (N) {
    if (N >= this.len)
        throw new RangeError('Too many clusters');
    var queue = [this.tree];
    while (queue.length  < N) {
        var pointer = queue.shift();
        for (var i = 0; i < pointer.children.length; i++)
            queue.push(pointer.children[i]);
    }
    var ans = new Array(queue.length);
    for (var j = 0; j < queue.length; j++) {
        var obj = queue[j];
        ans[j] = obj.data.concat();
    }
    return ans;
};

module.exports = Diana;