module.exports = {
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', {
    name: 'storybook-addon-sass-postcss',
    options: {
      loadSassAfterPostCSS: true,
      postcssLoaderOptions: {
        implementation: require('postcss')
      },
      rule: {
        test: /\.(scss|sass)$/i
      }
    }
  }, {
    name: '@storybook/addon-postcss',
    options: {
      postcssLoaderOptions: {
        implementation: require('postcss')
      }
    }
  }],
  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
  typescript: {
    check: true // type-check stories during Storybook build
  },
  core: {
    builder: 'webpack5'
  }
};