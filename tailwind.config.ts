import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deyeonso brand-ish palette (adjust later)
        brand: {
          primary: "#6C5CE7",
          accent: "#FF6B6B",
          ink: "#1F2937"
        }
      }
    },
  },
  plugins: [],
};
export default config;
