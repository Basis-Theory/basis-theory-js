import { axios } from './setup';
import { BasisTheory } from '../src';
import { SERVICES } from '../src/common';

describe('Environments', () => {
  it('should use sandbox environment', async () => {
    await new BasisTheory().init('sb-key', 'sandbox');
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: SERVICES.vault.sandbox,
      headers: {
        'X-API-KEY': 'sb-key',
      },
    });
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: SERVICES.payments.sandbox,
      headers: {
        'X-API-KEY': 'sb-key',
      },
    });
  });

  it('should use local environment', async () => {
    await new BasisTheory().init('local-key', 'local');
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: SERVICES.vault.local,
      headers: {
        'X-API-KEY': 'local-key',
      },
    });
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: SERVICES.payments.local,
      headers: {
        'X-API-KEY': 'local-key',
      },
    });
  });

  it('should throw error if not properly initialize', () => {
    expect(() => {
      const bt = new BasisTheory();
      bt.vault.createToken('some data');
    }).toThrowError();
  });
});
