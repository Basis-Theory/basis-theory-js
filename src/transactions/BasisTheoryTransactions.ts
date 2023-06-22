import type { AxiosRequestTransformer, AxiosResponseTransformer } from 'axios';
import { createRequestConfig } from '@/common';
import {
  dataExtractor,
  transformProxyResponseCamelCase,
  transformProxyRequestSnakeCase,
} from '@/common/utils';
import { BasisTheoryService } from '@/service';
import type { BasisTheoryServiceOptions } from '@/service';
import type { RequestOptions } from '@/types/sdk';
import {
  CreateTransactionResponse,
  Transactions,
} from '@/types/sdk/services/transactions';

export class BasisTheoryTransactions
  extends BasisTheoryService
  implements Transactions {
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

  public create(
    options: RequestOptions = {}
  ): Promise<CreateTransactionResponse> {
    return this.client
      .post('/', undefined, createRequestConfig(options))
      .then(dataExtractor);
  }

  public commit(id: string, options: RequestOptions = {}): Promise<void> {
    const url = `/${id}/commit`;

    return this.client
      .post(url, undefined, createRequestConfig(options))
      .then(dataExtractor);
  }

  public rollback(id: string, options: RequestOptions = {}): Promise<void> {
    const url = `/${id}/rollback`;

    return this.client
      .post(url, undefined, createRequestConfig(options))
      .then(dataExtractor);
  }
}
