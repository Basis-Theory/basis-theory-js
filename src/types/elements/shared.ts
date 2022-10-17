import {
  AUTOCOMPLETE_VALUES,
  CARD_BRANDS,
  CARD_ICON_POSITIONS,
} from '@/elements/constants';

type FieldErrorType = 'incomplete' | 'invalid';

type ConfigErrorType =
  | 'missing-configuration'
  | 'missing-permission'
  | 'invalid-configuration';

interface ConfigError {
  type: ConfigErrorType;
  message: string;
}

interface Targeted {
  targetId: string;
}

type ListenableKey = 'Escape' | 'Enter';

interface FieldError {
  targetId: string;
  type: FieldErrorType;
}

interface PropertyError {
  type: FieldErrorType;
}

/**
 * Card brands type
 */
type Brand = typeof CARD_BRANDS[number];

/**
 * Icon position for card number element
 */
type CardIconPosition = typeof CARD_ICON_POSITIONS[number];

/**
 * Values for the element input autocomplete attribute
 */
type AutoCompleteValue = typeof AUTOCOMPLETE_VALUES[number];

/**
 * Type used for detokenization responses stored on Data Elements
 */
type DataElementReference = {
  correlationId: string;
  elementId: string;
  path: string;
};

export type {
  FieldErrorType,
  ConfigErrorType,
  ConfigError,
  Targeted,
  ListenableKey,
  FieldError,
  PropertyError,
  Brand,
  CardIconPosition,
  AutoCompleteValue,
  DataElementReference,
};
