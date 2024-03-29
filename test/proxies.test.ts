import type MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import { API_KEY_HEADER } from '@/common';
import { transformProxyRequestSnakeCase } from '@/common/utils';
import type { BasisTheory as IBasisTheory } from '@/types/sdk';
import { mockServiceClient, testCRUD, testPatch } from './setup/utils';

describe('Proxies', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    client = mockServiceClient(bt.proxies);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('CRUD', () => {
    const _chance = new Chance();

    const createPayload = {
      name: _chance.animal(),
      destinationUrl: _chance.url(),
      requestTransform: {
        code: _chance.string(),
      },
      responseTransform: {
        code: _chance.string(),
      },
      application: {
        id: _chance.guid(),
      },
      configuration: {
        snake_case: _chance.string(),
        camelCase: _chance.string(),
      },
      requireAuth: _chance.bool(),
    };

    const updatePayload = {
      name: _chance.animal(),
      destinationUrl: _chance.url(),
      requestTransform: {
        code: _chance.word(),
      },
      responseTransform: {
        code: _chance.word(),
      },
      application: {
        id: _chance.guid(),
      },
      configuration: {
        snake_case: _chance.string(),
        camelCase: _chance.string(),
      },
      requireAuth: _chance.bool(),
    };

    const patchPayload = {
      ...updatePayload,
    };

    const transformedCreatePayload = transformProxyRequestSnakeCase(
      createPayload
    );

    const transformedUpdatePayload = transformProxyRequestSnakeCase(
      updatePayload
    );

    const transformedPatchPayload = transformProxyRequestSnakeCase(
      patchPayload
    );

    testCRUD(() => ({
      service: bt.proxies,
      client,
      createPayload,
      transformedCreatePayload,
      updatePayload,
      transformedUpdatePayload,
    }));

    testPatch(() => ({
      service: bt.proxies,
      client,
      patchPayload,
      transformedPatchPayload,
    }));

    test('should list w/o changing config casing', async () => {
      const randomString = _chance.string();
      const randomNumber = _chance.integer();

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
              configuration: {
                snake_case: randomString,
                camelCase: randomString,
              },
            },
            {
              id: '2',
              snake_case: randomString,
              configuration: {
                snake_case: randomString,
                camelCase: randomString,
              },
            },
          ],
        })
      );

      expect(await bt.proxies.list()).toStrictEqual({
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
            configuration: {
              snake_case: randomString,
              camelCase: randomString,
            },
          },
          {
            id: '2',
            snakeCase: randomString,
            configuration: {
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
});
