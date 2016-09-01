# hclust

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![David deps][david-image]][david-url]
  [![npm download][download-image]][download-url]

Hierarchical clustering algorithms in JavaScript

## Installation

`npm install ml-hclust`

## [API Documentation](https://mljs.github.io/hclust/)

## Methods
Generate a clustering hierarchy.

 - [x] [AGNES](http://dx.doi.org/10.1002/9780470316801.ch5) (AGglomerative NESting): Continuously merge nodes that have the least dissimilarity.
 - [x] [DIANA](http://eu.wiley.com/WileyCDA/WileyTitle/productCd-0470276800.html) (Divisive ANAlysis): The process starts at the root with all the points as one cluster and recursively splits the higher level clusters to build the dendrogram.
 - [ ] [BIRCH](http://www.cs.sfu.ca/CourseCentral/459/han/papers/zhang96.pdf) (Balanced Iterative Reducing and Clustering using Hierarchies): Incrementally construct a CF (Clustering Feature) tree, a hierarchical data structure for multiphase clustering
 - [ ] [CURE](http://www.cs.bu.edu/fac/gkollios/ada05/LectNotes/guha98cure.pdf) (Clustering Using REpresentatives):
 - [ ] [CHAMELEON](http://www.google.ch/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0CCQQFjAAahUKEwj6t4n_sZbGAhXDaxQKHXCLCmQ&url=http%3A%2F%2Fglaros.dtc.umn.edu%2Fgkhome%2Ffetch%2Fpapers%2FchameleonCOMPUTER99.pdf&ei=kDqBVfqvKsPXUfCWqqAG&usg=AFQjCNEYcGqCxN5N_GlP4Z__UF09aHegQg&sig2=9JkxZ5VS7iDbiJT-imX5Pg&bvm=bv.96041959,d.d24&cad=rja) 


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
