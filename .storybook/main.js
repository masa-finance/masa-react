module.exports = {
  stories: ['../src/**/*.stories.@(ts|tsx|js|jsx)'],

  addons: [
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-styling',
      options: {
        sass: {
          // Require your preprocessor
          implementation: require('sass'),
        },
      },
    },
  ],

  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
  typescript: {
    check: true, // type-check stories during Storybook build
  },

  // docs: {
  //   autodocs: true,
  // },
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  docs: {
    autodocs: false,
  },
};
