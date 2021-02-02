import { BasisTheory } from '../src';

describe('Payments', () => {
  let bt: BasisTheory;

  beforeAll(async () => {
    bt = await new BasisTheory().init('dummy-key');
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
