import { Chance } from 'chance';
import { delegateProxy } from '@/elements/services/proxy';
import { BasisTheoryElementsInternal } from '@/types/elements';
import { Proxy as ElementsProxy } from '@/types/elements/services';
import { Proxy, ProxyRequestOptions } from '@/types/sdk';

describe('elements proxy service', () => {
  let chance: Chance.Chance;
  let expectedResponse: string;
  const hasElement = jest.fn();
  let serviceInstance: Proxy & ElementsProxy;
  let expectedOptions: ProxyRequestOptions;
  const superMethod = jest.fn();
  let elementsInstance: {
    proxy: {
      get: jest.Mock;
      post: jest.Mock;
      put: jest.Mock;
      patch: jest.Mock;
      delete: jest.Mock;
    };
  } & {
    hasElement: jest.Mock;
  };

  describe('elements is initialized', () => {
    beforeEach(() => {
      chance = new Chance();

      expectedResponse = chance.string();

      expectedOptions = {
        apiKey: chance.string(),
        path: chance.string(),
        query: {
          [chance.string()]: chance.string(),
        },
        headers: {
          [chance.string()]: chance.string(),
        },
      };

      elementsInstance = {
        proxy: {
          get: jest.fn().mockReturnValue(expectedResponse),
          post: jest.fn().mockReturnValue(expectedResponse),
          put: jest.fn().mockReturnValue(expectedResponse),
          patch: jest.fn().mockReturnValue(expectedResponse),
          delete: jest.fn().mockReturnValue(expectedResponse),
        },
        hasElement,
      };

      serviceInstance = new (delegateProxy(
        (elementsInstance as unknown) as BasisTheoryElementsInternal
      ))({
        apiKey: chance.string(),
        baseURL: chance.url(),
      });
    });

    test('should delegate get and delete call to elements (no body)', () => {
      const getResponse = serviceInstance.get(expectedOptions);
      const deleteResponse = serviceInstance.delete(expectedOptions);

      expect(elementsInstance.proxy.get).toHaveBeenCalledTimes(1);
      expect(elementsInstance.proxy.get).toHaveBeenCalledWith(expectedOptions);

      expect(elementsInstance.proxy.delete).toHaveBeenCalledTimes(1);
      expect(elementsInstance.proxy.delete).toHaveBeenCalledWith(
        expectedOptions
      );

      expect(getResponse).toBe(expectedResponse);
      expect(deleteResponse).toBe(expectedResponse);
    });

    test('should delegate post, put and patch call to elements (w body)', () => {
      expectedOptions.body = {
        [chance.string()]: chance.string(),
      };

      const postResponse = serviceInstance.post(expectedOptions);
      const putResponse = serviceInstance.put(expectedOptions);
      const patchResponse = serviceInstance.patch(expectedOptions);

      expect(elementsInstance.proxy.post).toHaveBeenCalledTimes(1);
      expect(elementsInstance.proxy.post).toHaveBeenCalledWith(expectedOptions);

      expect(elementsInstance.proxy.patch).toHaveBeenCalledTimes(1);
      expect(elementsInstance.proxy.patch).toHaveBeenCalledWith(
        expectedOptions
      );

      expect(elementsInstance.proxy.put).toHaveBeenCalledTimes(1);
      expect(elementsInstance.proxy.put).toHaveBeenCalledWith(expectedOptions);

      expect(postResponse).toBe(expectedResponse);
      expect(putResponse).toBe(expectedResponse);
      expect(patchResponse).toBe(expectedResponse);
    });
  });

  describe('elements is not initialized', () => {
    beforeEach(() => {
      chance = new Chance();

      expectedResponse = chance.string();

      expectedOptions = {
        apiKey: chance.string(),
        path: chance.string(),
        query: {
          [chance.string()]: chance.string(),
        },
        headers: {
          [chance.string()]: chance.string(),
        },
      };

      (hasElement as jest.Mock).mockReturnValue(false);

      superMethod.mockReturnValue(expectedResponse);

      const ProxyServiceClass = delegateProxy(undefined);

      Object.setPrototypeOf(ProxyServiceClass.prototype, {
        get: superMethod,
        post: superMethod,
        put: superMethod,
        patch: superMethod,
        delete: superMethod,
      });

      serviceInstance = new ProxyServiceClass({
        apiKey: chance.string(),
        baseURL: chance.url(),
      });
    });

    test('should delegate get and delete call to elements (no body)', () => {
      const getResponse = serviceInstance.get(expectedOptions);

      expect(superMethod).toHaveBeenCalledTimes(1);
      expect(superMethod).toHaveBeenCalledWith(expectedOptions);

      const deleteResponse = serviceInstance.delete(expectedOptions);

      expect(superMethod).toHaveBeenCalledTimes(2);
      expect(superMethod).toHaveBeenCalledWith(expectedOptions);

      expect(getResponse).toBe(expectedResponse);
      expect(deleteResponse).toBe(expectedResponse);
    });

    test('should delegate post, put and patch call to elements (w body)', () => {
      expectedOptions.body = {
        [chance.string()]: chance.string(),
      };

      const postResponse = serviceInstance.post(expectedOptions);

      expect(superMethod).toHaveBeenCalledTimes(3);
      expect(superMethod).toHaveBeenCalledWith(expectedOptions);

      const putResponse = serviceInstance.put(expectedOptions);

      expect(superMethod).toHaveBeenCalledTimes(4);
      expect(superMethod).toHaveBeenCalledWith(expectedOptions);
      const patchResponse = serviceInstance.patch(expectedOptions);

      expect(superMethod).toHaveBeenCalledTimes(5);
      expect(superMethod).toHaveBeenCalledWith(expectedOptions);

      expect(postResponse).toBe(expectedResponse);
      expect(putResponse).toBe(expectedResponse);
      expect(patchResponse).toBe(expectedResponse);
    });
  });
});
