import { BasisTheoryService } from '../service';
import {
  CreateTokenResponse,
  GetTokenResponse,
  TokenData,
  TokensApi,
} from './types';
import camelcaseKeys from 'camelcase-keys';

export class BasisTheoryTokens extends BasisTheoryService {
  public async createToken(data: TokenData): Promise<CreateTokenResponse> {
    const { data: res } = await this.client.post<TokensApi.CreateTokenResponse>(
      '/',
      {
        data,
      }
    );
    const token = (camelcaseKeys(res, {
      deep: false,
    }) as unknown) as CreateTokenResponse;
    return token;
  }

  public async getToken(id: string): Promise<GetTokenResponse> {
    const { data: res } = await this.client.get<TokensApi.CreateTokenResponse>(
      `/${id}`
    );
    const token = (camelcaseKeys(res, {
      deep: false,
    }) as unknown) as GetTokenResponse;
    return token;
  }

  public async deleteToken(id: string): Promise<void> {
    await this.client.delete<void>(`/${id}`);
  }
}
