const override = {
  extend: {
    typography: {
      DEFAULT: {
        css: {
          '*:not(section,p)': {
            marginTop: '4px',
            marginBottom: '4px',
          },
          p: {
            marginTop: '14px',
            marginBottom: '14px',
          },
          table: { width: 'max-content' },
          td: { paddingLeft: '17px', paddingRight: '17px' },
          pre: { lineHeight: 'inherit' },
          code: { lineHeight: 'inherit' },
        },
      },
    },
  },
};

export default override;
