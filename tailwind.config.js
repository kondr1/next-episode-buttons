/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    float: false,
    clear: false,
    accessibility: false,
    tableLayout: false,
    borderCollapse: false,
    blur: false,
  },
}
