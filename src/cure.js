"use strict";

var Kd_tree = require('kdTree');

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

// TODO
function union(u, v) {}

function merge(u, v, alpha, c) {
     var w = union(u, v);
     w.mean = (u.len * u.mean + v.len * v.mean) / (u.len + v.len);
     var tmpSet = 0;
     for (var i = 0; i < c; i++) {
         var maxDist = 0;
         var minDist,
             maxPoint;
         for (var p = 0; p < w.length; p++) {
             if (i === 1)
                 minDist = dist(w[p], w.mean);
             else {
                 minDist = 10e6;
                 for (var j = 0; j < tmpSet.length; j++)
                    minDist = Math.min(dist(w[p],tmpSet[j]), minDist);
             }
             if (minDist >= maxDist) {
                 maxDist = minDist;
                 maxPoint = w[p];
             }
         }
         tmpSet = union(tmpSet, maxPoint);
     }
     for (p in tmpSet)
         w.rep = union(w.rep, (p + alpha*(w.mean - p)));
     return w
}

/*
// TODO
function Kd_tree(data) {}

Kd_tree.prototype.del = function () {};
Kd_tree.prototype.ins = function () {};
*/


// TODO
function Heap(data) {}

Heap.prototype.heapify = function () {};
Heap.prototype.del = function () {};
Heap.prototype.ins = function () {};
Heap.prototype.extr = function () {};
Heap.prototype.toArr = function () {};

// TODO
function dist(w, x) {}

// TODO
function closest_cluster(T, x, dist2) {}

var defaultOptions = {
    dis: euclidean,
    alpha: 0.5,
    c: 10
};

function Cure(data, options) {
    options = options || {};
    this.options = {};
    for (var o in defaultOptions) {
        if (options.hasOwnProperty(o)) {
            this.options[o] = options[o];
        } else {
            this.options[o] = defaultOptions[o];
        }
    }
    var dim = new Array(data[0].length); // really?
    var T = Kd_tree(data, options.dis, dim);
    var Q = Heap(data);
    while (Q.length > 1) {
        var u = Q.extr();
        var v = u.closest;
        Q.del(v);
        var w = merge(u, v, this.options.alpha, this.options.c);
        T.remove(u);
        T.remove(v);
        T.insert(w);
        var X = Q.toArr();
        w.closest = X[0];
        for (var i = 0; i < X.length; i++) {
            var x = X[i];
            if (dist(w, x) < dist(w, w.closest))
                w.closest = x;
            if (x.closest === u || x.closest === v) {
                if (dist(x, x.closest) < dist(x, w))
                    x.closest = closest_cluster(T, x, dist(x,w));
                else
                    x.closest = w;
            }
            else if (dist(x, x.closest) > dist(x, w))
                x.closest = w;
        }
        Q.heapify(X);
        Q.ins(w);
    }
}


/**
 * Returns a phylogram and change the leaves values for the values in input
 * @param {Array <object>} input
 * @returns {json}
 */
Cure.prototype.getDendogram = function (input) {
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

/**
 * Returns at least N clusters based in the clustering tree
 * @param {number} N - number of clusters desired
 * @returns {Array <Array <number>>}
 */
Cure.prototype.nClusters = function (N) {
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

module.exports = Cure;