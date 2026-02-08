/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        warm: {
          50: "#fdf8f3",
          100: "#faeee0",
          200: "#f5dcc1",
          300: "#eebd8a",
          400: "#e6a05e",
          500: "#df8a3c",
          600: "#c96f2e",
          700: "#a75728",
          800: "#874727",
          900: "#6d3b22"
        }
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
        display: ['"Playfair Display"', "Georgia", "serif"]
      }
    }
  },
  plugins: []
}
