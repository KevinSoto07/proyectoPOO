/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgBase:       '#0d1117',
        bgCard:       '#161b22',
        bgCardHover:  '#1c2330',
        borderNormal: '#21262d',
        borderBlue:   '#58a6ff',
        textPrimary:  '#e6edf3',
        textMuted:    '#8b949e',
        textLabel:    '#58a6ff',
        accentGreen:  '#39d98a',
        accentGreenDark: '#1a4731',
        accentBlue:   '#1f6feb',
      }
    },
  },
  plugins: [],
}