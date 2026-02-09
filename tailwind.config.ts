import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCFA',
          100: '#F9F7F1',
          200: '#F5F1E8',
          300: '#EDE7D9',
        },
        gray: {
          800: '#2D3748',
          900: '#1A202C',
        },
      },
      fontFamily: {
        serif: ['Merriweather', 'Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      lineHeight: {
        'relaxed': '1.8',
      },
    },
  },
  plugins: [],
}
export default config
