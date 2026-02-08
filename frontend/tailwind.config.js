/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3e2',
          100: '#fde7c5',
          200: '#fbcf8c',
          300: '#f9b752',
          400: '#f79f19',
          500: '#d88715',
          600: '#b06f11',
          700: '#88570d',
          800: '#603f09',
          900: '#382705',
        },
      },
    },
  },
  plugins: [],
}
