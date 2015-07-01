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
 * find the closest cluster in the tree
 * @param tree
 * @param point
 * @param dis
 * @returns {*}
 */
function closestCluster(tree, point, dis) {
    var m = 10e5,
        id = 0;
    for (var i = 0; i < tree.length; i++) {
        var dot = [tree[i].info.LS[0] / tree[i].info.N, tree[i].info.LS[1] / tree[i].info.N];
        var d = dis(point, dot);
        if (d < m) {
            m = d;
            id = i;
        }
    }
    var node = tree[id];
    while (!node.leaf) {
        m = 10e5;
        id = 0;
        for (var j = 0; j < node.children.length; j++) {
            dot = [node.children[j].info.LS[0] / node.children[j].info.N, node.children[j].info.LS[1] / node.children[j].info.N];
            d = dis(point, dot);
            if (d < m) {
                m = d;
                id = i;
            }
        }
        node = node[id];
    }
    return node
}

var defaultOptions = {
    dis: euclidean,
    T: 0.5,
    B:2,
    L:2
};

/**
 * Incrementally construct a CF (Clustering Feature) tree
 * @param {Array <Array <number>>} data - Array of points to be clustered
 * @param {json} options
 * @constructor
 */
function Birch(data, options) {
    options = options || {};
    this.options = {};
    for (var o in defaultOptions) {
        if (options.hasOwnProperty(o)) {
            this.options[o] = options[o];
        } else {
            this.options[o] = defaultOptions[o];
        }
    }

    this.tree = [{
        leaf: true,
        info: {
            N: 1,
            LS: data[0],
            SS: [data[0][0] * data[0][0], data[0][1] * data[0][1]]
        },
        data:[data[0]],
        left: undefined,
        right: undefined,
        father: undefined
    }];
    for (var i  = 1; i < data.length; i++) {
        var clust = closestCluster(this.tree, data[i], this.options.dis);
        var d = this.options.dis([clust.info.LS[0] / clust.info.N, clust.info.LS[1] / clust.info.N], data[i]);
        if (d < this.options.T) {
            clust.data.push(data[i])
        }
        else {
            // distribute the cluster points with the new point and attach to father
            var aux = {
                leaf: true,
                info: {
                    N: 1,
                    LS: data[i],
                    SS: [data[i][0] * data[i][0], data[i][1] * data[i][1]]
                },
                data:[data[i]],
                left: clust,
                right: clust.right,
                father: clust.father
            };
            clust.right.left = aux;
            clust.right = aux;

            if (aux.father === undefined) {
                this.tree.push(aux);
                // branching factor exceeded split father
                if (this.tree.length > this.options.L) {
                    // branching factor of non-leaf node exceeded split
                    if (true) {}
                }
            }
            else {
                aux.father.children.push(aux);
                // branching factor exceeded split father
                if (aux.father.children.length > this.options.L) {
                    // branching factor of non-leaf node exceeded split
                    if (true) {}
                }
            }
        }
    }
}

/**
 * Returns a phylogram and change the leaves values for the values in input
 * @param {Array <object>} input
 * @returns {json}
 */
Birch.prototype.getDendogram = function (input) {
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
Birch.prototype.nClusters = function (N) {
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

module.exports = Birch;