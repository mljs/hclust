var hclust = require('..');
var euclidean = require('ml-distance-euclidean');


var data = [[2,6], [3,4], [3,8], [4,5], [4,7], [6,2], [7,2], [7,4], [8,4], [8,5]];
var distance = new Array(data.length);
for(var i=0;i<data.length;i++) {
    distance[i] = new Array(data.length);
    for (var j = 0; j < data.length; j++) {
        distance[i][j]=euclidean(data[i],data[j]);
    }
}
//console.log(distance);
describe('Hierarchical clustering test', function () {

    it('AGNES test', function () {
        var agnes = hclust.agnes(data);
        agnes.distance.should.be.approximately(3.1623, 0.001);
    });

    it('AGNES based on distance matrix test', function () {
        var agnes = hclust.agnes(distance, {isDistanceMatrix:true});
        agnes.distance.should.be.approximately(3.1623, 0.001);
    });

    it('DIANA test', function () {
        var diana = hclust.diana(data);
        diana.distance.should.be.approximately(3.1360, 0.001);
    });

    it('cut test', function () {
        var agnes = hclust.agnes(data);
        agnes.cut(1.5).length.should.equal(5);
    });

    it('group test', function () {
        var agnes = hclust.agnes(data);
        var groupAgnes = agnes.group(3);
        groupAgnes.distance.should.be.approximately(agnes.distance, 0.0001);
    });
});
