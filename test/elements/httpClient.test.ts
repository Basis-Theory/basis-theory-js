import { Chance } from 'chance';

describe('elements http client', () => {
  const chance = new Chance();
  let BtElementImport: any;

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe('elements http client requests without element payloads (get, delete)', () => {
    let mockGet: jest.Mock,
      mockDelete: jest.Mock,
      mockGetResponse: string,
      mockDeleteResponse: string;

    describe('elements has not been initialized', () => {
      beforeEach(async () => {
        jest.mock('@/elements', () => ({
          ...jest.requireActual('@/elements'),
          loadElements: jest.fn().mockReturnValue({
            init: jest.fn().mockResolvedValue({}),
          }),
        }));
        const { BasisTheory } = await import('@/BasisTheory');

        BtElementImport = BasisTheory;
      });

      test('should throw NoElementsError', async () => {
        const btElements = await new BtElementImport().init(chance.string());
        const expectedUrl = chance.url();
        const expectedConfig = {
          [chance.string()]: chance.string(),
        };

        expect(() => btElements.get(expectedUrl, expectedConfig)).toThrow(
          'Elements not initialized. Use a regular HTTP client if no elements are needed.'
        );

        expect(() => btElements.delete(expectedUrl, expectedConfig)).toThrow(
          'Elements not initialized. Use a regular HTTP client if no elements are needed.'
        );
      });
    });

    describe('elements has been initialized', () => {
      beforeEach(async () => {
        mockGetResponse = chance.string();
        mockDeleteResponse = chance.string();
        mockGet = jest.fn().mockResolvedValue(mockGetResponse);
        mockDelete = jest.fn().mockResolvedValue(mockDeleteResponse);

        jest.mock('@/elements', () => ({
          ...jest.requireActual('@/elements'),
          loadElements: jest.fn().mockReturnValue({
            client: {
              get: mockGet,
              delete: mockDelete,
            },
            init: jest.fn().mockResolvedValue({}),
            hasElement: jest.fn().mockReturnValue(true),
          }),
        }));
        const { BasisTheory } = await import('@/BasisTheory');

        BtElementImport = BasisTheory;
      });

      test('should delegate http client request method to elements', async () => {
        const btElements = await new BtElementImport().init(chance.string(), {
          elements: true,
        });
        const expectedUrl = chance.url();
        const expectedConfig = {
          [chance.string()]: chance.string(),
        };

        const getResponse = await btElements.get(expectedUrl, expectedConfig);

        expect(mockGet).toHaveBeenCalledTimes(1);
        expect(mockGet).toHaveBeenCalledWith(expectedUrl, expectedConfig);
        expect(getResponse).toStrictEqual(mockGetResponse);

        const deleteResponse = await btElements.delete(
          expectedUrl,
          expectedConfig
        );

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(expectedUrl, expectedConfig);
        expect(deleteResponse).toStrictEqual(mockDeleteResponse);
      });
    });
  });

  describe('elements http client requests with element payloads (post, put, patch)', () => {
    let mockPost: jest.Mock,
      mockPut: jest.Mock,
      mockPatch: jest.Mock,
      mockPostResponse: string,
      mockPutResponse: string,
      mockPatchResponse: string;

    describe('elements exists on payload', () => {
      beforeEach(async () => {
        mockPostResponse = chance.string();
        mockPutResponse = chance.string();
        mockPatchResponse = chance.string();
        mockPost = jest.fn().mockResolvedValue(mockPostResponse);
        mockPut = jest.fn().mockResolvedValue(mockPutResponse);
        mockPatch = jest.fn().mockResolvedValue(mockPatchResponse);

        jest.mock('@/elements', () => ({
          ...jest.requireActual('@/elements'),
          loadElements: jest.fn().mockReturnValue({
            client: {
              post: mockPost,
              put: mockPut,
              patch: mockPatch,
            },
            init: jest.fn().mockResolvedValue({}),
            hasElement: jest.fn().mockReturnValue(true),
          }),
        }));
        const { BasisTheory } = await import('@/BasisTheory');

        BtElementImport = BasisTheory;
      });

      test('should delegate http client request method with elements payload to elements', async () => {
        const btElements = await new BtElementImport().init(chance.string(), {
          elements: true,
        });
        const expectedUrl = chance.url();
        const expectedPayload = {
          [chance.string()]: chance.string(),
        };
        const expectedConfig = {
          [chance.string()]: chance.string(),
        };

        const postResponse = await btElements.post(
          expectedUrl,
          expectedPayload,
          expectedConfig
        );

        expect(mockPost).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledWith(
          expectedUrl,
          expectedPayload,
          expectedConfig
        );
        expect(postResponse).toStrictEqual(mockPostResponse);

        const patchResponse = await btElements.patch(
          expectedUrl,
          expectedPayload,
          expectedConfig
        );

        expect(mockPatch).toHaveBeenCalledTimes(1);
        expect(mockPatch).toHaveBeenCalledWith(
          expectedUrl,
          expectedPayload,
          expectedConfig
        );
        expect(patchResponse).toStrictEqual(mockPatchResponse);

        const putResponse = await btElements.put(
          expectedUrl,
          expectedPayload,
          expectedConfig
        );

        expect(mockPut).toHaveBeenCalledTimes(1);
        expect(mockPut).toHaveBeenCalledWith(
          expectedUrl,
          expectedPayload,
          expectedConfig
        );
        expect(putResponse).toStrictEqual(mockPutResponse);
      });
    });

    describe('elements does not exist on payload', () => {
      beforeEach(async () => {
        jest.mock('@/elements', () => ({
          ...jest.requireActual('@/elements'),
          loadElements: jest.fn().mockReturnValue({
            init: jest.fn().mockResolvedValue({}),
            hasElement: jest.fn().mockReturnValue(false),
          }),
        }));
        const { BasisTheory } = await import('@/BasisTheory');

        BtElementImport = BasisTheory;
      });

      test('should throw NoElementsError', async () => {
        const btElements = await new BtElementImport().init(chance.string(), {
          elements: true,
        });
        const expectedUrl = chance.url();
        const expectedPayload = {
          [chance.string()]: chance.string(),
        };
        const expectedConfig = {
          [chance.string()]: chance.string(),
        };

        expect(() =>
          btElements.post(expectedUrl, expectedPayload, expectedConfig)
        ).toThrow(
          'Element not found in payload. Use a regular HTTP client if no elements are needed.'
        );

        expect(() =>
          btElements.patch(expectedUrl, expectedPayload, expectedConfig)
        ).toThrow(
          'Element not found in payload. Use a regular HTTP client if no elements are needed.'
        );

        expect(() =>
          btElements.put(expectedUrl, expectedPayload, expectedConfig)
        ).toThrow(
          'Element not found in payload. Use a regular HTTP client if no elements are needed.'
        );
      });
    });

    describe('elements has not been initialized', () => {
      beforeEach(async () => {
        jest.mock('@/elements', () => ({
          ...jest.requireActual('@/elements'),
          loadElements: jest.fn().mockReturnValue({
            init: jest.fn().mockResolvedValue({}),
          }),
        }));
        const { BasisTheory } = await import('@/BasisTheory');

        BtElementImport = BasisTheory;
      });

      test('should throw NoElementsError', async () => {
        const btElements = await new BtElementImport().init(chance.string());
        const expectedUrl = chance.url();
        const expectedPayload = {
          [chance.string()]: chance.string(),
        };
        const expectedConfig = {
          [chance.string()]: chance.string(),
        };

        expect(() =>
          btElements.post(expectedUrl, expectedPayload, expectedConfig)
        ).toThrow(
          'Elements not initialized. Use a regular HTTP client if no elements are needed.'
        );

        expect(() =>
          btElements.patch(expectedUrl, expectedPayload, expectedConfig)
        ).toThrow(
          'Elements not initialized. Use a regular HTTP client if no elements are needed.'
        );

        expect(() =>
          btElements.put(expectedUrl, expectedPayload, expectedConfig)
        ).toThrow(
          'Elements not initialized. Use a regular HTTP client if no elements are needed.'
        );
      });
    });
  });
});
