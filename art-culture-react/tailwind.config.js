/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#F7F6F3',
        'bg-secondary': '#EBE7E0',
        'text-primary': '#1A2332',
        'text-secondary': '#4A5568',
        'accent': '#2B4C7E',
        'accent-light': '#3A6BA5',
        'highlight': '#B87333',
        'highlight-light': '#D4956A',
        'teal': '#3D6B6A',
        'teal-light': '#5A8F8E',
        'gold': '#C4A35A',
        'gold-light': '#DBC98A',
        'border': '#D8D3CA',
        'surface': '#FFFFFF',
        // Keep old names for backward compatibility
        'rice-paper': '#F7F6F3',
        'ink-black': '#1A2332',
        'sepia': '#2B4C7E',
        'cinnabar': '#B87333',
        'bamboo-green': '#3D6B6A',
        'scroll-yellow': '#DBC98A',
        'ink-wash': '#EBE7E0',
      },
      fontFamily: {
        'sans': ['Noto Sans SC', 'system-ui', 'sans-serif'],
        'serif': ['Noto Serif SC', 'Georgia', 'serif'],
        'display': ['Noto Serif SC', 'Georgia', 'serif'],
        'title': ['Noto Serif SC', 'Georgia', 'serif'],
        'body': ['Noto Sans SC', 'system-ui', 'sans-serif'],
      },
    }
  },
  plugins: [],
}
