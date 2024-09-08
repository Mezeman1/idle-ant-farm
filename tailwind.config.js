// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./index.html', './src/**/*.vue', './src/**/*.ts'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      minWidth: {
        'half-screen': '50vw',
      },
      height: {
        'half-screen': '50vh',
      },
      maxHeight: {
        'half-screen': '50vh',
        'screen-3/4': '75vh',
        'screen-1/5': '20vh',
      },
      fontSize: {
        '3xs': '.5rem',
        '2xs': '.625rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
