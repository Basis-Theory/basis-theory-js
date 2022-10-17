import { AutoCompleteValue } from './shared';
import type { ElementStyle } from './styles';

const ELEMENTS_TYPES = [
  'card',
  'text',
  'cardNumber',
  'cardExpirationDate',
  'cardVerificationCode',
  'data',
] as const;

type ElementType = typeof ELEMENTS_TYPES[number];

interface ElementInternalOptions {
  apiKey: string;
  type: ElementType;
  baseUrl: string;
}

interface SanitizedElementOptions {
  style?: ElementStyle;
  disabled?: boolean;
  targetId?: string;
  mask?: (RegExp | string)[];
  password?: boolean;
  placeholder?: string;
  transform?: [RegExp, string] | null;
  ariaDescription?: string;
  ariaLabel?: string;
  iconPosition?: string;
  cardBrand?: string;
  autoComplete?: string;
  value?: string | unknown;
}

type ElementOptions = ElementInternalOptions & SanitizedElementOptions;

type Transform = RegExp | [RegExp, string?] | null;

interface TransformOption {
  transform?: Transform;
}

interface AutoCompleteOption {
  autoComplete?: AutoCompleteValue;
}

type CustomizableElementOptions = Pick<ElementOptions, 'style' | 'disabled'> &
  AutoCompleteOption;

interface CardElementValue {
  number?: string;
  // disabling camecalse so that the element value matches the API data
  /* eslint-disable camelcase */
  expiration_month?: number;
  expiration_year?: number;
  /* eslint-enable camelcase */
  cvc?: string;
}

interface CardExpirationDateValue {
  month: number;
  year: number;
}

type CreateCardElementOptions = CustomizableElementOptions & {
  value?: CardElementValue;
};

type UpdateCardElementOptions = CreateCardElementOptions;

type CreateTextElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'placeholder' | 'mask' | 'password' | 'value'> &
  TransformOption &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
  };

type UpdateTextElementOptions = Omit<
  CreateTextElementOptions,
  'targetId' | 'mask'
>;

type CreateCardNumberElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'placeholder' | 'iconPosition' | 'value'> &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
  };

type UpdateCardNumberElementOptions = Omit<
  CreateCardNumberElementOptions,
  'targetId'
>;

type CreateCardExpirationDateElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'placeholder'> &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
    value?: CardExpirationDateValue;
  };

type UpdateCardExpirationDateElementOptions = Omit<
  CreateCardExpirationDateElementOptions,
  'targetId'
>;

type CreateCardVerificationCodeElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'placeholder' | 'cardBrand' | 'value'> &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
  };

type UpdateCardVerificationCodeElementOptions = Omit<
  CreateCardVerificationCodeElementOptions,
  'targetId'
>;

export type {
  ElementInternalOptions,
  ElementType,
  ElementOptions,
  SanitizedElementOptions,
  Transform,
  CustomizableElementOptions,
  CreateCardElementOptions,
  UpdateCardElementOptions,
  CreateTextElementOptions,
  UpdateTextElementOptions,
  CreateCardNumberElementOptions,
  UpdateCardNumberElementOptions,
  CreateCardExpirationDateElementOptions,
  UpdateCardExpirationDateElementOptions,
  CreateCardVerificationCodeElementOptions,
  UpdateCardVerificationCodeElementOptions,
  CardElementValue,
  CardExpirationDateValue,
};

export { ELEMENTS_TYPES };
