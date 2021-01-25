import mockAxios from 'jest-mock-axios';
import { BasisTheory } from '../src/BasisTheory';

const basisTheory: BasisTheory = new BasisTheory({ apiKey: '123' });

describe('createToken', () => {
  it('creates a new token identifier', () => {
    const token = 'tok_1234';
    let catchFn = jest.fn(),
      thenFn = jest.fn();

    basisTheory.Vault
      .createToken('any data we want!')
      .then(thenFn)
      .catch(catchFn);

    expect(mockAxios.post).toHaveBeenCalledWith('/token', {
      data: JSON.stringify({ data: 'any data we want!' }),
    });

    mockAxios.mockResponse({ data: { token } });

    expect(thenFn).toHaveBeenCalledWith({ token });
  });
});
