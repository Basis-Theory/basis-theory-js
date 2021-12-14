import type { TokenizeData } from '@basis-theory/basis-theory-elements-interfaces/models';
import type { RequestOptions } from '@basis-theory/basis-theory-elements-interfaces/sdk';
import type { AxiosTransformer } from 'axios';
import { createRequestConfig } from '../common';
import {
  dataExtractor,
  proxyRaw,
  transformTokenRequestSnakeCase,
  transformTokenResponseCamelCase,
} from '../common/utils';
import { BasisTheoryService, BasisTheoryServiceOptions } from '../service';

export class BasisTheoryTokenize extends BasisTheoryService {
  public constructor(options: BasisTheoryServiceOptions) {
    const _options = options;

    // eslint-disable-next-line unicorn/prefer-spread
    _options.transformRequest = ([] as AxiosTransformer[]).concat(
      transformTokenRequestSnakeCase,
      options.transformRequest || []
    );

    // eslint-disable-next-line unicorn/prefer-spread
    _options.transformResponse = ([] as AxiosTransformer[]).concat(
      transformTokenResponseCamelCase,
      options.transformResponse || []
    );

    super(_options);
  }

  public tokenize(
    tokens: TokenizeData,
    options: RequestOptions = {}
  ): Promise<TokenizeData> {
    return this.client
      .post(
        '/',
        tokens,
        createRequestConfig(options, {
          transformRequest: proxyRaw,
          transformResponse: proxyRaw,
        })
      )
      .then(dataExtractor);
  }
}
