import { createRequestConfig, dataExtractor, proxyRaw } from '@/common';
import { BasisTheoryService } from '@/service';
import type { TokenizeData } from '@/types/models';
import type { RequestOptions } from '@/types/sdk';

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
