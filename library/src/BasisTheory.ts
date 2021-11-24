import { BasisTheoryApplications } from './applications';
import { BasisTheoryAtomic } from './atomic';
import { BasisTheoryAtomicBanks } from './atomic/banks';
import { BasisTheoryAtomicCards } from './atomic/cards';
import { assertInit, loadElements } from './common';
import {
  CLIENT_BASE_PATHS,
  DEFAULT_ELEMENTS_BASE_URL,
  DEFAULT_BASE_URL,
} from './common/constants';
import type { BasisTheoryElements, BasisTheoryElementsInit } from './elements';
import { BasisTheoryEncryptionAdapters } from './encryption/BasisTheoryEncryptionAdapters';
import { BasisTheoryLogs } from './logs';
import { BasisTheoryPermissions } from './permissions';
import { BasisTheoryReactorFormulas } from './reactor-formulas';
import { BasisTheoryReactors } from './reactors';
import { BasisTheoryTenants } from './tenants';
import { BasisTheoryTokenize } from './tokenize';
import { BasisTheoryTokens } from './tokens';
import type { BasisTheoryInitOptions, InitStatus } from './types';

const defaultInitOptions: Required<BasisTheoryInitOptions> = {
  apiBaseUrl: DEFAULT_BASE_URL,
  elements: false,
  elementsBaseUrl: DEFAULT_ELEMENTS_BASE_URL,
};

export class BasisTheory {
  private _initStatus: InitStatus = 'not-started';

  private _initOptions?: Required<BasisTheoryInitOptions>;

  private _tokens?: BasisTheoryTokens;

  private _tokenize?: BasisTheoryTokenize;

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

      let baseUrl = this._initOptions.apiBaseUrl;

      try {
        const baseUrlObject = new URL(this.initOptions.apiBaseUrl);

        if (baseUrlObject.hostname === 'localhost') {
          baseUrlObject.protocol = 'http';
        } else {
          baseUrlObject.protocol = 'https';
        }

        baseUrl = baseUrlObject.toString().replace(/\/$/u, '');
      } catch {
        throw new Error('Invalid format for the given API base url.');
      }

      this._tokens = new BasisTheoryTokens({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.tokens, baseUrl).toString(),
      });
      this._tokenize = new BasisTheoryTokenize({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.tokenize, baseUrl).toString(),
      });
      this._atomic = new BasisTheoryAtomic({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.atomic, baseUrl).toString(),
      });
      this._applications = new BasisTheoryApplications({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.applications, baseUrl).toString(),
      });
      this._tenants = new BasisTheoryTenants({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.tenants, baseUrl).toString(),
      });
      this._logs = new BasisTheoryLogs({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.logs, baseUrl).toString(),
      });
      this._reactorFormulas = new BasisTheoryReactorFormulas({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.reactorFormulas, baseUrl).toString(),
      });
      this._reactors = new BasisTheoryReactors({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.reactors, baseUrl).toString(),
      });
      this._atomicBanks = new BasisTheoryAtomicBanks({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.atomicBanks, baseUrl).toString(),
      });
      this._atomicCards = new BasisTheoryAtomicCards({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.atomicCards, baseUrl).toString(),
      });
      this._permissions = new BasisTheoryPermissions({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.permissions, baseUrl).toString(),
      });

      this._encryption = new BasisTheoryEncryptionAdapters();

      if (this._initOptions.elements) {
        await this.loadElements(apiKey);
      }

      this._initStatus = 'done';
    } catch (error) {
      this._initStatus = 'error';
      throw error;
    }

    return this;
  }

  private async loadElements(apiKey: string): Promise<void> {
    let elementsBaseUrl: URL;

    try {
      elementsBaseUrl = new URL(this.initOptions.elementsBaseUrl);
    } catch {
      throw new Error('Invalid format for the given Elements base url.');
    }

    const elements = await loadElements();

    await (elements as BasisTheoryElementsInit).init(
      apiKey,
      elementsBaseUrl.toString().replace(/\/$/u, '')
    );
    this.elements = elements;
  }

  // these should be set by the init call only.
  /* eslint-disable accessor-pairs */
  public get initOptions(): Required<BasisTheoryInitOptions> {
    return assertInit(this._initOptions);
  }

  public get tokens(): BasisTheoryTokens {
    return assertInit(this._tokens);
  }

  public get tokenize(): BasisTheoryTokenize {
    return assertInit(this._tokenize);
  }

  public get atomic(): BasisTheoryAtomic {
    return assertInit(this._atomic);
  }

  public get encryption(): BasisTheoryEncryptionAdapters {
    return assertInit(this._encryption);
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
  /* eslint-enable accessor-pairs */

  public get elements(): BasisTheoryElements {
    return assertInit(this._elements);
  }

  public set elements(elements: BasisTheoryElements) {
    this._elements = elements;
  }
}
