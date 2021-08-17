import type { AtomicBank, CreateAtomicBankModel } from './types';
import type {
  BasisTheoryServiceOptions,
  PaginatedQuery,
  RequestOptions,
} from '../../service';
import type { ReactRequest } from '../types';
import type { Token } from '../../tokens';
import {
  createRequestConfig,
  dataExtractor,
  transformAtomicReactionRequestSnakeCase,
  transformTokenResponseCamelCase,
  transformAtomicRequestSnakeCase,
  transformAtomicResponseCamelCase,
} from '../../common';
import { BasisTheoryService } from '../../service';
import { CrudBuilder } from '../../service/CrudBuilder';

export const BasisTheoryAtomicBanks = new CrudBuilder(
  class BasisTheoryAtomicBanks extends BasisTheoryService {
    public constructor(options: BasisTheoryServiceOptions) {
      super({
        transformRequest: transformAtomicRequestSnakeCase,
        transformResponse: transformAtomicResponseCamelCase,
        ...options,
      });
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
        .post(`/${id}/react`, request, {
          transformRequest: transformAtomicReactionRequestSnakeCase,
          transformResponse: transformTokenResponseCamelCase,
          ...createRequestConfig(options),
        })
        .then(dataExtractor);
    }

    public async retrieveReaction(
      atomicBankId: string,
      reactionTokenId: string,
      options?: RequestOptions
    ): Promise<Token> {
      return this.client
        .get(`/${atomicBankId}/reaction/${reactionTokenId}`, {
          transformResponse: transformTokenResponseCamelCase,
          ...createRequestConfig(options),
        })
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
