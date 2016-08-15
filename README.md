# hclust

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![David deps][david-image]][david-url]
  [![npm download][download-image]][download-url]

Hierarchical clustering algorithms in JavaScript

## Installation

`npm install ml-hclust`

## Methods
Generate a clustering hierarchy.

### new agnes(data,[options])

[AGNES](http://dx.doi.org/10.1002/9780470316801.ch5) (AGglomerative NESting): Continuously merge nodes that have the least dissimilarity.

__Arguments__

* `data`: Array of points to be clustered, are an array of arrays, as [[x1,y1],[x2,y2], ... ]. Optionally the data input can be a distance matrix. In such case, the option `source` has to be set to `distance` (the default value is `data`).
* `options`: Is an object with the parameters `sim` and `kind`, where `sim` is a distance function between vectors (the default function is the euclidean), and `kind` is the string name for the function to calculate distance between clusters, and it could be `single`(default), `complete`, `average`, `centroid` or `ward`

#### getDendogram([input])

Returns a phylogram (a dendogram with weights) and change the leaves values for the values in `input`, if it's given.

__Example 1__

```js
var hclust = require('ml-hclust')
var data = [[2,6], [3,4], [3,8]];
var HC = new hclust.agnes(data);
var dend1 = HC.getDendogram();
var dend2 = HC.getDendogram([{a:1},{b:2},{c:3}]);
```
__Example 2__

```js
var hclust = require('ml-hclust')
//A distance matrix. 
var distance = [[0, 1, 2], [1, 0, 2], [2, 2, 0]]; 
var HC = new hclust.agnes(data, {source:'distance'});
```

#### nClusters(N)

Returns at least N clusters based in the clustering tree if it's possible

### new diana(data,[options])

[DIANA](http://eu.wiley.com/WileyCDA/WileyTitle/productCd-0470276800.html) (Divisive ANAlysis): The process starts at the root with all the points as one cluster and recursively splits the higher level clusters to build the dendrogram.

__Arguments__

* `data`: Array of points to be clustered, are an array of arrays, as [[x1,y1],[x2,y2], ... ]
* `options`: Is an object with the parameters `sim` and `kind`, where `sim` is a distance function between vectors (the default function is the euclidean), and `kind` is the string name for the function to calculate distance between clusters, and it could be `single`(default), `complete`, `average`, `centroid` or `ward`

#### getDendogram([input])

Returns a phylogram (a dendogram with weights) and change the leaves values for the values in `input`, if it's given.

__Example__

```js
var hclust = require('ml-hclust')
var data = [[2,6], [3,4], [3,8]];
var HC = new hclust.diana(data);
var dend1 = HC.getDendogram();
var dend2 = HC.getDendogram([{a:1},{b:2},{c:3}]);
```

#### nClusters(N)

Returns at least N clusters based in the clustering tree if it's possible

### new birch(data,[options])

[BIRCH](http://www.cs.sfu.ca/CourseCentral/459/han/papers/zhang96.pdf) (Balanced Iterative Reducing and Clustering using Hierarchies): Incrementally construct a CF (Clustering Feature) tree, a hierarchical data structure for multiphase clustering


### new cure(data,[options])

[CURE](http://www.cs.bu.edu/fac/gkollios/ada05/LectNotes/guha98cure.pdf) (Clustering Using REpresentatives):


### new chameleon(data,[options])

[CHAMELEON](http://www.google.ch/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0CCQQFjAAahUKEwj6t4n_sZbGAhXDaxQKHXCLCmQ&url=http%3A%2F%2Fglaros.dtc.umn.edu%2Fgkhome%2Ffetch%2Fpapers%2FchameleonCOMPUTER99.pdf&ei=kDqBVfqvKsPXUfCWqqAG&usg=AFQjCNEYcGqCxN5N_GlP4Z__UF09aHegQg&sig2=9JkxZ5VS7iDbiJT-imX5Pg&bvm=bv.96041959,d.d24&cad=rja) 


## Test

```js
$ npm install
$ npm test
```

## Authors

  - [Miguel Asencio](https://github.com/maasencioh)

## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ml-hclust.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ml-hclust
[travis-image]: https://img.shields.io/travis/mljs/hclust/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/mljs/hclust
[david-image]: https://img.shields.io/david/mljs/hclust.svg?style=flat-square
[david-url]: https://david-dm.org/mljs/hclust
[download-image]: https://img.shields.io/npm/dm/ml-hclust.svg?style=flat-square
[download-url]: https://npmjs.org/package/ml-hclust
