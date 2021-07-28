import { BasisTheory } from '../src';
import { Chance } from 'chance';
import MockAdapter from 'axios-mock-adapter';
import { mockServiceClient } from './setup/utils';

describe('Tokens', () => {
  let bt: BasisTheory;
  let chance: Chance.Chance;
  let client: MockAdapter;

  beforeAll(async () => {
    chance = new Chance();
    bt = await new BasisTheory().init(chance.string());
    client = mockServiceClient(bt.tokens);
  });

  beforeEach(() => {
    client.resetHandlers();
    client.resetHistory();
  });

  it('should create a new token', async () => {
    client.onPost('/').reply(201, {
      id: chance.string(),
      tenant_id: chance.string(),
      created_at: chance.string(),
    });

    const data = chance.string();

    const token = await bt.tokens.createToken(data);

    expect(client.history.post.length).toBe(1);
    expect(client.history.post[0].data).toStrictEqual(
      JSON.stringify({
        data,
      })
    );
    expect(token).toStrictEqual({
      id: expect.any(String),
      tenantId: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('should retrieve a token', async () => {
    const id = chance.string();

    client.onGet(`/${id}`).reply(200, {
      id: chance.string(),
      tenant_id: chance.string(),
      created_at: chance.string(),
    });

    const token = await bt.tokens.getToken(id);

    expect(client.history.get.length).toBe(1);
    expect(token).toStrictEqual({
      id: expect.any(String),
      tenantId: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('should delete a token', async () => {
    const id = chance.string();

    client.onDelete(`/${id}`).reply(204);

    await bt.tokens.deleteToken(id);

    expect(client.history.delete.length).toBe(1);
  });
});
