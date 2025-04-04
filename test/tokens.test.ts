import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import {
  API_KEY_HEADER,
  BT_IDEMPOTENCY_KEY_HEADER,
  BT_TRACE_ID_HEADER,
  CONTENT_TYPE_HEADER,
  transformTokenRequestSnakeCase,
} from '@/common';
import type {
  CreateToken,
  TokenEnrichments,
  Token,
  TokenType,
  UpdateToken,
} from '@/types/models';
import {
  DATA_CLASSIFICATIONS,
  DATA_IMPACT_LEVELS,
  DATA_RESTRICTION_POLICIES,
} from '@/types/models';
import {
  enrichmentCardBrands,
  enrichmentFundingTypes,
} from '@/types/models/card-details';
import type {
  BasisTheory as IBasisTheory,
  PaginatedList,
  ListTokensQuery,
  SearchTokensRequest,
} from '@/types/sdk';
import {
  errorStatus,
  expectBasisTheoryApiError,
  mockServiceClient,
  testCreate,
  testDelete,
  testList,
} from './setup/utils';

describe('Tokens', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.tokens);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  const getEnrichments = (): TokenEnrichments => ({
    binDetails: {
      cardBrand: chance.string(),
      type: chance.string(),
      prepaid: chance.bool(),
      cardSegmentType: chance.string(),
      reloadable: chance.bool(),
      panOrToken: chance.string(),
      accountUpdater: chance.bool(),
      alm: chance.bool(),
      domesticOnly: chance.bool(),
      gamblingBlocked: chance.bool(),
      level2: chance.bool(),
      level3: chance.bool(),
      issuerCurrency: chance.string(),
      comboCard: chance.string(),
      binLength: chance.integer(),
      authentication: [],
      cost: [],
      bank: {
        name: chance.string(),
        phone: chance.string(),
        url: chance.string(),
        cleanName: chance.string(),
      },
      country: {
        alpha2: chance.string(),
        name: chance.string(),
        numeric: chance.string(),
      },
      product: {
        code: chance.string(),
        name: chance.string(),
      },
    },
    cardDetails: {
      bin: chance.string(),
      last4: chance.string(),
      expirationMonth: chance.integer(),
      expirationYear: chance.integer(),
      brand: chance.pickone([...enrichmentCardBrands]),
      funding: chance.pickone([...enrichmentFundingTypes]),
      authentication: chance.string(),
    },
  });

  describe('retrieve', () => {
    test('should retrieve', async () => {
      const id = chance.string();
      const fingerprint = chance.string();
      const tenantId = chance.string();
      const type = chance.string() as TokenType;
      const containers = [`/${chance.string()}/`];
      const enrichments = getEnrichments();

      const data = {
        camelCaseParameter: chance.string(),
        snake_case_parameter: chance.string(),
      };
      const metadata = {
        camelCaseParameter: chance.string(),
        snake_case_parameter: chance.string(),
      };

      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();

      client.onGet(id).reply(
        200,

        JSON.stringify({
          id,
          tenant_id: tenantId,
          fingerprint,
          type,
          data,
          metadata,
          containers,
          enrichments,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
      );

      expect(await bt.tokens.retrieve(id)).toStrictEqual({
        id,
        tenantId,
        fingerprint,
        type,
        data,
        metadata,
        containers,
        enrichments,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });
      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    test('should retrieve with options', async () => {
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const idempotencyKey = chance.string();
      const id = chance.string();
      const tenantId = chance.string();
      const fingerprint = chance.string();
      const type = chance.string() as TokenType;
      const data = chance.string();
      const containers = [`/${chance.string()}/`];
      const enrichments = getEnrichments();
      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();

      client.onGet().reply(
        200,

        JSON.stringify({
          id,
          tenant_id: tenantId,
          fingerprint,
          type,
          data,
          containers,
          enrichments,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
      );

      expect(
        await bt.tokens.retrieve(id, {
          apiKey: _apiKey,
          correlationId,
          idempotencyKey,
        })
      ).toStrictEqual({
        id,
        tenantId,
        fingerprint,
        type,
        data,
        containers,
        enrichments,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });
      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].url).toStrictEqual(`/${id}`);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
        [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const id = chance.string();
      const status = errorStatus();

      client.onGet(id).reply(status);

      const promise = bt.tokens.retrieve(id);

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('create', () => {
    const _chance = new Chance();

    const createPayload: CreateToken = {
      id: _chance.string(),
      type: 'token',
      data: {
        camelCaseParameter: _chance.string(),
        snake_case_parameter: _chance.string(),
      },
      privacy: {
        impactLevel: _chance.pickone([...DATA_IMPACT_LEVELS]),
        classification: _chance.pickone([...DATA_CLASSIFICATIONS]),
        restrictionPolicy: _chance.pickone([...DATA_RESTRICTION_POLICIES]),
      },
      metadata: {
        camelCaseParameter: _chance.string(),
        snake_case_parameter: _chance.string(),
      },
      searchIndexes: [_chance.string(), _chance.string()],
      fingerprintExpression: _chance.string(),
      deduplicateToken: _chance.bool(),
      mask: _chance.string(),
      expiresAt: _chance.date().toString(),
    };

    testCreate(() => ({
      service: bt.tokens,
      client,
      createPayload,
      transformedCreatePayload: transformTokenRequestSnakeCase(createPayload),
    }));
  });

  describe('update', () => {
    const _chance = new Chance();
    const expectedContentType = 'application/merge-patch+json';

    test('should update a token', async () => {
      const id = _chance.guid();

      const updatePayload: UpdateToken = {
        data: {
          camelCaseParameter: _chance.string(),
          snake_case_parameter: _chance.string(),
        },
        privacy: {
          impactLevel: _chance.pickone([...DATA_IMPACT_LEVELS]),
          restrictionPolicy: _chance.pickone([...DATA_RESTRICTION_POLICIES]),
        },
        containers: [`/${chance.string()}/`],
        encryption: {
          cek: {
            key: _chance.string(),
            alg: _chance.string(),
          },
          kek: {
            key: _chance.string(),
            alg: _chance.string(),
          },
        },
        expiresAt: _chance.date().toString(),
        metadata: {
          camelCaseParameter: _chance.string(),
          snake_case_parameter: _chance.string(),
        },
        searchIndexes: [_chance.string(), _chance.string()],
        fingerprintExpression: _chance.string(),
        deduplicateToken: _chance.bool(),
        mask: _chance.string(),
      };

      const updatedToken: Omit<Token, 'data'> = {
        id,
        type: 'token',
        tenantId: chance.guid(),
        privacy: {
          impactLevel: _chance.pickone([...DATA_IMPACT_LEVELS]),
          restrictionPolicy: _chance.pickone([...DATA_RESTRICTION_POLICIES]),
        },
        containers: [`/${chance.string()}/`],
        enrichments: getEnrichments(),
        searchIndexes: [_chance.string(), _chance.string()],
        fingerprintExpression: _chance.string(),
        mask: _chance.string(),
      };

      client.onPatch().reply(204, JSON.stringify(updatedToken));

      expect(await bt.tokens.update(id, updatePayload)).toStrictEqual(
        updatedToken
      );

      expect(client.history.patch).toHaveLength(1);
      expect(client.history.patch[0].data).toStrictEqual(
        JSON.stringify(transformTokenRequestSnakeCase(updatePayload))
      );
      expect(client.history.patch[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
        [CONTENT_TYPE_HEADER]: expectedContentType,
      });
    });

    test('should update a token with options', async () => {
      const id = _chance.guid();
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const idempotencyKey = chance.string();

      const updatePayload: UpdateToken = {
        data: {
          camelCaseParameter: _chance.string(),
          snake_case_parameter: _chance.string(),
        },
        privacy: {
          impactLevel: _chance.pickone([...DATA_IMPACT_LEVELS]),
          restrictionPolicy: _chance.pickone([...DATA_RESTRICTION_POLICIES]),
        },
        containers: [`/${chance.string()}/`],
        metadata: {
          camelCaseParameter: _chance.string(),
          snake_case_parameter: _chance.string(),
        },
        searchIndexes: [_chance.string(), _chance.string()],
        fingerprintExpression: _chance.string(),
        expiresAt: _chance.date().toString(),
      };

      const updatedToken: Omit<Token, 'data'> = {
        id,
        type: 'token',
        tenantId: chance.guid(),
        privacy: {
          impactLevel: _chance.pickone([...DATA_IMPACT_LEVELS]),
          restrictionPolicy: _chance.pickone([...DATA_RESTRICTION_POLICIES]),
        },
        containers: [`/${chance.string()}/`],
        enrichments: getEnrichments(),
        searchIndexes: [_chance.string(), _chance.string()],
        fingerprintExpression: _chance.string(),
      };

      client.onPatch().reply(204, JSON.stringify(updatedToken));

      expect(
        await bt.tokens.update(id, updatePayload, {
          apiKey: _apiKey,
          correlationId,
          idempotencyKey,
        })
      ).toStrictEqual(updatedToken);

      expect(client.history.patch).toHaveLength(1);
      expect(client.history.patch[0].data).toStrictEqual(
        JSON.stringify(transformTokenRequestSnakeCase(updatePayload))
      );
      expect(client.history.patch[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
        [CONTENT_TYPE_HEADER]: expectedContentType,
        [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const id = _chance.guid();
      const status = errorStatus();

      client.onPatch().reply(status);

      const promise = bt.tokens.update(id, { data: chance.string() });

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('delete', () => {
    testDelete(() => ({
      service: bt.tokens,
      client,
    }));
  });

  describe('list', () => {
    testList(() => ({
      service: bt.tokens,
      client,
    }));

    test('should list tokens w/ query', async () => {
      const totalItems = chance.integer();
      const pageNumber = chance.integer();
      const pageSize = chance.integer();
      const totalPages = chance.integer();
      const query = {
        page: chance.integer(),
        size: chance.integer(),
        id: chance.string({
          alpha: true,
          numeric: true,
        }),
        type: chance.string({
          alpha: true,
          numeric: true,
        }) as TokenType,
        metadata: {
          str: chance.string({ alpha: true }),
          num: chance.string({ numeric: true }),
        },
      } as ListTokensQuery;
      const url = `/?page=${query.page}&size=${query.size}&id=${query.id}&type=${query.type}&metadata.str=${query.metadata?.str}&metadata.num=${query.metadata?.num}`;

      client.onGet(url).reply(
        200,

        JSON.stringify({
          pagination: {
            total_items: totalItems,
            page_number: pageNumber,
            page_size: pageSize,
            total_pages: totalPages,
          },
          data: [],
        })
      );

      expect(await bt.tokens.list(query)).toStrictEqual({
        pagination: {
          totalItems,
          pageNumber,
          pageSize,
          totalPages,
        },
        data: [],
      } as PaginatedList<Token>);
      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].url).toStrictEqual(url);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    test('should list w/o changing metadata or data casing', async () => {
      const randomString = chance.string();
      const randomNumber = chance.integer();

      client.onGet().reply(
        200,

        JSON.stringify({
          pagination: {
            total_items: randomNumber,
            page_number: randomNumber,
            page_size: randomNumber,
            total_pages: randomNumber,
          },
          data: [
            {
              id: '1',
              snake_case: randomString,
              data: {
                snake_case: randomString,
                camelCase: randomString,
              },
              metadata: {
                snake_case: randomString,
                camelCase: randomString,
              },
            },
            {
              id: '2',
              snake_case: randomString,
              data: {
                snake_case: randomString,
                camelCase: randomString,
              },
              metadata: {
                snake_case: randomString,
                camelCase: randomString,
              },
            },
          ],
        })
      );

      expect(await bt.tokens.list()).toStrictEqual({
        pagination: {
          totalItems: randomNumber,
          pageNumber: randomNumber,
          pageSize: randomNumber,
          totalPages: randomNumber,
        },
        data: [
          {
            id: '1',

            snakeCase: randomString,
            data: {
              snake_case: randomString,
              camelCase: randomString,
            },
            metadata: {
              snake_case: randomString,
              camelCase: randomString,
            },
          },
          {
            id: '2',
            snakeCase: randomString,
            data: {
              snake_case: randomString,
              camelCase: randomString,
            },
            metadata: {
              snake_case: randomString,
              camelCase: randomString,
            },
          },
        ],
      });
      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].url).toStrictEqual('/');
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });
  });

  describe('search tokens', () => {
    test('should search tokens', async () => {
      const totalItems = chance.integer();
      const pageNumber = chance.integer();
      const pageSize = chance.integer();
      const totalPages = chance.integer();

      const searchRequest = {
        query: chance.string(),
        page: chance.integer(),
        size: chance.integer(),
      } as SearchTokensRequest;

      client.onPost('search').reply(
        200,
        JSON.stringify({
          pagination: {
            total_items: totalItems,
            page_number: pageNumber,
            page_size: pageSize,
            total_pages: totalPages,
          },
          data: [],
        })
      );

      expect(await bt.tokens.search(searchRequest)).toStrictEqual({
        pagination: {
          totalItems,
          pageNumber,
          pageSize,
          totalPages,
        },
        data: [],
      } as PaginatedList<Token>);

      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].url).toStrictEqual('/search');
      expect(client.history.post[0].data).toStrictEqual(
        JSON.stringify(searchRequest)
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    test('should search tokens with options', async () => {
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const idempotencyKey = chance.string();
      const totalItems = chance.integer();
      const pageNumber = chance.integer();
      const pageSize = chance.integer();
      const totalPages = chance.integer();

      const searchRequest = {
        query: chance.string(),
        page: chance.integer(),
        size: chance.integer(),
      } as SearchTokensRequest;

      client.onPost('search').reply(
        200,
        JSON.stringify({
          pagination: {
            total_items: totalItems,
            page_number: pageNumber,
            page_size: pageSize,
            total_pages: totalPages,
          },
          data: [],
        })
      );

      expect(
        await bt.tokens.search(searchRequest, {
          apiKey: _apiKey,
          correlationId,
          idempotencyKey,
        })
      ).toStrictEqual({
        pagination: {
          totalItems,
          pageNumber,
          pageSize,
          totalPages,
        },
        data: [],
      } as PaginatedList<Token>);

      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].url).toStrictEqual('/search');
      expect(client.history.post[0].data).toStrictEqual(
        JSON.stringify(searchRequest)
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
        [BT_IDEMPOTENCY_KEY_HEADER]: idempotencyKey,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const searchRequest = {
        query: chance.string(),
        page: chance.integer(),
        size: chance.integer(),
      } as SearchTokensRequest;

      const status = errorStatus();

      client.onPost('/search').reply(status);

      const promise = bt.tokens.search(searchRequest);

      await expectBasisTheoryApiError(promise, status);
    });
  });
});
