import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        royal: {
          maroon: "#800000",
          gold: "#D4AF37",
          burnt: "#C65A1E",
          cream: "#FBF7EE",
          ink: "#1A1210",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        script: [
          "var(--font-script)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;