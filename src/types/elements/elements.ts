import type {
  ElementEventListener,
  EventType,
  Subscription,
  TextElementEvents,
  CardElementEvents,
} from './events';
import type {
  CreateCardElementOptions,
  CreateTextElementOptions,
  UpdateCardElementOptions,
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
  BasisTheoryElements,
  BasisTheoryElementsInternal,
};
