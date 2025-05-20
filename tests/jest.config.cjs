// tests/jest.config.cjs
module.exports = {
  verbose: true,
  testMatch: ['**/tests/integration/**/*.cjs'],
  testPathIgnorePatterns: ['/node_modules/'],
  globalSetup: './tests/setup.cjs',
  globalTeardown: './tests/teardown.cjs'
};