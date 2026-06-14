import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        av: {
          midnight: "#020814",
          navy: "#061524",
          panel: "#071d31",
          panelSoft: "#0d2740",
          gold: "#c99d56",
          goldBright: "#f0c985",
          ivory: "#f6ecd8",
          muted: "#b8a98f",
          line: "rgba(201, 157, 86, 0.48)",
          success: "#8cc66f",
          warning: "#e4b65e",
          danger: "#e45d58",
          info: "#75a9d6",
          review: "#b58de2"
        }
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
      },
      boxShadow: {
        panel: "0 18px 60px rgba(0, 0, 0, 0.35)",
        glow: "0 0 32px rgba(201, 157, 86, 0.2)"
      }
    }
  },
  plugins: []
};

export default config;
