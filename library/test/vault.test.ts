import { BasisTheory } from '../src';

describe('Vault', () => {
  let bt: BasisTheory;

  beforeAll(async () => {
    bt = await new BasisTheory().init('dummy-key');
  });

  it('should create a new token', async () => {
    const apiCall = mockedAxios.post.mockResolvedValueOnce({
      data: { token: '12345', data: 'any data we want!' },
    });

    const token = await bt.vault.createToken('any data we want!');

    expect(apiCall).toHaveBeenCalledWith('/tokens', {
      data: 'any data we want!',
    });
    expect(token).toEqual({ token: '12345', data: 'any data we want!' });
  });

  it('should retrieve a token', async () => {
    const apiCall = mockedAxios.get.mockResolvedValueOnce({
      data: { token: '12345', data: 'any data we want!' },
    });

    const token = await bt.vault.getToken('12345');

    expect(apiCall).toHaveBeenCalledWith('/tokens/12345');

    expect(token).toEqual({ token: '12345', data: 'any data we want!' });
  });

  it('should delete a token', async () => {
    const apiCall = mockedAxios.delete.mockResolvedValueOnce({});

    await bt.vault.deleteToken('12345');

    expect(apiCall).toHaveBeenCalledWith('/tokens/12345');
  });
});
