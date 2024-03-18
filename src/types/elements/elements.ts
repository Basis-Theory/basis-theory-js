import type { HttpClient } from '@/types/sdk';
import type {
  CardElementEvents,
  CardExpirationDateElementEvents,
  CardNumberElementEvents,
  CardVerificationCodeElementEvents,
  ElementEventListener,
  EventType,
  Subscription,
  TextElementEvents,
} from './events';
import type {
  CardElementValue,
  CardExpirationDateValue,
  CreateCardElementOptions,
  CreateCardExpirationDateElementOptions,
  CreateCardNumberElementOptions,
  CreateCardVerificationCodeElementOptions,
  CreateTextElementOptions,
  UpdateCardElementOptions,
  UpdateCardExpirationDateElementOptions,
  UpdateCardNumberElementOptions,
  UpdateCardVerificationCodeElementOptions,
  UpdateTextElementOptions,
} from './options';
import type { Proxy, Tokenize, Tokens } from './services';
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
  setValueRef(value: TextElement): void;
  setValue(value: DataElementReference): void;
};

type CardNumberElement = BaseElement<
  UpdateCardNumberElementOptions,
  CardNumberElementEvents
> & {
  readonly cardMetadata?: CardMetadata;
  setValueRef(value: CardNumberElement): void;
  setValue(value: DataElementReference): void;
};

type CardExpirationDateElement = BaseElement<
  UpdateCardExpirationDateElementOptions,
  CardExpirationDateElementEvents
> & {
  setValueRef(value: CardExpirationDateElement): void;
  setValue(value: CardExpirationDateValue<'reference'>): void;
  month(): ElementWrapper<CardExpirationDateElement>;
  year(): ElementWrapper<CardExpirationDateElement>;
  format(dateFormat: string): ElementWrapper<CardExpirationDateElement>;
};

type CardVerificationCodeElement = BaseElement<
  UpdateCardVerificationCodeElementOptions,
  CardVerificationCodeElementEvents
> & {
  setValueRef(value: CardVerificationCodeElement): void;
  setValue(value: DataElementReference): void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ElementWrapper<T extends BaseElement<any, any> = BaseElement<any, any>> = {
  element: T;
  method?: string;
  formattingOptions?: { format: string };
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
interface BasisTheoryElementsInternal extends BasisTheoryElements {
  init: (
    apiKey: string | undefined,
    elementsBaseUrl: string,
    elementsUseNgApi: boolean | undefined
  ) => Promise<BasisTheoryElements>;
  hasElement: (payload: unknown) => boolean;
  client: HttpClient;
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
