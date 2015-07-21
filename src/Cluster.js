'use strict';

function Cluster () {
    this.children = [];
    this.distance = -1;
    this.index = -1;
}

/**
 * Returns a phylogram and change the leaves values for the values in input
 * @param {Array <object>} input
 * @returns {json}
 */
Cluster.prototype.getDendrogram = function (input) {
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
Cluster.prototype.nClusters = function (N) {
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

module.exports = Cluster;
