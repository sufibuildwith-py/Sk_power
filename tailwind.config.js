/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        solar: {
          slate: '#849EAD',
          ink: '#172A36',
          charcoal: '#243642',
          ivory: '#F7F5EF',
          silver: '#DCE5E9',
          amber: '#E9AD59',
          'amber-glow': 'rgba(233, 173, 89, 0.25)',
          sky: '#8FA4B4',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Manrope', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      letterSpacing: {
        'tightest': '-0.035em',
        'tighter': '-0.025em',
        'wide-editorial': '0.18em',
        'wider-editorial': '0.24em',
      },
      backdropBlur: {
        'glass': '16px',
        'glass-subtle': '10px',
      },
      boxShadow: {
        'glass-subtle': '0 8px 32px 0 rgba(16, 30, 40, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.25)',
        'glass-glow': '0 12px 40px -10px rgba(23, 42, 54, 0.15), 0 0 20px -2px rgba(233, 173, 89, 0.15)',
        'pill': '0 4px 20px rgba(23, 42, 54, 0.18)',
      },
    },
  },
  plugins: [],
};
