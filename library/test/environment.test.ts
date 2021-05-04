import { axios } from './setup';
import { BasisTheory } from '../src';
import { SERVICES } from '../src/common';

describe('Environments', () => {
  it('should use sandbox environment', async () => {
    await new BasisTheory().init('sb-key', { environment: 'sandbox' });
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: SERVICES.tokens.sandbox,
      headers: {
        'X-API-KEY': 'sb-key',
      },
    });
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: SERVICES.atomic.sandbox,
      headers: {
        'X-API-KEY': 'sb-key',
      },
    });
  });

  it('should use local environment', async () => {
    await new BasisTheory().init('local-key', { environment: 'local' });
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: SERVICES.tokens.local,
      headers: {
        'X-API-KEY': 'local-key',
      },
    });
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: SERVICES.atomic.local,
      headers: {
        'X-API-KEY': 'local-key',
      },
    });
  });

  it('should throw error if not properly initialized', () => {
    expect(() => {
      const bt = new BasisTheory();
      bt.tokens.createToken('some data');
    }).toThrowError();
  });
});
