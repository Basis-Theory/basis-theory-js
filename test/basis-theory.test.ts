import axios from 'axios';
import { BasisTheory } from '../src';
import { SERVICES } from '../src/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BasisTheory', () => {
  describe('Environment', () => {
    it('should use sandbox environment', async () => {
      await new BasisTheory().init('sb-key', 'sandbox');
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: SERVICES.vault.sandbox,
        headers: {
          'X-API-KEY': 'sb-key',
        },
      });
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: SERVICES.payments.sandbox,
        headers: {
          'X-API-KEY': 'sb-key',
        },
      });
    });
    it('should use local environment', async () => {
      await new BasisTheory().init('local-key', 'local');
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: SERVICES.vault.local,
        headers: {
          'X-API-KEY': 'local-key',
        },
      });
      expect(mockedAxios.create).toHaveBeenCalledWith({
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

  describe('Features', () => {
    let bt: BasisTheory;

    beforeAll(async () => {
      bt = await new BasisTheory().init('dummy-key');
    });

    it('should create a new token', async () => {
      const apiCall = mockedAxios.post.mockResolvedValueOnce({
        data: { token: '12345' },
      });
      const data = 'any data we want!';
      const token = await bt.vault.createToken(data);

      expect(apiCall).toHaveBeenCalledWith('/token', {
        data: JSON.stringify({ data }),
      });
      expect(token).toEqual({ token: '12345' });
    });

    it('should create a new credit card', async () => {
      const creditCardInfo = {
        holderName: 'John Doe',
        cardNumber: '1234 5678 9101 11213',
        expiration: '12/21',
        cvv: '123',
      };
      const apiCall = mockedAxios.post.mockResolvedValueOnce({
        data: { token: '12345' },
      });
      const token = await bt.payments.storeCreditCard(creditCardInfo);

      expect(apiCall).toHaveBeenCalledWith('/credit_card', creditCardInfo);
      expect(token).toEqual({ token: '12345' });
    });
  });
});
