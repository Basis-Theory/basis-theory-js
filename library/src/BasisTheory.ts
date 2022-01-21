import type {
  AtomicBanks as ElementsAtomicBanks,
  AtomicCards as ElementsAtomicCards,
  BasisTheoryElements,
  BasisTheoryElementsInternal,
  CardElement,
  CustomizableElementOptions,
  ElementType,
  TextElement,
  Tokenize as ElementsTokenize,
  TokenizeData as ElementsTokenizeData,
  Tokens as ElementsTokens,
} from '@basis-theory/basis-theory-elements-interfaces/elements';
import type { TokenizeData } from '@basis-theory/basis-theory-elements-interfaces/models';
import type {
  Applications,
  AtomicBanks,
  AtomicCards,
  BasisTheory as IBasisTheory,
  BasisTheoryInit,
  Logs,
  Permissions,
  ReactorFormulas,
  Reactors,
  RequestOptions,
  Tenants,
  Tokenize,
  Tokens,
} from '@basis-theory/basis-theory-elements-interfaces/sdk';
import { BasisTheoryApplications } from './applications';
import {
  assertInit,
  CLIENT_BASE_PATHS,
  DEFAULT_BASE_URL,
  DEFAULT_ELEMENTS_BASE_URL,
} from './common';
import {
  delegateAtomicBanks,
  delegateAtomicCards,
  delegateTokenize,
  delegateTokens,
  loadElements,
} from './elements';
import { ELEMENTS_INIT_ERROR_MESSAGE } from './elements/constants';
import { BasisTheoryEncryptionAdapters } from './encryption/BasisTheoryEncryptionAdapters';
import { BasisTheoryLogs } from './logs';
import { BasisTheoryPermissions } from './permissions';
import { BasisTheoryReactorFormulas } from './reactor-formulas';
import { BasisTheoryReactors } from './reactors';
import { BasisTheoryTenants } from './tenants';
import type {
  BasisTheoryInitOptions,
  BasisTheoryInitOptionsWithElements,
  BasisTheoryInitOptionsWithoutElements,
  InitStatus,
} from './types';

const defaultInitOptions: Required<BasisTheoryInitOptionsWithoutElements> = {
  apiBaseUrl: DEFAULT_BASE_URL,
  elements: false,
  appInfo: {},
};

export class BasisTheory
  implements BasisTheoryInit, IBasisTheory, BasisTheoryElements {
  private _initStatus: InitStatus = 'not-started';

  private _initOptions?: Required<BasisTheoryInitOptions>;

  private _tokens?: Tokens & ElementsTokens;

  private _tokenize?: Tokenize & ElementsTokenize;

  private _encryption?: BasisTheoryEncryptionAdapters;

  private _elements?: BasisTheoryElementsInternal;

  private _applications?: BasisTheoryApplications;

  private _tenants?: BasisTheoryTenants;

  private _logs?: BasisTheoryLogs;

  private _reactorFormulas?: BasisTheoryReactorFormulas;

  private _reactors?: BasisTheoryReactors;

  private _atomicBanks?: AtomicBanks & ElementsAtomicBanks;

  private _atomicCards?: AtomicCards & ElementsAtomicCards;

  private _permissions?: BasisTheoryPermissions;

  public init(
    apiKey: string,
    options?: BasisTheoryInitOptionsWithoutElements
  ): Promise<IBasisTheory>;

  public init(
    apiKey: string,
    options: BasisTheoryInitOptionsWithElements
  ): Promise<IBasisTheory & BasisTheoryElements>;

  public async init(
    apiKey: string,
    options: BasisTheoryInitOptions = {}
  ): Promise<IBasisTheory & BasisTheoryElements> {
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

      const appInfo = this._initOptions.appInfo;

      if ((this._initOptions as BasisTheoryInitOptionsWithElements).elements) {
        await this.loadElements(apiKey);
      }

      this._tokens = new (delegateTokens(this._elements))({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.tokens, baseUrl).toString(),
        appInfo,
      });
      this._tokenize = new (delegateTokenize(this._elements))({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.tokenize, baseUrl).toString(),
        appInfo,
      });
      this._applications = new BasisTheoryApplications({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.applications, baseUrl).toString(),
        appInfo,
      });
      this._tenants = new BasisTheoryTenants({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.tenants, baseUrl).toString(),
        appInfo,
      });
      this._logs = new BasisTheoryLogs({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.logs, baseUrl).toString(),
        appInfo,
      });
      this._reactorFormulas = new BasisTheoryReactorFormulas({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.reactorFormulas, baseUrl).toString(),
        appInfo,
      });
      this._reactors = new BasisTheoryReactors({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.reactors, baseUrl).toString(),
        appInfo,
      });
      this._atomicBanks = new (delegateAtomicBanks(this._elements))({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.atomicBanks, baseUrl).toString(),
        appInfo,
      });
      this._atomicCards = new (delegateAtomicCards(this._elements))({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.atomicCards, baseUrl).toString(),
        appInfo,
      });
      this._permissions = new BasisTheoryPermissions({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.permissions, baseUrl).toString(),
        appInfo,
      });

      this._encryption = new BasisTheoryEncryptionAdapters();

      this._initStatus = 'done';
    } catch (error) {
      this._initStatus = 'error';
      throw error;
    }

    return this;
  }

  public createElement(
    type: ElementType,
    options: CustomizableElementOptions
  ): CardElement | TextElement {
    if (!this._elements) {
      throw new Error(ELEMENTS_INIT_ERROR_MESSAGE);
    }

    // the cast below is to avoid unnecessary conditional calls to elements
    // the underlying elements function called will be the same, no matter the
    // element type
    return this._elements.createElement(type as 'card', options);
  }

  public tokenize(
    tokens: TokenizeData & ElementsTokenizeData,
    options?: RequestOptions
  ): Promise<TokenizeData> {
    return assertInit(this._tokenize).tokenize(tokens, options);
  }

  private async loadElements(apiKey: string): Promise<void> {
    let elementsBaseUrl: URL;

    try {
      elementsBaseUrl = new URL(
        (this.initOptions as BasisTheoryInitOptionsWithElements)
          .elementsBaseUrl || DEFAULT_ELEMENTS_BASE_URL
      );
    } catch {
      throw new Error('Invalid format for the given Elements base url.');
    }

    const elements = await loadElements();

    await (elements as BasisTheoryElementsInternal).init(
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

  public get tokens(): Tokens & ElementsTokens {
    return assertInit(this._tokens);
  }

  /**
   * @deprecated
   */
  public get encryption(): BasisTheoryEncryptionAdapters {
    return assertInit(this._encryption);
  }

  public get applications(): Applications {
    return assertInit(this._applications);
  }

  public get tenants(): Tenants {
    return assertInit(this._tenants);
  }

  public get logs(): Logs {
    return assertInit(this._logs);
  }

  public get reactorFormulas(): ReactorFormulas {
    return assertInit(this._reactorFormulas);
  }

  public get reactors(): Reactors {
    return assertInit(this._reactors);
  }

  public get atomicBanks(): AtomicBanks & ElementsAtomicBanks {
    return assertInit(this._atomicBanks);
  }

  public get atomicCards(): AtomicCards & ElementsAtomicCards {
    return assertInit(this._atomicCards);
  }

  public get permissions(): Permissions {
    return assertInit(this._permissions);
  }
  /* eslint-enable accessor-pairs */

  /**
   * @deprecated
   */
  public get elements(): BasisTheoryElements {
    return assertInit(this._elements);
  }

  public set elements(elements: BasisTheoryElements) {
    this._elements = elements as BasisTheoryElementsInternal;
  }
}
