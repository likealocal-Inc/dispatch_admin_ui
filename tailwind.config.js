/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const themeBase = require("./themes/themeBase.json");
const themeSet = themeBase.global;

module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./libs/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-elements/dist/js/*.js",
  ],
};
