import { AutoCompleteValue, DataElementReference } from './shared';
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
  apiKey: string | undefined;
  type: ElementType;
  baseUrl: string;
}

interface SanitizedElementOptions {
  validateOnChange?: boolean;
  enableCopy?: boolean;
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
  value?:
    | CardElementValue<'static'>
    | CardExpirationDateValue<'static'>
    | string;
}

type ElementOptions = ElementInternalOptions & SanitizedElementOptions;

type Transform = RegExp | [RegExp, string?] | null;

interface TransformOption {
  transform?: Transform;
}

interface AutoCompleteOption {
  autoComplete?: AutoCompleteValue;
}

type CustomizableElementOptions = Pick<
  ElementOptions,
  'style' | 'disabled' | 'validateOnChange' | 'enableCopy'
> &
  AutoCompleteOption;

type ElementValueType = 'static' | 'reference';

interface CardElementValue<T extends ElementValueType> {
  number?: T extends 'reference' ? DataElementReference : string;
  // disabling camecalse so that the element value matches the API data
  /* eslint-disable camelcase */
  expiration_month?: T extends 'reference' ? DataElementReference : number;
  expiration_year?: T extends 'reference' ? DataElementReference : number;
  /* eslint-enable camelcase */
  cvc?: T extends 'reference' ? DataElementReference : string;
}

interface CardExpirationDateValue<T extends ElementValueType> {
  month: T extends 'reference' ? DataElementReference : number;
  year: T extends 'reference' ? DataElementReference : number;
}

type CreateCardElementOptions = CustomizableElementOptions & {
  value?: CardElementValue<'static'>;
};

type UpdateCardElementOptions = Omit<
  CreateCardElementOptions,
  'validateOnChange' | 'enableCopy'
>;

type CreateTextElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'placeholder' | 'mask' | 'password'> &
  TransformOption &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
    value?: string;
  };

type UpdateTextElementOptions = Omit<
  CreateTextElementOptions,
  'targetId' | 'mask' | 'validateOnChange'
>;

type CreateCardNumberElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'placeholder' | 'iconPosition'> &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
    value?: string;
  };

type UpdateCardNumberElementOptions = Omit<
  CreateCardNumberElementOptions,
  'targetId' | 'validateOnChange' | 'enableCopy'
>;

type CreateCardExpirationDateElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'placeholder'> &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
    value?: CardExpirationDateValue<'static'> | string;
  };

type UpdateCardExpirationDateElementOptions = Omit<
  CreateCardExpirationDateElementOptions,
  'targetId' | 'validateOnChange' | 'enableCopy'
>;

type CreateCardVerificationCodeElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'placeholder' | 'cardBrand'> &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
    value?: string;
  };

type UpdateCardVerificationCodeElementOptions = Omit<
  CreateCardVerificationCodeElementOptions,
  'targetId' | 'validateOnChange' | 'enableCopy'
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
