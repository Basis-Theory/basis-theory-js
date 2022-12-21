import type {
  BasisTheoryElements,
  BasisTheoryElementsInternal,
  CardElement,
  CardNumberElement,
  CardExpirationDateElement,
  CardVerificationCodeElement,
  CreateCardElementOptions,
  CreateCardNumberElementOptions,
  CreateCardExpirationDateElementOptions,
  CreateCardVerificationCodeElementOptions,
  CreateTextElementOptions,
  CustomizableElementOptions,
  ElementType,
  TextElement,
  Tokenize as ElementsTokenize,
  TokenizeData as ElementsTokenizeData,
  Tokens as ElementsTokens,
  Proxy as ElementsProxy,
} from '@/types/elements';
import type { TokenizeData } from '@/types/models';
import type {
  Applications,
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
  BasisTheoryInitOptions,
  BasisTheoryInitOptionsWithElements,
  BasisTheoryInitOptionsWithoutElements,
  BasisTheoryInitStatus,
  Proxies,
  Proxy,
} from '@/types/sdk';
import { BasisTheoryApplications } from './applications';
import {
  assertInit,
  CLIENT_BASE_PATHS,
  DEFAULT_BASE_URL,
  DEFAULT_ELEMENTS_BASE_URL,
} from './common';
import { delegateTokenize, delegateTokens, loadElements } from './elements';
import { ELEMENTS_INIT_ERROR_MESSAGE } from './elements/constants';
import { BasisTheoryLogs } from './logs';
import { BasisTheoryPermissions } from './permissions';
import { BasisTheoryProxies } from './proxies';
import { BasisTheoryProxy } from './proxy';
import { BasisTheoryReactorFormulas } from './reactor-formulas';
import { BasisTheoryReactors } from './reactors';
import { BasisTheoryTenants } from './tenants';

const defaultInitOptions: Required<BasisTheoryInitOptionsWithoutElements> = {
  apiBaseUrl: DEFAULT_BASE_URL,
  elements: false,
  appInfo: {},
};

export class BasisTheory
  implements BasisTheoryInit, IBasisTheory, BasisTheoryElements {
  private _initStatus: BasisTheoryInitStatus = 'not-started';

  private _initOptions?: Required<BasisTheoryInitOptions>;

  private _tokens?: Tokens & ElementsTokens;

  private _tokenize?: Tokenize & ElementsTokenize;

  private _elements?: BasisTheoryElementsInternal;

  private _applications?: BasisTheoryApplications;

  private _tenants?: BasisTheoryTenants;

  private _logs?: BasisTheoryLogs;

  private _reactorFormulas?: BasisTheoryReactorFormulas;

  private _reactors?: BasisTheoryReactors;

  private _permissions?: BasisTheoryPermissions;

  private _proxies?: Proxies;

  private _proxy?: Proxy & ElementsProxy;

  public init(
    apiKey: string | undefined,
    options?: BasisTheoryInitOptionsWithoutElements
  ): Promise<IBasisTheory>;

  public init(
    apiKey: string | undefined,
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
      this._permissions = new BasisTheoryPermissions({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.permissions, baseUrl).toString(),
        appInfo,
      });
      this._proxies = new BasisTheoryProxies({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.proxies, baseUrl).toString(),
        appInfo,
      });
      this._proxy = new BasisTheoryProxy({
        apiKey,
        baseURL: new URL(CLIENT_BASE_PATHS.proxy, baseUrl).toString(),
        appInfo,
      });

      this._initStatus = 'done';
    } catch (error) {
      this._initStatus = 'error';
      throw error;
    }

    return this;
  }

  public createElement(
    type: 'card',
    options?: CreateCardElementOptions
  ): CardElement;

  public createElement(
    type: 'text',
    options: CreateTextElementOptions
  ): TextElement;

  public createElement(
    type: 'cardNumber',
    options: CreateCardNumberElementOptions
  ): CardNumberElement;

  public createElement(
    type: 'cardExpirationDate',
    options: CreateCardExpirationDateElementOptions
  ): CardExpirationDateElement;

  public createElement(
    type: 'cardVerificationCode',
    options: CreateCardVerificationCodeElementOptions
  ): CardVerificationCodeElement;

  public createElement(
    type: ElementType,
    options: CustomizableElementOptions
  ):
    | CardElement
    | TextElement
    | CardNumberElement
    | CardExpirationDateElement
    | CardVerificationCodeElement {
    if (!this._elements) {
      throw new Error(ELEMENTS_INIT_ERROR_MESSAGE);
    }

    return this._elements.createElement(type as never, options);
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

  public get permissions(): Permissions {
    return assertInit(this._permissions);
  }

  public get proxies(): Proxies {
    return assertInit(this._proxies);
  }

  public get proxy(): Proxy {
    return assertInit(this._proxy);
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
