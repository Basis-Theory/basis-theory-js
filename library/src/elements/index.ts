// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BasisTheoryElements {}

interface BasisTheoryElementsInit extends BasisTheoryElements {
  init: (
    apiKey: string,
    elementsBaseUrl: string
  ) => Promise<BasisTheoryElements>;
}

export { BasisTheoryElements, BasisTheoryElementsInit };
