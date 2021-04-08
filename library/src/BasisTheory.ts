import { assertInit, loadElements, SERVICES } from './common';
import { BasisTheoryEncryption } from './encryption';
import { BasisTheoryPayments } from './payments';
import { BasisTheoryElements, BasisTheoryInitOptions } from './types';
import { BasisTheoryVault } from './vault';

export const defaultInitOptions: Required<BasisTheoryInitOptions> = {
  environment: 'production',
  elements: false,
};

export class BasisTheory {
  private _initOptions?: Required<BasisTheoryInitOptions>;
  private _vault?: BasisTheoryVault;
  private _payments?: BasisTheoryPayments;
  private _encryption?: BasisTheoryEncryption;
  private _elements?: BasisTheoryElements;

  public async init(
    apiKey: string,
    options: BasisTheoryInitOptions = {}
  ): Promise<BasisTheory> {
    this._initOptions = Object.freeze({
      ...defaultInitOptions,
      ...options,
    });
    this._vault = new BasisTheoryVault({
      apiKey,
      baseURL: SERVICES.vault[this._initOptions.environment],
    });
    this._payments = new BasisTheoryPayments({
      apiKey,
      baseURL: SERVICES.payments[this._initOptions.environment],
    });
    this._encryption = new BasisTheoryEncryption();
    // initialization options
    // TODO perform async initialization steps

    if (this._initOptions.elements) {
      await this.loadElements(apiKey);
    }

    return this;
  }

  private async loadElements(apiKey: string): Promise<void> {
    const elements = await loadElements();
    await elements.init(apiKey, this.initOptions.environment);
  }

  public get initOptions(): Required<BasisTheoryInitOptions> {
    return assertInit(this._initOptions);
  }

  public get vault(): BasisTheoryVault {
    return assertInit(this._vault);
  }

  public get payments(): BasisTheoryPayments {
    return assertInit(this._payments);
  }

  public get encryption(): BasisTheoryEncryption {
    return assertInit(this._encryption);
  }

  public set elements(elements: BasisTheoryElements) {
    this._elements = elements;
  }

  public get elements(): BasisTheoryElements {
    return assertInit(this._elements);
  }
}
