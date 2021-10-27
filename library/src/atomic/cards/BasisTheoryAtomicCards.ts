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
import type {
  AtomicCard,
  CreateAtomicCardModel,
  UpdateAtomicCardModel,
} from './types';

export const BasisTheoryAtomicCards = new CrudBuilder(
  class BasisTheoryAtomicCards extends BasisTheoryService {
    public constructor(options: BasisTheoryServiceOptions) {
      const _options = {
        ...options,
      };

      // eslint-disable-next-line unicorn/prefer-spread
      _options.transformRequest = ([] as AxiosTransformer[]).concat(
        transformAtomicRequestSnakeCase,
        options.transformRequest || []
      );

      // eslint-disable-next-line unicorn/prefer-spread
      _options.transformResponse = ([] as AxiosTransformer[]).concat(
        transformAtomicResponseCamelCase,
        options.transformResponse || []
      );

      super(_options);
    }

    public update(
      id: string,
      request: UpdateAtomicCardModel,
      options?: RequestOptions
    ): Promise<AtomicCard> {
      return this.client
        .patch(`/${id}`, request, createRequestConfig(options))
        .then(dataExtractor);
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
          `/${atomicCardId}/reactions/${reactionTokenId}`,
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
