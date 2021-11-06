function isThemeTag(tagName) {
  return tagName === 'Theme';
}

const defaultTheme = {
  fontSize: '2.2em',
  lineHeight: 1.8,
  letterSpacing: '3px',
  fontFamily:
    '"Noto Serif","Times New Roman", "Noto Color Emoji","Font Awesome 5 Free","Noto Serif CJK SC","PingFang SC","Microsoft Yahei",serif',
};

export { isThemeTag, defaultTheme };
