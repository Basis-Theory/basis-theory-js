import { BasisTheoryElements, ServicesMap } from '../types';
import { findScript, injectScript } from './utils';

export const SERVICES: ServicesMap = {
  vault: {
    production: 'https://api.basistheory.com/vault',
    sandbox: 'https://api-dev.basistheory.com/vault',
    local: 'http://localhost:3000/vault', // TODO env var
  },
  payments: {
    production: 'https://api.basistheory.com/payments',
    sandbox: 'https://api-dev.basistheory.com/payments',
    local: 'http://localhost:3000/payments', // TODO env var
  },
};

export const API_KEY_HEADER = 'X-API-KEY';

export const assertInit = <T>(prop: T): NonNullable<T> => {
  if (!prop) {
    throw new Error('BasisTheory has not yet been properly initialized.');
  }
  return prop as NonNullable<T>;
};

let elementsPromise: Promise<BasisTheoryElements>;

export const loadElements = (): Promise<BasisTheoryElements> => {
  if (!elementsPromise) {
    elementsPromise = new Promise((resolve, reject) => {
      if (typeof window !== 'object') {
        reject(
          new Error(
            'Tried to load BasisTheoryElements in a non-DOM environment.'
          )
        );
        return;
      }
      if (window.BasisTheoryElements) {
        // TODO print console message
        resolve(window.BasisTheoryElements);
        return;
      }
      try {
        const url = 'https://js.basistheory.com/elements/index.js';
        let script = findScript(url);

        if (!script) {
          script = injectScript(url);
        }
        script.addEventListener('load', () => {
          if (window.BasisTheoryElements) {
            resolve(window.BasisTheoryElements);
          } else {
            reject(new Error('BasisTheoryElements did not load properly.'));
          }
        });

        script.addEventListener('error', () => {
          reject(
            new Error('There was an error when loading BasisTheoryElements')
          );
        });
      } catch (error) {
        reject(error);
        return;
      }
    });
  }
  return elementsPromise;
};
