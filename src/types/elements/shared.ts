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
type Brand =
  | 'visa'
  | 'mastercard'
  | 'american-express'
  | 'discover'
  | 'diners-club'
  | 'jcb'
  | 'unionpay'
  | 'maestro'
  | 'elo'
  | 'hiper'
  | 'hipercard'
  | 'mir'
  | 'unknown';

export type {
  FieldErrorType,
  ConfigErrorType,
  ConfigError,
  Targeted,
  ListenableKey,
  FieldError,
  PropertyError,
  Brand,
};
