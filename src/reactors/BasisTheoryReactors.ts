import type { AxiosRequestTransformer, AxiosResponseTransformer } from 'axios';
import { createRequestConfig, dataExtractor, proxyRaw } from '@/common';
import {
  transformReactorResponseCamelCase,
  transformReactorRequestSnakeCase,
} from '@/common/utils';
import { BasisTheoryService } from '@/service';
import type { BasisTheoryServiceOptions } from '@/service';
import { CrudBuilder } from '@/service/CrudBuilder';
import type {
  Reactor,
  CreateReactor,
  UpdateReactor,
  ReactResponse,
} from '@/types/models';
import type {
  ListReactorQuery,
  ReactRequest,
  RequestOptions,
} from '@/types/sdk';

export const BasisTheoryReactors = new CrudBuilder(
  class BasisTheoryReactors extends BasisTheoryService {
    public constructor(options: BasisTheoryServiceOptions) {
      const _options = {
        ...options,
      };

      // eslint-disable-next-line unicorn/prefer-spread
      _options.transformRequest = ([] as AxiosRequestTransformer[]).concat(
        transformReactorRequestSnakeCase,
        options.transformRequest || []
      );

      // eslint-disable-next-line unicorn/prefer-spread
      _options.transformResponse = ([] as AxiosResponseTransformer[]).concat(
        transformReactorResponseCamelCase,
        options.transformResponse || []
      );

      super(_options);
    }

    public react(
      reactorId: string,
      request: ReactRequest,
      options?: RequestOptions
    ): Promise<ReactResponse> {
      return this.client
        .post(
          `/${reactorId}/react`,
          request,
          createRequestConfig(options, {
            transformRequest: proxyRaw,
            transformResponse: proxyRaw,
          })
        )
        .then(dataExtractor);
    }
  }
)
  .create<Reactor, CreateReactor>()
  .retrieve<Reactor>()
  .update<Reactor, UpdateReactor>()
  .delete()
  .list<Reactor, ListReactorQuery>()
  .build();

export type BasisTheoryReactors = InstanceType<typeof BasisTheoryReactors>;
