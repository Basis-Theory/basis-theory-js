import { Chance } from 'chance';
import { BasisTheory } from '@/BasisTheory';
import {
  loadElements,
  delegateTokens,
  delegateTokenize,
  delegateProxy,
  delegateTokenIntents,
} from '@/elements';

jest.mock('../src/elements');

describe('Init', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
    (delegateTokens as jest.Mock).mockImplementation(() =>
      jest.fn().mockReturnValue({})
    );
    (delegateTokenize as jest.Mock).mockImplementation(() =>
      jest.fn().mockReturnValue({})
    );
    (delegateProxy as jest.Mock).mockImplementation(() =>
      jest.fn().mockReturnValue({})
    );
    (delegateTokenIntents as jest.Mock).mockImplementation(() =>
      jest.fn().mockReturnValue({})
    );
  });

  test('should throw error if init is called consecutively', () => {
    const bt = new BasisTheory();

    bt.init(chance.string());
    expect(() => bt.init(chance.string())).rejects.toThrow(
      'This BasisTheory instance has been already initialized.'
    );
  });

  test('should throw error if await to init and call it again', async () => {
    const bt = new BasisTheory();

    await bt.init(chance.string());

    await expect(() => bt.init(chance.string())).rejects.toThrow(
      'This BasisTheory instance has been already initialized.'
    );
  });

  test('should throw error for invalid base API url', async () => {
    const bt = new BasisTheory();

    await expect(() =>
      bt.init(chance.string(), { apiBaseUrl: chance.string() })
    ).rejects.toThrow('Invalid format for the given API base url.');
  });

  test('should accept a valid base API url', async () => {
    const bt = new BasisTheory();
    const validUrl = chance.url({ protocol: 'https' });

    expect(
      await bt.init(chance.string(), { apiBaseUrl: validUrl })
    ).toStrictEqual(bt);
  });

  test('should allow init again if throws error', async () => {
    jest
      .mocked(loadElements)
      .mockRejectedValueOnce(new Error('Load Elements error'));

    const bt = new BasisTheory();

    await expect(() =>
      bt.init(chance.string(), { elements: true })
    ).rejects.toThrow('Load Elements error');

    expect(await bt.init(chance.string())).toStrictEqual(bt);
  });
});
