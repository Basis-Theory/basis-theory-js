import type { AxiosTransformer } from 'axios';
import {
  createRequestConfig,
  dataExtractor,
  transformAtomicReactionRequestSnakeCase,
  transformTokenResponseCamelCase,
} from '../../common';
import {
  transformAtomicRequestSnakeCase,
  transformAtomicResponseCamelCase,
} from '../../common/utils';
import type {
  BasisTheoryServiceOptions,
  PaginatedQuery,
  RequestOptions,
} from '../../service';
import { BasisTheoryService } from '../../service';
import { CrudBuilder } from '../../service/CrudBuilder';
import type { Token } from '../../tokens';
import type { ReactRequest } from '../types';
import type { AtomicCard, CreateAtomicCardModel } from './types';

export const BasisTheoryAtomicCards = new CrudBuilder(
  class BasisTheoryAtomicCards extends BasisTheoryService {
    public constructor(options: BasisTheoryServiceOptions) {
      const _options = options;

      _options.transformRequest = [
        ...([] as AxiosTransformer[]),
        ...[transformAtomicRequestSnakeCase],
        ...((options.transformRequest as AxiosTransformer[]) || []),
      ];

      _options.transformResponse = [
        ...([] as AxiosTransformer[]),
        ...[transformAtomicResponseCamelCase],
        ...((options.transformResponse as AxiosTransformer[]) || []),
      ];

      super(_options);
    }

    public retrieveDecrypted(
      id: string,
      options?: RequestOptions
    ): Promise<AtomicCard> {
      return this.client
        .get(`/${id}/decrypt`, createRequestConfig(options))
        .then(dataExtractor);
    }

    public react(
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

    public retrieveReaction(
      atomicCardId: string,
      reactionTokenId: string,
      options?: RequestOptions
    ): Promise<Token> {
      return this.client
        .get(
          `/${atomicCardId}/reaction/${reactionTokenId}`,
          createRequestConfig(options, {
            transformResponse: transformTokenResponseCamelCase,
          })
        )
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
