export default {
  // Let's stop at first error
  bail: 1,

  // We check code coverage as a hint to the health of our test suite.
  collectCoverage: true,
  coverageReporters: ['html', 'text-summary'],

  // We will test DOM stuff for sure
  testEnvironment: 'jsdom',
  testURL: 'http://localhost:8888',

  // Enable some usefull matching extensions
  setupFilesAfterEnv: [
    'jest-extended', // https://github.com/jest-community/jest-extended#readme
    '@testing-library/jest-dom', // https://github.com/testing-library/jest-dom#readme
    '<rootDir>/jest.setup.js'
  ]
}
