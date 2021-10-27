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
import type {
  AtomicBank,
  CreateAtomicBankModel,
  UpdateAtomicBankModel,
} from './types';

export const BasisTheoryAtomicBanks = new CrudBuilder(
  class BasisTheoryAtomicBanks extends BasisTheoryService {
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
      request: UpdateAtomicBankModel,
      options?: RequestOptions
    ): Promise<AtomicBank> {
      return this.client
        .patch(`/${id}`, request, createRequestConfig(options))
        .then(dataExtractor);
    }

    public retrieveDecrypted(
      id: string,
      options?: RequestOptions
    ): Promise<AtomicBank> {
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
      atomicBankId: string,
      reactionTokenId: string,
      options?: RequestOptions
    ): Promise<Token> {
      return this.client
        .get(
          `/${atomicBankId}/reactions/${reactionTokenId}`,
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
