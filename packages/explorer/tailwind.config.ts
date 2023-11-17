import type { Config } from 'tailwindcss'
import { fontFamily as _fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#111316',
        secondary: '#21272D',
        container: '#1D2127',
        outline: '#78838e',
        accent: '#fb0',
        lightaccent: '#FFE395',
        lightgreen: '#9AE6B4',
      },
      fontFamily: {
        sans: ['Inter', ..._fontFamily.sans],
      },
      screens: {
        xl: { max: '1200px' },
        lg: { min: '767px', max: '1024px' },
        md: { min: '479px', max: '768px' },
        sm: { max: '480px' },
      },
    },
  },
  plugins: [],
}
export default config
