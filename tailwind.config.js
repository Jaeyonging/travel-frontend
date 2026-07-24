/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#14171c',
          800: '#232830',
          700: '#3a4049',
          500: '#6e7683',
          300: '#a6acb6',
          200: '#d6d9de',
          100: '#e9ebef',
          50: '#f5f6f8',
        },
        brand: {
          50: '#e9f6f6',
          100: '#cdeaea',
          200: '#a3d8da',
          300: '#6fbdc0',
          400: '#3a9ba3',
          500: '#0e7c86',
          600: '#0a6470',
          700: '#084f5a',
          900: '#04333c',
        },
        coral: {
          50: '#fff2ee',
          100: '#ffe0d6',
          300: '#ffa789',
          500: '#ff6b4a',
          600: '#e8543a',
        },
        sand: {
          50: '#fbf8f3',
          100: '#f5eee2',
          300: '#e6d5b8',
          500: '#c79a4b',
          700: '#8e6a26',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'Apple SD Gothic Neo',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,23,28,.04), 0 6px 20px -14px rgba(20,23,28,.35)',
        sheet: '0 -8px 40px -12px rgba(20,23,28,.22)',
        app: '0 0 80px rgba(20,23,28,.10)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(.22,1,.36,1)',
        'out-expo': 'cubic-bezier(.16,1,.3,1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'sheet-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'backdrop-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'backdrop-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'sheet-down': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'draw-line': {
          '0%': { strokeDashoffset: '900' },
          '100%': { strokeDashoffset: '0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        /* 상단 토스트 */
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(-130%) scale(.94)' },
          '60%': { opacity: '1' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'toast-out': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-130%) scale(.94)' },
        },
        /* 화면 전환 */
        'page-push': {
          '0%': { opacity: '0', transform: 'translate3d(30px,0,0)' },
          '100%': { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        'page-pop': {
          '0%': { opacity: '0', transform: 'translate3d(-30px,0,0)' },
          '100%': { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        'page-fade': {
          '0%': { opacity: '0', transform: 'translate3d(0,8px,0) scale(.994)' },
          '100%': { opacity: '1', transform: 'translate3d(0,0,0) scale(1)' },
        },
        /* 탭 아이콘 */
        'tab-pop': {
          '0%': { transform: 'scale(.82)' },
          '55%': { transform: 'scale(1.16)' },
          '100%': { transform: 'scale(1)' },
        },
        'badge-pop': {
          '0%': { transform: 'scale(.4)', opacity: '0' },
          '60%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up .4s cubic-bezier(.2,.7,.3,1) both',
        'sheet-up': 'sheet-up .34s cubic-bezier(.22,1,.36,1) both',
        'backdrop-in': 'backdrop-in .25s ease-out both',
        'backdrop-out': 'backdrop-out .24s ease-in both',
        'sheet-down': 'sheet-down .26s cubic-bezier(.4,0,1,1) both',
        'draw-line': 'draw-line 1.3s ease-out both',
        float: 'float 3s ease-in-out infinite',
        'toast-in': 'toast-in .42s cubic-bezier(.16,1,.3,1) both',
        'toast-out': 'toast-out .26s cubic-bezier(.4,0,1,1) both',
        'page-push': 'page-push .3s cubic-bezier(.22,1,.36,1)',
        'page-pop': 'page-pop .3s cubic-bezier(.22,1,.36,1)',
        'page-fade': 'page-fade .26s cubic-bezier(.22,1,.36,1)',
        'tab-pop': 'tab-pop .4s cubic-bezier(.22,1,.36,1)',
        'badge-pop': 'badge-pop .35s cubic-bezier(.22,1,.36,1)',
      },
    },
  },
  plugins: [],
}
