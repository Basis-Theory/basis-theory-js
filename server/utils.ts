export const mask = (word: string, lastPlain = 0): string =>
  word.substring(0, word.length - lastPlain).replace(/./gi, '*') +
  word.substring(word.length - lastPlain);
