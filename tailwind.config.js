// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.vue', './src/**/*.ts'],
  theme: {
    fontFamily: {
      psp: ['Press Start 2P', ...defaultTheme.fontFamily.mono],
      sans: ['Inter var', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      minWidth: {
        'half-screen': '50vw',
      },
      height: {
        'half-screen': '50vh',
      },
      maxHeight: {
        'half-screen': '50vh',
        'screen-1/2': '50vh',
        'screen-3/4': '75vh',
        'screen-1/5': '20vh',
        'screen-1/4': '25vh',
        'screen-1/3': '33.33vh',
        'screen-4/5': '80vh',
        'screen-7/8': '87.5vh',
      },
      minHeight: {
        'half-screen': '50vh',
        'screen-1/2': '50vh',
        'screen-3/4': '75vh',
        'screen-1/5': '20vh',
        'screen-1/4': '25vh',
        'screen-1/3': '33.33vh',
        'screen-4/5': '80vh',
        'screen-7/8': '87.5vh',
      },
      fontSize: {
        '3xs': '.5rem',
        '2xs': '.625rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('nightwind'),
  ],
}
