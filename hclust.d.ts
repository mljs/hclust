declare module 'ml-hclust' {
  export type AgglomerationMethod =
    | 'single'
    | 'complete'
    | 'average'
    | 'centroid'
    | 'ward';
  export interface AgnesOptions {
    distanceFunction: (a: T, b: T) => number;
    method: AgglomerationMethod;
    isDistanceMatrix: boolean;
  }

  export interface DianaOptions<T> {
    distanceFunction: (a: T, b: T) => number;
  }

  export interface Cluster {
    children: Cluster[];
    distance: number;
    index: number[];
    cut: (threshold: number) => Cluster[];
    group: (minGroups: number) => Cluster;
    traverse: (cb: (cluster: Cluster) => void) => void;
  }

  export function agnes<T = number[]>(
    data: T[],
    options?: AgnesOptions<T>
  ): Cluster;
  export function diana<T = number[]>(
    data: T[],
    options?: DianaOptions<T>
  ): Cluster;
}
