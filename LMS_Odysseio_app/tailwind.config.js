/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          start: '#7C3AED',
          mid: '#4F46E5',
          end: '#2563EB',
        },
        bg: {
          primary: '#F8FAFF',
          surface: '#FFFFFF',
        }
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #2563EB 100%)',
      }
    },
  },
  plugins: [],
}
