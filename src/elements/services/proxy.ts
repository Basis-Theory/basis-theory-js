import { BasisTheoryProxy } from '@/proxy';
import type {
  Proxy as ElementsProxy,
  BasisTheoryElementsInternal,
} from '@/types/elements';
import type { Proxy, ProxyRequestOptions } from '@/types/sdk';

const delegateProxy = (
  elements?: BasisTheoryElementsInternal
): new (
  ...args: ConstructorParameters<typeof BasisTheoryProxy>
) => ElementsProxy & Proxy =>
  class BasisTheoryProxyElementsDelegate
    extends BasisTheoryProxy
    implements ElementsProxy {
    public get(options?: ProxyRequestOptions): Promise<any> {
      if (elements !== undefined) {
        return elements.proxy.get(options);
      }

      return super.get(options);
    }

    public post(options?: ProxyRequestOptions): Promise<any> {
      if (elements !== undefined) {
        return elements.proxy.post(options);
      }

      return super.post(options);
    }

    public put(options?: ProxyRequestOptions): Promise<any> {
      if (elements !== undefined) {
        return elements.proxy.put(options);
      }

      return super.put(options);
    }

    public patch(options?: ProxyRequestOptions): Promise<any> {
      if (elements !== undefined) {
        return elements.proxy.patch(options);
      }

      return super.patch(options);
    }

    public delete(options?: ProxyRequestOptions): Promise<any> {
      if (elements !== undefined) {
        return elements.proxy.delete(options);
      }

      return super.delete(options);
    }
  };

export { delegateProxy };
