import { BasisTheoryService } from '../service';
import { TokenCreateResponse } from './types';

export class BasisTheoryVault extends BasisTheoryService {
  public async createToken(data: string): Promise<TokenCreateResponse> {
    const { data: res } = await this.client.post<TokenCreateResponse>(
      '/tokens',
      {
        data, // the API is accepting string only
      }
    );
    return res;
  }

  public async retrieveToken(id: string): Promise<TokenCreateResponse> {
    const { data: res } = await this.client.get<TokenCreateResponse>(
      `/tokens/${id}`
    );
    return res;
  }

  public async deleteToken(id: string): Promise<void> {
    await this.client.delete<void>(`/tokens/${id}`);
  }
}
