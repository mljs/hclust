import Heap from 'heap';

export default class Cluster {
  constructor() {
    this.children = [];
    this.height = 0;
    this.size = 1;
    this.index = -1;
    this.isLeaf = false;
  }

  /**
   * Creates an array of clusters where the maximum height is smaller than the threshold
   * @param {number} threshold
   * @return {Array<Cluster>}
   */
  cut(threshold) {
    if (typeof threshold !== 'number') {
      throw new TypeError('threshold must be a number');
    }
    if (threshold < 0) {
      throw new RangeError('threshold must be a positive number');
    }
    let list = [this];
    const ans = [];
    while (list.length > 0) {
      const aux = list.shift();
      if (threshold >= aux.height) {
        ans.push(aux);
      } else {
        list = list.concat(aux.children);
      }
    }
    return ans;
  }

  /**
   * Merge the leaves in the minimum way to have `groups` number of clusters.
   * @param {number} groups - Them number of children the first level of the tree should have.
   * @return {Cluster}
   */
  group(groups) {
    if (!Number.isInteger(groups) || groups < 1) {
      throw new RangeError('groups must be a positive integer');
    }

    const heap = new Heap((a, b) => {
      return b.height - a.height;
    });

    heap.push(this);

    while (heap.size() < groups) {
      const first = heap.pop();
      if (first.children.length === 0) {
        break;
      }
      first.children.forEach((child) => heap.push(child));
    }

    const root = new Cluster();
    root.children = heap.toArray();
    root.height = this.height;

    return root;
  }

  /**
   * Traverses the tree depth-first and calls the provided callback with each individual node
   * @param {function} cb - The callback to be called on each node encounter
   */
  traverse(cb) {
    function visit(root, callback) {
      callback(root);
      if (root.children) {
        for (const child of root.children) {
          visit(child, callback);
        }
      }
    }
    visit(this, cb);
  }

  /**
   * Returns a list of indices for all the leaves of this cluster.
   * The list is ordered in such a way that a dendrogram could be drawn without crossing branches.
   * @returns {Array<number>}
   */
  indices() {
    const result = [];
    this.traverse((cluster) => {
      if (cluster.isLeaf) {
        result.push(cluster.index);
      }
    });
    return result;
  }
}
