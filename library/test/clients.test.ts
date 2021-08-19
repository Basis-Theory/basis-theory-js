import axios from 'axios';
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
    expect(create).toHaveBeenCalledTimes(10);
  });

  it('should throw error if not properly initialized', () => {
    expect(() => {
      const bt = new BasisTheory();
      bt.tokens.create({ data: 'some data' });
    }).toThrowError();
  });
});
