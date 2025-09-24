import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          700: "var(--color-primary-700)",
        },
        ink: {
          800: "var(--color-ink-800)",
          900: "var(--color-ink-900)",
        },
        accent: "var(--color-accent)",
        neutral: {
          50: "var(--color-neutral-50)",
          100: "var(--color-neutral-100)",
          900: "var(--color-neutral-900)",
        },
      },
      boxShadow: {
        elev1: "var(--shadow-elev1)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        ctl: "var(--radius-control)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "sans-serif",
        ],
      },
      fontSize: {
        h1: ["var(--type-h1-size)", { lineHeight: "var(--type-h1-leading)" }],
        h2: ["var(--type-h2-size)", { lineHeight: "var(--type-h2-leading)" }],
        h3: ["var(--type-h3-size)", { lineHeight: "var(--type-h3-leading)" }],
        h4: ["var(--type-h4-size)", { lineHeight: "var(--type-h4-leading)" }],
        body: ["var(--type-body-size)", { lineHeight: "var(--type-body-leading)" }],
        "body-lg": ["var(--type-body-lg-size)", { lineHeight: "var(--type-body-lg-leading)" }],
        caption: ["var(--type-caption-size)", { lineHeight: "var(--type-caption-leading)" }],
      },
    },
  },
  plugins: [],
};

export default config;









