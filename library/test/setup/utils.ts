export const describeif = (condition: boolean): typeof describe =>
  condition ? describe : describe.skip;
