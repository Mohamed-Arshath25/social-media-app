/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', "sans-serif"],
        display: ['"Space Grotesk"', "sans-serif"]
      },
      colors: {
        ink: "#0f172a",
        mist: "#e2e8f0",
        shell: "#f8fafc",
        ember: "#f97316",
        aqua: "#22d3ee",
        night: "#020617"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(15, 23, 42, 0.18)",
        card: "0 18px 45px rgba(15, 23, 42, 0.12)"
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(circle at top left, rgba(34,211,238,0.35), transparent 32%), radial-gradient(circle at 85% 10%, rgba(249,115,22,0.24), transparent 30%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
        "mesh-dark":
          "radial-gradient(circle at top left, rgba(34,211,238,0.16), transparent 26%), radial-gradient(circle at 85% 10%, rgba(249,115,22,0.2), transparent 28%), linear-gradient(180deg, #020617 0%, #111827 100%)"
      }
    }
  },
  plugins: []
};
