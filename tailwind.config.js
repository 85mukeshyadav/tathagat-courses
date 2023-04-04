module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    keyframes: {
      wiggle: {
        '0%, 100%': { transform: 'translateY(-10px)' },
        '50%': { transform: 'translateY(12px)' },
      }
    }
  },
  plugins: [],
}