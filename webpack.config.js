const path = require('path');
module.exports = {
  mode: 'production',
  entry: './browser.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      os: false,
      path: false,
      fs: false,
      crypto: false
    },
  },
  optimization: {
    usedExports: true,
    sideEffects: true,
  },
  output: {
    filename: 'community.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
