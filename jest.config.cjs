/* eslint-env node */
module.exports = {
  rootDir: process.cwd(),
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transformIgnorePatterns: [],
  testEnvironment: 'jsdom',
  transform: {
    '.*\\.(tsx?|jsx?)$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
          parser: {
            syntax: 'typescript',
            tsx: false,
            decorators: true,
            dynamicImport: false,
          },
          transform: {
            hidden: {
              jest: true,
            },
          },
        },
        module: {
          type: 'commonjs',
          strict: false,
          strictMode: true,
          lazy: false,
          noInterop: false,
        },
      },
    ],
  },
};
