import { assertInit, loadElements, SERVICES } from './common';
import { BasisTheoryEncryption } from './encryption';
import { BasisTheoryAtomic } from './atomic';
import {
  BasisTheoryElements,
  BasisTheoryInitOptions,
  InitStatus,
} from './types';
import { BasisTheoryTokens } from './tokens';
import { BasisTheoryApplications } from './applications';

export const defaultInitOptions: Required<BasisTheoryInitOptions> = {
  environment: 'production',
  elements: false,
};

export class BasisTheory {
  private _initStatus: InitStatus = 'not-started';
  private _initOptions?: Required<BasisTheoryInitOptions>;
  private _tokens?: BasisTheoryTokens;
  private _atomic?: BasisTheoryAtomic;
  private _encryption?: BasisTheoryEncryption;
  private _elements?: BasisTheoryElements;
  private _applications?: BasisTheoryApplications;

  public async init(
    apiKey: string,
    options: BasisTheoryInitOptions = {}
  ): Promise<BasisTheory> {
    if (this._initStatus !== 'not-started') {
      throw new Error(
        'This BasisTheory instance has been already initialized.'
      );
    }
    this._initStatus = 'in-progress';
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
    this._encryption = new BasisTheoryEncryption();

    if (this._initOptions.elements) {
      await this.loadElements(apiKey);
    }
    this._initStatus = 'done';
    return this;
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

  public get encryption(): BasisTheoryEncryption {
    return assertInit(this._encryption);
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
