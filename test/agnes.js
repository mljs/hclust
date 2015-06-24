var hclust = require('..');
var util = require('util');

describe('Hierarchical clustering test', function () {

    it('AGNES test', function () {
        var agnesData = [[2,6], [3,4], [3,8], [4,5], [4,7], [6,2], [7,2], [7,4], [8,4], [8,5]];
        var HC = new hclust.agnes(agnesData);
        //console.log(util.inspect(HC.tree, {depth:null}));
    });
});