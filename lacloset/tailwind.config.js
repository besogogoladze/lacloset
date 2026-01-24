/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        black: "var(--color-black)",
        red: "var(--color-red)",
        yellow: "var(--color-yellow)",
        orange: "var(--color-orange)",
        green: "var(--color-green)",
        grey: "var(--color-grey)",
        greyLight: "var(--color-greyLight)",
        whiteGrayish: "var(--color-whiteGrayish)",
        grey10: "var(--color-grey10)",
        grey50: "var(--color-grey50)",
        grey100: "var(--color-grey100)",
        grey200: "var(--color-grey200)",
        grey300: "var(--color-grey300)",
      },
    },
  },
  plugins: [],
};
