module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './stories/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: require('./src/config/colors.js'),
    fontFamily: {
      base: [
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica',
        'Arial',
        'sans-serif',
      ],
      sans: ['Proxima Nova', 'system-ui', 'sans-serif'],
      serif: ['serif'],
    },
  },
  variants: {
    scrollbar: ['rounded'],
    extend: {
      backgroundColor: ['checked'],
      display: ['group-hover'],
    },
  },
  plugins: [
    '@tailwindcss/forms',
    require('tailwind-scrollbar-hide'),
    require('tailwind-scrollbar'),
  ],
};
