import { dataExtractor } from '../common/utils';
import {
  Token,
  CreateTokenModel,
  ListTokensQuery,
  RetrieveTokenQuery,
  ListTokensQueryDecrypted,
  TokenData,
  CreateTokenResponse,
  TokensApi,
  GetTokenResponse,
} from './types';
import { BasisTheoryService, PaginatedList, RequestOptions } from '../service';
import { CrudBuilder } from '../service/CrudBuilder';
import { createRequestConfig, getQueryParams } from '../common';
import camelcaseKeys from 'camelcase-keys';

export const BasisTheoryTokens = new CrudBuilder(
  class BasisTheoryTokens extends BasisTheoryService {
    /**
     * @deprecated use {@link create} instead
     */
    public async createToken(data: TokenData): Promise<CreateTokenResponse> {
      const {
        data: res,
      } = await this.client.post<TokensApi.CreateTokenResponse>('/', {
        data,
      });
      const token = (camelcaseKeys(res, {
        deep: false,
      }) as unknown) as CreateTokenResponse;
      return token;
    }

    /**
     * @deprecated use {@link retrieve} instead
     */
    public async getToken(id: string): Promise<GetTokenResponse> {
      const {
        data: res,
      } = await this.client.get<TokensApi.CreateTokenResponse>(`/${id}`);
      const token = (camelcaseKeys(res, {
        deep: false,
      }) as unknown) as GetTokenResponse;
      return token;
    }

    /**
     * @deprecated use {@link delete} instead
     */
    public async deleteToken(id: string): Promise<void> {
      await this.client.delete<void>(`/${id}`);
    }

    public async retrieve(
      id: string,
      query: RetrieveTokenQuery = {},
      options?: RequestOptions
    ): Promise<Token> {
      const url = `/${id}${getQueryParams(query)}`;
      return this.client
        .get(url, createRequestConfig(options))
        .then(dataExtractor);
    }

    public async retrieveDecrypted(
      id: string,
      query: RetrieveTokenQuery = {},
      options?: RequestOptions
    ): Promise<Token> {
      const url = `/${id}/decrypt${getQueryParams(query)}`;
      return this.client
        .get(url, createRequestConfig(options))
        .then(dataExtractor);
    }

    public async listDecrypted(
      query: ListTokensQueryDecrypted = {},
      options?: RequestOptions
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

    public async createChild(
      parentId: string,
      token: CreateTokenModel,
      options?: RequestOptions
    ): Promise<Token> {
      const url = `/${parentId}/children`;
      return this.client
        .post(url, token, createRequestConfig(options))
        .then(dataExtractor);
    }

    public async listChildren(
      parentId: string,
      query: ListTokensQuery = {},
      options?: RequestOptions
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
