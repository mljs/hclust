declare module 'ml-hclust' {
  export type LinkageKind =
    | 'single'
    | 'complete'
    | 'average'
    | 'centroid'
    | 'ward';
  export interface AgnesOptions {
    distanceFunction: (a: number[], b: number[]) => number;
    kind: LinkageKind;
    isDistanceMatrix: boolean;
  }

  export interface DianaOptions {
    distanceFunction: (a: number[], b: number[]) => number;
  }

  export interface Cluster {
    children: Cluster[];
    distance: number;
    index: number[];
    cut: (threshold: number) => Cluster[];
    group: (minGroups: number) => Cluster;
    traverse: (cb: (cluster: Cluster) => void) => void;
  }

  export function agnes(data: number[][], options?: AgnesOptions): Cluster;
  export function diana(data: number[][], options?: DianaOptions): Cluster;
}
