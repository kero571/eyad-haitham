/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F6EEDF', sand: '#EADBC0', gold: '#E9C98B', caramel: '#B98A5B',
        cocoa: '#6B4A33', espresso: '#2A1B12', mocha: '#4A3A2E', ink: '#1E140D',
      },
      fontFamily: {
        signature: ['var(--font-signature)', 'cursive'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
    },
  },
  plugins: [],
};
