import { datadogLogs } from '@datadog/browser-logs';
import { DD_GIT_SHA, DD_TOKEN, DEFAULT_BASE_URL } from './constants';

let env = '';
const initTelemetryLogger = (): void => {
  if (DEFAULT_BASE_URL.includes('localhost')) {
    env = 'local';
  } else if (DEFAULT_BASE_URL.includes('dev')) {
    env = 'dev';
  } else {
    env = 'prod';
  }

  if (DD_TOKEN && process.env.NODE_ENV !== 'test') {
    if (
      !datadogLogs.getInitConfiguration() ||
      datadogLogs.getInitConfiguration()?.clientToken !== DD_TOKEN
    ) {
      datadogLogs.init({
        clientToken: DD_TOKEN,
        forwardErrorsToLogs: false,
        sessionSampleRate: 100,
        env,
      });
    }

    datadogLogs.setGlobalContext({
      referrer: document.referrer,
    });

    datadogLogs.createLogger('js-sdk-logger');
  }
};

const telemetryLogger = {
  logger: {
    error: (message: string, attributes?: Record<string, unknown>): void => {
      if (datadogLogs && process.env.NODE_ENV !== 'test') {
        datadogLogs.getLogger('js-sdk-logger')?.error(message, {
          service: 'js-sdk',
          gitSha: DD_GIT_SHA ?? 'unknown',
          env,
          ...attributes,
        });
      }

      return;
    },
    info: (message: string, attributes?: Record<string, unknown>): void => {
      if (datadogLogs && process.env.NODE_ENV !== 'test') {
        datadogLogs.getLogger('js-sdk-logger')?.info(message, {
          service: 'js-sdk',
          gitSha: DD_GIT_SHA ?? 'unknown',
          env,
          ...attributes,
        });
      }

      return;
    },
    warn: (message: string, attributes?: Record<string, unknown>): void => {
      datadogLogs.getLogger('js-sdk-logger')?.warn(message, {
        service: 'js-sdk',
        gitSha: DD_GIT_SHA ?? 'unknown',
        env,
        ...attributes,
      });

      return;
    },
  },
};

export { telemetryLogger, initTelemetryLogger };
