# ml-hclust

[![NPM version](https://img.shields.io/npm/v/ml-hclust.svg)](https://www.npmjs.com/package/ml-hclust)
[![npm download](https://img.shields.io/npm/dm/ml-hclust.svg)](https://www.npmjs.com/package/ml-hclust)
[![test coverage](https://img.shields.io/codecov/c/github/mljs/hclust.svg)](https://codecov.io/gh/mljs/hclust)
[![license](https://img.shields.io/npm/l/ml-hclust.svg)](https://github.com/mljs/hclust/blob/main/LICENSE)

Hierarchical clustering algorithms in JavaScript.

## Installation

```console
npm install ml-hclust
```

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
- [ ] [CHAMELEON](https://www.cs.upc.edu/~bejar/URL/material_art/DM%20clustering%20karypis99chameleon.pdf): Hierarchical Clustering Using Dynamic Modeling

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
