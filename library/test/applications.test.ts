import { Chance } from 'chance';
import { axios } from './setup';
import { BasisTheory } from '../src';

describe('Applications', () => {
  let bt: BasisTheory;
  let chance: Chance.Chance;
  let apiKey: string;

  beforeAll(async () => {
    chance = new Chance();
    apiKey = chance.string();
    bt = await new BasisTheory().init(apiKey);
  });

  it('should get a application by api key', async () => {
    const id = chance.string();

    const apiCall = axios.get.mockResolvedValueOnce({
      data: { id },
    });

    const application = await bt.applications.getApplicationByKey();

    expect(apiCall).toHaveBeenCalledWith('/key');
    expect(application).toEqual({ id });
  });

  it('should reject with 404', async () => {
    const apiCall = axios.get.mockRejectedValueOnce({
      status: 404,
    });

    const promise = bt.applications.getApplicationByKey();

    await expect(promise).rejects.toEqual({
      status: 404,
    });

    expect(apiCall).toHaveBeenCalledWith('/key');
  });
});
