import type { AxiosResponse } from 'axios';
import { Chance } from 'chance';
import * as os from 'os';
import {
  BT_TRACE_ID_HEADER,
  API_KEY_HEADER,
  buildUserAgentString,
  USER_AGENT_CLIENT,
  getBrowser,
  errorInterceptor,
  dataExtractor,
  createRequestConfig,
  getOSVersion,
  getRuntime,
  BROWSER_LIST,
} from '@/common';
import type { RequestOptions } from '@/interfaces/sdk';
import type { ApplicationInfo } from '@/types';
import { describeif } from './setup/utils';

jest.mock('os', () => ({
  version: jest.fn().mockReturnValue('1.0.0'),
  type: jest.fn().mockReturnValue('testOs'),
}));

describe('Utils', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  describe('data extractor', () => {
    test('should handle falsy data', () => {
      expect(
        dataExtractor((undefined as unknown) as AxiosResponse)
      ).toBeUndefined();
      // eslint-disable-next-line unicorn/no-null
      expect(dataExtractor((null as unknown) as AxiosResponse)).toBeUndefined();
    });
    test('should extract data', () => {
      expect(dataExtractor(({} as unknown) as AxiosResponse)).toBeUndefined();
      expect(
        dataExtractor(({ data: chance.string() } as unknown) as AxiosResponse)
      ).toStrictEqual(expect.any(String));
    });
  });

  describe('create request config', () => {
    test('should handle falsy data', () => {
      expect(createRequestConfig(undefined)).toBeUndefined();
      expect(
        // eslint-disable-next-line unicorn/no-null
        createRequestConfig((null as unknown) as RequestOptions)
      ).toBeUndefined();
    });
    test('should handle empty options', () => {
      expect(createRequestConfig({})).toStrictEqual({
        headers: {},
      });
    });
    test('should handle options', () => {
      expect(
        createRequestConfig({
          apiKey: chance.string(),
          correlationId: chance.string(),
        })
      ).toStrictEqual({
        headers: {
          [API_KEY_HEADER]: expect.any(String),
          [BT_TRACE_ID_HEADER]: expect.any(String),
        },
      });
    });
  });

  describe('error interceptor', () => {
    test('should throw BasisTheoryApiError with response status and response data', () => {
      const expectedError = {
        name: 'BasisTheoryApiError',
        message: 'some error message',
        response: {
          data: {
            key1: 'value1',
            key2: 'value2',
          },
          status: 418,
        },
      };

      try {
        errorInterceptor(expectedError);
        fail('should have thrown BasisTheoryApiError');
      } catch (error) {
        /* eslint-disable jest/no-conditional-expect */
        expect(error).toHaveProperty('name', 'BasisTheoryApiError');
        expect(error).toHaveProperty('message', expectedError.message);
        expect(error).toHaveProperty('status', expectedError.response.status);
        expect(error).toHaveProperty('data', expectedError.response.data);
        /* eslint-enable jest/no-conditional-expect */
      }
    });
    test('should throw BasisTheoryApiError with -1 for the status and an undefined for data', () => {
      const errorMessage = 'some error message';

      const expectedError = {
        name: 'BasisTheoryApiError',
        message: errorMessage,
        status: -1,
        data: undefined,
      };

      try {
        errorInterceptor(expectedError);
        fail('should have thrown BasisTheoryApiError');
      } catch (error) {
        /* eslint-disable jest/no-conditional-expect */
        expect(error).toHaveProperty('name', 'BasisTheoryApiError');
        expect(error).toHaveProperty('message', expectedError.message);
        expect(error).toHaveProperty('status', expectedError.status);
        expect(error).toHaveProperty('data', expectedError.data);
        /* eslint-enable jest/no-conditional-expect */
      }
    });
  });

  describe('user agent utilities', () => {
    const env = process.env;

    chance = new Chance();
    const osType = chance.string({
      alpha: true,
      symbols: false,
    });
    const versionNumber = chance.integer({
      min: 0,
      max: 100,
    });
    const testVersion = `${versionNumber}.${versionNumber}.${versionNumber}`;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...env };
      process.env.VERSION = testVersion;

      const browser = chance.pickone(BROWSER_LIST);

      if (typeof window !== 'undefined') {
        Object.defineProperty(window.navigator, 'appVersion', {
          value: `(${osType})`,
        });

        Object.defineProperty(window.navigator, 'userAgent', {
          value: `${browser.browserUA}/${testVersion}`,
          configurable: true,
        });
      }
    });

    afterAll(() => {
      process.env = env;
    });

    test('should build the user agent string', () => {
      const userAgentString = buildUserAgentString();

      expect(userAgentString).toStrictEqual(
        `${USER_AGENT_CLIENT}/${testVersion}`
      );
    });

    test('should build the user agent string w/ app info', () => {
      const name = chance.string();
      const version = testVersion;
      const url = chance.url();

      const appInfo: ApplicationInfo = {
        name,
        version,
        url,
      };

      const userAgentString = buildUserAgentString(appInfo);

      expect(userAgentString).toStrictEqual(
        `${USER_AGENT_CLIENT}/${testVersion} (${name}; ${version}; ${url})`
      );
    });

    test('should get the os version', () => {
      (os.type as jest.Mock).mockReturnValue(osType);
      (os.version as jest.Mock).mockReturnValue(testVersion);

      const osString =
        typeof window === 'undefined' ? `${osType}/${testVersion}` : osType;

      expect(getOSVersion()).toStrictEqual(osString);
    });

    describeif(typeof window === 'object')('in a window environment', () => {
      test('should get the browser runtime version', () => {
        const runtime = getBrowser();

        expect(getRuntime()).toStrictEqual(runtime);
      });
    });

    describeif(typeof window !== 'object')(
      'in a windowless environment',
      () => {
        test('should get the node runtime version', () => {
          const runtime = `NodeJS/${process.version}`;

          expect(getRuntime()).toStrictEqual(runtime);
        });
      }
    );
  });
});
