import type { AxiosTransformer } from 'axios';
import { createRequestConfig, getQueryParams } from '../common';
import {
  dataExtractor,
  transformTokenResponseCamelCase,
  transformTokenRequestSnakeCase,
} from '../common/utils';
import {
  BasisTheoryService,
  BasisTheoryServiceOptions,
  PaginatedList,
  RequestOptions,
} from '../service';
import { CrudBuilder } from '../service/CrudBuilder';
import {
  Token,
  CreateTokenModel,
  ListTokensQuery,
  RetrieveTokenQuery,
  ListTokensQueryDecrypted,
  TokenData,
} from './types';

export const BasisTheoryTokens = new CrudBuilder(
  class BasisTheoryTokens extends BasisTheoryService {
    public constructor(options: BasisTheoryServiceOptions) {
      const _options = options;

      // eslint-disable-next-line unicorn/prefer-spread
      _options.transformRequest = ([] as AxiosTransformer[]).concat(
        transformTokenRequestSnakeCase,
        options.transformRequest || []
      );

      // eslint-disable-next-line unicorn/prefer-spread
      _options.transformResponse = ([] as AxiosTransformer[]).concat(
        transformTokenResponseCamelCase,
        options.transformResponse || []
      );

      super(_options);
    }

    /**
     * @deprecated use {@link create} instead
     */
    public createToken(data: TokenData): Promise<Token> {
      return this.client.post('/', { data }).then(dataExtractor);
    }

    /**
     * @deprecated use {@link retrieve} instead
     */
    public getToken(id: string): Promise<Token> {
      return this.client.get(id).then(dataExtractor);
    }

    /**
     * @deprecated use {@link delete} instead
     */
    public async deleteToken(id: string): Promise<void> {
      await this.client.delete(id);
    }

    public retrieve(
      id: string,
      query: RetrieveTokenQuery = {},
      options: RequestOptions = {}
    ): Promise<Token> {
      const url = `/${id}${getQueryParams(query)}`;

      return this.client
        .get(url, createRequestConfig(options))
        .then(dataExtractor);
    }

    public retrieveDecrypted(
      id: string,
      query: RetrieveTokenQuery = {},
      options: RequestOptions = {}
    ): Promise<Token> {
      const url = `/${id}/decrypt${getQueryParams(query)}`;

      return this.client
        .get(url, createRequestConfig(options))
        .then(dataExtractor);
    }

    public listDecrypted(
      query: ListTokensQueryDecrypted = {},
      options: RequestOptions = {}
    ): Promise<PaginatedList<Token>> {
      const url = `/decrypt${getQueryParams(query)}`;

      return this.client
        .get(url, createRequestConfig(options))
        .then(dataExtractor);
    }

    public async createAssociation(
      parentId: string,
      childId: string,
      options?: RequestOptions
    ): Promise<void> {
      const url = `/${parentId}/children/${childId}`;

      await this.client.post(url, {}, createRequestConfig(options));
    }

    public async deleteAssociation(
      parentId: string,
      childId: string,
      options?: RequestOptions
    ): Promise<void> {
      const url = `/${parentId}/children/${childId}`;

      await this.client.delete(url, createRequestConfig(options));
    }

    public createChild(
      parentId: string,
      token: CreateTokenModel,
      options?: RequestOptions
    ): Promise<Token> {
      const url = `/${parentId}/children`;

      return this.client
        .post(url, token, createRequestConfig(options))
        .then(dataExtractor);
    }

    public listChildren(
      parentId: string,
      query: ListTokensQuery = {},
      options: RequestOptions = {}
    ): Promise<PaginatedList<Token>> {
      const url = `/${parentId}/children${getQueryParams(query)}`;

      return this.client
        .get(url, createRequestConfig(options))
        .then(dataExtractor);
    }
  }
)
  .create<Token, CreateTokenModel>()
  .delete()
  .list<Token, ListTokensQuery>()
  .build();

export type BasisTheoryTokens = InstanceType<typeof BasisTheoryTokens>;
