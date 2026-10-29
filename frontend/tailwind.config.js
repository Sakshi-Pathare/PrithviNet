/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        prithvi: {
          beige: '#F5F2EB',
          beigeDark: '#EFECE4',
          parchment: '#FAF8F5',
          cream: '#FFFFFF',
          sage: '#7C9D8E',
          sageDark: '#587B6C',
          sageLight: '#E8EFEA',
          sageMid: '#A8C4B8',
          forest: '#2C4A3E',
          forestLight: '#3D6254',
          stone: '#8C857B',
          border: '#E2DDD1',
          borderLight: '#ECE7DC',
          // Map dark teal from user image
          mapDark: '#0F2020',
          mapMid: '#162D2D',
          mapTeal: '#1B3A3A',
          mapLight: '#1F4040',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(44, 74, 62, 0.06)',
        'soft-md': '0 8px 30px -4px rgba(44, 74, 62, 0.1)',
        'sage': '0 4px 16px rgba(88, 123, 108, 0.3)',
        'sage-lg': '0 8px 32px rgba(88, 123, 108, 0.35)',
        'glass': '0 8px 32px rgba(44, 74, 62, 0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
        'glass-hover': '0 16px 48px rgba(44, 74, 62, 0.14), inset 0 1px 0 rgba(255,255,255,0.7)',
        'glow-sage': '0 0 20px rgba(124, 157, 142, 0.4)',
        'map-pin': '0 4px 16px rgba(0,0,0,0.4)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-6px) rotate(1deg)' },
          '66%': { transform: 'translateY(-3px) rotate(-1deg)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-scale': {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'ticker-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: '0.5' },
          '40%': { transform: 'scale(1.2)', opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(124,157,142,0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(124,157,142,0.6)' },
        },
        'map-ripple': {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(3)', opacity: '0' },
        },
        'scan-line': {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.4s ease-out both',
        'fade-scale': 'fade-scale 0.35s ease-out both',
        'ticker-scroll': 'ticker-scroll 30s linear infinite',
        'bounce-dot': 'bounce-dot 1.4s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
        'map-ripple': 'map-ripple 2.5s ease-out infinite',
        'scan-line': 'scan-line 3s linear infinite',
      },
      backgroundImage: {
        'sage-gradient': 'linear-gradient(135deg, #7C9D8E 0%, #587B6C 100%)',
        'forest-gradient': 'linear-gradient(135deg, #2C4A3E 0%, #1A2E28 100%)',
        'warm-gradient': 'linear-gradient(135deg, #F5F2EB 0%, #EFECE4 100%)',
        'glass-light': 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)',
        'shimmer-bg': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      }
    },
  },
  plugins: [],
}
