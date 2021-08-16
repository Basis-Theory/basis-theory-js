import type { AtomicBank, CreateAtomicBankModel } from './types';
import { createRequestConfig, dataExtractor } from '../../common';
import {
  BasisTheoryService,
  PaginatedQuery,
  RequestOptions,
} from '../../service';
import { CrudBuilder } from '../../service/CrudBuilder';
import { ReactRequest } from '../types';
import { Token } from '../../tokens';

export const BasisTheoryAtomicBanks = new CrudBuilder(
  class BasisTheoryAtomicBanks extends BasisTheoryService {
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
        .post(`/${id}/react`, request, createRequestConfig(options))
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
          createRequestConfig(options)
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
