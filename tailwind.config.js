/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        iz: {
          orange: 'var(--iz-orange)',
          'orange-light': 'var(--iz-orange-light)',
          'orange-dark': 'var(--iz-orange-dark)',
          blue: 'var(--iz-blue)',
          'blue-light': 'var(--iz-blue-light)',
          cyan: 'var(--iz-cyan)',
          navy: 'var(--iz-navy)',
          deep: 'var(--iz-deep)',
          card: 'var(--iz-card)',
          gold: 'var(--iz-gold)',
          text: 'var(--iz-text)',
          muted: 'var(--iz-muted)',
          pitch: '#1A7A42',
          'pitch-light': '#2FA85A',
          'pitch-dark': '#0F5A30',
        },
      },
      fontFamily: {
        heading: ['Barlow Condensed', 'var(--font-heading)'],
        body: ['Nunito Sans', 'var(--font-body)'],
      },
      boxShadow: {
        'iz-orange': '0 0 24px rgba(255, 107, 26, 0.45)',
        'iz-blue': '0 0 20px rgba(0, 212, 255, 0.25)',
      },
    },
  },
  plugins: [],
}
