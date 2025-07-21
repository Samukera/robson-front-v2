/** @type {import('tailwindcss').Config} */
const patterns = require('tailwindcss-bg-patterns');
const easingGradients = require('tailwind-easing-gradients');
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar'), patterns, easingGradients
  ],
};
