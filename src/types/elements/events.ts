import type {
  CardMetadata,
  ElementMetadata,
  ListenableKey,
  Targeted,
} from './shared';

type EventType = 'ready' | 'change' | 'focus' | 'blur' | 'keydown';

interface BaseEvent<T extends EventType> {
  type: T;
}

type ReadyEvent = BaseEvent<'ready'>;

type ChangeEvent = BaseEvent<'change'> & ElementMetadata;

type BlurEvent = BaseEvent<'blur'> & ElementMetadata;

type CardChangeEvent = ChangeEvent & CardMetadata;

type InputFocusEvent = BaseEvent<'focus'> & Targeted;

type InputBlurEvent = BlurEvent & Targeted;

type InputKeydownEvent = BaseEvent<'keydown'> &
  Targeted & {
    key: ListenableKey;
  } & Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'shiftKey' | 'metaKey'>;

type BaseElementEvents =
  | ReadyEvent
  | InputFocusEvent
  | InputBlurEvent
  | InputKeydownEvent;

type TextElementEvents = BaseElementEvents | ChangeEvent;

type CardElementEvents = BaseElementEvents | CardChangeEvent;

type CardNumberElementEvents = BaseElementEvents | CardChangeEvent;

type CardExpirationDateElementEvents = BaseElementEvents | ChangeEvent;

type CardVerificationCodeElementEvents = BaseElementEvents | ChangeEvent;

/**
 * Utility type that helps find a Union type based on a `type` property
 */
type FindByType<Union, Type> = Union extends { type: Type } ? Union : never;

type ElementEventListener<Events, Type> = (
  event: FindByType<Events, Type>
) => void;

interface Subscription {
  unsubscribe(): void;
}

export type {
  EventType,
  BaseEvent,
  ReadyEvent,
  ChangeEvent,
  CardChangeEvent,
  InputFocusEvent,
  InputBlurEvent,
  InputKeydownEvent,
  BaseElementEvents,
  TextElementEvents,
  CardElementEvents,
  CardNumberElementEvents,
  CardExpirationDateElementEvents,
  CardVerificationCodeElementEvents,
  ElementEventListener,
  Subscription,
};
