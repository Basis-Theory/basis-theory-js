import { Chance } from 'chance';
import type { BasisTheory as BasisTheoryType } from '@/BasisTheory';
import type { BasisTheoryElementsInternal } from '@/types/elements';
import { describeif } from './setup/utils';

describe('Elements', () => {
  const chance = new Chance();
  let BasisTheory: typeof BasisTheoryType;

  const loadModule = (): void => {
    jest.resetModules();
    ({ BasisTheory } = require('../src'));
  };

  beforeEach(() => {
    loadModule();

    if (typeof window === 'object') {
      delete window.BasisTheoryElements;
    }
  });

  test('should not load elements with default options', async () => {
    const bt = await new BasisTheory().init('');

    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      ((bt as unknown) as { elements: unknown }).elements;
    }).toThrow('BasisTheory has not yet been properly initialized.');
  });

  test('should not load elements with elements=false', async () => {
    const bt = await new BasisTheory().init('', { elements: false });

    expect(() => {
      // eslint-disable-next-line no-unused-expressions
      ((bt as unknown) as { elements: unknown }).elements;
    }).toThrow('BasisTheory has not yet been properly initialized.');
  });

  describeif(typeof window !== 'object')('in a windowless environment', () => {
    test('should not load elements', () => {
      expect(() =>
        new BasisTheory().init('', {
          elements: true,
        })
      ).rejects.toThrow(
        'Tried to load BasisTheoryElements in a non-DOM environment.'
      );
    });
  });

  describeif(typeof window === 'object')('in a window environment', () => {
    test('should throw error for invalid base elements url', async () => {
      const bt = new BasisTheory();

      await expect(() =>
        bt.init(chance.string(), {
          elements: true,
          elementsBaseUrl: chance.string(),
        })
      ).rejects.toThrow('Invalid format for the given Elements base url.');
    });

    test('should throw error for invalid client elements url', async () => {
      const bt = new BasisTheory();

      await expect(() =>
        bt.init(chance.string(), {
          elements: true,
          elementsClientUrl: chance.string(),
          disableTelemetry: true,
        })
      ).rejects.toThrow('Invalid format for the given Elements client url.');
    });

    test('should resolve with a valid base elements url', () => {
      const bt = new BasisTheory();
      const validUrl = chance.url({ protocol: 'https' });

      expect(
        bt.init(chance.string(), {
          elements: true,
          elementsBaseUrl: validUrl,
        })
        // eslint-disable-next-line jest/no-restricted-matchers
      ).resolves.toBe(bt);
    });

    test('should resolve with a valid client elements url', () => {
      const bt = new BasisTheory();
      const validUrl = chance.url({ protocol: 'https' });

      expect(
        bt.init(chance.string(), {
          elements: true,
          elementsClientUrl: validUrl,
        })
        // eslint-disable-next-line jest/no-restricted-matchers
      ).resolves.toBe(bt);
    });

    test('should initialize BasisTheoryElements with useNgApi and useSameOriginApi false if not specified', async () => {
      let loadElements: () => unknown = jest.fn();

      jest.isolateModules(() => {
        ({ loadElements } = require('../src/elements'));
      });

      const expectedElements = ({
        init: jest.fn(),
      } as unknown) as BasisTheoryType;

      window.BasisTheoryElements = (expectedElements as unknown) as BasisTheoryElementsInternal;
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
        baseUrl.replace(/\/$/u, ''),
        false,
        false,
        false,
        false
      );
    });

    test('should initialize BasisTheoryElements with specified useNgApi and useSameOriginApi params', async () => {
      let loadElements: () => unknown = jest.fn();

      jest.isolateModules(() => {
        ({ loadElements } = require('../src/elements'));
      });

      const expectedElements = ({
        init: jest.fn(),
      } as unknown) as BasisTheoryType;

      window.BasisTheoryElements = (expectedElements as unknown) as BasisTheoryElementsInternal;
      expect(await loadElements()).toBe(expectedElements);
      const baseUrl = chance.url({
        protocol: 'https',
        path: '',
      });
      const useNgApi = chance.bool();
      const useSameOriginApi = chance.bool();

      await new BasisTheory().init('', {
        elements: true,
        elementsBaseUrl: baseUrl,
        elementsUseNgApi: useNgApi,
        elementsUseSameOriginApi: useSameOriginApi,
      });

      expect(expectedElements.init).toHaveBeenCalledWith(
        '',
        baseUrl.replace(/\/$/u, ''),
        useNgApi,
        useSameOriginApi,
        false,
        false
      );
    });

    test('should resolve to previously initialized BasisTheoryElements', async () => {
      let loadElements: () => unknown = jest.fn();

      jest.isolateModules(() => {
        ({ loadElements } = require('../src/elements'));
      });

      const expectedElements = ({
        init: jest.fn(),
      } as unknown) as BasisTheoryType;

      window.BasisTheoryElements = (expectedElements as unknown) as BasisTheoryElementsInternal;
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
        baseUrl.replace(/\/$/u, ''),
        false,
        false,
        false,
        false
      );
    });

    test('should reject if load elements throws error', () => {
      const message = 'load error';

      jest.mock('../src/elements/script', () => ({
        findScript: (): void => {
          throw new Error(message);
        },
      }));

      loadModule();

      expect(new BasisTheory().init('', { elements: true })).rejects.toThrow(
        message
      );
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

        loadModule();
      });

      test('should resolve successfully', async () => {
        const promise = new BasisTheory().init('', { elements: true });

        // eslint-disable-next-line jest/prefer-strict-equal
        expect(addEventListener.mock.calls[0]).toEqual([
          'load',
          expect.any(Function),
        ]);
        // eslint-disable-next-line jest/prefer-strict-equal
        expect(addEventListener.mock.calls[1]).toEqual([
          'error',
          expect.any(Function),
        ]);

        window.BasisTheoryElements = ({
          init: jest.fn(),
        } as unknown) as BasisTheoryElementsInternal;

        loadCallback();
        expect(await promise).toBeDefined();
      });

      test('should reject when Elements can not load in window', () => {
        const promise = new BasisTheory().init('', { elements: true });

        loadCallback();
        expect(promise).rejects.toThrow(
          'Basis Theory Elements did not load properly.'
        );
      });

      test('should reject when Elements throw unknown error', () => {
        const promise = new BasisTheory().init('', { elements: true });

        errorCallback();
        expect(promise).rejects.toThrow(
          'There was an unknown error when loading Basis Theory Elements. Check the console for details.'
        );
      });

      test('should reject when Elements throw error', () => {
        const message = chance.string();
        const promise = new BasisTheory().init('', { elements: true });

        errorCallback({ error: new Error(message) });
        expect(promise).rejects.toThrow(message);
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
            window.BasisTheoryElements = ({
              init: elementsInit,
            } as unknown) as BasisTheoryElementsInternal;
            bt.elements = window.BasisTheoryElements as BasisTheoryElementsInternal;
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

        loadModule();
        bt = new BasisTheory();
      });

      test('should resolve successfully and have elements initialized', async () => {
        const baseUrl = chance.url({
          protocol: 'https',
          path: '',
        });
        const promise = bt.init?.('el-123', {
          elements: true,
          elementsBaseUrl: baseUrl,
        });

        // eslint-disable-next-line jest/prefer-strict-equal
        expect(addEventListener.mock.calls[0]).toEqual([
          'load',
          expect.any(Function),
        ]);
        // eslint-disable-next-line jest/prefer-strict-equal
        expect(addEventListener.mock.calls[1]).toEqual([
          'error',
          expect.any(Function),
        ]);

        loadCallback();
        await promise;

        expect(bt.elements).toBeDefined();
        expect(elementsInit).toHaveBeenCalledWith(
          'el-123',
          baseUrl.replace(/\/$/u, ''),
          false,
          false,
          false,
          false
        );
      });
    });
  });
});
