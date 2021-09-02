import { BasisTheoryElements } from '../elements';
import { findScript, injectScript } from './script';

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
        resolve(window.BasisTheoryElements);

        return;
      }

      try {
        const url = `https://${process.env.JS_HOST}/elements`;
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

        script.addEventListener('error', (event) => {
          reject(
            event?.error ||
              new Error(
                'There was an unknown error when loading BasisTheoryElements'
              )
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
