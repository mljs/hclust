import Cluster from './Cluster';

export default class ClusterLeaf extends Cluster {
  constructor(index) {
    super();
    this.index = index;
    this.distance = 0;
    this.children = [];
  }
}
