/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        dark: '#111827'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

