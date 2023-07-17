import type { BasisTheoryElementsInternal } from '@/types/elements';
import type { RequestConfig } from '@/types/sdk/services';

type MethodWithPayloads = 'post' | 'put' | 'patch';
type MethodWithoutPayloads = 'get' | 'delete';

class NoElementsError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'NoElementsError';
  }
}

const makeRequestWithElementsPayloadCheck = (
  elements: BasisTheoryElementsInternal | undefined,
  method: MethodWithPayloads,
  url: string,
  payload: unknown,
  config: RequestConfig = {}
): Promise<unknown> => {
  if (elements?.hasElement(payload)) {
    return elements.client[method](url, payload, config);
  }

  let errorMessageStart = 'Elements not initialized.';

  if (elements) {
    errorMessageStart = 'Element not found in payload.';
  }

  throw new NoElementsError(
    `${errorMessageStart} Use a regular HTTP client if no elements are needed.`
  );
};

const makeRequestWithoutElementsPayloadCheck = (
  elements: BasisTheoryElementsInternal | undefined,
  method: MethodWithoutPayloads,
  url: string,
  config: RequestConfig = {}
): Promise<unknown> => {
  if (elements) {
    return elements.client[method](url, config);
  }

  throw new NoElementsError(
    'Elements not initialized. Use a regular HTTP client if no elements are needed.'
  );
};

export {
  makeRequestWithElementsPayloadCheck,
  makeRequestWithoutElementsPayloadCheck,
};
