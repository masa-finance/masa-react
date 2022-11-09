const postcss = require('rollup-plugin-postcss');
const replace = require('@rollup/plugin-replace');
const babel = require('rollup-plugin-babel');

module.exports = {
  rollup(config, options) {
    (config.plugins = [
      ...config.plugins,
      babel({
        babelrc: false,
        plugins: [['import', { libraryName: 'antd', style: true }]],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        exclude: 'node_modules/**',
      }),
      postcss({
        extensions: ['.css', '.scss', '.less'],
        use: [
          'sass',
          ['less', { javascriptEnabled: true }],
        ],
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
