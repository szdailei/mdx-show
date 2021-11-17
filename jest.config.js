const config = {
  moduleFileExtensions: ['js', 'jsx', 'mjs'],
  transform: {},
  testMatch: ['**/test/short-test/**/*.(spec|test).(js|mjs|ts|tsx)'],
  testPathIgnorePatterns: ['node_modules/', 'dist/', 'pdfs/', 'report/'],
  reporters: ['default', ['jest-html-reporters', { publicPath: 'reports' }]],
  verbose: false,
};

export default config;
