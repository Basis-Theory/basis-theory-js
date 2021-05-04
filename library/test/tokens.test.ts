import { BasisTheory } from '../src';
import { axios } from './setup';

describe('Tokens', () => {
  let bt: BasisTheory;

  beforeAll(async () => {
    bt = await new BasisTheory().init('dummy-key');
  });

  it('should create a new token', async () => {
    const apiCall = axios.post.mockResolvedValueOnce({
      data: {
        id: '12345',
        tenant_id: '123',
        data: {
          my_field: 'some value',
        },
      },
    });

    const token = await bt.tokens.createToken('any data we want!');

    expect(apiCall).toHaveBeenCalledWith('/', {
      data: 'any data we want!',
    });
    expect(token).toEqual({
      id: '12345',
      tenantId: '123',
      data: {
        my_field: 'some value',
      },
    });
  });

  it('should retrieve a token', async () => {
    const apiCall = axios.get.mockResolvedValueOnce({
      data: {
        id: '12345',
        tenant_id: '123',
        data: {
          my_field: 'some value',
        },
      },
    });

    const token = await bt.tokens.getToken('12345');

    expect(apiCall).toHaveBeenCalledWith('/12345');

    expect(token).toEqual({
      id: '12345',
      tenantId: '123',
      data: {
        my_field: 'some value',
      },
    });
  });

  it('should delete a token', async () => {
    const apiCall = axios.delete.mockResolvedValueOnce({});

    await bt.tokens.deleteToken('12345');

    expect(apiCall).toHaveBeenCalledWith('/12345');
  });
});
