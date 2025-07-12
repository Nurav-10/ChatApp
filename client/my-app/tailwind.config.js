// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        secondary: "var(--secondary)",
        tertiary:"var(--tertiary)",
        primary: "var(--primary)",
      },
    },
  },
  plugins: [],
};
