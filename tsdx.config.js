const postcss = require('rollup-plugin-postcss');
const replace = require('@rollup/plugin-replace');
const sass = require('rollup-plugin-scss');

module.exports = {
  rollup(config, options) {
    (config.plugins = [
      ...config.plugins,
      sass({
        sass: require('node-sass'),
        watch: '',
        verbose: true,
        include: ['/**/*.css', '/**/*.scss', '/**/*.sass'],
        output: 'dist/styles/style.css',
        failOnError: true,
      }),
      postcss({
        extensions: ['.css', '.scss', '.less'],
        use: ['sass', ['less', { javascriptEnabled: true }]],
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
