import { BasisTheory } from '../src';
import { Chance } from 'chance';

describe('Init', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should throw error if init is called consecutively', () => {
    const bt = new BasisTheory();
    bt.init(chance.string());
    expect(() => bt.init(chance.string())).rejects.toThrowError(
      'This BasisTheory instance has been already initialized.'
    );
  });

  it('should throw error if await to init and call it again', async () => {
    const bt = new BasisTheory();
    await bt.init(chance.string());

    await expect(() => bt.init(chance.string())).rejects.toThrowError(
      'This BasisTheory instance has been already initialized.'
    );
  });
});
