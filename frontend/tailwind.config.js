/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10121B",
        inkraised: "#171A28",
        paper: "#ECEAE3",
        papermuted: "#B9B6AC",
        amber: "#E8A33D",
        teal: "#3F7C74",
        coral: "#C1503A",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
