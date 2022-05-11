import type { TokenizeData } from '@basis-theory/basis-theory-elements-interfaces/models';
import type { RequestOptions } from '@basis-theory/basis-theory-elements-interfaces/sdk';
import { createRequestConfig, dataExtractor, proxyRaw } from '../common';
import { BasisTheoryService } from '../service';

export class BasisTheoryTokenize extends BasisTheoryService {
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
