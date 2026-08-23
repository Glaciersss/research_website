/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rice-paper': '#f5f0e6',
        'ink-black': '#1a1a1a',
        'sepia': '#704214',
        'cinnabar': '#c1272d',
        'bamboo-green': '#7d8471',
        'scroll-yellow': '#e8d9a9',
        'ink-wash': '#d9c9b4',
      },
      fontFamily: {
        'sans': ['Noto Sans SC', 'sans-serif'],
        'serif': ['Times New Roman', 'Noto Serif SC', 'serif'],
        'display': ['Ma Shan Zheng', 'cursive'],
        'title': ['Futura', 'Trebuchet MS', 'Ma Shan Zheng', 'cursive'],
      },
      backgroundImage: {
        'ink-wash-bg': "url('https://p9-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/3485e18b22fe4d5e91205b69ecb95afc~tplv-a9rns2rl98-image.image?rcl=20251026135537B60115FDD75F0328FA88&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1764050163&x-signature=jP5zKu8iWLdYfyLzwKYSmYJSCOA%3D')",
      }
    }
  },
  plugins: [],
}
