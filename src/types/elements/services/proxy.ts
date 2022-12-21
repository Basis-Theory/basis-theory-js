import type { ProxyRequestOptions } from '@/types/sdk';

interface Proxy {
  get(options?: ProxyRequestOptions): Promise<any>;
  post(options?: ProxyRequestOptions): Promise<any>;
  patch(options?: ProxyRequestOptions): Promise<any>;
  put(options?: ProxyRequestOptions): Promise<any>;
  delete(options?: ProxyRequestOptions): Promise<any>;
}

export type { Proxy };
