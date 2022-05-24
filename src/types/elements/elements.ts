import type {
  ElementEventListener,
  EventType,
  Subscription,
  TextElementEvents,
  CardElementEvents,
  CardNumberElementEvents,
  CardExpirationDateElementEvents,
} from './events';
import type {
  CreateCardElementOptions,
  CreateCardExpirationDateElementOptions,
  CreateTextElementOptions,
  UpdateCardElementOptions,
  CreateCardNumberElementOptions,
  UpdateCardNumberElementOptions,
  UpdateCardExpirationDateElementOptions,
  UpdateTextElementOptions,
} from './options';
import type { AtomicBanks, AtomicCards, Tokenize, Tokens } from './services';

interface BaseElement<UpdateOptions, ElementEvents> {
  readonly mounted: boolean;
  mount(selector: string): Promise<void>;
  update(options: UpdateOptions): Promise<void>;
  clear(): void;
  unmount(): void;
  on<T extends EventType>(
    eventType: T,
    listener: ElementEventListener<ElementEvents, T>
  ): Subscription;
}

type CardElement = BaseElement<UpdateCardElementOptions, CardElementEvents>;

type TextElement = BaseElement<UpdateTextElementOptions, TextElementEvents>;

type CardNumberElement = BaseElement<
  UpdateCardNumberElementOptions,
  CardNumberElementEvents
>;

type CardExpirationDateElement = BaseElement<
  UpdateCardExpirationDateElementOptions,
  CardExpirationDateElementEvents
> & {
  month(): ElementWrapper<CardExpirationDateElement>;
  year(): ElementWrapper<CardExpirationDateElement>;
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
  | ElementWrapper;

interface BasisTheoryElements extends Tokenize {
  /**
   * @deprecated use {@link tokens} or {@link tokenize}
   */
  atomicBanks: AtomicBanks;
  /**
   * @deprecated use {@link tokens} or {@link tokenize}
   */
  atomicCards: AtomicCards;
  tokens: Tokens;

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
}

interface BasisTheoryElementsInternal extends BasisTheoryElements {
  init: (
    apiKey: string,
    elementsBaseUrl: string
  ) => Promise<BasisTheoryElements>;
  hasElement: (payload: unknown) => boolean;
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
  ElementWrapper,
  ElementValue,
  BasisTheoryElements,
  BasisTheoryElementsInternal,
};
