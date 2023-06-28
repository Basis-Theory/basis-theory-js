import type { AxiosRequestTransformer, AxiosResponseTransformer } from 'axios';
import {
  CONTENT_TYPE_HEADER,
  createRequestConfig,
  getQueryParams,
  MERGE_CONTENT_TYPE,
} from '@/common';
import {
  dataExtractor,
  transformTokenResponseCamelCase,
  transformTokenRequestSnakeCase,
} from '@/common/utils';
import { BasisTheoryService, BasisTheoryServiceOptions } from '@/service';
import { CrudBuilder } from '@/service/CrudBuilder';
import type { Token, CreateToken, UpdateToken } from '@/types/models';
import type {
  PaginatedList,
  RequestOptions,
  ListTokensQuery,
  SearchTokensRequest,
} from '@/types/sdk';

export const BasisTheoryTokens = new CrudBuilder(
  class BasisTheoryTokens extends BasisTheoryService {
    public constructor(options: BasisTheoryServiceOptions) {
      const _options = options;

      // eslint-disable-next-line unicorn/prefer-spread
      _options.transformRequest = ([] as AxiosRequestTransformer[]).concat(
        transformTokenRequestSnakeCase,
        options.transformRequest || []
      );

      // eslint-disable-next-line unicorn/prefer-spread
      _options.transformResponse = ([] as AxiosResponseTransformer[]).concat(
        transformTokenResponseCamelCase,
        options.transformResponse || []
      );

      super(_options);
    }

    public retrieve(
      id: string,
      options: RequestOptions = {}
      // avoid casting when accessing token data props
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<Token<any>> {
      const url = `/${id}`;

      return this.client
        .get(url, createRequestConfig(options))
        .then(dataExtractor);
    }

    public update(
      id: string,
      model: UpdateToken,
      options: RequestOptions = {}
    ): Promise<Token> {
      const url = `/${id}`;

      const config = createRequestConfig(options);

      return this.client
        .patch(url, model, {
          ...config,
          headers: {
            ...(config?.headers || {}),
            [CONTENT_TYPE_HEADER]: MERGE_CONTENT_TYPE,
          },
        })
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
      token: CreateToken,
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

    public search(
      searchRequest: SearchTokensRequest,
      options?: RequestOptions
    ): Promise<PaginatedList<Token>> {
      return this.client
        .post('/search', searchRequest, createRequestConfig(options))
        .then(dataExtractor);
    }
  }
)
  .create<Token, CreateToken>()
  .delete()
  .list<Token, ListTokensQuery>()
  .build();

export type BasisTheoryTokens = InstanceType<typeof BasisTheoryTokens>;
