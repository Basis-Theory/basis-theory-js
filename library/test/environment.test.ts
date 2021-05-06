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

  describe('axios interceptor', () => {
    let axiosClient: {
        interceptors: {
          response: {
            use: jest.Mock;
          };
        };
      },
      responseFn: (arg: unknown) => unknown,
      errorFn: (arg: unknown) => void;

    beforeAll(async () => {
      await new BasisTheory().init('local-key', { environment: 'local' });

      axiosClient = axios.create.mock.results[0].value;
      [
        responseFn,
        errorFn,
      ] = axiosClient.interceptors.response.use.mock.calls[0];
    });

    it('should return unaltered response', async () => {
      expect(responseFn(56789)).toBe(56789);
    });

    describe('response exists', () => {
      it('should throw BasisTheoryApiError with response status and response data', async () => {
        const expectedError = {
          message: 'some error message',
          response: {
            data: {
              key1: 'value1',
              key2: 'value2',
            },
            status: 418,
          },
        };

        try {
          errorFn(expectedError);
          fail('should have thrown BasisTheoryApiError');
        } catch (error) {
          expect(error).toHaveProperty('name', 'BasisTheoryApiError');
          expect(error).toHaveProperty('message', expectedError.message);
          expect(error).toHaveProperty('status', expectedError.response.status);
          expect(error).toHaveProperty('data', expectedError.response.data);
        }
      });
    });

    describe('response does not exist', () => {
      it('should throw BasisTheoryApiError with -1 for the status and an undefined for data', async () => {
        const errorMessage = 'some error message';

        try {
          errorFn({
            message: errorMessage,
          });
          fail('should have thrown BasisTheoryApiError');
        } catch (error) {
          expect(error).toHaveProperty('name', 'BasisTheoryApiError');
          expect(error).toHaveProperty('message', errorMessage);
          expect(error).toHaveProperty('status', -1);
          expect(error).toHaveProperty('data', undefined);
        }
      });
    });
  });
});