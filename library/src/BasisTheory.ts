import { assertInit, loadElements, SERVICES } from './common';
import { BasisTheoryAtomic } from './atomic';
import type { BasisTheoryInitOptions, InitStatus } from './types';
import { BasisTheoryTokens } from './tokens';
import { BasisTheoryApplications } from './applications';
import { BasisTheoryEncryptionAdapters } from './encryption/BasisTheoryEncryptionAdapters';
import type { BasisTheoryElements, BasisTheoryElementsInit } from './elements';
import { BasisTheoryReactorFormulas } from './reactor-formulas/BasisTheoryReactorFormulas';
import { BasisTheoryReactors } from './reactors';
import { BasisTheoryAtomicBanks } from './atomic/bank/BasisTheoryAtomicBanks';

export const defaultInitOptions: Required<BasisTheoryInitOptions> = {
  environment: 'production',
  elements: false,
};

export class BasisTheory {
  private _initStatus: InitStatus = 'not-started';
  private _initOptions?: Required<BasisTheoryInitOptions>;
  private _tokens?: BasisTheoryTokens;
  private _atomic?: BasisTheoryAtomic;
  private _encryption?: BasisTheoryEncryptionAdapters;
  private _elements?: BasisTheoryElements;
  private _applications?: BasisTheoryApplications;
  private _reactorFormulas?: BasisTheoryReactorFormulas;
  private _reactors?: BasisTheoryReactors;
  private _atomicBanks?: BasisTheoryAtomicBanks;

  public async init(
    apiKey: string,
    options: BasisTheoryInitOptions = {}
  ): Promise<BasisTheory> {
    if (this._initStatus !== 'not-started' && this._initStatus !== 'error') {
      throw new Error(
        'This BasisTheory instance has been already initialized.'
      );
    }
    this._initStatus = 'in-progress';
    try {
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
      this._reactorFormulas = new BasisTheoryReactorFormulas({
        apiKey,
        baseURL: SERVICES.reactorFormulas[this._initOptions.environment],
      });
      this._reactors = new BasisTheoryReactors({
        apiKey,
        baseURL: SERVICES.reactors[this._initOptions.environment],
      });
      this._atomicBanks = new BasisTheoryAtomicBanks({
        apiKey,
        baseURL: SERVICES.atomicBanks[this._initOptions.environment],
      });

      this._encryption = new BasisTheoryEncryptionAdapters();

      if (this._initOptions.elements) {
        await this.loadElements(apiKey);
      }
      this._initStatus = 'done';
    } catch (e) {
      this._initStatus = 'error';
      throw e;
    }
    return this;
  }

  private async loadElements(apiKey: string): Promise<void> {
    const elements = await loadElements();
    await (elements as BasisTheoryElementsInit).init(
      apiKey,
      this.initOptions.environment
    );
    this.elements = elements;
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

  public get encryption(): BasisTheoryEncryptionAdapters {
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

  public get reactorFormulas(): BasisTheoryReactorFormulas {
    return assertInit(this._reactorFormulas);
  }

  public get reactors(): BasisTheoryReactors {
    return assertInit(this._reactors);
  }

  public get atomicBanks(): BasisTheoryAtomicBanks {
    return assertInit(this._atomicBanks);
  }
}
