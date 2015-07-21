'use strict';

var Cluster = require('./Cluster');
var util = require('util');

function ClusterLeaf (index) {
    Cluster.call(this);
    this.index = index;
    this.distance = 0;
    this.children = undefined;
}

util.inherits(ClusterLeaf, Cluster);

module.exports = ClusterLeaf;
