/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // "white"/"black" follow the theme: warm paper & ink in light mode, pure white/black in dark mode
        white: 'rgb(var(--c-white) / <alpha-value>)',
        black: 'rgb(var(--c-black) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
      },
      keyframes: {
        'orbit-dash': { to: { strokeDashoffset: '-120' } },
      },
      animation: {
        'orbit-dash': 'orbit-dash 6s linear infinite',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
