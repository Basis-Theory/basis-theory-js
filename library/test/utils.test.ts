import type { RequestOptions } from '@basis-theory/basis-theory-elements-interfaces/sdk';
import type { AxiosResponse } from 'axios';
import { Chance } from 'chance';
import os from 'os';
import { getOSVersion, getRuntime } from '../dist/common';
import {
  BT_TRACE_ID_HEADER,
  API_KEY_HEADER,
  buildUserAgentString,
  USER_AGENT_CLIENT,
  getBrowser,
  errorInterceptor,
  dataExtractor,
  createRequestConfig,
} from '../src/common';
import { ApplicationInfo } from '../src/types';

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
    it('should handle falsy data', () => {
      expect(
        dataExtractor((undefined as unknown) as AxiosResponse)
      ).toBeUndefined();
      // eslint-disable-next-line unicorn/no-null
      expect(dataExtractor((null as unknown) as AxiosResponse)).toBeUndefined();
    });
    it('should extract data', () => {
      expect(dataExtractor(({} as unknown) as AxiosResponse)).toBeUndefined();
      expect(
        dataExtractor(({ data: chance.string() } as unknown) as AxiosResponse)
      ).toStrictEqual(expect.any(String));
    });
  });

  describe('create request config', () => {
    it('should handle falsy data', () => {
      expect(createRequestConfig(undefined)).toBeUndefined();
      expect(
        // eslint-disable-next-line unicorn/no-null
        createRequestConfig((null as unknown) as RequestOptions)
      ).toBeUndefined();
    });
    it('should handle empty options', () => {
      expect(createRequestConfig({})).toStrictEqual({
        headers: {},
      });
    });
    it('should handle options', () => {
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
    it('should throw BasisTheoryApiError with response status and response data', () => {
      const expectedError = {
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
        expect(error).toHaveProperty('name', 'BasisTheoryApiError');
        expect(error).toHaveProperty('message', expectedError.message);
        expect(error).toHaveProperty('status', expectedError.response.status);
        expect(error).toHaveProperty('data', expectedError.response.data);
      }
    });
    it('should throw BasisTheoryApiError with -1 for the status and an undefined for data', () => {
      const errorMessage = 'some error message';

      try {
        errorInterceptor({
          message: errorMessage,
        });
        fail('should have thrown BasisTheoryApiError');
      } catch (error) {
        expect(error).toHaveProperty('name', 'BasisTheoryApiError');
        expect(error).toHaveProperty('message', errorMessage);
        expect(error).toHaveProperty('status', -1);
        expect(error).toHaveProperty('data', undefined);
      }
    });
  });

  describe('user agent utilities', () => {
    const env = process.env;

    chance = new Chance();

    const osType = chance.string({ symbols: false });
    const versionNumber = chance.integer({
      min: 0,
      max: 100,
    });
    const testVersion = `${versionNumber}.${versionNumber}.${versionNumber}`;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...env };
      process.env.VERSION = testVersion;

      const browser = chance.pickone([
        {
          browserName: 'Firefox',
          browserUA: 'Firefox',
        },
        {
          browserName: 'SamsungBrowser',
          browserUA: 'SamsungBrowser',
        },
        {
          browserName: 'Opera',
          browserUA: 'Opera',
        },
        {
          browserName: 'Opera',
          browserUA: 'OPR',
        },
        {
          browserName: 'Microsoft Internet Explorer',
          browserUA: 'Trident',
        },
        {
          browserName: 'Microsoft Edge (Legacy)',
          browserUA: 'Edge',
        },
        {
          browserName: 'Microsoft Edge (Chromium)',
          browserUA: 'Edg',
        },
        {
          browserName: 'Google Chrome/Chromium',
          browserUA: 'Chrome',
        },
        {
          browserName: 'Safari',
          browserUA: 'Safari',
        },
      ]);

      if (typeof window !== 'undefined') {
        Object.defineProperty(window.navigator, 'appVersion', {
          value: `(${osType}/${testVersion})`,
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

    it('should build the user agent string', () => {
      const userAgentString = buildUserAgentString();

      expect(userAgentString).toStrictEqual(
        `${USER_AGENT_CLIENT}/${testVersion}`
      );
    });

    it('should build the user agent string w/ app info', () => {
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

    it('should get the os version', () => {
      (os.type as jest.Mock).mockReturnValue(osType);

      (os.version as jest.Mock).mockReturnValue(testVersion);

      expect(getOSVersion()).toStrictEqual(`${osType}/${testVersion}`);
    });

    it('should get the runtime version', () => {
      const runtime =
        typeof window === 'undefined'
          ? `NodeJS/${process.version}`
          : getBrowser();

      expect(getRuntime()).toStrictEqual(runtime);
    });
  });
});
