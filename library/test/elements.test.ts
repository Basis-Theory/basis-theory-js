/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { mocked } from 'ts-jest/utils';
import { findScript, injectScript } from '../src/common/utils';
import type { BasisTheory as BasisTheoryType } from '../src';
import { describeif } from './setup/utils';

jest.mock('../src/common/utils');

describe('Elements', () => {
  let BasisTheory: typeof BasisTheoryType;

  beforeEach(() => {
    jest.isolateModules(async () => {
      ({ BasisTheory } = require('../src'));
    });
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

    it('should resolve to previously initialized BasisTheoryElements', async () => {
      let loadElements: () => unknown = jest.fn();
      jest.isolateModules(() => {
        ({ loadElements } = require('../src/common/constants'));
      });

      const expectedElements = {
        init: jest.fn(),
      };
      window.BasisTheoryElements = expectedElements;
      expect(await loadElements()).toBe(expectedElements);

      await new BasisTheory().init('', { elements: true });

      expect(expectedElements.init).toHaveBeenCalledWith('', 'production');
    });

    it('should reject if load elements throws error', () => {
      const message = 'load error';

      mocked(findScript).mockImplementationOnce(() => {
        throw new Error(message);
      });

      expect(
        new BasisTheory().init('', { elements: true })
      ).rejects.toThrowError(message);
    });

    describe('with a previously loaded script', () => {
      let addEventListener: jest.Mock<void>;
      let loadCallback: () => void;
      let errorCallback: () => void;

      beforeEach(() => {
        addEventListener = jest.fn((event: string, callback: () => void) => {
          if (event === 'load') {
            loadCallback = callback;
          } else if (event === 'error') {
            errorCallback = callback;
          }
        });

        mocked(findScript).mockImplementationOnce(() => {
          const script = document.createElement('script');
          return {
            ...script,
            addEventListener,
          };
        });
      });

      it('should resolve successfully', () => {
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
        expect(promise).resolves.toBeDefined();
      });

      it('should reject when Elements can not load in window', () => {
        const promise = new BasisTheory().init('', { elements: true });
        loadCallback();
        expect(promise).rejects.toThrowError(
          'BasisTheoryElements did not load properly.'
        );
      });

      it('should reject when Elements throw error', () => {
        const promise = new BasisTheory().init('', { elements: true });
        errorCallback();
        expect(promise).rejects.toThrowError(
          'There was an error when loading BasisTheoryElements'
        );
      });
    });

    describe('when mounting a new script tag', () => {
      let addEventListener: jest.Mock<void>;
      let loadCallback: () => void;
      let bt: BasisTheoryType;
      const elementsInit = jest.fn();

      beforeEach(() => {
        bt = new BasisTheory();
        addEventListener = jest.fn((event: string, callback: () => void) => {
          if (event === 'load') {
            loadCallback = callback;
            window.BasisTheoryElements = { init: elementsInit };
            bt.elements = window.BasisTheoryElements;
          }
        });

        mocked(findScript).mockImplementationOnce(() => {
          return null;
        });
        mocked(injectScript).mockImplementationOnce(() => {
          const script = document.createElement('script');
          return {
            ...script,
            addEventListener,
          };
        });
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
        expect(elementsInit).toHaveBeenCalledWith('el-123', 'production');
      });
    });
  });
});
