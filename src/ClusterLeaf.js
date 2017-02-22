'use strict';

const Cluster = require('./Cluster');
const util = require('util');

function ClusterLeaf(index) {
    Cluster.call(this);
    this.index = index;
    this.distance = 0;
    this.children = [];
}

util.inherits(ClusterLeaf, Cluster);

module.exports = ClusterLeaf;
