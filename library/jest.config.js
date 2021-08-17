const common = {
  preset: 'ts-jest',
  automock: false,
  coveragePathIgnorePatterns: ['test', 'dist', 'src/encryption/providers'],
};

module.exports = {
  projects: [
    {
      ...common,
      displayName: 'jsdom',
      testEnvironment: './test/setup/JSDOMExtendedEnvironment.js',
    },
    {
      ...common,
      displayName: 'node',
      testEnvironment: 'node',
    },
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      lines: 80,
      functions: 80,
    },
  },
};
