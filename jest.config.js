const config = {
  moduleFileExtensions: ['js', 'jsx', 'mjs'],
  transform: {},
  testRegex: '(/__tests__/.*|(\\.|/)(spec))\\.(jsx?|js?|tsx?|ts?|mjs?)$',
  testPathIgnorePatterns: ['node_modules/', 'dist/','pdfs/','report/'],
  reporters: ['default', ['jest-html-reporters', { publicPath: 'reports' }]],
  verbose: false,
};

export default config;
