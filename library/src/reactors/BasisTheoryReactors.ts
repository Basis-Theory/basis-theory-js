import type {
  Reactor,
  CreateReactor,
  UpdateReactor,
  ReactRequest,
  ReactResponse,
  DataObject,
} from '@basis-theory/basis-theory-elements-interfaces/models';
import type {
  ListReactorQuery,
  RequestOptions,
} from '@basis-theory/basis-theory-elements-interfaces/sdk';
import type { AxiosTransformer } from 'axios';
import { createRequestConfig, dataExtractor, proxyRaw } from '../common';
import {
  transformReactorResponseCamelCase,
  transformReactorRequestSnakeCase,
} from '../common/utils';
import { BasisTheoryService } from '../service';
import type { BasisTheoryServiceOptions } from '../service';
import { CrudBuilder } from '../service/CrudBuilder';

export const BasisTheoryReactors = new CrudBuilder(
  class BasisTheoryReactors extends BasisTheoryService {
    public constructor(options: BasisTheoryServiceOptions) {
      const _options = {
        ...options,
      };

      // eslint-disable-next-line unicorn/prefer-spread
      _options.transformRequest = ([] as AxiosTransformer[]).concat(
        transformReactorRequestSnakeCase,
        options.transformRequest || []
      );

      // eslint-disable-next-line unicorn/prefer-spread
      _options.transformResponse = ([] as AxiosTransformer[]).concat(
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
