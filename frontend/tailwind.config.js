/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hello Kitty theme colors
        'kitty-pink': '#FFB6C1',
        'kitty-hot-pink': '#FF69B4',
        'kitty-white': '#FFFFFF',
        'kitty-red': '#FF1493',

        // Pokemon theme colors
        'poke-red': '#CC0000',
        'poke-blue': '#3B4CCA',
        'poke-yellow': '#FFDE00',
        'poke-gold': '#B3A125',

        // Neutral theme
        'neutral-primary': '#4F46E5',
        'neutral-secondary': '#7C3AED',
      },
      fontFamily: {
        'kitty': ['Comic Sans MS', 'cursive'],
        'pokemon': ['Flexo-Demi', 'Arial Black', 'sans-serif'],
        'neutral': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}