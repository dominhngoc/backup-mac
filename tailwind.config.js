const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './modules/**/*.{js,ts,jsx,tsx}',
    './common/**/*.{js,ts,jsx,tsx}',
    './layout/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite-react/**/*.js',
  ],
  media: false,
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1278px',
      xl: '1480px',
      '2xl': '1536px',
    },
    extend: {
      zIndex: {
        45: '45',
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
        max: '9999',
        snackbar: '10000',
      },
      spacing: {
        17: '4.25rem',
        18: '4.5rem',
        25: '6.25rem',
        27: '6.75rem',
        50: '12.5rem',
        70: '17.5rem',
        89: '22.25rem',
        105: '26.25rem',
        109: '27.25rem',
      },
      colors: {
        primary: '#D21F3C',
        secondary: '#FF3B30',
        red: '#FF3B30',
        yellow: '#FFCC00',
        green: '#34C759',
        blue: '#007AFF',
        neutral: {
          100: '#272728',
          200: '#47474C',
          300: '#717278',
          400: '#8A8B93',
          500: '#B0B0B8',
        },
        bg1: '#000000',
        bg2: '#141414',
      },
      boxShadow: {
        sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)',
        lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
        xl: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0px 2px 4px rgba(0, 0, 0, 0.05)',
      },
      dropShadow: {
        '3xl': '0px 22px 50px rgba(0, 0, 0, 0.4)',
      },
      keyframes: {
        fade: {
          '0%,': { opacity: 1 },
          '100%': {
            opacity: 0,
          },
        },
        show: {
          '0%,': { opacity: 0 },
          '100%': {
            opacity: 1,
          },
        },
        slideLeft: {
          from: {
            transform: 'translateX(-200%)',
          },
          to: {
            transform: 'translateX(0px)',
          },
        },
        slideLeftOut: {
          from: {
            transform: 'translateX(0px)',
          },
          to: {
            transform: 'translateX(-200%)',
          },
        },
      },
      animation: {
        'fade-out': 'fade 1s linear 1 normal forwards',
        'fade-in': 'show 1s linear 1 normal forwards',
        'slide-left': 'slideLeft 0.5s ease-in 1 normal forwards',
        'slide-left-out': 'slideLeftOut 0.5s ease-out 1 normal forwards',
      },
    },
    container: {
      screens: {
        sm: '675px',
        md: '856px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1480px', // theo deign figma
      },
      padding: '0rem',
      center: true,
    },
  },
  plugins: [
    plugin(function ({
      addVariant,
      addBase,
      addUtilities,
      addComponents,
      theme,
    }) {
      addVariant('child', '& > *')
      addVariant('child-hover', '& > *:hover')
      addVariant('first', '&:nth-child(1)')
      addVariant('second', '&:nth-child(2)')
      addVariant('third', '&:nth-child(3)')
      addComponents({
        '.text-field': {
          minHeight: 40,
          fontSize: '14px',
          lineHeight: '20px',
          width: '100%',
          background: '#272728',
          borderRadius: 12,
          display: 'flex',
          gap: 3,
          border: '1px solid',
          borderColor: '#272728',
          outline: '2px solid transparent',
          outlineOffset: 2,
          padding: '0px 12px',
          '&:focus': {
            borderColor: 'white',
            boxShadow: 'none',
          },
        },
        'textarea.text-field': {
          padding: '8px 12px',
        },
        '.text-field.error-field': {
          borderColor: 'red',
          '&:focus': {
            borderColor: 'red',
          },
        },
        '.text-field.small-field': {
          minHeight: 32,
          fontSize: '12px',
          lineHeight: '20px',
        },
        '.divider': {
          borderBottomWidth: '1px',
          borderColor: theme('colors.neutral.200'),
        },
        '.divider-light': {
          borderBottomWidth: '0.5px',
          borderColor: theme('colors.neutral.100'),
        },
        '.avatar': {
          flexShrink: 0,
          borderRadius: theme('borderRadius.full'),
          backgroundColor: theme('colors.gray.500'),
          overflow: 'hidden',
          objectFite: 'cover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      })
      addUtilities({
        '.scrollbar-none-height': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',

          /* Firefox */
          'scrollbar-width': 'none',

          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.text-editor ': {
          '*': {
            color: 'white !important',
          },
        },

        '.min-h-screen ': {
          minHeight: 'calc(100vh - 96px)',
        },
        '.h-screen-head': {
          height: 'calc(100vh - 96px)',
        },
      })
      addBase({
        body: {
          padding: 0,
          margin: 0,
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '20px',
          background: 'black',
          width: '100vw',
          minHeight: '100vh',
          color: theme('colors.white'),
        },
        p: {
          padding: 0,
          margin: 0,
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '20px',
        },
        a: {
          textDecoration: 'none',
          backgroundColor: 'transparent',
        },
      })
      addUtilities({
        '.title2': {
          fontSize: '24px',
          lineHeight: '24px',
        },
        '.title': {
          fontSize: '20px',
          lineHeight: '24px',
        },
        '.headline': {
          fontSize: '16px',
          lineHeight: '21px',
        },
        '.subtitle': {
          fontSize: '14px',
          lineHeight: '20px',
        },

        '.caption1': {
          fontSize: '12px',
          lineHeight: '18px',
        },
        '.caption2': {
          fontSize: '11px',
          lineHeight: '13px',
        },
        '.caption3': {
          fontSize: '11px',
          lineHeight: '13px',
        },
      })
    }),
    require('@tailwindcss/line-clamp'),
    require('flowbite/plugin'),
  ],
}
