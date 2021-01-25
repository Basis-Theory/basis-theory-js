import axios, {AxiosInstance} from 'axios';
import {Vault} from './Vault/Vault';
import {BasisTheoryOptions} from './types/BasisTheoryOptions';

export class BasisTheory<T extends BasisTheoryOptions = BasisTheoryOptions> {
  public readonly client: AxiosInstance = axios.create({
    baseURL: 'https://api.basistheory.com',
  });
  public readonly Vault: Vault;

  public constructor(public readonly options: T) {
    this.Vault = new Vault({ client: this.client });
  }
}
