import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import {
  API_KEY_HEADER,
  BT_TRACE_ID_HEADER,
  CONTENT_TYPE_HEADER,
  getQueryParams,
  transformTokenRequestSnakeCase,
} from '@/common';
import type {
  CreateToken,
  Token,
  TokenType,
  UpdateToken,
} from '@/types/models';
import {
  DATA_CLASSIFICATIONS,
  DATA_IMPACT_LEVELS,
  DATA_RESTRICTION_POLICIES,
} from '@/types/models';
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

  describe('retrieve', () => {
    test('should retrieve', async () => {
      const id = chance.string();
      const fingerprint = chance.string();
      const tenantId = chance.string();
      const type = chance.string() as TokenType;

      /* eslint-disable camelcase */
      const data = {
        camelCaseParameter: chance.string(),
        snake_case_parameter: chance.string(),
      };
      const metadata = {
        camelCaseParameter: chance.string(),
        snake_case_parameter: chance.string(),
      };
      /* eslint-enable camelcase */

      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();

      client.onGet(id).reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          id,
          tenant_id: tenantId,
          fingerprint,
          type,
          data,
          metadata,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
        /* eslint-enable camelcase */
      );

      expect(await bt.tokens.retrieve(id)).toStrictEqual({
        id,
        tenantId,
        fingerprint,
        type,
        data,
        metadata,
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
      const id = chance.string();
      const tenantId = chance.string();
      const fingerprint = chance.string();
      const type = chance.string() as TokenType;
      const data = chance.string();
      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();

      client.onGet().reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          id,
          tenant_id: tenantId,
          fingerprint,
          type,
          data,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
        /* eslint-enable camelcase */
      );

      expect(
        await bt.tokens.retrieve(id, {
          apiKey: _apiKey,
          correlationId,
        })
      ).toStrictEqual({
        id,
        tenantId,
        fingerprint,
        type,
        data,
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

  describe('create association', () => {
    test('should create association', async () => {
      const parentId = chance.string();
      const childId = chance.string();

      client.onPost(`/${parentId}/children/${childId}`).reply(204, {});

      expect(
        await bt.tokens.createAssociation(parentId, childId)
      ).toBeUndefined();

      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].url).toStrictEqual(
        `/${parentId}/children/${childId}`
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    test('should create association with options', async () => {
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const parentId = chance.string();
      const childId = chance.string();

      client.onPost(`/${parentId}/children/${childId}`).reply(204, {});

      expect(
        await bt.tokens.createAssociation(parentId, childId, {
          apiKey: _apiKey,
          correlationId,
        })
      ).toBeUndefined();

      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].url).toStrictEqual(
        `/${parentId}/children/${childId}`
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const parentId = chance.string();
      const childId = chance.string();
      const status = errorStatus();

      client.onPost(`/${parentId}/children/${childId}`).reply(status);

      const promise = bt.tokens.createAssociation(parentId, childId);

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('delete association', () => {
    test('should delete association', async () => {
      const parentId = chance.string();
      const childId = chance.string();

      client.onDelete(`/${parentId}/children/${childId}`).reply(204, {});

      expect(
        await bt.tokens.deleteAssociation(parentId, childId)
      ).toBeUndefined();

      expect(client.history.delete).toHaveLength(1);
      expect(client.history.delete[0].url).toStrictEqual(
        `/${parentId}/children/${childId}`
      );
      expect(client.history.delete[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    test('should delete association with options', async () => {
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const parentId = chance.string();
      const childId = chance.string();

      client.onDelete(`/${parentId}/children/${childId}`).reply(204, {});

      expect(
        await bt.tokens.deleteAssociation(parentId, childId, {
          apiKey: _apiKey,
          correlationId,
        })
      ).toBeUndefined();

      expect(client.history.delete).toHaveLength(1);
      expect(client.history.delete[0].url).toStrictEqual(
        `/${parentId}/children/${childId}`
      );
      expect(client.history.delete[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const parentId = chance.string();
      const childId = chance.string();
      const status = errorStatus();

      client.onDelete(`/${parentId}/children/${childId}`).reply(status);

      const promise = bt.tokens.deleteAssociation(parentId, childId);

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('create child', () => {
    test('should create child token for a token', async () => {
      const parentId = chance.string();

      /* eslint-disable camelcase */
      const tokenPayload = {
        type: 'token',
        data: {
          camelCaseParameter: chance.string(),
          snake_case_parameter: chance.string(),
        },
        metadata: {
          camelCaseParameter: chance.string(),
          snake_case_parameter: chance.string(),
        },
      } as CreateToken;
      /* eslint-enable camelcase */

      const createdAt = chance.string();
      const createdBy = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();

      client.onPost(`/${parentId}/children`).reply(
        201,
        /* eslint-disable camelcase */
        JSON.stringify({
          ...tokenPayload,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
        /* eslint-enable camelcase */
      );

      expect(await bt.tokens.createChild(parentId, tokenPayload)).toStrictEqual(
        {
          ...tokenPayload,
          createdAt,
          createdBy,
          modifiedAt,
          modifiedBy,
        }
      );

      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].url).toStrictEqual(`/${parentId}/children`);
      expect(client.history.post[0].data).toStrictEqual(
        JSON.stringify(tokenPayload)
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    test('should create child token for a token with options', async () => {
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const parentId = chance.string();
      const tokenPayload = {
        data: chance.string(),
      } as CreateToken;

      const createdAt = chance.string();
      const createdBy = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();

      client.onPost(`/${parentId}/children`).reply(
        201,
        /* eslint-disable camelcase */
        JSON.stringify({
          ...tokenPayload,
          created_at: createdAt,
          created_by: createdBy,
          modified_at: modifiedAt,
          modified_by: modifiedBy,
        })
        /* eslint-enable camelcase */
      );

      expect(
        await bt.tokens.createChild(parentId, tokenPayload, {
          apiKey: _apiKey,
          correlationId,
        })
      ).toStrictEqual({
        ...tokenPayload,
        createdAt,
        createdBy,
        modifiedAt,
        modifiedBy,
      });

      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].url).toStrictEqual(`/${parentId}/children`);
      expect(client.history.post[0].data).toStrictEqual(
        JSON.stringify(tokenPayload)
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const parentId = chance.string();
      const tokenPayload: CreateToken = {
        type: 'token',
        data: chance.string(),
      };
      const status = errorStatus();

      client.onPost(`/${parentId}/children`).reply(status);

      const promise = bt.tokens.createChild(parentId, tokenPayload);

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('list children', () => {
    test('should list child tokens for a token', async () => {
      const parentId = chance.string();
      const totalItems = chance.integer();
      const pageNumber = chance.integer();
      const pageSize = chance.integer();
      const totalPages = chance.integer();

      client.onGet(`/${parentId}/children`).reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          pagination: {
            total_items: totalItems,
            page_number: pageNumber,
            page_size: pageSize,
            total_pages: totalPages,
          },
          data: [],
        })
        /* eslint-enable camelcase */
      );

      expect(await bt.tokens.listChildren(parentId)).toStrictEqual({
        pagination: {
          totalItems,
          pageNumber,
          pageSize,
          totalPages,
        },
        data: [], // no need to assert this conversion, since we are asserting pagination already
      } as PaginatedList<Token>);
      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].url).toStrictEqual(`/${parentId}/children`);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    test('should list child tokens for a token w/ query', async () => {
      const parentId = chance.string();
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
      } as ListTokensQuery;
      const url = `/${parentId}/children${getQueryParams(query)}`;

      client.onGet(url).reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          pagination: {
            total_items: totalItems,
            page_number: pageNumber,
            page_size: pageSize,
            total_pages: totalPages,
          },
          data: [],
        })
        /* eslint-enable camelcase */
      );

      expect(await bt.tokens.listChildren(parentId, query)).toStrictEqual({
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

    test('should list child tokens for a token w/ options', async () => {
      const _apiKey = chance.string();
      const correlationId = chance.string();
      const parentId = chance.string();
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
      } as ListTokensQuery;
      const url = `/${parentId}/children${getQueryParams(query)}`;

      client.onGet(url).reply(
        200,
        /* eslint-disable camelcase */
        JSON.stringify({
          pagination: {
            total_items: totalItems,
            page_number: pageNumber,
            page_size: pageSize,
            total_pages: totalPages,
          },
          data: [],
        })
        /* eslint-enable camelcase */
      );

      expect(
        await bt.tokens.listChildren(parentId, query, {
          apiKey: _apiKey,
          correlationId,
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
      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].url).toStrictEqual(url);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    test('should reject with status >= 400 <= 599', async () => {
      const parentId = chance.string();
      const status = errorStatus();

      client.onGet(`/${parentId}/children`).reply(status);

      const promise = bt.tokens.listChildren(parentId);

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('create', () => {
    const _chance = new Chance();

    /* eslint-disable camelcase */
    const createPayload: CreateToken = {
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
    };
    /* eslint-enable camelcase */

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

      /* eslint-disable camelcase */
      const updatePayload: UpdateToken = {
        data: {
          camelCaseParameter: _chance.string(),
          snake_case_parameter: _chance.string(),
        },
        privacy: {
          impactLevel: _chance.pickone([...DATA_IMPACT_LEVELS]),
          restrictionPolicy: _chance.pickone([...DATA_RESTRICTION_POLICIES]),
        },
        metadata: {
          camelCaseParameter: _chance.string(),
          snake_case_parameter: _chance.string(),
        },
        searchIndexes: [_chance.string(), _chance.string()],
        fingerprintExpression: _chance.string(),
        deduplicateToken: _chance.bool(),
      };
      /* eslint-enable camelcase */

      const updatedToken: Omit<Token, 'data'> = {
        id,
        type: 'token',
        tenantId: chance.guid(),
        privacy: {
          impactLevel: _chance.pickone([...DATA_IMPACT_LEVELS]),
          restrictionPolicy: _chance.pickone([...DATA_RESTRICTION_POLICIES]),
        },
        searchIndexes: [_chance.string(), _chance.string()],
        fingerprintExpression: _chance.string(),
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

      /* eslint-disable camelcase */
      const updatePayload: UpdateToken = {
        data: {
          camelCaseParameter: _chance.string(),
          snake_case_parameter: _chance.string(),
        },
        privacy: {
          impactLevel: _chance.pickone([...DATA_IMPACT_LEVELS]),
          restrictionPolicy: _chance.pickone([...DATA_RESTRICTION_POLICIES]),
        },
        metadata: {
          camelCaseParameter: _chance.string(),
          snake_case_parameter: _chance.string(),
        },
        searchIndexes: [_chance.string(), _chance.string()],
        fingerprintExpression: _chance.string(),
      };
      /* eslint-enable camelcase */

      const updatedToken: Omit<Token, 'data'> = {
        id,
        type: 'token',
        tenantId: chance.guid(),
        privacy: {
          impactLevel: _chance.pickone([...DATA_IMPACT_LEVELS]),
          restrictionPolicy: _chance.pickone([...DATA_RESTRICTION_POLICIES]),
        },
        searchIndexes: [_chance.string(), _chance.string()],
        fingerprintExpression: _chance.string(),
      };

      client.onPatch().reply(204, JSON.stringify(updatedToken));

      expect(
        await bt.tokens.update(id, updatePayload, {
          apiKey: _apiKey,
          correlationId,
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
        /* eslint-disable camelcase */
        JSON.stringify({
          pagination: {
            total_items: totalItems,
            page_number: pageNumber,
            page_size: pageSize,
            total_pages: totalPages,
          },
          data: [],
        })
        /* eslint-enable camelcase */
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

      /* eslint-disable camelcase */
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
      /* eslint-enable camelcase */

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
      const totalItems = chance.integer();
      const pageNumber = chance.integer();
      const pageSize = chance.integer();
      const totalPages = chance.integer();

      const searchRequest = {
        query: chance.string(),
        page: chance.integer(),
        size: chance.integer(),
      } as SearchTokensRequest;

      /* eslint-disable camelcase */
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
      /* eslint-enable camelcase */

      expect(
        await bt.tokens.search(searchRequest, {
          apiKey: _apiKey,
          correlationId,
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
