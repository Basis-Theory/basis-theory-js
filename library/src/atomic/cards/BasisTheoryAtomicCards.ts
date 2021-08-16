import {
  transformAtomicRequestSnakeCase,
  transformAtomicResponseCamelCase,
} from './../../common/utils';
import type { AtomicCard, CreateAtomicCardModel } from './types';
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
} from '../../common';
import { BasisTheoryService } from '../../service';
import { CrudBuilder } from '../../service/CrudBuilder';

export const BasisTheoryAtomicCards = new CrudBuilder(
  class BasisTheoryAtomicCards extends BasisTheoryService {
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
    ): Promise<AtomicCard> {
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
      atomicCardId: string,
      reactionTokenId: string,
      options?: RequestOptions
    ): Promise<Token> {
      return this.client
        .get(`/${atomicCardId}/reaction/${reactionTokenId}`, {
          transformResponse: transformTokenResponseCamelCase,
          ...createRequestConfig(options),
        })
        .then(dataExtractor);
    }
  }
)
  .create<AtomicCard, CreateAtomicCardModel>()
  .retrieve<AtomicCard>()
  .delete()
  .list<AtomicCard, PaginatedQuery>()
  .build();

export type BasisTheoryAtomicCards = InstanceType<
  typeof BasisTheoryAtomicCards
>;
