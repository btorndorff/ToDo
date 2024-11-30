/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    // Add the color classes we're using dynamically
    {
      pattern: /(bg|border|text|ring)-(red|blue|yellow|green)-(50|100|200|500|600)/,
    },
  ],
}
