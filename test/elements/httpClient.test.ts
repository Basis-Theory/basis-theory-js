import { Chance } from 'chance';

describe('elements http client requests with element payloads (post, put, patch, get, delete)', () => {
  const chance = new Chance();

  let mockPost: jest.Mock,
    mockPut: jest.Mock,
    mockPatch: jest.Mock,
    mockGet: jest.Mock,
    mockDelete: jest.Mock,
    mockPostResponse: string,
    mockPutResponse: string,
    mockPatchResponse: string,
    expectationsMap: any,
    elements: any;

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    mockPostResponse = chance.string();
    mockPutResponse = chance.string();
    mockPatchResponse = chance.string();

    mockPost = jest.fn().mockResolvedValue(mockPostResponse);
    mockPut = jest.fn().mockResolvedValue(mockPutResponse);
    mockPatch = jest.fn().mockResolvedValue(mockPatchResponse);
    mockGet = jest.fn();
    mockDelete = jest.fn();

    const elementsModule = (jest.requireActual(
      '@/elements'
    ) as unknown) as Record<string, unknown>;

    jest.mock('@/elements', () => ({
      ...elementsModule,
      loadElements: jest.fn().mockReturnValue({
        client: {
          post: mockPost,
          put: mockPut,
          patch: mockPatch,
          get: mockGet,
          delete: mockDelete,
        },
        init: jest.fn().mockResolvedValue({}),
        hasElement: jest.fn().mockReturnValue(true),
      }),
    }));

    const { BasisTheory } = await import('@/BasisTheory');

    elements = await new BasisTheory().init(chance.string(), {
      elements: true,
    });

    expectationsMap = {
      post: {
        fn: mockPost,
        response: mockPostResponse,
      },
      put: {
        fn: mockPut,
        response: mockPutResponse,
      },
      patch: {
        fn: mockPatch,
        response: mockPatchResponse,
      },
      get: {
        fn: mockGet,
      },
      delete: {
        fn: mockDelete,
      },
    };
  });

  test.each(['post', 'put', 'patch'])('calls %s', async (method) => {
    const expectedUrl = chance.url();
    const expectedPayload = {
      [chance.string()]: chance.string(),
    };
    const expectedConfig = {
      [chance.string()]: chance.string(),
    };

    const response = await elements.client[method](
      expectedUrl,
      expectedPayload,
      expectedConfig
    );

    expect(expectationsMap[method].fn).toHaveBeenCalledTimes(1);
    expect(expectationsMap[method].fn).toHaveBeenCalledWith(
      expectedUrl,
      expectedPayload,
      expectedConfig
    );
    expect(response).toStrictEqual(expectationsMap[method].response);
  });

  test.each(['get', 'delete'])('calls %s', async (method) => {
    const expectedUrl = chance.url();

    const expectedConfig = {
      [chance.string()]: chance.string(),
    };

    await elements.client[method](expectedUrl, expectedConfig);

    expect(expectationsMap[method].fn).toHaveBeenCalledTimes(1);

    expect(expectationsMap[method].fn).toHaveBeenCalledWith(
      expectedUrl,
      expectedConfig
    );
  });
});

describe('http client error handling/warnings', () => {
  const chance = new Chance();

  let BasisTheoryClient;

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const { BasisTheory } = await import('@/BasisTheory');

    BasisTheoryClient = BasisTheory;
  });

  test('http client returns undefined when elements are not initialized', async () => {
    const btClient = await new BasisTheoryClient().init(chance.string());

    expect(btClient.client).toBeUndefined();
  });

  test('logs error to console when trying to use client with elements not initialized', async () => {
    const consoleErrorMock = jest.spyOn(console, 'error');

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    consoleErrorMock.mockImplementation(() => {});

    const btClient = await new BasisTheoryClient().init(chance.string());

    expect(btClient.client).toBeUndefined();

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith(
      'Elements are not initialized. Either initialize elements or use a regular HTTP client if no elements are needed.'
    );

    consoleErrorMock.mockRestore();
  });
});
