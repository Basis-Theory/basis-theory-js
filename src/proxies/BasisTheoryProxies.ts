import type { AxiosRequestTransformer, AxiosResponseTransformer } from 'axios';
import {
  transformProxyResponseCamelCase,
  transformProxyRequestSnakeCase,
} from '@/common/utils';
import { BasisTheoryService } from '@/service';
import type { BasisTheoryServiceOptions } from '@/service';
import { CrudBuilder } from '@/service/CrudBuilder';
import type {
  CreateProxy,
  UpdateProxy,
  Proxy,
  PatchProxy,
} from '@/types/models';
import type { ListProxyQuery } from '@/types/sdk';

export const BasisTheoryProxies = new CrudBuilder(
  class BasisTheoryProxies extends BasisTheoryService {
    public constructor(options: BasisTheoryServiceOptions) {
      const _options = {
        ...options,
      };

      // eslint-disable-next-line unicorn/prefer-spread
      _options.transformRequest = ([] as AxiosRequestTransformer[]).concat(
        transformProxyRequestSnakeCase,
        options.transformRequest || []
      );

      // eslint-disable-next-line unicorn/prefer-spread
      _options.transformResponse = ([] as AxiosResponseTransformer[]).concat(
        transformProxyResponseCamelCase,
        options.transformResponse || []
      );

      super(_options);
    }
  }
)
  .create<Proxy, CreateProxy>()
  .retrieve<Proxy>()
  .update<Proxy, UpdateProxy>()
  .patch<PatchProxy>()
  .delete()
  .list<Proxy, ListProxyQuery>()
  .build();
