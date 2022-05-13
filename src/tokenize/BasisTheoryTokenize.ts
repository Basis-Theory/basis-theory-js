import { createRequestConfig, dataExtractor, proxyRaw } from '@/common';
import type { TokenizeData } from '@/interfaces/models';
import type { RequestOptions } from '@/interfaces/sdk';
import { BasisTheoryService } from '@/service';

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
