import { datadogLogs } from '@datadog/browser-logs';
import { DD_GIT_SHA, DD_TOKEN, DEFAULT_BASE_URL } from './constants';

const LOGGER_NAME = 'js-sdk-logger';
const SERVICE_NAME = 'js-sdk';

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
      });
    }

    datadogLogs.setGlobalContext({
      referrer: document.referrer,
    });

    datadogLogs.createLogger(LOGGER_NAME);
  }
};

const telemetryLogger = {
  logger: {
    error: (message: string, attributes?: Record<string, unknown>): void => {
      if (datadogLogs && process.env.NODE_ENV !== 'test') {
        datadogLogs.getLogger(LOGGER_NAME)?.error(message, {
          service: SERVICE_NAME,
          gitSha: DD_GIT_SHA ?? 'unknown',
          env,
          ...attributes,
        });
      }

      return;
    },
    info: (message: string, attributes?: Record<string, unknown>): void => {
      if (datadogLogs && process.env.NODE_ENV !== 'test') {
        datadogLogs.getLogger(LOGGER_NAME)?.info(message, {
          service: SERVICE_NAME,
          gitSha: DD_GIT_SHA ?? 'unknown',
          env,
          ...attributes,
        });
      }

      return;
    },
    warn: (message: string, attributes?: Record<string, unknown>): void => {
      datadogLogs.getLogger(LOGGER_NAME)?.warn(message, {
        service: SERVICE_NAME,
        gitSha: DD_GIT_SHA ?? 'unknown',
        env,
        ...attributes,
      });

      return;
    },
  },
};

export { telemetryLogger, initTelemetryLogger };
