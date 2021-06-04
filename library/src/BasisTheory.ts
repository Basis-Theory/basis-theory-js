import { assertInit, loadElements, SERVICES } from './common';
import { BasisTheoryAtomic } from './atomic';
import { BasisTheoryElements, BasisTheoryInitOptions } from './types';
import { BasisTheoryTokens } from './tokens';
import { BasisTheoryApplications } from './applications';
import { EncryptionAdapter } from './encryption';

export const defaultInitOptions: Required<BasisTheoryInitOptions> = {
  environment: 'production',
  elements: false,
};

export class BasisTheory {
  private _initOptions?: Required<BasisTheoryInitOptions>;
  private _tokens?: BasisTheoryTokens;
  private _atomic?: BasisTheoryAtomic;
  private _elements?: BasisTheoryElements;
  private _applications?: BasisTheoryApplications;
  private _encryptionAdapters: Record<string, EncryptionAdapter> = {};

  public async init(
    apiKey: string,
    options: BasisTheoryInitOptions = {}
  ): Promise<BasisTheory> {
    this._initOptions = Object.freeze({
      ...defaultInitOptions,
      ...options,
    });
    this._tokens = new BasisTheoryTokens({
      apiKey,
      baseURL: SERVICES.tokens[this._initOptions.environment],
    });
    this._atomic = new BasisTheoryAtomic({
      apiKey,
      baseURL: SERVICES.atomic[this._initOptions.environment],
    });
    this._applications = new BasisTheoryApplications({
      apiKey,
      baseURL: SERVICES.applications[this._initOptions.environment],
    });

    if (this._initOptions.elements) {
      await this.loadElements(apiKey);
    }

    return this;
  }

  public addEncryptionAdapter(
    providerName: string,
    encryptionAdapter: EncryptionAdapter
  ): Record<string, EncryptionAdapter> {
    this._encryptionAdapters[providerName] = encryptionAdapter;

    return this._encryptionAdapters;
  }

  private async loadElements(apiKey: string): Promise<void> {
    const elements = await loadElements();
    await elements.init(apiKey, this.initOptions.environment);
  }

  public get initOptions(): Required<BasisTheoryInitOptions> {
    return assertInit(this._initOptions);
  }

  public get tokens(): BasisTheoryTokens {
    return assertInit(this._tokens);
  }

  public get atomic(): BasisTheoryAtomic {
    return assertInit(this._atomic);
  }

  public get encryption(): Record<string, EncryptionAdapter> {
    return assertInit(this._encryptionAdapters);
  }

  public set elements(elements: BasisTheoryElements) {
    this._elements = elements;
  }

  public get elements(): BasisTheoryElements {
    return assertInit(this._elements);
  }

  public get applications(): BasisTheoryApplications {
    return assertInit(this._applications);
  }
}
