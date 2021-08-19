import { Chance } from 'chance';
import { BasisTheory } from '../src';
import { BasisTheoryElements } from '../src/elements';
import { loadElements } from '../src/common/elements';
import { mocked } from 'ts-jest/utils';

jest.mock('../src/common/elements');

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

  it('should throw error for invalid base API url', async () => {
    const bt = new BasisTheory();

    await expect(() =>
      bt.init(chance.string(), { apiBaseUrl: chance.string() })
    ).rejects.toThrowError('Invalid format for the given API base url.');
  });

  it('should accept a valid base API url', async () => {
    const bt = new BasisTheory();
    const validUrl = 'https://basistheory.com';

    await expect(
      bt.init(chance.string(), { apiBaseUrl: validUrl })
    ).resolves.toBe(bt);
  });

  it('should allow init again if throws error', async () => {
    mocked(loadElements).mockRejectedValueOnce(
      new Error('Load Elements error')
    );

    const bt = new BasisTheory();

    await expect(() =>
      bt.init(chance.string(), { elements: true })
    ).rejects.toThrowError('Load Elements error');

    await expect(bt.init(chance.string())).resolves.toBe(bt);
  });
});
