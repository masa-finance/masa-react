const postcss = require('rollup-plugin-postcss');
const replace = require('@rollup/plugin-replace');
const sass = require('rollup-plugin-scss');
const copy = require('rollup-plugin-copy');

module.exports = {
  rollup(config, options) {
    config.plugins = [
      ...config.plugins,
      sass({
        sass: require('node-sass'),
        watch: '',
        verbose: true,
        include: ['/**/*.css', '/**/*.scss', '/**/*.sass'],
        output: 'dist/style.css',
        failOnError: true,
      }),
      postcss({
        extensions: ['.css', '.scss', '.less'],
        use: ['sass', ['less', { javascriptEnabled: true }]],
      }),
      copy({
        targets: [{ src: 'fonts/**/*', dest: 'dist/fonts' }],
      }),
    ];
    config.plugins = config.plugins.map((plugin) =>
      plugin.name === 'replace'
        ? replace({
            'process.env.NODE_ENV': JSON.stringify(options.env),
            preventAssignment: true,
          })
        : plugin
    );
    return config;
  },
};
