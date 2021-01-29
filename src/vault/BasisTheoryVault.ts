import { BasisTheoryService } from '../service';
import { TokenCreateResponse } from './types';

export class BasisTheoryVault extends BasisTheoryService {
  public async createToken(data: string): Promise<TokenCreateResponse> {
    const { data: res } = await this.client.post<TokenCreateResponse>(
      '/token',
      {
        data: JSON.stringify({ data }),
      }
    );
    return res;
  }
}
