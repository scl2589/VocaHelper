import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
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
        slate: { 50:'#f6f5ef',100:'#eeeee7',200:'#dedfd9',300:'#bfc8c9',400:'#84939f',500:'#637385',600:'#465a70',700:'#344c66',800:'#22364c',900:'#172b40',950:'#101c2b' },
        indigo: { 50:'#f0f4f8',100:'#e4edf4',200:'#c8d9e8',300:'#a5bfd8',400:'#8aaed2',500:'#41688c',600:'#203c60',700:'#19334f',800:'#193149',900:'#182b3c',950:'#101c2b' },
        gray: {
          50:'#f7f7f2',100:'#f0f0ea',200:'#e1e3dc',300:'#c7cdc8',400:'#869391',500:'#64716f',600:'#4e5d60',700:'#344653',800:'#243440',900:'#192832',950:'#101c25',
          90: 'var(--color-gray-90)',
          70: 'var(--color-gray-70)',
          30: 'var(--color-gray-30)',
          10: 'var(--color-gray-10)',
        },
        blue: {
          50:'#f0f4f8',100:'#e4edf4',200:'#c8d9e8',300:'#a5bfd8',400:'#8aaed2',500:'#41688c',600:'#203c60',700:'#19334f',800:'#193149',900:'#182b3c',950:'#101c2b',
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
