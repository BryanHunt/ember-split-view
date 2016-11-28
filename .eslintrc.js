module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  env: {
    'es6': true,
    'browser': true,
    'node': true
  },
  rules: {
    'arrow-parens': [2, 'always'],
    'func-names': 0,
    'no-use-before-define': [2, 'nofunc'],
    'prefer-arrow-callback': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'no-restricted-syntax': 0,
    "import/no-extraneous-dependencies": 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': [2, { "props": false }]
  }
};
