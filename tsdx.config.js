const postcss = require('rollup-plugin-postcss');
const replace = require('@rollup/plugin-replace');
const babel = require('rollup-plugin-babel');

module.exports = {
  rollup(config, options) {
    (config.plugins = [
      ...config.plugins,
      postcss({ plugins: [] }),
      babel({
        babelrc: false,
        plugins: [
          [
            'import',
            { libraryName: 'antd', libraryDirectory: 'es', style: true },
          ],
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        exclude: 'node_modules/**',
      }),
    ]),
      (config.plugins = config.plugins.map((plugin) =>
        plugin.name === 'replace'
          ? replace({
              'process.env.NODE_ENV': JSON.stringify(options.env),
              preventAssignment: true,
            })
          : plugin
      ));
    return config;
  },
};
