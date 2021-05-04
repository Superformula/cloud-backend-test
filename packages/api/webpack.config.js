const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  optimization: {
    concatenateModules: false
  },
  resolve: {
    extensions: ['.mjs', '.json', '.ts', '.js'],
    symlinks: false,
    cacheWithContext: false,
    alias: {
      "@sf/api": path.resolve(__dirname, './src/'),
      "@sf/core": path.resolve(__dirname, '../packages/core/lib/generated/')
    }
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  externals: [
    nodeExternals(),
    nodeExternals({
      modulesDir: path.resolve(__dirname, '../../node_modules'),
    }),
  ],
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.(ts?)$/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack'),
          ],
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  },
};
