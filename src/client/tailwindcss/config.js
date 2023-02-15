import tailwind from 'tailwindcss';
import typography from '@tailwindcss/typography';
import overrideTypography from './typography.js';

const config = tailwind({
  content: ['./src/client/**/*.{jsx,tsx}'],
  safelist: [{ pattern: /(leading|animate)-./ }, { pattern: /bg-(sky|gray|white|black)-(300|500|700)/, variants: ['hover', 'active'] }],
  plugins: [typography()],
  theme: {
    fontFamily: {
      sans: [
        '"Noto Sans"',
        '"Times New Roman"',
        '"Noto Color Emoji"',
        '"Font Awesome 5 Free"',
        '"Noto Sans CJK SC"',
        '"PingFang SC"',
        '"Microsoft Yahei"',
        '"sans-serif"',
      ],
    },
    ...overrideTypography,
  },
});

export default config;
