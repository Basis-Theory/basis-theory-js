import { logger } from '@/common/logging';
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
        (async () => {
          await logger.log.warn(ELEMENTS_NOM_DOM_ERROR_MESSAGE, {
            logType: 'elementsNonDomError',
            logOrigin: 'loadElements',
          });

          reject(new Error(ELEMENTS_NOM_DOM_ERROR_MESSAGE));
        })();

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
            (async () => {
              await logger.log.warn(
                'Invalid format for the given Elements client url.',
                {
                  logType: 'invalidClientUrlError',
                  logOrigin: 'loadElements',
                }
              );
            })();

            throw new Error(
              'Invalid format for the given Elements client url.'
            );
          }
        }

        let script = findScript(url);

        if (!script) {
          script = injectScript(url);
        }

        script.addEventListener('load', async () => {
          if (window.BasisTheoryElements) {
            resolve(window.BasisTheoryElements);
          } else {
            await logger.log.error('Elements not found on window on load', {
              logType: 'elementsNotFoundOnWindow',
              logOrigin: 'loadElements',
            });

            reject(new Error(ELEMENTS_SCRIPT_LOAD_ERROR_MESSAGE));
          }
        });

        script.addEventListener('error', async (event) => {
          await logger.log.error('Elements script onError event', {
            logType: 'elementsScriptOnError',
            logOrigin: 'loadElements',
            event: {
              message: event?.message,
              source: event?.filename,
              lineno: event?.lineno,
              colno: event?.colno,
              error: event?.error,
              target: event?.target,
            },
          });

          reject(
            event?.error ||
              event?.message ||
              new Error(ELEMENTS_SCRIPT_UNKNOWN_ERROR_MESSAGE)
          );
        });
      } catch (error) {
        logger.log.error('Unexpected error loading Elements script', {
          logType: 'unexpectedError',
          logOrigin: 'loadElements',
          errorObject: error,
        });

        reject(error);

        return;
      }
    });
  }

  return elementsPromise;
};

export { loadElements };
