import { DEFAULT_BASE_URL } from './constants';

export const logger = (() => {
  const ddTok = 'pubb96b84a13912504f4354f2d794ea4fab';

  let isTelemetryEnabled = process.env.NODE_ENV !== 'test';

  const log = async (
    message: string,
    level: string,
    attributes = {}
  ): Promise<void> => {
    if (!isTelemetryEnabled) {
      return;
    }

    try {
      let env;

      if (DEFAULT_BASE_URL.includes('localhost')) {
        env = 'local';
      } else if (DEFAULT_BASE_URL.includes('dev')) {
        env = 'dev';
      } else {
        env = 'prod';
      }

      const payload = {
        // dd info
        level,
        message,

        // for basis theory tracking
        service: 'js-sdk',
        env,

        // browser information
        referrer: document?.referrer,
        origin: window?.location?.origin,
        url: window?.location?.href,
        userAgent: navigator?.userAgent,

        // custom values
        ...attributes,
      };

      await fetch(`https://http-intake.logs.datadoghq.com/v1/input/${ddTok}`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch {
      // eslint-disable-next-line no-console
      console.warn('There was an error sending telemetry.');
    }
  };

  const setTelemetryEnabled = (enabled: boolean): void => {
    isTelemetryEnabled = enabled;
  };

  return {
    setTelemetryEnabled,
    log: {
      error: (message: string, attributes = {}) =>
        log(message, 'error', attributes),
      info: (message: string, attributes = {}) =>
        log(message, 'info', attributes),
      warn: (message: string, attributes = {}) =>
        log(message, 'warn', attributes),
    },
  };
})();
