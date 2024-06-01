/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.(js|jsx|ts|tsx)"],
  theme: {
    extend: {
      colors: {
        primary: "#3e3c61",
        secondary: "#2f2d52",
        button: "#5d5b8d",
        tertiary: "#8da4f1",
      },
    },
  },
  plugins: [],
};
