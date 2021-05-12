import { Chance } from 'chance';
import { axios } from './setup';
import { BasisTheory } from '../src';

describe('Atomic', () => {
  let bt: BasisTheory;
  let chance: Chance.Chance;

  beforeAll(async () => {
    bt = await new BasisTheory().init('dummy-key');
    chance = new Chance();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Cards', () => {
    it('should create a new credit card with minimum required fields', async () => {
      const creditCardInfo = {
        number: '12345678910111213',
        expirationMonth: 12,
        expirationYear: 29,
      };
      const apiCall = axios.post.mockResolvedValueOnce({
        data: { token: '12345' },
      });
      const token = await bt.atomic.storeCreditCard({
        card: creditCardInfo,
      });

      expect(apiCall).toHaveBeenCalledWith('/cards', {
        card: {
          number: '12345678910111213',
          expiration_month: 12,
          expiration_year: 29,
        },
      });
      expect(token).toEqual({ token: '12345' });
    });

    it('should create a new credit card with required + address', async () => {
      const creditCardInfo = {
        number: '12345678910111213',
        expirationMonth: 12,
        expirationYear: 29,
      };
      const billingDetails = {
        address: {
          city: 'Honolulu',
          country: 'US',
          line1: '123 Chill street',
          postalCode: '11111',
          state: 'HI',
        },
      };
      const token = chance.string();
      const apiCall = axios.post.mockImplementationOnce((url, data) => {
        return Promise.resolve({
          data: {
            id: token,
            ...data,
          },
        });
      });
      const atomicCard = await bt.atomic.storeCreditCard({
        card: creditCardInfo,
        billingDetails,
      });

      expect(apiCall).toHaveBeenCalledWith('/cards', {
        card: {
          number: '12345678910111213',
          expiration_month: 12,
          expiration_year: 29,
        },
        billing_details: {
          address: {
            city: 'Honolulu',
            country: 'US',
            line1: '123 Chill street',
            postal_code: '11111',
            state: 'HI',
          },
        },
      });
      expect(atomicCard).toEqual({
        id: token,
        card: creditCardInfo,
        billingDetails,
      });
    });

    it('should create a new credit card with all fields', async () => {
      const creditCardInfo = {
        number: '12345678910111213',
        expirationMonth: 12,
        expirationYear: 29,
        cvc: '123',
      };
      const billingDetails = {
        name: 'John Doe',
        email: 'john.doe@basistheory.com',
        phone: '+12035555555',
        address: {
          city: 'Honolulu',
          country: 'US',
          line1: '123 Chill street',
          line2: 'Unit A',
          postalCode: '11111',
          state: 'HI',
        },
      };
      const token = chance.string();
      const apiCall = axios.post.mockImplementationOnce((url, data) => {
        return Promise.resolve({
          data: {
            id: token,
            ...data,
          },
        });
      });
      const atomicCard = await bt.atomic.storeCreditCard({
        card: creditCardInfo,
        billingDetails,
      });

      expect(apiCall).toHaveBeenCalledWith('/cards', {
        card: {
          number: '12345678910111213',
          expiration_month: 12,
          expiration_year: 29,
          cvc: '123',
        },
        billing_details: {
          name: 'John Doe',
          email: 'john.doe@basistheory.com',
          phone: '+12035555555',
          address: {
            city: 'Honolulu',
            country: 'US',
            line1: '123 Chill street',
            line2: 'Unit A',
            postal_code: '11111',
            state: 'HI',
          },
        },
      });
      expect(atomicCard).toEqual({
        id: token,
        card: creditCardInfo,
        billingDetails,
      });
    });
  });

  describe('Banks', () => {
    it('should create a new bank with required fields', async () => {
      const bankInfo = {
        accountNumber: '123456789',
        routingNumber: '12345679012',
      };
      const apiCall = axios.post.mockResolvedValueOnce({
        data: { token: '12345' },
      });
      const token = await bt.atomic.storeBank({
        bank: bankInfo,
      });

      expect(apiCall).toHaveBeenCalledWith('/banks', {
        bank: {
          account_number: '123456789',
          routing_number: '12345679012',
        },
      });
      expect(token).toEqual({ token: '12345' });
    });
  });
});
