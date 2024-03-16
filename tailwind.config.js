import defaultTheme from 'tailwindcss/defaultTheme';

/**
 * @param {string} fontFamily Font family name
 * @returns {Array<string>} List of font families
 */
const extendSansFontFamily = (fontFamily) => [
  fontFamily,
  ...defaultTheme.fontFamily.sans,
];

/** @type {import('tailwindcss').Config} */
export default {
  // eslint-disable-next-line prettier/prettier
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [],
  theme: {
    extend: {
      colors: {
        apex: '#DA292A',
      },
    },
    fontFamily: {
      'duke-fill': extendSansFontFamily('Duke_Fill'),
      'tt-lakes-w05-light': extendSansFontFamily('TT_Lakes_W05_Light'),
      'tt-lakes-w05-medium': extendSansFontFamily('TT_Lakes_W05_Medium'),
      'tt-lakes-w05-regular': extendSansFontFamily('TT_Lakes_W05_Regular'),
    },
  },
};
