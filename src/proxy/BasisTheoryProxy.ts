import {
  createRequestConfig,
  dataAndHeadersExtractor,
  dataExtractor,
  proxyRaw,
} from '@/common';
import { BasisTheoryService } from '@/service';
import type { Proxy, ProxyRequestOptions } from '@/types/sdk';

type PROXY_METHODS = 'get' | 'post' | 'put' | 'patch' | 'delete';

export class BasisTheoryProxy extends BasisTheoryService implements Proxy {
  public get(options?: ProxyRequestOptions): Promise<any> {
    return this.proxyRequest('get', options);
  }

  public post(options?: ProxyRequestOptions): Promise<any> {
    return this.proxyRequest('post', options);
  }

  public put(options?: ProxyRequestOptions): Promise<any> {
    return this.proxyRequest('put', options);
  }

  public patch(options?: ProxyRequestOptions): Promise<any> {
    return this.proxyRequest('patch', options);
  }

  public delete(options?: ProxyRequestOptions): Promise<any> {
    return this.proxyRequest('delete', options);
  }

  private proxyRequest(
    method: PROXY_METHODS,
    options?: ProxyRequestOptions
  ): Promise<any> {
    const extractor = options?.includeResponseHeaders
      ? dataAndHeadersExtractor
      : dataExtractor;

    if (method === 'post' || method === 'put' || method === 'patch') {
      return this.client[method](
        options?.path ?? '',
        options?.body ?? undefined,
        createRequestConfig(options, {
          transformRequest: proxyRaw,
          transformResponse: proxyRaw,
        })
      ).then(extractor);
    }

    return this.client[method](
      options?.path ?? '/',
      createRequestConfig(options, {
        transformRequest: proxyRaw,
        transformResponse: proxyRaw,
      })
    ).then(extractor);
  }
}
