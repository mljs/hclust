'use strict';

var hclust = require('..');
const data = require('./data');
describe('Hierarchical clustering test', function () {
    it('AGNES test', function () {
        var agnes = hclust.agnes(data.features1);
        agnes.distance.should.be.approximately(3.1623, 0.001);
    });

    it('AGNES second test', function () {
        var clust = hclust.agnes(data.distanceMatrix2, {isDistanceMatrix:true});
        clust.distance.should.not.be.greaterThan(1);
    });

    it('AGNES centroid', function () {
        var clust = hclust.agnes(data.distanceMatrix2, {
            isDistanceMatrix: true,
            kind: 'centroid'
        });

        clust.traverse(function(node) {
            node.distance.should.be.a.Number();
            node.distance.should.not.be.NaN();
            node.distance.should.not.be.lessThan(0);
        });
    });

    it('AGNES based on distance matrix test', function () {
        var agnes = hclust.agnes(data.distanceMatrix1, {isDistanceMatrix:true});
        agnes.distance.should.be.approximately(3.1623, 0.001);
    });

    it('DIANA test', function () {
        var diana = hclust.diana(data.features1);
        diana.distance.should.be.approximately(3.1360, 0.001);
    });

    it('cut test', function () {
        var agnes = hclust.agnes(data.features1);
        agnes.cut(1.5).length.should.equal(5);
    });

    it('group test', function () {
        var agnes = hclust.agnes(data.features1);
        var groupAgnes = agnes.group(8);
        groupAgnes.distance.should.be.approximately(agnes.distance, 0.0001);
    });
});
