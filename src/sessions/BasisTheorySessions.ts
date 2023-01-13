import type { AxiosTransformer } from 'axios';
import { createRequestConfig } from '@/common';
import {
  dataExtractor,
  transformProxyResponseCamelCase,
  transformProxyRequestSnakeCase,
} from '@/common/utils';
import { BasisTheoryService } from '@/service';
import type { BasisTheoryServiceOptions } from '@/service';
import type { RequestOptions } from '@/types/sdk';
import type {
  CreateSessionResponse,
  AuthorizeSessionRequest,
  Sessions,
} from '@/types/sdk/services/sessions';

export class BasisTheorySessions
  extends BasisTheoryService
  implements Sessions {
  public constructor(options: BasisTheoryServiceOptions) {
    const _options = {
      ...options,
    };

    // eslint-disable-next-line unicorn/prefer-spread
    _options.transformRequest = ([] as AxiosTransformer[]).concat(
      transformProxyRequestSnakeCase,
      options.transformRequest || []
    );

    // eslint-disable-next-line unicorn/prefer-spread
    _options.transformResponse = ([] as AxiosTransformer[]).concat(
      transformProxyResponseCamelCase,
      options.transformResponse || []
    );

    super(_options);
  }

  public create(options: RequestOptions = {}): Promise<CreateSessionResponse> {
    return this.client
      .post('/', undefined, createRequestConfig(options))
      .then(dataExtractor);
  }

  public authorize(
    authorizeSessionRequest: AuthorizeSessionRequest,
    options: RequestOptions = {}
  ): Promise<void> {
    const url = `/authorize`;

    return this.client
      .post(url, authorizeSessionRequest, createRequestConfig(options))
      .then(dataExtractor);
  }
}
