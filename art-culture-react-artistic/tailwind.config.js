/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bright backgrounds
        'cream': '#faf7f2',
        'warm-gray': '#f0ece6',
        'surface': '#ffffff',

        // Text
        'ink': '#2d2926',
        'stone': '#6e6862',
        'ash': '#a09a94',

        // Accents - bright, modern
        'coral': '#e8785a',
        'coral-light': '#f4a88e',
        'teal-accent': '#5d9e8f',
        'teal-light': '#8fc4b8',
        'gold-accent': '#c9a452',
        'gold-light': '#e0cc88',
        'blue-accent': '#5e8ab8',
        'blue-light': '#8db4d8',

        // Soft dark (for sections needing contrast)
        'soft-dark': '#1e2630',
        'soft-darker': '#171e26',

        // Keep compatibility aliases
        'rice-paper': '#faf7f2',
        'ink-black': '#2d2926',
        'sepia': '#5e8ab8',
        'cinnabar': '#e8785a',
        'bamboo-green': '#5d9e8f',
        'scroll-yellow': '#e0cc88',
        'ink-wash': '#f0ece6',

        // Legacy aliases
        'bg-primary': '#faf7f2',
        'bg-secondary': '#f0ece6',
        'accent': '#5e8ab8',
        'accent-light': '#8db4d8',
        'highlight': '#e8785a',
        'highlight-light': '#f4a88e',
        'teal': '#5d9e8f',
        'gold': '#c9a452',
        'border': '#e0dbd4',
      },
      fontFamily: {
        'sans': ['Noto Sans SC', 'system-ui', 'sans-serif'],
        'serif': ['Noto Serif SC', 'Georgia', 'serif'],
        'display': ['Noto Serif SC', 'Georgia', 'serif'],
        'title': ['Noto Serif SC', 'Georgia', 'serif'],
        'body': ['Noto Sans SC', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #5e8ab8, #8db4d8)',
        'warm-gradient': 'linear-gradient(135deg, #e8785a, #f4a88e)',
        'teal-gradient': 'linear-gradient(135deg, #5d9e8f, #8fc4b8)',
        'gold-gradient': 'linear-gradient(135deg, #c9a452, #e0cc88)',
        'hero-overlay': 'linear-gradient(180deg, rgba(45,41,38,0.5) 0%, rgba(45,41,38,0.2) 50%, rgba(250,247,242,0.98) 100%)',
        'glass-shine': 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
        'soft-dark-gradient': 'linear-gradient(180deg, #3a4450 0%, #2d353c 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(45,41,38,0.06)',
        'glass-lg': '0 16px 48px rgba(45,41,38,0.1)',
        'glow': '0 0 40px rgba(232,120,90,0.12)',
        'glow-teal': '0 0 40px rgba(93,158,143,0.12)',
        'glow-blue': '0 0 40px rgba(94,138,184,0.12)',
        'card': '0 2px 16px rgba(45,41,38,0.04)',
        'card-hover': '0 8px 32px rgba(45,41,38,0.08)',
      },
    },
  },
  plugins: [],
}
