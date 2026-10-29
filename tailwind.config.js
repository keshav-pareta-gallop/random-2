/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          600: '#2563EB',
          700: '#1D4ED8',
        },
        destructive: {
          600: '#DC2626',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
