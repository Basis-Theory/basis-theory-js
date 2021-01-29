import { assertService, SERVICES } from './common/constants';
import { BasisTheoryPayments } from './payments';
import { ServiceEnvironment } from './types';
import { BasisTheoryVault } from './vault';

export class BasisTheory {
  private _vault?: BasisTheoryVault;
  private _payments?: BasisTheoryPayments;

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

    // TODO perform async initialization steps

    return this;
  }

  public get vault(): BasisTheoryVault {
    return assertService(this._vault);
  }

  public get payments(): BasisTheoryPayments {
    return assertService(this._payments);
  }
}

declare global {
  interface Window {
    BasisTheory: BasisTheory;
  }
}

window.BasisTheory = new BasisTheory();
