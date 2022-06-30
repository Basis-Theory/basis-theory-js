import type { AxiosTransformer } from 'axios';
import { createRequestConfig, dataExtractor } from '@/common';
import {
  transformAtomicRequestSnakeCase,
  transformAtomicResponseCamelCase,
} from '@/common/utils';
import type { BasisTheoryServiceOptions } from '@/service';
import { BasisTheoryService } from '@/service';
import { CrudBuilder } from '@/service/CrudBuilder';
import type {
  AtomicCard,
  CreateAtomicCard,
  UpdateAtomicCard,
} from '@/types/models';
import type { PaginatedQuery, RequestOptions } from '@/types/sdk';

export const BasisTheoryAtomicCards = new CrudBuilder(
  class BasisTheoryAtomicCards extends BasisTheoryService {
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
      request: UpdateAtomicCard,
      options?: RequestOptions
    ): Promise<AtomicCard> {
      return this.client
        .patch(`/${id}`, request, createRequestConfig(options))
        .then(dataExtractor);
    }
  }
)
  .create<AtomicCard, CreateAtomicCard>()
  .retrieve<AtomicCard>()
  .delete()
  .list<AtomicCard, PaginatedQuery>()
  .build();

export type BasisTheoryAtomicCards = InstanceType<
  typeof BasisTheoryAtomicCards
>;
