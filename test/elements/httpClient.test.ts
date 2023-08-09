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
    mocks: any,
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

    mocks = {
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

    expect(mocks[method].fn).toHaveBeenCalledTimes(1);
    expect(mocks[method].fn).toHaveBeenCalledWith(
      expectedUrl,
      expectedPayload,
      expectedConfig
    );
    expect(response).toStrictEqual(mocks[method].response);
  });

  test.each(['get', 'delete'])('calls %s', async (method) => {
    const expectedUrl = chance.url();

    const expectedConfig = {
      [chance.string()]: chance.string(),
    };

    await elements.client[method](expectedUrl, expectedConfig);

    expect(mocks[method].fn).toHaveBeenCalledTimes(1);

    expect(mocks[method].fn).toHaveBeenCalledWith(expectedUrl, expectedConfig);
  });
});
