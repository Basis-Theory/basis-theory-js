import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '../src';
import { DEFAULT_BASE_URL, CLIENT_BASE_PATHS } from '../src/common';

describe('clients', () => {
  it('should use base url and paths for all clients', async () => {
    const create = jest.spyOn(axios, 'create');

    await new BasisTheory().init('sb-key', {
      apiBaseUrl: DEFAULT_BASE_URL,
    });

    const baseConfig = {
      headers: {
        'X-API-KEY': 'sb-key',
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
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.tokenize}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.atomic}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.applications}`,
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
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.atomicBanks}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.atomicCards}`,
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: `${DEFAULT_BASE_URL}/${CLIENT_BASE_PATHS.permissions}`,
    });
    expect(create).toHaveBeenCalledTimes(11);
  });

  it('should throw error if not properly initialized', () => {
    expect(() => {
      const bt = new BasisTheory();

      bt.tokens.create({
        type: 'token',
        data: 'some data',
      });
    }).toThrowError();
  });

  it('should be able to handle base URLs with trailing slash', async () => {
    const chance = new Chance();
    const url = chance.url({
      protocol: 'https',
      path: '',
    });
    const id = chance.string();

    const bt = await new BasisTheory().init(chance.string(), {
      apiBaseUrl: `${url}`,
    });

    const mockClient = new MockAdapter(bt.tokens.client);

    mockClient.onGet(id).reply(200, {});

    await bt.tokens.retrieve(id);
    expect(mockClient.history.get[0].baseURL).toBe(
      `${url}${CLIENT_BASE_PATHS.tokens}`
    );
  });

  it('should be able to handle base URLs without trailing slash', async () => {
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

    const mockClient = new MockAdapter(bt.tokens.client);

    mockClient.onGet(id).reply(200, {});

    await bt.tokens.retrieve(id);
    expect(mockClient.history.get[0].baseURL).toBe(
      `${url}/${CLIENT_BASE_PATHS.tokens}`
    );
  });
});
