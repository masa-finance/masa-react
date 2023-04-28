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
      os: false,
      crypto: false,
      url: false,
      https: false,
      http: false,
      assert: false,
      path: false,
      zlib: false,
      fs: false,
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
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
