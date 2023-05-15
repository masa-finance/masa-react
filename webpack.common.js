'use strict';
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { paths } = require('./webpack.parts.js');

const PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
  entry: paths.entry,
  mode: 'none',
  optimization: {
    minimize: true,
    emitOnErrors: false,
  },
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
    fallback: {
      // assert: false,
      // crypto: false,
      // http: false,
      // https: false,
      // os: false,
      // url: false,
      // stream: require.resolve('stream-browserify'),

      fs: false,
      path: false,
      zlib: false,
      buffer: require.resolve('buffer'),
      'process/browser': require.resolve('process/browser'),
      assert: require.resolve('assert'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  module: {
    rules: [
      {
        // Typescript loader
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        // CSS Loader
        test: /\.css$/,
        use: [
          {
            loader: PRODUCTION ? MiniCssExtractPlugin.loader : 'style-loader',
          },
          { loader: 'css-loader' },
        ],
      },
      {
        // SCSS (SASS) Loader
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: PRODUCTION ? MiniCssExtractPlugin.loader : 'style-loader',
          },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        // Less loader
        test: /\.less$/,
        use: [
          {
            loader: PRODUCTION ? MiniCssExtractPlugin.loader : 'style-loader',
          },
          { loader: 'css-loader' },
          { loader: 'less-loader' },
        ],
      },
      {
        // Assets loader
        // More information here https://webpack.js.org/guides/asset-modules/
        test: /\.(gif|jpe?g|tiff|png|webp|bmp|svg|eot|otf|ttf|woff|woff2)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/[name].[hash][ext][query]',
        },
      },
    ],
  },
};
