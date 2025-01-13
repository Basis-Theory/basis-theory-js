import { telemetryLogger } from '@/common/telemetry-logging';
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
        telemetryLogger.logger.warn(ELEMENTS_NOM_DOM_ERROR_MESSAGE, {
          logType: 'elementsNonDomError',
          logOrigin: 'loadElements',
        });
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
            telemetryLogger.logger.warn(
              'Invalid format for the given Elements client url.',
              {
                logType: 'invalidClientUrlError',
                logOrigin: 'loadElements',
              }
            );

            throw new Error(
              'Invalid format for the given Elements client url.'
            );
          }
        }

        let script = findScript(url);

        if (!script) {
          script = injectScript(url);
        }

        // list for window error events for same script
        window.addEventListener('error', (event) => {
          telemetryLogger.logger.error(
            'Elements script onError event from window',
            {
              logType: 'elementsNotFoundOnWindow',
              logOrigin: 'loadElements',
              eventObject: event,
              event: {
                type: event.type,
                src: script?.src,
              },
            }
          );
        });

        script.addEventListener('load', (event) => {
          if (window.BasisTheoryElements) {
            resolve(window.BasisTheoryElements);
          } else {
            telemetryLogger.logger.error(
              'Elements not found on window on load',
              {
                logType: 'elementsNotFoundOnWindow',
                logOrigin: 'loadElements',
                eventObject: event,
                event: {
                  type: event.type,
                  src: script?.src,
                },
              }
            );

            reject(new Error(ELEMENTS_SCRIPT_LOAD_ERROR_MESSAGE));
          }
        });

        script.addEventListener('error', (event) => {
          telemetryLogger.logger.warn('Elements script onError event', {
            logType: 'elementsNotFoundOnWindow',
            logOrigin: 'loadElements',
            eventObject: event,
            event: {
              type: event.type,
              src: script?.src,
            },
          });

          // printing full error event to console for debugging
          // eslint-disable-next-line no-console
          console.error(event);
          reject(
            event?.error || new Error(ELEMENTS_SCRIPT_UNKNOWN_ERROR_MESSAGE)
          );
        });
      } catch (error) {
        telemetryLogger.logger.error(
          'Unexpected error loading Elements script',
          {
            logType: 'unexpectedError',
            logOrigin: 'loadElements',
            error,
          }
        );

        reject(error);

        return;
      }
    });
  }

  return elementsPromise;
};

export { loadElements };
