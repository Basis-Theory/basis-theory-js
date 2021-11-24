import MockAdapter from 'axios-mock-adapter';
import { Chance } from 'chance';
import { BasisTheory } from '../src';
import { mockServiceClient } from './setup/utils';

describe('Atomic', () => {
  let bt: BasisTheory;
  let chance: Chance.Chance;
  let client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    bt = await new BasisTheory().init(chance.string());
    client = mockServiceClient(bt.atomic);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  describe('Cards', () => {
    it('should create a new credit card', async () => {
      const creditCardInfo = {
        number: '12345678910111213',
        expirationMonth: 12,
        expirationYear: 29,
        cvc: '123',
      };

      client.onPost('/cards').reply(201, {
        id: chance.string(),
        // eslint-disable-next-line camelcase
        created_at: chance.string(),
      });

      const token = await bt.atomic.storeCreditCard({
        card: creditCardInfo,
      });

      expect(client.history.post.length).toBe(1);
      expect(client.history.post[0].data).toStrictEqual(
        /* eslint-disable camelcase */
        JSON.stringify({
          card: {
            number: '12345678910111213',
            expiration_month: 12,
            expiration_year: 29,
            cvc: '123',
          },
        })
        /* eslint-enable camelcase */
      );
      expect(token).toStrictEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
      });
    });
  });

  describe('Banks', () => {
    it('should create a new bank with all fields', async () => {
      const bankInfo = {
        accountNumber: '123456789',
        routingNumber: '12345679012',
      };

      client.onPost('/banks').reply(201, {
        id: chance.string(),
        // eslint-disable-next-line camelcase
        created_at: chance.string(),
      });
      const token = await bt.atomic.storeBank({
        bank: bankInfo,
      });

      expect(client.history.post.length).toBe(1);
      expect(client.history.post[0].data).toStrictEqual(
        JSON.stringify({
          bank: {
            /* eslint-disable camelcase */
            account_number: '123456789',
            routing_number: '12345679012',
            /* eslint-enable camelcase */
          },
        })
      );
      expect(token).toStrictEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
      });
    });
  });
});
