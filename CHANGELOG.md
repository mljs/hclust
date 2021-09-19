# Changelog

## [3.1.0](https://github.com/mljs/hclust/compare/v3.0.0...v3.1.0) (2021-09-19)


### Features

* export Cluster class ([#13](https://github.com/mljs/hclust/pull/13))

# [3.0.0](https://github.com/mljs/hclust/compare/v2.0.3...v3.0.0) (2019-07-16)


### Code Refactoring

* make AGNES algorithm closer to R ([#11](https://github.com/mljs/hclust/issues/11)) ([1517124](https://github.com/mljs/hclust/commit/1517124))


### BREAKING CHANGES

* - use the Lance-Williams algorithm to update cluster distances.
- add other methods that exist in R.
- remove `ClusterLeaf` class and use an `isLeaf` property instead.
- remove `index` array from clusters. Instead, an `indexes()` method has been added to compute it.
- add a `size` property to clusters that indicates the number of leaves below it.
- the default `method` is now `'complete'`.
- DIANA has been removed from the package pending rewriting it.



## [2.0.3](https://github.com/mljs/hclust/compare/v2.0.2...v2.0.3) (2019-07-10)


### Bug Fixes

* correct definitions of options interfaces ([b07d3a4](https://github.com/mljs/hclust/commit/b07d3a4))
* improve performance of ward algorithm ([3bad3b6](https://github.com/mljs/hclust/commit/3bad3b6))



## [2.0.2](https://github.com/mljs/hclust/compare/v2.0.1...v2.0.2) (2019-07-10)


### Bug Fixes

* correct more types ([1fa6854](https://github.com/mljs/hclust/commit/1fa6854))



## [2.0.1](https://github.com/mljs/hclust/compare/v2.0.0...v2.0.1) (2019-07-10)


### Bug Fixes

* correct TS definitions ([f50d820](https://github.com/mljs/hclust/commit/f50d820))



# [2.0.0](https://github.com/mljs/hclust/compare/v1.3.0...v2.0.0) (2019-05-02)


### Code Refactoring

* **agnes:** rename `options.kind` to `options.method` ([acabbe6](https://github.com/mljs/hclust/commit/acabbe6))
* rework options and write TS definitions ([f49c7af](https://github.com/mljs/hclust/commit/f49c7af))
* rewrite project as ESM and use rollup ([f02ad0a](https://github.com/mljs/hclust/commit/f02ad0a))


### BREAKING CHANGES

* **agnes:** `options.kind` was renamed to `options.method` in `agnes`.
* the `disFunc` option was renamed to `distanceFunction`.
* Node.js 4 and 6 are no longer supported.



<a name="1.3.0"></a>
# [1.3.0](https://github.com/mljs/hclust/compare/v1.2.1...v1.3.0) (2017-02-22)


### Features

* **cluster:** add traverse method ([e437076](https://github.com/mljs/hclust/commit/e437076))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/mljs/hclust/compare/v1.2.0...v1.2.1) (2017-02-10)



<a name="1.2.0"></a>
# [1.2.0](https://github.com/mljs/hclust/compare/v1.1.2...v1.2.0) (2016-09-05)


### Features

* **cluster:** use a heap to group clusters ([8c70c9e](https://github.com/mljs/hclust/commit/8c70c9e))



<a name="1.1.2"></a>
## [1.1.2](https://github.com/mljs/hclust/compare/v1.1.1...v1.1.2) (2016-09-01)



<a name="1.1.1"></a>
## [1.1.1](https://github.com/mljs/hclust/compare/v1.1.0...v1.1.1) (2016-09-01)


### Bug Fixes

* **Cluster:** possible infinite loop when all the clusters are leafs ([ba234a7](https://github.com/mljs/hclust/commit/ba234a7))
* **CLuster:** group method brok in the case when reached a leaf ([b09148f](https://github.com/mljs/hclust/commit/b09148f))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/mljs/hclust/compare/v1.0.1...v1.1.0) (2016-08-16)


### Features

* **agnes:** add agglomerative clustering algorithm based on a distance matrix ([7609eb0](https://github.com/mljs/hclust/commit/7609eb0))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/mljs/hclust/compare/v1.0.0...v1.0.1) (2016-08-16)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/mljs/hclust/compare/v0.1.0...v1.0.0) (2015-07-24)



<a name="0.1.0"></a>
# 0.1.0 (2015-07-01)



