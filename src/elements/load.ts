import type { BasisTheoryElements } from '@/types/elements';
import {
  ELEMENTS_NOM_DOM_ERROR_MESSAGE,
  ELEMENTS_SCRIPT_LOAD_ERROR_MESSAGE,
  ELEMENTS_SCRIPT_UNKNOWN_ERROR_MESSAGE,
} from './constants';
import { findScript, injectScript } from './script';

let elementsPromise: Promise<BasisTheoryElements>;

const loadElements = (
  elementsClientUrl?: string
): Promise<BasisTheoryElements> => {
  if (!elementsPromise) {
    elementsPromise = new Promise((resolve, reject) => {
      if (typeof window !== 'object') {
        reject(new Error(ELEMENTS_NOM_DOM_ERROR_MESSAGE));

        return;
      }

      if (window.BasisTheoryElements) {
        resolve(window.BasisTheoryElements);

        return;
      }

      try {
        let url = `https://${process.env.JS_HOST}/elements`;

        if (typeof elementsClientUrl !== 'undefined') {
          try {
            const urlObject = new URL(elementsClientUrl);

            url = urlObject.toString().replace(/\/$/u, '');
          } catch {
            throw new Error(
              'Invalid format for the given Elements client url.'
            );
          }
        }

        let script = findScript(url);

        if (!script) {
          script = injectScript(url);
        }

        script.addEventListener('load', () => {
          if (window.BasisTheoryElements) {
            resolve(window.BasisTheoryElements);
          } else {
            reject(new Error(ELEMENTS_SCRIPT_LOAD_ERROR_MESSAGE));
          }
        });

        script.addEventListener('error', (event) => {
          reject(
            event?.error || new Error(ELEMENTS_SCRIPT_UNKNOWN_ERROR_MESSAGE)
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

export { loadElements };
