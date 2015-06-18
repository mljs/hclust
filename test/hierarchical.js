var hierarchical = require('..');

describe('Hierarchical clustering test', function () {

    it('AGNES test', function () {
        var agnesData = [[2,6], [3,4], [3,8], [4,5], [4,7], [6,2], [7,2], [7,4], [8,4], [8,5]];
        var HC = new hierarchical();
        HC.cluster(agnesData);
        var ansAgnes = HC.getLevel(3);
        ansAgnes[0][0][0].should.equal(3);
    });

    it('DIANA test', function () {
        var dianaData = [[2,6], [3,4], [3,8], [4,5], [4,7], [6,2], [7,2], [7,4], [8,4], [8,5]];
        var HC = new hierarchical({name:'diana'});
        HC.cluster(dianaData);
        var ansDiana = HC.getLevel(3);
        ansDiana[0][0][0].should.equal(7);
    });
});