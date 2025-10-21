/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Indian Government Color Palette
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        orange: {
          500: '#f97316',
          600: '#ea580c',
        },
        green: {
          500: '#10b981',
          600: '#059669',
        },
        saffron: '#ff9933',
        indiaGreen: '#138808',
        navyBlue: '#000080',
      },
      fontFamily: {
        'hindi': ['Noto Sans Devanagari', 'sans-serif'],
        'english': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

