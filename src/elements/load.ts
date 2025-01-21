import { logger } from '@/common/logging';
import type { BasisTheoryElements } from '@/types/elements';
import {
  ELEMENTS_NOM_DOM_ERROR_MESSAGE,
  ELEMENTS_SCRIPT_FAILED_TO_DELIVER,
  ELEMENTS_SCRIPT_LOAD_ERROR_MESSAGE,
  ELEMENTS_SCRIPT_UNKNOWN_ERROR_MESSAGE,
} from './constants';
import { findScript, injectScript } from './script';

let elementsPromise: Promise<BasisTheoryElements>;

const loadScript = (
  url: string,
  retryCount: number
): Promise<BasisTheoryElements> =>
  new Promise<BasisTheoryElements>((resolve, reject) => {
    let script = findScript(url);

    if (!script) {
      script = injectScript(url);
    }

    // flag to prevent double rejection (if somehow script was not removed)
    let isSettled = false;

    // script load success
    script.addEventListener('load', () => {
      if (window.BasisTheoryElements) {
        resolve(window.BasisTheoryElements);
      } else {
        (async () => {
          await logger.log.error('Elements not found on window on load', {
            logType: 'elementsNotFoundOnWindow',
            logOrigin: 'loadScript',
            retryCount,
          });
        })();

        reject(new Error(ELEMENTS_SCRIPT_LOAD_ERROR_MESSAGE));
      }
    });

    // script error event
    script.addEventListener('error', async (event) => {
      if (isSettled) {
        return;
      }

      isSettled = true;
      await logger.log.error('Elements script onError event', {
        logType: 'elementsScriptOnError',
        logOrigin: 'loadScript',
        retryCount,
        event: {
          message: event?.message,
          source: event?.filename,
          lineno: event?.lineno,
          colno: event?.colno,
          error: event?.error,
          target: event?.target,
        },
      });

      // remove from dom to avoid duplicates
      try {
        script?.remove();
      } catch (error) {
        await logger.log.error(
          `Error removing script from DOM on retry attempt ${retryCount}`,
          {
            logType: 'scriptRemovalError',
            logOrigin: 'loadScript',
            retryCount,
            removalError: error,
          }
        );
      }

      // retry 1x if first attempt
      if (retryCount === 0) {
        loadScript(url, retryCount + 1)
          .then(resolve)
          .catch(reject);

        return;
      }

      // second attempt has failed: try fetching the script to inspect the response
      try {
        const response = await fetch(url);

        if (!response.ok) {
          await logger.log.error(
            `Second attempt to load elements script failed, fetch failed with status: ${response.status}.`,
            {
              logType: 'elementsScriptFetchFailure',
              logOrigin: 'loadScript',
              retryCount,
              fetchResult: 'error',
              fetchResponse: response,
            }
          );

          reject(new Error(ELEMENTS_SCRIPT_FAILED_TO_DELIVER));
        } else {
          await logger.log.error(
            `Second attempt to load elements script failed, fetch success`,
            {
              logType: 'elementsScriptFetchFailure',
              logOrigin: 'loadScript',
              retryCount,
              fetchResult: 'success',
              fetchResponse: response,
            }
          );

          reject(new Error(ELEMENTS_SCRIPT_UNKNOWN_ERROR_MESSAGE));
        }
      } catch (error) {
        // fetch also failed
        await logger.log.error(
          'Second attempt failed to load elements script failed, fetch network error.',
          {
            logType: 'elementsScriptFetchError',
            logOrigin: 'loadScript',
            retryCount,
            fetchResult: 'error',
            fetchError: error,
          }
        );

        reject(new Error(ELEMENTS_SCRIPT_UNKNOWN_ERROR_MESSAGE));
      }

      // ultimately reject with browser message
      reject(
        event?.error ||
          event?.message ||
          new Error(ELEMENTS_SCRIPT_UNKNOWN_ERROR_MESSAGE)
      );
    });
  });

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

          throw new Error('Invalid format for the given Elements client url.');
        }
      }

      loadScript(url, 0)
        .then(resolve)
        .catch((error) => {
          reject(error);
        });
    });
  }

  return elementsPromise;
};

export { loadElements };
