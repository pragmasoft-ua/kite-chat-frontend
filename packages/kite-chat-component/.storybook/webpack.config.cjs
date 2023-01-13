// This file is here for prototyping purposes only
// because storybook uses webpack internally
// It works, in a sense it's possible to build component with it in a commonjs format
// if webpack, webpack cli, both loaders used here and their respective deps are installed

const path = require('path');

module.exports = {
  entry: './src/index',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css/i,
        resourceQuery: /raw/,
        type: 'asset/source',
        use: ['postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
