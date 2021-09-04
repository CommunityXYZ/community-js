const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/community.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      os: false,
      path: false,
      fs: false
    },
  },
  optimization: {
    providedExports: true,
    sideEffects: true,
    usedExports: true,
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
