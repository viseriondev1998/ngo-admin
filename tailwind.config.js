const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
     content: ["./src/**/*.{js,jsx,ts,tsx}"],
     theme: {
          extend: {
               colors: {
                    primary: colors.emerald,
               },
               fontFamily: {
                    sans: ["'Mulish', sans-serif"],
               },
          },
     },
     plugins: [],
};
