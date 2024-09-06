/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // React component paths
  ],
  theme: {
    extend: {
      colors: {
        bg: '#26292b',
        secondary: 'rgba(136, 166, 189, 0.09)', // Custom secondary background color
      },
    },
  },
  plugins: [],
}
