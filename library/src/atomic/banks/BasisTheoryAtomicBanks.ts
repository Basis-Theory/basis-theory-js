import type { AxiosTransformer } from 'axios';
import {
  createRequestConfig,
  dataExtractor,
  transformAtomicReactionRequestSnakeCase,
  transformTokenResponseCamelCase,
  transformAtomicRequestSnakeCase,
  transformAtomicResponseCamelCase,
} from '../../common';
import type {
  BasisTheoryServiceOptions,
  PaginatedQuery,
  RequestOptions,
} from '../../service';
import { BasisTheoryService } from '../../service';
import { CrudBuilder } from '../../service/CrudBuilder';
import type { Token } from '../../tokens';
import type { ReactRequest } from '../types';
import type { AtomicBank, CreateAtomicBankModel } from './types';

export const BasisTheoryAtomicBanks = new CrudBuilder(
  class BasisTheoryAtomicBanks extends BasisTheoryService {
    public constructor(options: BasisTheoryServiceOptions) {
      options.transformRequest = ([] as AxiosTransformer[]).concat(
        transformAtomicRequestSnakeCase,
        options.transformRequest || []
      );

      options.transformResponse = ([] as AxiosTransformer[]).concat(
        transformAtomicResponseCamelCase,
        options.transformResponse || []
      );

      super(options);
    }

    public async retrieveDecrypted(
      id: string,
      options?: RequestOptions
    ): Promise<AtomicBank> {
      return this.client
        .get(`/${id}/decrypt`, createRequestConfig(options))
        .then(dataExtractor);
    }

    public async react(
      id: string,
      request: ReactRequest,
      options?: RequestOptions
    ): Promise<Token> {
      return this.client
        .post(
          `/${id}/react`,
          request,
          createRequestConfig(options, {
            transformRequest: transformAtomicReactionRequestSnakeCase,
            transformResponse: transformTokenResponseCamelCase,
          })
        )
        .then(dataExtractor);
    }

    public async retrieveReaction(
      atomicBankId: string,
      reactionTokenId: string,
      options?: RequestOptions
    ): Promise<Token> {
      return this.client
        .get(
          `/${atomicBankId}/reaction/${reactionTokenId}`,
          createRequestConfig(options, {
            transformResponse: transformTokenResponseCamelCase,
          })
        )
        .then(dataExtractor);
    }
  }
)
  .create<AtomicBank, CreateAtomicBankModel>()
  .retrieve<AtomicBank>()
  .delete()
  .list<AtomicBank, PaginatedQuery>()
  .build();

export type BasisTheoryAtomicBanks = InstanceType<
  typeof BasisTheoryAtomicBanks
>;
