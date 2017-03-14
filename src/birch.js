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
                id = j;
            }
        }
        node = node.children[id];
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
            // TODO: distribute the cluster points with the new point
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
            clust.right = aux;
            if (clust.right)
                clust.right.left = aux;

            if (aux.father === undefined) {
                this.tree.push(aux);
                if (this.tree.length > this.options.L) {
                    var rootSplit = [
                        {
                            leaf: false,
                            info: {
                                N: Math.floor(this.tree.length / 2),
                                LS: [0, 0],
                                SS: [0, 0]
                            },
                            children: this.tree.slice(0, Math.floor(this.tree.length / 2)),
                            father: undefined
                        },
                        {
                            leaf: false,
                            info: {
                                N: Math.ceil(this.tree.length / 2),
                                LS: 0,
                                SS: 0
                            },
                            children: this.tree.slice(Math.ceil(this.tree.length / 2)),
                            father: undefined
                        }
                    ];
                    for (var f = 0; f < rootSplit[0].children.length; f++) {
                        rootSplit[0].info.LS[0] += rootSplit[0].children[f].info.LS[0];
                        rootSplit[0].info.LS[1] += rootSplit[0].children[f].info.LS[1];
                        rootSplit[0].info.SS[0] += rootSplit[0].children[f].info.SS[0];
                        rootSplit[0].info.SS[1] += rootSplit[0].children[f].info.SS[1];
                    }
                    for (var g = 0; g < rootSplit[1].children.length; g++) {
                        rootSplit[1].info.LS[0] += rootSplit[1].children[g].info.LS[0];
                        rootSplit[1].info.LS[1] += rootSplit[1].children[g].info.LS[1];
                        rootSplit[1].info.SS[0] += rootSplit[1].children[g].info.SS[0];
                        rootSplit[1].info.SS[1] += rootSplit[1].children[g].info.SS[1];
                    }
                    this.tree = rootSplit;
                }
            }
            else {
                aux.father.children.push(aux);
                if (aux.father.children.length > this.options.L) {
                    var oldFather = aux.father;
                    var newFather1 = {
                        leaf: false,
                        info: {
                            N: Math.floor(oldFather.children.length / 2),
                            LS: [0, 0],
                            SS: [0, 0]
                        },
                        children: oldFather.children.slice(0, Math.floor(oldFather.children.length / 2)),
                        father: oldFather.father
                    };
                    var newFather2 = {
                        leaf: false,
                        info: {
                            N: Math.ceil(oldFather.children.length / 2),
                            LS: 0,
                            SS: 0
                        },
                        children: oldFather.children.slice(Math.ceil(oldFather.children.length / 2)),
                        father: oldFather.father
                    };
                    for (var h = 0; h < newFather1.children.length; h++) {
                        newFather1.info.LS[0] += newFather1.children[h].info.LS[0];
                        newFather1.info.LS[1] += newFather1.children[h].info.LS[1];
                        newFather1.info.SS[0] += newFather1.children[h].info.SS[0];
                        newFather1.info.SS[1] += newFather1.children[h].info.SS[1];
                    }
                    for (var e = 0; e < newFather2.children.length; e++) {
                        newFather2.info.LS[0] += newFather2.children[e].info.LS[0];
                        newFather2.info.LS[1] += newFather2.children[e].info.LS[1];
                        newFather2.info.SS[0] += newFather2.children[e].info.SS[0];
                        newFather2.info.SS[1] += newFather2.children[e].info.SS[1];
                    }
                    if (oldFather.father === undefined) {
                        for (var a = 0; a < this.tree.length; a++)
                            if (this.tree[a] === oldFather) {
                                this.tree.splice(a, 1);
                                this.tree.push(newFather1);
                                this.tree.push(newFather2);
                                break;
                            }
                    }
                    else {
                        for (var b = 0; b < oldFather.father.children.length; b++)
                            if (oldFather.father.children[b] === oldFather) {
                                oldFather.father.children.splice(b, 1);
                                oldFather.father.children.push(newFather1);
                                oldFather.father.children.push(newFather2);
                                break;
                            }
                    }
                    var bigFather = oldFather.father;
                    while (bigFather.children.length > this.options.B) {
                        var newBigFather1 = {
                            leaf: false,
                            info: {
                                N: Math.floor(bigFather.children.length / 2),
                                LS: [0, 0],
                                SS: [0, 0]
                            },
                            children: bigFather.children.slice(0, Math.floor(bigFather.children.length / 2)),
                            father: bigFather.father
                        };
                        var newBigFather2 = {
                            leaf: false,
                            info: {
                                N: Math.ceil(bigFather.children.length / 2),
                                LS: 0,
                                SS: 0
                            },
                            children: bigFather.children.slice(Math.ceil(bigFather.children.length / 2)),
                            father: bigFather.father
                        };
                        for (var c = 0; c < newBigFather1.children.length; c++) {
                            newBigFather1.info.LS[0] += newBigFather1.children[c].info.LS[0];
                            newBigFather1.info.LS[1] += newBigFather1.children[c].info.LS[1];
                            newBigFather1.info.SS[0] += newBigFather1.children[c].info.SS[0];
                            newBigFather1.info.SS[1] += newBigFather1.children[c].info.SS[1];
                        }
                        for (var p = 0; p < newBigFather2.children.length; p++) {
                            newBigFather2.info.LS[0] += newBigFather2.children[p].info.LS[0];
                            newBigFather2.info.LS[1] += newBigFather2.children[p].info.LS[1];
                            newBigFather2.info.SS[0] += newBigFather2.children[p].info.SS[0];
                            newBigFather2.info.SS[1] += newBigFather2.children[p].info.SS[1];
                        }
                        if (bigFather.father === undefined) {
                            for (var q = 0; q < this.tree.length; q++)
                                if (this.tree[q] === bigFather) {
                                    this.tree.splice(q, 1);
                                    this.tree.push(newBigFather1);
                                    this.tree.push(newBigFather2);
                                    break;
                                }
                            break;
                        }
                        else {
                            for (var r = 0; r < bigFather.father.children.length; r++)
                                if (bigFather.father.children[r] === bigFather) {
                                    bigFather.father.children.splice(r, 1);
                                    bigFather.father.children.push(newBigFather1);
                                    bigFather.father.children.push(newBigFather2);
                                    break;
                                }
                            bigFather = bigFather.father;
                        }
                    }
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
    // TODO: fix
    input = input || {length:this.len, ND: true};
    if (input.length !== this.len)
        throw new Error('Invalid input size');
    console.log(require('util').inspect(this.tree, {showHidden: false, depth: 20}));
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