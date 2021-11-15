module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  customSyntax: '@stylelint/postcss-css-in-js',
  rules: {
    'font-family-name-quotes': 'always-where-recommended',
    'value-keyword-case': null,
    'alpha-value-notation': 'number',
  },
};
