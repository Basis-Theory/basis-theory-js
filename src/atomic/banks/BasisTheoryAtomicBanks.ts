import type { AxiosTransformer } from 'axios';
import {
  createRequestConfig,
  dataExtractor,
  transformAtomicRequestSnakeCase,
  transformAtomicResponseCamelCase,
} from '@/common';
import type { BasisTheoryServiceOptions } from '@/service';
import { BasisTheoryService } from '@/service';
import { CrudBuilder } from '@/service/CrudBuilder';
import type {
  AtomicBank,
  CreateAtomicBank,
  UpdateAtomicBank,
} from '@/types/models';
import type { PaginatedQuery, RequestOptions } from '@/types/sdk';

export const BasisTheoryAtomicBanks = new CrudBuilder(
  class BasisTheoryAtomicBanks extends BasisTheoryService {
    public constructor(options: BasisTheoryServiceOptions) {
      const _options = {
        ...options,
      };

      // eslint-disable-next-line unicorn/prefer-spread
      _options.transformRequest = ([] as AxiosTransformer[]).concat(
        transformAtomicRequestSnakeCase,
        options.transformRequest || []
      );

      // eslint-disable-next-line unicorn/prefer-spread
      _options.transformResponse = ([] as AxiosTransformer[]).concat(
        transformAtomicResponseCamelCase,
        options.transformResponse || []
      );

      super(_options);
    }

    public update(
      id: string,
      request: UpdateAtomicBank,
      options?: RequestOptions
    ): Promise<AtomicBank> {
      return this.client
        .patch(`/${id}`, request, createRequestConfig(options))
        .then(dataExtractor);
    }
  }
)
  .create<AtomicBank, CreateAtomicBank>()
  .retrieve<AtomicBank>()
  .delete()
  .list<AtomicBank, PaginatedQuery>()
  .build();

export type BasisTheoryAtomicBanks = InstanceType<
  typeof BasisTheoryAtomicBanks
>;
