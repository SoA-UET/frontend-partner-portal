/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E40AF',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#1E40AF',
          700: '#1E3A8A',
          800: '#1E3A8A',
          900: '#1E3A8A',
        },
        background: '#F1F5F9',
        surface: '#FFFFFF',
        'text-main': '#1E293B',
        'text-muted': '#64748B',
        'status-success': '#10B981',
        'status-error': '#EF4444',
        'status-warning': '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['12px', { lineHeight: '20px' }],
        'base': ['14px', { lineHeight: '24px' }],
        'lg': ['16px', { lineHeight: '28px' }],
        'xl': ['18px', { lineHeight: '28px' }],
        '2xl': ['20px', { lineHeight: '32px' }],
        '3xl': ['24px', { lineHeight: '36px' }],
      },
      spacing: {
        '18': '72px',
        '22': '88px',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      maxWidth: {
        'sidebar': '260px',
      },
      gridTemplateColumns: {
        'dashboard': 'repeat(12, minmax(0, 1fr))',
      },
      gap: {
        'gutter': '24px',
      },
    },
  },
  plugins: [],
}
