import type { BasisTheoryElementsInternal } from '@/types/elements';

type Config = {
  headers?: Record<string, string>;
};

type MethodWithPayloads = 'post' | 'put' | 'patch';
type MethodWithoutPayloads = 'get' | 'delete';

class NoElementsError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'NoElementsError';
  }
}

const makeRequestWithElementsCheck = (
  elements: BasisTheoryElementsInternal | undefined,
  method: MethodWithPayloads,
  url: string,
  payload: unknown,
  config: Config = {}
): Promise<unknown> => {
  if (elements?.hasElement(payload)) {
    return elements.client[method](url, payload, config);
  }

  let errorMessageStart = 'Element not found in payload';

  if (elements) {
    errorMessageStart = 'Element not initialized';
  }

  throw new NoElementsError(
    `${errorMessageStart}. Use a regular HTTP client if no elements are needed.`
  );
};

const makeRequestWithoutElementsCheck = (
  elements: BasisTheoryElementsInternal | undefined,
  method: MethodWithoutPayloads,
  url: string,
  config: Config = {}
): Promise<unknown> => {
  if (elements) {
    return elements.client[method](url, config);
  }

  throw new NoElementsError(
    'Elements not initialized. Use a regular HTTP client if no elements are needed.'
  );
};

export {
  Config,
  makeRequestWithElementsCheck,
  makeRequestWithoutElementsCheck,
};
