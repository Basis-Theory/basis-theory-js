import { BasisTheoryService } from '../service';
import { TokenCreateResponse } from './types';

export class BasisTheoryVault extends BasisTheoryService {
  public async createToken(data: string): Promise<TokenCreateResponse> {
    const { data: res } = await this.client.post<TokenCreateResponse>(
      '/token',
      {
        data, // the API is accepting string only
      }
    );
    return res;
  }

  public async retrieveToken(id: string): Promise<TokenCreateResponse> {
    const { data: res } = await this.client.get<TokenCreateResponse>(
      `/token/${id}`
    );
    return res;
  }
}
