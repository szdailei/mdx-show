const override = {
  extend: {
    typography: {
      DEFAULT: {
        css: {
          '*:not(section,p,table)': {
            marginTop: '4px',
            marginBottom: '4px',
          },
          p: {
            marginTop: '14px',
            marginBottom: '14px',
          },
          table: { marginTop: '0', marginBottom: '0', width: 'max-content', lineHeight: 'inherit' },
          td: { paddingLeft: '17px', paddingRight: '17px', verticalAlign: 'inherit' },
          pre: { lineHeight: 'inherit' },
          code: { lineHeight: 'inherit' },
        },
      },
    },
  },
};

export default override;
