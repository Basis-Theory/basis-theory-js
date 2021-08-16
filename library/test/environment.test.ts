import axios from 'axios';
import { BasisTheory } from '../src';
import { SERVICES } from '../src/common';
import { Chance } from 'chance';
import type { ServiceEnvironment } from '../src/types';

describe('Environments', () => {
  const chance = new Chance();

  it('should use environment map', async () => {
    const environment = chance.pickone([
      'production',
      'sandbox',
      'local',
    ]) as ServiceEnvironment;

    const create = jest.spyOn(axios, 'create');

    await new BasisTheory().init('sb-key', {
      environment,
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
      baseURL: SERVICES.tokens[environment],
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: SERVICES.atomic[environment],
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: SERVICES.applications[environment],
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: SERVICES.reactorFormulas[environment],
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: SERVICES.reactors[environment],
    });
    expect(create).toHaveBeenCalledWith({
      ...baseConfig,
      baseURL: SERVICES.permissions[environment],
    });
    expect(create).toHaveBeenCalledTimes(6);
  });

  it('should throw error if not properly initialized', () => {
    expect(() => {
      const bt = new BasisTheory();
      bt.tokens.createToken('some data');
    }).toThrowError();
  });
});
