import type { BasisTheoryElements } from '@basis-theory/basis-theory-elements-interfaces/elements';
import type { BasisTheoryInit } from '@basis-theory/basis-theory-elements-interfaces/sdk';
import { Chance } from 'chance';
import { BasisTheory } from '../../src';
import { loadElements } from '../../src/elements';

jest.mock('../../src/elements/load');

describe('createElement', () => {
  let bt: BasisTheoryElements & BasisTheoryInit, chance: Chance.Chance;

  beforeEach(() => {
    bt = new BasisTheory();
    chance = new Chance();
  });

  describe('should throw error', () => {
    test('when BT has not been initialized', () => {
      expect(() => bt.createElement('card')).toThrow(
        'BasisTheory Elements was not properly initialized.'
      );
      expect(loadElements).toHaveBeenCalledTimes(0);
    });
    test('when BT was initialized without elements:true', async () => {
      await bt.init(chance.string());
      expect(() => bt.createElement('card')).toThrow(
        'BasisTheory Elements was not properly initialized.'
      );
      expect(loadElements).toHaveBeenCalledTimes(0);
    });
  });

  describe('when BT was initialized with elements:true', () => {
    test('should delegate to elements instance', async () => {
      const createElement = jest.fn();
      const elements = ({
        createElement,
      } as unknown) as BasisTheoryElements;

      // eslint-disable-next-line jest/prefer-spy-on, @typescript-eslint/no-explicit-any
      (elements as any).init = jest.fn().mockResolvedValueOnce(elements);

      jest.mocked(loadElements).mockResolvedValueOnce(elements);

      await bt.init(chance.string(), { elements: true });

      const type = chance.string() as 'card';
      const options = {
        [chance.string()]: chance.string(),
      };

      bt.createElement(type, options);

      expect(createElement).toHaveBeenCalledWith(type, options);
    });
  });
});
