import { assertService, SERVICES } from './common/constants';
import { BasisTheoryEncryption } from './encryption';
import { BasisTheoryPayments } from './payments';
import { ServiceEnvironment } from './types';
import { BasisTheoryVault } from './vault';

export class BasisTheory {
  private _vault?: BasisTheoryVault;
  private _payments?: BasisTheoryPayments;
  private _encryption?: BasisTheoryEncryption;

  public async init(
    apiKey: string,
    environment: ServiceEnvironment = 'production'
  ): Promise<BasisTheory> {
    this._vault = new BasisTheoryVault({
      apiKey,
      baseURL: SERVICES.vault[environment],
    });
    this._payments = new BasisTheoryPayments({
      apiKey,
      baseURL: SERVICES.payments[environment],
    });
    this._encryption = new BasisTheoryEncryption();
    // initialization options
    // TODO perform async initialization steps

    return this;
  }

  public get vault(): BasisTheoryVault {
    return assertService(this._vault);
  }

  public get payments(): BasisTheoryPayments {
    return assertService(this._payments);
  }

  public get encryption(): BasisTheoryEncryption {
    return assertService(this._encryption);
  }
}
