const common = {
  preset: 'ts-jest',
  automock: false,
  setupFiles: ['<rootDir>/test/setup/setupJest.ts'],
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
};
