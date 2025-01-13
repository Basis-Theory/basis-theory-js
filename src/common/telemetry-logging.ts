import { datadogLogs } from '@datadog/browser-logs';
import { DD_GIT_SHA, DD_TOKEN, DEFAULT_BASE_URL } from './constants';

const initTelemetryLogger = (): void => {
  let env = '';

  if (DEFAULT_BASE_URL.includes('localhost')) {
    env = 'local';
  } else if (DEFAULT_BASE_URL.includes('dev')) {
    env = 'dev';
  } else {
    env = 'prod';
  }

  if (window?.DD_LOGS && DD_TOKEN) {
    window?.DD_LOGS.init({
      clientToken: DD_TOKEN,
      forwardErrorsToLogs: false,
      sessionSampleRate: 100,
      service: 'basis-theory-js-sdk',
      env,
    });

    window?.DD_LOGS.setGlobalContext({
      referrer: document.referrer,
      gitSha: DD_GIT_SHA ?? 'unknown',
    });
  }
};

const telemetryLogger = {
  logger: {
    error: (message: string, attributes?: Record<string, unknown>): void => {
      datadogLogs.logger.error(message, attributes);
    },
    info: (message: string, attributes?: Record<string, unknown>): void => {
      datadogLogs.logger.info(message, attributes);
    },
    warn: (message: string, attributes?: Record<string, unknown>): void => {
      datadogLogs.logger.warn(message, attributes);
    },
  },
};

export { telemetryLogger, initTelemetryLogger };
