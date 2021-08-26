// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BasisTheoryElements {}

export interface BasisTheoryElementsInit extends BasisTheoryElements {
  init: (
    apiKey: string,
    elementsBaseUrl: string
  ) => Promise<BasisTheoryElements>;
}
