/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx,jsx,js}', './index.html'],
  theme: {
    extend: {
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
      },
      animation: {
        flip: 'flip 0.6s ease-in-out',
      },
    },
  },
  plugins: [],
};
