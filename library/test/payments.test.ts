import { axios } from './setup';
import { BasisTheory } from '../src';

describe('Payments', () => {
  let bt: BasisTheory;

  beforeAll(async () => {
    bt = await new BasisTheory().init('dummy-key');
  });

  it('should create a new credit card with minimum required fields', async () => {
    const creditCardInfo = {
      number: '12345678910111213',
      expirationMonth: 12,
      expirationYear: 29,
    };
    const apiCall = axios.post.mockResolvedValueOnce({
      data: { token: '12345' },
    });
    const token = await bt.payments.storeCreditCard({
      card: creditCardInfo,
    });

    expect(apiCall).toHaveBeenCalledWith('/sources/cards', {
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
    const billingInfo = {
      address: {
        city: 'Honolulu',
        country: 'US',
        line1: '123 Chill street',
        postalCode: '11111',
        state: 'HI',
      },
    };
    const apiCall = axios.post.mockResolvedValueOnce({
      data: { token: '12345' },
    });
    const token = await bt.payments.storeCreditCard({
      card: creditCardInfo,
      billingDetails: billingInfo,
    });

    expect(apiCall).toHaveBeenCalledWith('/sources/cards', {
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
    expect(token).toEqual({ token: '12345' });
  });

  it('should create a new credit card with all fields', async () => {
    const creditCardInfo = {
      number: '12345678910111213',
      expirationMonth: 12,
      expirationYear: 29,
      cvc: '123',
    };
    const billingInfo = {
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
    const apiCall = axios.post.mockResolvedValueOnce({
      data: { token: '12345' },
    });
    const token = await bt.payments.storeCreditCard({
      card: creditCardInfo,
      billingDetails: billingInfo,
    });

    expect(apiCall).toHaveBeenCalledWith('/sources/cards', {
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
    expect(token).toEqual({ token: '12345' });
  });
});
