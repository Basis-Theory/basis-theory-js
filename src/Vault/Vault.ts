import { VaultOptions } from './types/VaultOptions';
import { BasisTheoryToken } from './types/BasisTheoryToken';

export class Vault<T extends VaultOptions = VaultOptions> {
  public readonly client;

  public constructor(options: T) {
    this.client = options.client;
  }

  public createToken(data: string): Promise<BasisTheoryToken> {
    return this.client
      .post('/token', {
        data: JSON.stringify({ data }),
      })
      .then(response => {
        console.log('data');
        return response.data;
      });
  }
}
