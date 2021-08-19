import { assertInit, loadElements } from './common';
import {
  CLIENT_BASE_PATHS,
  DEFAULT_ELEMENTS_BASE_URL,
  DEFAULT_BASE_URL,
} from './common/constants';
import { BasisTheoryAtomic } from './atomic';
import type { BasisTheoryInitOptions, InitStatus } from './types';
import { BasisTheoryApplications } from './applications';
import { BasisTheoryTokens } from './tokens';
import { BasisTheoryEncryptionAdapters } from './encryption/BasisTheoryEncryptionAdapters';
import type { BasisTheoryElements, BasisTheoryElementsInit } from './elements';
import { BasisTheoryTenants } from './tenants';
import { BasisTheoryLogs } from './logs';
import { BasisTheoryReactorFormulas } from './reactor-formulas';
import { BasisTheoryReactors } from './reactors';
import { BasisTheoryAtomicBanks } from './atomic/banks';
import { BasisTheoryAtomicCards } from './atomic/cards';
import { BasisTheoryPermissions } from './permissions';

export const defaultInitOptions: Required<BasisTheoryInitOptions> = {
  apiBaseUrl: DEFAULT_BASE_URL,
  elements: false,
  elementsBaseUrl: DEFAULT_ELEMENTS_BASE_URL,
};

export class BasisTheory {
  private _initStatus: InitStatus = 'not-started';
  private _initOptions?: Required<BasisTheoryInitOptions>;
  private _tokens?: BasisTheoryTokens;
  private _atomic?: BasisTheoryAtomic;
  private _encryption?: BasisTheoryEncryptionAdapters;
  private _elements?: BasisTheoryElements;
  private _applications?: BasisTheoryApplications;
  private _tenants?: BasisTheoryTenants;
  private _logs?: BasisTheoryLogs;
  private _reactorFormulas?: BasisTheoryReactorFormulas;
  private _reactors?: BasisTheoryReactors;
  private _atomicBanks?: BasisTheoryAtomicBanks;
  private _atomicCards?: BasisTheoryAtomicCards;
  private _permissions?: BasisTheoryPermissions;

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
        baseURL: `${this._initOptions.apiBaseUrl}/${CLIENT_BASE_PATHS.tokens}`,
      });
      this._atomic = new BasisTheoryAtomic({
        apiKey,
        baseURL: `${this._initOptions.apiBaseUrl}/${CLIENT_BASE_PATHS.atomic}`,
      });
      this._applications = new BasisTheoryApplications({
        apiKey,
        baseURL: `${this._initOptions.apiBaseUrl}/${CLIENT_BASE_PATHS.applications}`,
      });
      this._tenants = new BasisTheoryTenants({
        apiKey,
        baseURL: `${this._initOptions.apiBaseUrl}/${CLIENT_BASE_PATHS.tenants}`,
      });
      this._logs = new BasisTheoryLogs({
        apiKey,
        baseURL: `${this._initOptions.apiBaseUrl}/${CLIENT_BASE_PATHS.logs}`,
      });
      this._reactorFormulas = new BasisTheoryReactorFormulas({
        apiKey,
        baseURL: `${this._initOptions.apiBaseUrl}/${CLIENT_BASE_PATHS.reactorFormulas}`,
      });
      this._reactors = new BasisTheoryReactors({
        apiKey,
        baseURL: `${this._initOptions.apiBaseUrl}/${CLIENT_BASE_PATHS.reactors}`,
      });
      this._atomicBanks = new BasisTheoryAtomicBanks({
        apiKey,
        baseURL: `${this._initOptions.apiBaseUrl}/${CLIENT_BASE_PATHS.atomicBanks}`,
      });
      this._atomicCards = new BasisTheoryAtomicCards({
        apiKey,
        baseURL: `${this._initOptions.apiBaseUrl}/${CLIENT_BASE_PATHS.atomicCards}`,
      });
      this._permissions = new BasisTheoryPermissions({
        apiKey,
        baseURL: `${this._initOptions.apiBaseUrl}/${CLIENT_BASE_PATHS.permissions}`,
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
      this.initOptions?.elementsBaseUrl
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

  public get tenants(): BasisTheoryTenants {
    return assertInit(this._tenants);
  }

  public get logs(): BasisTheoryLogs {
    return assertInit(this._logs);
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

  public get atomicCards(): BasisTheoryAtomicCards {
    return assertInit(this._atomicCards);
  }

  public get permissions(): BasisTheoryPermissions {
    return assertInit(this._permissions);
  }
}
