/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // Add the plugins array with the typography plugin
  plugins: [
    require('@tailwindcss/typography'),
  ],
}