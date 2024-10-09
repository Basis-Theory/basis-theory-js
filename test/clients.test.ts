import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import {
  DEFAULT_BASE_URL,
  CLIENT_BASE_PATHS,
  buildClientUserAgentString,
  buildUserAgentString,
} from '@/common';
import { BasisTheoryService } from '@/service';
import { getTestAppInfo } from './setup/utils';

describe('clients', () => {
  test('should use base url and paths for all clients', async () => {
    const create = jest.spyOn(axios, 'create');

    await new BasisTheory().init('sb-key', {
      apiBaseUrl: DEFAULT_BASE_URL,
      appInfo: getTestAppInfo(),
    });

    const baseConfig = {
      headers: {
        'BT-API-KEY': 'sb-key',
        ...(typeof window === 'undefined' && {
          'User-Agent': buildUserAgentString(getTestAppInfo()),
        }),
        'BT-CLIENT-USER-AGENT': buildClientUserAgentString(getTestAppInfo()),
      },
      transformRequest: expect.any(Array),
      transformResponse: expect.any(Array),
    };

    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.tokens}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.applicationKeys}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.tokenize}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.applications}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.applicationTemplates}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.tenants}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.logs}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.reactorFormulas}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.reactors}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.permissions}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.proxies}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.proxy}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.sessions}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.threeds}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.tokenIntents}`,
    });
    expect(create).toHaveBeenCalledTimes(15);
  });

  test('should throw error if not properly initialized', () => {
    expect(() => {
      const bt = new BasisTheory();

      bt.tokens.create({
        type: 'token',
        data: 'some data',
      });
    }).toThrow('BasisTheory has not yet been properly initialized.');
  });

  test('should be able to handle base URLs with trailing slash', async () => {
    const chance = new Chance();
    const url = chance.url({
      protocol: 'https',
      path: '',
    });
    const id = chance.string();

    const bt = await new BasisTheory().init(chance.string(), {
      apiBaseUrl: `${url}`,
    });

    const mockClient = new MockAdapter(
      ((bt.tokens as unknown) as BasisTheoryService).client
    );

    mockClient.onGet(id).reply(200, {});

    await bt.tokens.retrieve(id);
    expect(mockClient.history.get[0].baseURL).toBe(
      `${url}${CLIENT_BASE_PATHS.tokens}`
    );
  });

  test('should be able to handle base URLs without trailing slash', async () => {
    const chance = new Chance();
    const url = chance
      .url({
        protocol: 'https',
        path: '',
      })
      .slice(0, -1);
    const id = chance.string();

    const bt = await new BasisTheory().init(chance.string(), {
      apiBaseUrl: `${url}`,
    });

    const mockClient = new MockAdapter(
      ((bt.tokens as unknown) as BasisTheoryService).client
    );

    mockClient.onGet(id).reply(200, {});

    await bt.tokens.retrieve(id);
    expect(mockClient.history.get[0].baseURL).toBe(
      `${url}/${CLIENT_BASE_PATHS.tokens}`
    );
  });
});
