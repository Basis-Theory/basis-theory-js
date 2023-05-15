import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import { API_KEY_HEADER, BT_EXPOSE_PROXY_RESPONSE_HEADER } from '@/common';
import type {
  BasisTheory as IBasisTheory,
  ProxyHeaders,
  ProxyQuery,
} from '@/types/sdk';
import { mockServiceClient } from './setup/utils';

describe('Proxy', () => {
  let bt: IBasisTheory,
    chance: Chance.Chance,
    apiKey: string,
    client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
    // this is the only service we need to do this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client = mockServiceClient((bt as any)._proxy);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('proxy', () => {
    test('should perform get and delete (no body)', async () => {
      const response = chance.string();

      const path = chance.string();

      const query: ProxyQuery = {
        'bt-proxy-key': chance.string(),
        [chance.string()]: chance.string(),
      };

      const headers: ProxyHeaders = {
        'BT-PROXY-KEY': chance.string(),
        'BT-PROXY-URL': chance.url(),
        [chance.string()]: chance.string(),
      };

      // validate path
      client.onGet(path).reply(200, JSON.stringify(response));
      client.onDelete(path).reply(200, JSON.stringify(response));

      expect(
        await bt.proxy.get({
          apiKey,
          path,
          query,
          headers,
        })
      ).toStrictEqual(response);

      expect(
        await bt.proxy.delete({
          apiKey,
          path,
          query,
          headers,
        })
      ).toStrictEqual(response);

      expect(client.history.get).toHaveLength(1);
      expect(client.history.get[0].params).toMatchObject(query);
      expect(client.history.get[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
        ...headers,
      });

      expect(client.history.delete).toHaveLength(1);
      expect(client.history.delete[0].params).toMatchObject(query);
      expect(client.history.delete[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
        ...headers,
      });
    });

    test('should perform post, put and patch (with body)', async () => {
      const response = chance.string();

      const path = chance.string();

      const query: ProxyQuery = {
        'bt-proxy-key': chance.string(),
        [chance.string()]: chance.string(),
      };

      const headers: ProxyHeaders = {
        'BT-PROXY-KEY': chance.string(),
        'BT-PROXY-URL': chance.url(),
        [chance.string()]: chance.string(),
      };

      const body = {
        [chance.string()]: chance.string(),
        [chance.string()]: {
          [chance.string()]: chance.string(),
        },
      };

      // validate path
      client.onPost(path).reply(200, JSON.stringify(response));
      client.onPut(path).reply(200, JSON.stringify(response));
      client.onPatch(path).reply(200, JSON.stringify(response));

      expect(
        await bt.proxy.post({
          apiKey,
          path,
          query,
          headers,
          body,
        })
      ).toStrictEqual(response);

      expect(
        await bt.proxy.put({
          apiKey,
          path,
          query,
          headers,
          body,
        })
      ).toStrictEqual(response);

      expect(
        await bt.proxy.patch({
          apiKey,
          path,
          query,
          headers,
          body,
        })
      ).toStrictEqual(response);

      expect(client.history.post).toHaveLength(1);
      expect(client.history.post[0].params).toMatchObject(query);
      expect(client.history.post[0].data).toStrictEqual(JSON.stringify(body));
      expect(client.history.post[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
        ...headers,
      });

      expect(client.history.put).toHaveLength(1);
      expect(client.history.put[0].params).toMatchObject(query);
      expect(client.history.put[0].data).toStrictEqual(JSON.stringify(body));
      expect(client.history.put[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
        ...headers,
      });

      expect(client.history.patch).toHaveLength(1);
      expect(client.history.patch[0].params).toMatchObject(query);
      expect(client.history.patch[0].data).toStrictEqual(JSON.stringify(body));
      expect(client.history.patch[0].headers).toMatchObject({
        [API_KEY_HEADER]: apiKey,
        ...headers,
      });
    });

    test('returns response body and headers when passing `includeResponseHeaders` in config', async () => {
      const response = chance.string();

      const path = chance.string();

      const query: ProxyQuery = {
        'bt-proxy-key': chance.string(),
        [chance.string()]: chance.string(),
      };

      const headers: ProxyHeaders = {
        'BT-PROXY-KEY': chance.string(),
        'BT-PROXY-URL': chance.url(),
        [chance.string()]: chance.string(),
      };

      const body = {
        [chance.string()]: chance.string(),
        [chance.string()]: {
          [chance.string()]: chance.string(),
        },
      };

      // validate path
      client.onPost(path).reply(200, JSON.stringify(response), {
        [BT_EXPOSE_PROXY_RESPONSE_HEADER]: 'true',
      });

      expect(
        await bt.proxy.post({
          includeResponseHeaders: true,
          apiKey,
          path,
          query,
          headers,
          body,
        })
      ).toStrictEqual({
        data: response,
        headers: { [BT_EXPOSE_PROXY_RESPONSE_HEADER]: 'true' },
      });
    });
  });
});
