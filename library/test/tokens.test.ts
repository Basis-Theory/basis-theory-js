import type {
  Token,
  CreateToken,
  DataClassification,
  DataImpact,
  DataRestrictionPolicy,
  TokenType,
} from '@basis-theory/basis-theory-elements-interfaces/models';
import type {
  BasisTheory as IBasisTheory,
  ListDecryptedTokensQuery,
  PaginatedList,
  ListTokensQuery,
} from '@basis-theory/basis-theory-elements-interfaces/sdk';
import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '../src';
import {
  API_KEY_HEADER,
  BT_TRACE_ID_HEADER,
  getQueryParams,
  transformTokenRequestSnakeCase,
} from '../src/common';
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
    it('should retrieve', async () => {
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
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should retrieve with options', async () => {
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
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].url).toStrictEqual(`/${id}`);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const id = chance.string();
      const status = errorStatus();

      client.onGet(id).reply(status);

      const promise = bt.tokens.retrieve(id);

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('retrieve decrypted', () => {
    it('should retrieve decrypted', async () => {
      const id = chance.string();
      const tenantId = chance.string();
      const fingerprint = chance.string();
      const type = chance.string() as TokenType;
      const data = chance.string();
      const createdBy = chance.string();
      const createdAt = chance.string();
      const modifiedBy = chance.string();
      const modifiedAt = chance.string();

      client.onGet(`/${id}/decrypt`).reply(
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

      expect(await bt.tokens.retrieveDecrypted(id)).toStrictEqual({
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
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].url).toStrictEqual(`/${id}/decrypt`);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should retrieve decrypted with options', async () => {
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
      const url = `/${id}/decrypt`;

      client.onGet(url).reply(
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
        await bt.tokens.retrieveDecrypted(id, {
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
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].url).toStrictEqual(url);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const id = chance.string();
      const status = errorStatus();

      client.onGet(`/${id}/decrypt`).reply(status);

      const promise = bt.tokens.retrieveDecrypted(id);

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('list decrypted', () => {
    it('should list decrypted', async () => {
      const totalItems = chance.integer();
      const pageNumber = chance.integer();
      const pageSize = chance.integer();
      const totalPages = chance.integer();

      client.onGet('/decrypt').reply(
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

      expect(await bt.tokens.listDecrypted()).toStrictEqual({
        pagination: {
          totalItems,
          pageNumber,
          pageSize,
          totalPages,
        },
        data: [], // no need to assert this conversion, since we are asserting pagination already
      } as PaginatedList<Token>);
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].url).toStrictEqual('/decrypt');
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should list decrypted with query', async () => {
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
        decryptType: chance.string({
          alpha: true,
          numeric: true,
        }) as TokenType,
      } as ListDecryptedTokensQuery;
      const url = `/decrypt${getQueryParams(query)}`;

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
        await bt.tokens.listDecrypted(query as ListDecryptedTokensQuery)
      ).toStrictEqual({
        pagination: {
          totalItems,
          pageNumber,
          pageSize,
          totalPages,
        },
        data: [],
      } as PaginatedList<Token>);
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].url).toStrictEqual(url);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should list decrypted with options', async () => {
      const _apiKey = chance.string();
      const correlationId = chance.string();
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
        decryptType: chance.string({
          alpha: true,
          numeric: true,
        }) as TokenType,
      } as ListDecryptedTokensQuery;
      const url = `/decrypt${getQueryParams(query)}`;

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
        await bt.tokens.listDecrypted(query as ListDecryptedTokensQuery, {
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
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].url).toStrictEqual(url);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const status = errorStatus();

      client.onGet(`/decrypt`).reply(status);

      const promise = bt.tokens.listDecrypted();

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('create association', () => {
    it('should create association', async () => {
      const parentId = chance.string();
      const childId = chance.string();

      client.onPost(`/${parentId}/children/${childId}`).reply(204, {});

      expect(
        await bt.tokens.createAssociation(parentId, childId)
      ).toBeUndefined();

      expect(client.history.post.length).toBe(1);
      expect(client.history.post[0].url).toStrictEqual(
        `/${parentId}/children/${childId}`
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should create association with options', async () => {
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

      expect(client.history.post.length).toBe(1);
      expect(client.history.post[0].url).toStrictEqual(
        `/${parentId}/children/${childId}`
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const parentId = chance.string();
      const childId = chance.string();
      const status = errorStatus();

      client.onPost(`/${parentId}/children/${childId}`).reply(status);

      const promise = bt.tokens.createAssociation(parentId, childId);

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('delete association', () => {
    it('should delete association', async () => {
      const parentId = chance.string();
      const childId = chance.string();

      client.onDelete(`/${parentId}/children/${childId}`).reply(204, {});

      expect(
        await bt.tokens.deleteAssociation(parentId, childId)
      ).toBeUndefined();

      expect(client.history.delete.length).toBe(1);
      expect(client.history.delete[0].url).toStrictEqual(
        `/${parentId}/children/${childId}`
      );
      expect(client.history.delete[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should delete association with options', async () => {
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

      expect(client.history.delete.length).toBe(1);
      expect(client.history.delete[0].url).toStrictEqual(
        `/${parentId}/children/${childId}`
      );
      expect(client.history.delete[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
      const parentId = chance.string();
      const childId = chance.string();
      const status = errorStatus();

      client.onDelete(`/${parentId}/children/${childId}`).reply(status);

      const promise = bt.tokens.deleteAssociation(parentId, childId);

      await expectBasisTheoryApiError(promise, status);
    });
  });

  describe('create child', () => {
    it('should create child token for a token', async () => {
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

      expect(client.history.post.length).toBe(1);
      expect(client.history.post[0].url).toStrictEqual(`/${parentId}/children`);
      expect(client.history.post[0].data).toStrictEqual(
        JSON.stringify(tokenPayload)
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should create child token for a token with options', async () => {
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

      expect(client.history.post.length).toBe(1);
      expect(client.history.post[0].url).toStrictEqual(`/${parentId}/children`);
      expect(client.history.post[0].data).toStrictEqual(
        JSON.stringify(tokenPayload)
      );
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
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
    it('should list child tokens for a token', async () => {
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
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].url).toStrictEqual(`/${parentId}/children`);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should list child tokens for a token w/ query', async () => {
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
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].url).toStrictEqual(url);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: expect.any(String),
      });
    });

    it('should list child tokens for a token w/ options', async () => {
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
      expect(client.history.get.length).toBe(1);
      expect(client.history.get[0].url).toStrictEqual(url);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: _apiKey,
        [BT_TRACE_ID_HEADER]: correlationId,
      });
    });

    it('should reject with status >= 400 <= 599', async () => {
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
        impactLevel: DataImpact.HIGH,
        classification: DataClassification.PCI,
        restrictionPolicy: DataRestrictionPolicy.REDACT,
      },
      metadata: {
        camelCaseParameter: _chance.string(),
        snake_case_parameter: _chance.string(),
      },
    };
    /* eslint-enable camelcase */

    testCreate(() => ({
      service: bt.tokens,
      client,
      createPayload,
      transformedCreatePayload: transformTokenRequestSnakeCase(createPayload),
    }));
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
  });
});
