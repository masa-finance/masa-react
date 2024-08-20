const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { ProvidePlugin } = require('webpack');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

/* 
==== BUILD STEPS ====

1. Transpile typescript with tsc command (script: "transpile":)
2. Build css with first config export
3. Build libraries with entry-mapped object config 
 */
const commonConfig = /** @type { import("webpack").Configuration } */ {
  mode: 'none',
  devtool: undefined,
  entry: path.resolve(__dirname, './dist/src/index.js'),
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // modules: ['node_modules'],
    // plugins: [new TsconfigPathsPlugin()],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [nodeModulesPath],
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new ProvidePlugin({
      React: 'react',
    }),
    new ForkTsCheckerWebpackPlugin(),
    new NodePolyfillPlugin(),
  ],
  optimization: {
    minimize: false,
    emitOnErrors: false,
  },
  stats: {
    errorDetails: true,
  },
};

module.exports =
  /** @type { import("webpack").Configuration } */
  [
    {
      ...commonConfig,
      entry: path.resolve(__dirname, 'src/styles.scss'),
      output: {
        path: path.resolve('dist/css'),
      },
      optimization: {
        // minimize: true,
        // minimizer: [new CssMinimizerPlugin()],
      },
      plugins: [
        new RemoveEmptyScriptsPlugin(),
        new MiniCssExtractPlugin({
          filename: 'styles.css',
        }),
      ],
      resolve: {
        fallback: {
          https: false,
          zlib: false,
        },
      },
      module: {
        rules: [
          {
            // Assets loader
            // bundle assets with css so they can be loaded by css
            // More information here https://webpack.js.org/guides/asset-modules/
            test: /\.(eot|otf|ttf|woff|woff2)$/i,
            type: 'asset',
            generator: {
              filename: '../fonts/[name].[hash][ext][query]',
            },
          },
          {
            // Assets loader
            // bundle assets with css so they can be loaded by css
            // More information here https://webpack.js.org/guides/asset-modules/
            test: /\.(gif|jpe?g|tiff|png|webp|bmp|svg)$/i,
            type: 'asset',
            generator: {
              filename: '../assets/[name].[hash][ext][query]',
            },
          },
          {
            test: /\.(sa|sc|c)ss$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'sass-loader',
                options: {
                  sassOptions: {
                    includePaths: [
                      path.resolve('node_modules'),
                      path.resolve('node_modules/@rainbow-me/rainbowkit'),
                      path.resolve('node_modules/react-phone-number-input'),
                      path.resolve('node_modules/rc-tooltip'),
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
    },
  ].concat(
    Object.entries({
      amd: 'amd',
      commonjs: 'cjs',
      commonjs2: 'cjs2',
      umd: 'umd',
      window: 'window',
    }).map(([libraryTarget, extension]) => ({
      ...commonConfig,
      entry: path.resolve(__dirname, './dist/src/index.js'),
      devtool: 'source-map',
      output: {
        filename: `masa-react.${extension}.min.js`,
        library: libraryTarget === 'window' ? 'MasaReact' : 'masa-react', // cant use kebap-case for library namesy
        libraryTarget,
        path: path.resolve(__dirname, 'dist/browser'),
        clean: false,
      },
    }))
  );
