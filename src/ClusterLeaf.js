import Cluster from './Cluster';

export default class ClusterLeaf extends Cluster {
  constructor(index) {
    super();
    this.children = [];
    this.distance = 0;
    this.index = index;
  }
}
