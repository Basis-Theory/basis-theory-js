const common = {
  preset: 'ts-jest',
  automock: false,
  setupFiles: ['./test/setup/setupJest.ts'],
};

module.exports = {
  projects: [
    {
      ...common,
      testEnvironment: './test/setup/JSDOMExtendedEnvironment.js',
    },
    {
      ...common,
      testEnvironment: 'node',
    },
  ],
};
