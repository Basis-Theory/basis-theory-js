import type { AxiosRequestTransformer, AxiosResponseTransformer } from 'axios';
import {
  transformTokenRequestSnakeCase,
  transformTokenResponseCamelCase,
} from '@/common';
import { BasisTheoryService, BasisTheoryServiceOptions } from '@/service';
import { CrudBuilder } from '@/service/CrudBuilder';
import type { TokenIntent, CreateTokenIntent } from '@/types/models';

export const BasisTheoryTokenIntents = new CrudBuilder(
  class BasisTheoryTokenIntents extends BasisTheoryService {
    public constructor(options: BasisTheoryServiceOptions) {
      const _options = options;

      // eslint-disable-next-line unicorn/prefer-spread
      _options.transformRequest = ([] as AxiosRequestTransformer[]).concat(
        transformTokenRequestSnakeCase,
        options.transformRequest || []
      );

      // eslint-disable-next-line unicorn/prefer-spread
      _options.transformResponse = ([] as AxiosResponseTransformer[]).concat(
        transformTokenResponseCamelCase,
        options.transformResponse || []
      );

      super(_options);
    }
  }
)
  .create<TokenIntent, CreateTokenIntent>()
  .delete()
  .build();

export type BasisTheoryTokenIntents = InstanceType<
  typeof BasisTheoryTokenIntents
>;
