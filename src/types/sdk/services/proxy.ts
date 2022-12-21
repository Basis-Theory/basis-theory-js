import type { RequestOptions } from './shared';

interface Proxy {
  get(options?: ProxyRequestOptions): Promise<any>;
  post(options?: ProxyRequestOptions): Promise<any>;
  patch(options?: ProxyRequestOptions): Promise<any>;
  put(options?: ProxyRequestOptions): Promise<any>;
  delete(options?: ProxyRequestOptions): Promise<any>;
}

type BasisTheoryProxyHeaders = {
  [key: string]: string;
  'BT-PROXY-URL': string;
  'BT-PROXY-KEY': string;
};

type ProxyHeaders = Partial<BasisTheoryProxyHeaders>;

type BasisTheoryQueryParams = {
  [key: string]: string;
  'bt-proxy-key': string;
};

type ProxyQuery = Partial<BasisTheoryQueryParams>;

interface ProxyRequestOptions extends RequestOptions {
  path?: string;
  query?: ProxyQuery;
  headers?: ProxyHeaders;
  body?: unknown;
}

export type { Proxy, ProxyRequestOptions, ProxyHeaders, ProxyQuery };
