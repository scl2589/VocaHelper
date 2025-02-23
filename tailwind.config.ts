import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: {
          90: 'var(--color-gray-90)',
          70: 'var(--color-gray-70)',
          50: 'var(--color-gray-50)',
          30: 'var(--color-gray-30)',
          10: 'var(--color-gray-10)',
        },
        blue: {
          light: 'var(--color-blue-light)',
          medium: 'var(--color-blue-medium)',
          dark: 'var(--color-blue-dark)',
        },
        yellow: {
          medium: 'var(--color-yellow-medium)',
        },
        green: {
          medium: 'var(--color-green-medium)',
        },
        pink: {
          light: 'var(--color-pink-light)',
          medium: 'var(--color-pink-medium)',
          dark: 'var(--color-pink-dark)',
        },
        darkText: '#e2e8f0',
        darkWhiteBgText: 'black'
      },
    },
  },
  plugins: [],
} satisfies Config;
