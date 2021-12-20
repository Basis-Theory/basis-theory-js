import { BasisTheoryElements } from '@basis-theory/basis-theory-elements-interfaces/elements';
import { BasisTheoryInitOptionsWithElements } from '@basis-theory/basis-theory-elements-interfaces/sdk';
import { Chance } from 'chance';
import type { BasisTheory as BasisTheoryType } from '../src';
import { describeif } from './setup/utils';

describe('Elements', () => {
  const chance = new Chance();

  beforeEach(() => {
    jest.resetModules();
  });

  it('should not load elements with default options', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { BasisTheory } = require('../src');
    const bt = await new BasisTheory().init('');

    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      bt.elements;
    }).toThrowError();
  });

  it('should not load elements with elements=false', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { BasisTheory } = require('../src');
    const bt = await new BasisTheory().init('', { elements: false });

    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      bt.elements;
    }).toThrowError();
  });

  describeif(typeof window !== 'object')('in a windowless environment', () => {
    it('should not load elements ', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { BasisTheory } = require('../src');

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
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { BasisTheory } = require('../src');
      const bt = new BasisTheory();

      await expect(() =>
        bt.init(chance.string(), {
          elements: true,
          elementsBaseUrl: chance.string(),
        })
      ).rejects.toThrowError('Invalid format for the given Elements base url.');
    });

    it('should resolve with a valid base elements url', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { BasisTheory } = require('../src');
      const bt = new BasisTheory();
      const validUrl = chance.url({ protocol: 'https' });

      expect(
        bt.init(chance.string(), {
          elements: true,
          elementsBaseUrl: validUrl,
        })
      ).resolves.toBe(bt);
    });

    it('should resolve to previously initialized BasisTheoryElements', async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { BasisTheory } = require('../src');
      let loadElements: () => unknown = jest.fn();

      jest.isolateModules(() => {
        ({ loadElements } = require('../src/elements'));
      });

      const expectedElements = ({
        init: jest.fn(),
      } as unknown) as BasisTheoryType;

      window.BasisTheoryElements = expectedElements as BasisTheoryElements;
      expect(await loadElements()).toBe(expectedElements);

      const baseUrl = chance.url({
        protocol: 'https',
        path: '',
      });

      await new BasisTheory().init('', {
        elements: true,
        elementsBaseUrl: baseUrl,
      });

      expect(expectedElements.init).toHaveBeenCalledWith(
        '',
        baseUrl.replace(/\/$/u, '')
      );
    });

    it('should reject if load elements throws error', () => {
      const message = 'load error';

      jest.mock('../src/elements/script', () => ({
        findScript: (): void => {
          throw new Error(message);
        },
      }));

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { BasisTheory } = require('../src');

      expect(
        new BasisTheory().init('', { elements: true })
      ).rejects.toThrowError(message);
    });

    describe('with a previously loaded script', () => {
      let addEventListener: jest.Mock<void>;
      let loadCallback: () => void;
      let errorCallback: (event?: unknown) => void;

      beforeEach(() => {
        jest.mock('../src/elements/script', () => ({
          findScript: (): unknown => {
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
      });

      it('should resolve successfully', async () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { BasisTheory } = require('../src');
        const promise = new BasisTheory().init('', { elements: true });

        expect(addEventListener.mock.calls[0]).toEqual([
          'load',
          expect.any(Function),
        ]);
        expect(addEventListener.mock.calls[1]).toEqual([
          'error',
          expect.any(Function),
        ]);

        window.BasisTheoryElements = ({
          init: jest.fn(),
        } as unknown) as BasisTheoryElements;

        loadCallback();
        await expect(promise).resolves.toBeDefined();
      });

      it('should reject when Elements can not load in window', () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { BasisTheory } = require('../src');
        const promise = new BasisTheory().init('', { elements: true });

        loadCallback();
        expect(promise).rejects.toThrowError(
          'BasisTheoryElements did not load properly.'
        );
      });

      it('should reject when Elements throw unknown error', () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { BasisTheory } = require('../src');
        const promise = new BasisTheory().init('', { elements: true });

        errorCallback();
        expect(promise).rejects.toThrowError(
          'There was an unknown error when loading BasisTheoryElements'
        );
      });

      it('should reject when Elements throw error', () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { BasisTheory } = require('../src');
        const message = chance.string();
        const promise = new BasisTheory().init('', { elements: true });

        errorCallback({ error: new Error(message) });
        expect(promise).rejects.toThrowError(message);
      });
    });

    describe('when mounting a new script tag', () => {
      let addEventListener: jest.Mock<void>;
      let loadCallback: () => void;
      let bt: {
        elements: BasisTheoryElements;
        init?: (
          apiKey: string,
          options: BasisTheoryInitOptionsWithElements
        ) => Promise<BasisTheoryType & BasisTheoryElements>;
      };
      const elementsInit = jest.fn();

      beforeEach(() => {
        addEventListener = jest.fn((event: string, callback: () => void) => {
          if (event === 'load') {
            loadCallback = callback;
            window.BasisTheoryElements = ({
              init: elementsInit,
            } as unknown) as BasisTheoryElements;
            bt = {
              elements: window.BasisTheoryElements,
            };
          }
        });

        jest.mock('../src/elements/script', () => ({
          findScript: (): unknown => undefined,
          injectScript: (): unknown => {
            const script = document.createElement('script');

            return {
              ...script,
              addEventListener,
            };
          },
        }));

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { BasisTheory } = require('../src');

        bt = new BasisTheory();
      });

      it('should resolve successfully and have elements initialized', async () => {
        const baseUrl = chance.url({
          protocol: 'https',
          path: '',
        });
        const promise = bt.init?.('el-123', {
          elements: true,
          elementsBaseUrl: baseUrl,
        });

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
          baseUrl.replace(/\/$/u, '')
        );
      });
    });
  });
});
