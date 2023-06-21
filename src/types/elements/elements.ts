import type { Config } from '@/common/BasisTheoryClient';
import type {
  ElementEventListener,
  EventType,
  Subscription,
  TextElementEvents,
  CardElementEvents,
  CardNumberElementEvents,
  CardExpirationDateElementEvents,
  CardVerificationCodeElementEvents,
} from './events';
import type {
  CreateCardElementOptions,
  CreateCardExpirationDateElementOptions,
  CreateCardVerificationCodeElementOptions,
  CreateTextElementOptions,
  UpdateCardElementOptions,
  CreateCardNumberElementOptions,
  UpdateCardNumberElementOptions,
  UpdateCardExpirationDateElementOptions,
  UpdateCardVerificationCodeElementOptions,
  UpdateTextElementOptions,
  CardElementValue,
  CardExpirationDateValue,
} from './options';
import type { Tokenize, Tokens, Proxy } from './services';
import type {
  CardMetadata,
  DataElementReference,
  ElementMetadata,
} from './shared';

interface BaseElement<UpdateOptions, ElementEvents> {
  readonly mounted: boolean;
  readonly metadata: ElementMetadata;
  mount(selector: string): Promise<void>;
  mount(element: Element): Promise<void>;
  update(options: UpdateOptions): Promise<void>;
  clear(): void;
  focus(): void;
  blur(): void;
  unmount(): void;
  on<T extends EventType>(
    eventType: T,
    listener: ElementEventListener<ElementEvents, T>
  ): Subscription;
}

type CardElement = BaseElement<UpdateCardElementOptions, CardElementEvents> & {
  readonly cardMetadata?: CardMetadata;
  setValue(value: CardElementValue<'reference'>): void;
};

type TextElement = BaseElement<UpdateTextElementOptions, TextElementEvents> & {
  setValue(value: DataElementReference): void;
};

type CardNumberElement = BaseElement<
  UpdateCardNumberElementOptions,
  CardNumberElementEvents
> & {
  readonly cardMetadata?: CardMetadata;
  setValue(value: DataElementReference): void;
};

type CardExpirationDateElement = BaseElement<
  UpdateCardExpirationDateElementOptions,
  CardExpirationDateElementEvents
> & {
  month(): ElementWrapper<CardExpirationDateElement>;
  year(): ElementWrapper<CardExpirationDateElement>;
  setValue(value: CardExpirationDateValue<'reference'>): void;
};

type CardVerificationCodeElement = BaseElement<
  UpdateCardVerificationCodeElementOptions,
  CardVerificationCodeElementEvents
> & {
  setValue(value: DataElementReference): void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ElementWrapper<T extends BaseElement<any, any> = BaseElement<any, any>> = {
  element: T;
  method?: string;
};

type ElementValue =
  | TextElement
  | CardElement
  | CardNumberElement
  | CardExpirationDateElement
  | CardVerificationCodeElement
  | ElementWrapper;

interface BasisTheoryElements extends Tokenize {
  tokens: Tokens;
  proxy: Proxy;

  createElement(type: 'card', options?: CreateCardElementOptions): CardElement;
  createElement(type: 'text', options: CreateTextElementOptions): TextElement;
  createElement(
    type: 'cardNumber',
    options: CreateCardNumberElementOptions
  ): CardNumberElement;
  createElement(
    type: 'cardExpirationDate',
    options: CreateCardExpirationDateElementOptions
  ): CardExpirationDateElement;
  createElement(
    type: 'cardVerificationCode',
    options: CreateCardVerificationCodeElementOptions
  ): CardVerificationCodeElement;
}

interface ElementClient {
  post(url: string, payload: unknown, config?: Config): Promise<unknown>;
  put(url: string, payload: unknown, config?: Config): Promise<unknown>;
  patch(url: string, payload: unknown, config?: Config): Promise<unknown>;
  get(url: string, config?: Config): Promise<unknown>;
  delete(url: string, config?: Config): Promise<unknown>;
}

interface BasisTheoryElementsInternal extends BasisTheoryElements {
  init: (
    apiKey: string | undefined,
    elementsBaseUrl: string
  ) => Promise<BasisTheoryElements>;
  hasElement: (payload: unknown) => boolean;
  client: ElementClient;
}

declare global {
  interface Window {
    BasisTheoryElements?: BasisTheoryElementsInternal;
  }
}

export type {
  BaseElement,
  CardElement,
  TextElement,
  CardNumberElement,
  CardExpirationDateElement,
  CardVerificationCodeElement,
  ElementWrapper,
  ElementValue,
  BasisTheoryElements,
  BasisTheoryElementsInternal,
};
