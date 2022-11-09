const postcss = require('rollup-plugin-postcss');
const replace = require('@rollup/plugin-replace');

module.exports = {
  rollup(config, options) {
    (config.plugins = [
      ...config.plugins,
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
