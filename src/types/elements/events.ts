import type { FieldError, ListenableKey, Targeted } from './shared';

type EventType = 'ready' | 'change' | 'focus' | 'blur' | 'keydown';

interface BaseEvent<T extends EventType> {
  type: T;
}

type ReadyEvent = BaseEvent<'ready'>;

type ChangeEvent = BaseEvent<'change'> & {
  empty: boolean;
  complete: boolean;
  errors?: FieldError[];
};

type InputFocusEvent = BaseEvent<'focus'> & Targeted;

type InputBlurEvent = BaseEvent<'blur'> & Targeted;

type InputKeydownEvent = BaseEvent<'keydown'> &
  Targeted & {
    key: ListenableKey;
  } & Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'shiftKey' | 'metaKey'>;

type ElementEvent =
  | ReadyEvent
  | ChangeEvent
  | InputFocusEvent
  | InputBlurEvent
  | InputKeydownEvent;

/**
 * Utility type that helps find a Union type based on a `type` property
 */
type FindByType<Union, Type> = Union extends { type: Type } ? Union : never;

type ElementEventListener<T extends EventType> = (
  event: FindByType<ElementEvent, T>
) => void;

interface Subscription {
  unsubscribe(): void;
}

export type {
  EventType,
  BaseEvent,
  ReadyEvent,
  ChangeEvent,
  InputFocusEvent,
  InputBlurEvent,
  InputKeydownEvent,
  ElementEvent,
  ElementEventListener,
  Subscription,
};
