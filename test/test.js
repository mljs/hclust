var hclust = require('..');

var data = [[2,6], [3,4], [3,8], [4,5], [4,7], [6,2], [7,2], [7,4], [8,4], [8,5]];

describe('Hierarchical clustering test', function () {

    it('AGNES test', function () {
        var agnes = hclust.agnes(data);
        agnes.distance.should.equal(3.6056);
    });

    it('DIANA test', function () {
        var diana = hclust.diana(data);
        console.log(require('util').inspect(diana, {depth:null}));
        diana.distance.should.equal(3.6056);
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