
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {

        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#1e3a5f",
          600: "#1a3352",
          700: "#152b45",
          800: "#112338",
          900: "#0d1b2b",
        },
        secondary: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#b8860b",
          600: "#a47a0a",
          700: "#906d09",
          800: "#7c6008",
          900: "#685307",
        },
        accent: {
          500: "#8b0000",
          600: "#7a0000",
          700: "#690000",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      fontFamily: {
        heading: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        body: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 10px 30px -18px rgba(15, 23, 42, 0.3)",
        "card-hover": "0 18px 45px -20px rgba(15, 23, 42, 0.35)",
      },
      borderRadius: {
        none: "0",
        sm: "4px",
        DEFAULT: "12px",
      },
    },
  },
  plugins: [],
};
