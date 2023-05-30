/** @type {import('tailwindcss').Config} */
const { join } = require("path");

module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./libs/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.{html,ico,svg}",
  ],
  corePlugins: {
    preflight: false,
  },
  important: "body",
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
