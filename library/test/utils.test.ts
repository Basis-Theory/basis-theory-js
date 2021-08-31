import type { AxiosResponse } from 'axios';
import { Chance } from 'chance';
import { API_KEY_HEADER } from '../dist/common';
import { BT_TRACE_ID_HEADER } from '../src/common';
import {
  errorInterceptor,
  dataExtractor,
  createRequestConfig,
} from '../src/common/utils';
import type { RequestOptions } from '../src/service';

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
    it('should throw BasisTheoryApiError with response status and response data', async () => {
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
    it('should throw BasisTheoryApiError with -1 for the status and an undefined for data', async () => {
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
});
