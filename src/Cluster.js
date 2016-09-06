'use strict';

const Heap = require('heap');

function Cluster () {
    this.children = [];
    this.distance = -1;
    this.index = [];
}

/**
 * Creates an array of values where maximum distance smaller than the threshold
 * @param {number} threshold
 * @return {Array <Cluster>}
 */
Cluster.prototype.cut = function (threshold) {
    if (threshold < 0) throw new RangeError('Threshold too small');
    var root = new Cluster();
    root.children = this.children;
    root.distance = this.distance;
    root.index = this.index;
    var list = [root];
    var ans = [];
    while (list.length > 0) {
        var aux = list.shift();
        if (threshold >= aux.distance)
            ans.push(aux);
        else
            list = list.concat(aux.children);
    }
    return ans;
};

/**
 * Merge the leaves in the minimum way to have 'minGroups' number of clusters
 * @param {number} minGroups
 * @return {Cluster}
 */
Cluster.prototype.group = function (minGroups) {
    if (!Number.isInteger(minGroups) || minGroups < 1) throw new RangeError('Number of groups must be a positive integer');

    var root = new Cluster();
    root.children = this.children;
    root.distance = this.distance;
    root.index = this.index;

    const heap = new Heap(function (a, b) {
        return b.distance - a.distance;
    });

    heap.push(root);

    let listLeafs = [];
    while ((heap.size() + listLeafs.length) < minGroups && heap.size() > 0) {
        var first = heap.pop();
        if (first.children.length === 0) {
            listLeafs.push(first);
        }
        else {
            first.children.forEach(child => heap.push(child));
        }
    }
    if (heap.size() === 0) throw new RangeError('Number of groups too big');

    root.children = listLeafs.concat(heap.toArray());
    return root;
};

/**
 * Merge the roots in the minimum way to have 'minGroups' number of clusters
 * @param {number} minGroups
 * @return {Cluster}
 */
Cluster.prototype.automaticCut = function (minGroups) {
    if (!Number.isInteger(minGroups) || minGroups < 1) throw new RangeError('Number of groups must be a positive integer');

    const heap = new Heap(function (a, b) {
        return b.distance - a.distance;
    });

    heap.push(this);

    while (heap.size() < minGroups) {
        var first = heap.pop();
        if (first.children.length === 0) {
            break;
        }
        first.children.forEach(child => heap.push(child));
    }

    var root = new Cluster();
    root.children = heap.toArray();
    root.distance = this.distance;

    return root;
};

module.exports = Cluster;
