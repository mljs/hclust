# hclust

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Hierarchical clustering algorithms in JavaScript.

## Installation

`npm i ml-hclust`

## [API Documentation](https://mljs.github.io/hclust/)

## Usage

### AGNES

```js
const { agnes } = require('ml-hclust');

const tree = agnes(data, {
  method: 'ward',
});
```

## Implemented algorithms

- [x] [AGNES](http://dx.doi.org/10.1002/9780470316801.ch5) (AGglomerative NESting): Continuously merge nodes that have the least dissimilarity.
- [ ] [DIANA](http://eu.wiley.com/WileyCDA/WileyTitle/productCd-0470276800.html) (Divisive ANAlysis): The process starts at the root with all the points as one cluster and recursively splits the higher level clusters to build the dendrogram.
- [ ] [BIRCH](http://www.cs.sfu.ca/CourseCentral/459/han/papers/zhang96.pdf) (Balanced Iterative Reducing and Clustering using Hierarchies): Incrementally construct a CF (Clustering Feature) tree, a hierarchical data structure for multiphase clustering
- [ ] [CURE](http://www.cs.bu.edu/fac/gkollios/ada05/LectNotes/guha98cure.pdf) (Clustering Using REpresentatives):
- [ ] [CHAMELEON](http://www.google.ch/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0CCQQFjAAahUKEwj6t4n_sZbGAhXDaxQKHXCLCmQ&url=http%3A%2F%2Fglaros.dtc.umn.edu%2Fgkhome%2Ffetch%2Fpapers%2FchameleonCOMPUTER99.pdf&ei=kDqBVfqvKsPXUfCWqqAG&usg=AFQjCNEYcGqCxN5N_GlP4Z__UF09aHegQg&sig2=9JkxZ5VS7iDbiJT-imX5Pg&bvm=bv.96041959,d.d24&cad=rja)

## Test

```console
npm install
npm test
```

## Authors

- [Miguel Asencio](https://github.com/maasencioh)
- [Michael Zasso](https://github.com/targos)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ml-hclust.svg
[npm-url]: https://npmjs.org/package/ml-hclust
[codecov-image]: https://img.shields.io/codecov/c/github/mljs/hclust.svg
[codecov-url]: https://codecov.io/gh/mljs/hclust
[ci-image]: https://github.com/mljs/hclust/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/mljs/hclust/actions?query=workflow%3A%22Node.js+CI%22
[download-image]: https://img.shields.io/npm/dm/ml-hclust.svg
[download-url]: https://npmjs.org/package/ml-hclust
