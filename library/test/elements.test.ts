/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Chance } from 'chance';
import type { BasisTheory as BasisTheoryType } from '../src';
import { describeif } from './setup/utils';
import { DEFAULT_ELEMENTS_BASE_URL } from './../src/common/constants';

describe('Elements', () => {
  let chance: Chance.Chance;
  let BasisTheory: typeof BasisTheoryType;

  const loadModule = () => {
    jest.resetModules();
    ({ BasisTheory } = require('../src'));
  };

  beforeEach(() => {
    chance = new Chance();
    loadModule();
  });

  it('should not load elements with default options', async () => {
    const bt = await new BasisTheory().init('');

    expect(() => {
      bt.elements;
    }).toThrowError();
  });

  it('should not load elements with elements=false', async () => {
    const bt = await new BasisTheory().init('', { elements: false });

    expect(() => {
      bt.elements;
    }).toThrowError();
  });

  describeif(typeof window !== 'object')('in a windowless environment', () => {
    it('should not load elements ', () => {
      expect(() =>
        new BasisTheory().init('', {
          elements: true,
        })
      ).rejects.toThrowError(
        'Tried to load BasisTheoryElements in a non-DOM environment.'
      );
    });
  });

  describeif(typeof window === 'object')('in a window environment', () => {
    beforeEach(() => {
      delete window.BasisTheoryElements;
    });

    it('should throw error for invalid base elements url', async () => {
      const bt = new BasisTheory();

      await expect(() =>
        bt.init(chance.string(), {
          elements: true,
          elementsBaseUrl: chance.string(),
        })
      ).rejects.toThrowError('Invalid format for the given Elements base url.');
    });

    it('should resolve with a valid base elements url', async () => {
      const bt = new BasisTheory();
      const validUrl = ' https://basistheory.com';

      expect(
        bt.init(chance.string(), {
          elements: true,
          elementsBaseUrl: validUrl,
        })
      ).resolves.toBe(bt);
    });

    it('should resolve to previously initialized BasisTheoryElements', async () => {
      let loadElements: () => unknown = jest.fn();
      jest.isolateModules(() => {
        ({ loadElements } = require('../src/common/elements'));
      });

      const expectedElements = {
        init: jest.fn(),
      };
      window.BasisTheoryElements = expectedElements;
      expect(await loadElements()).toBe(expectedElements);

      await new BasisTheory().init('', { elements: true });

      expect(expectedElements.init).toHaveBeenCalledWith(
        '',
        new URL(DEFAULT_ELEMENTS_BASE_URL).toString()
      );
    });

    it('should reject if load elements throws error', () => {
      const message = 'load error';

      jest.mock('../src/common/script', () => ({
        findScript: () => {
          throw new Error(message);
        },
      }));

      loadModule();

      expect(
        new BasisTheory().init('', { elements: true })
      ).rejects.toThrowError(message);
    });

    describe('with a previously loaded script', () => {
      let addEventListener: jest.Mock<void>;
      let loadCallback: () => void;
      let errorCallback: (event?: unknown) => void;

      beforeEach(() => {
        jest.mock('../src/common/script', () => ({
          findScript: () => {
            const script = document.createElement('script');
            return {
              ...script,
              addEventListener,
            };
          },
        }));

        addEventListener = jest.fn((event: string, callback: () => void) => {
          if (event === 'load') {
            loadCallback = callback;
          } else if (event === 'error') {
            errorCallback = callback;
          }
        });

        loadModule();
      });

      it('should resolve successfully', async () => {
        const promise = new BasisTheory().init('', { elements: true });

        expect(addEventListener.mock.calls[0]).toEqual([
          'load',
          expect.any(Function),
        ]);
        expect(addEventListener.mock.calls[1]).toEqual([
          'error',
          expect.any(Function),
        ]);

        window.BasisTheoryElements = { init: jest.fn() };

        loadCallback();
        await expect(promise).resolves.toBeDefined();
      });

      it('should reject when Elements can not load in window', () => {
        const promise = new BasisTheory().init('', { elements: true });
        loadCallback();
        expect(promise).rejects.toThrowError(
          'BasisTheoryElements did not load properly.'
        );
      });

      it('should reject when Elements throw unknown error', () => {
        const promise = new BasisTheory().init('', { elements: true });
        errorCallback();
        expect(promise).rejects.toThrowError(
          'There was an unknown error when loading BasisTheoryElements'
        );
      });

      it('should reject when Elements throw error', () => {
        const message = chance.string();
        const promise = new BasisTheory().init('', { elements: true });
        errorCallback({ error: new Error(message) });
        expect(promise).rejects.toThrowError(message);
      });
    });

    describe('when mounting a new script tag', () => {
      let addEventListener: jest.Mock<void>;
      let loadCallback: () => void;
      let bt: BasisTheoryType;
      const elementsInit = jest.fn();

      beforeEach(() => {
        addEventListener = jest.fn((event: string, callback: () => void) => {
          if (event === 'load') {
            loadCallback = callback;
            window.BasisTheoryElements = { init: elementsInit };
            bt.elements = window.BasisTheoryElements;
          }
        });

        jest.mock('../src/common/script', () => ({
          findScript: () => null,
          injectScript: () => {
            const script = document.createElement('script');
            return {
              ...script,
              addEventListener,
            };
          },
        }));

        loadModule();
        bt = new BasisTheory();
      });

      it('should resolve successfully and have elements initialized', async () => {
        const promise = bt.init('el-123', { elements: true });

        expect(addEventListener.mock.calls[0]).toEqual([
          'load',
          expect.any(Function),
        ]);
        expect(addEventListener.mock.calls[1]).toEqual([
          'error',
          expect.any(Function),
        ]);

        loadCallback();
        await promise;

        expect(bt.elements).toBeDefined();
        expect(elementsInit).toHaveBeenCalledWith(
          'el-123',
          new URL(DEFAULT_ELEMENTS_BASE_URL).toString()
        );
      });
    });
  });
});
