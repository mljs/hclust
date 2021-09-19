export default {
  input: 'src/index.js',
  output: {
    file: 'hclust.js',
    format: 'cjs',
  },
  external: ['ml-distance-euclidean', 'ml-distance-matrix', 'heap'],
};
