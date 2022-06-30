import type { ElementStyle } from './styles';

const ELEMENTS_TYPES = [
  'card',
  'text',
  'cardNumber',
  'cardExpirationDate',
  'cardVerificationCode',
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
}

type ElementOptions = ElementInternalOptions & SanitizedElementOptions;

type Transform = RegExp | [RegExp, string?] | null;

interface TransformOption {
  transform?: Transform;
}

type CustomizableElementOptions = Pick<
  ElementOptions,
  'style' | 'disabled' | 'autoComplete'
>;

type CreateCardElementOptions = CustomizableElementOptions;

type UpdateCardElementOptions = CreateCardElementOptions;

type CreateTextElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'placeholder' | 'mask' | 'password' | 'autoComplete'> &
  TransformOption &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
  };

type UpdateTextElementOptions = Omit<
  CreateTextElementOptions,
  'targetId' | 'mask'
>;

type CreateCardNumberElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'placeholder' | 'iconPosition' | 'autoComplete'> &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
  };

type UpdateCardNumberElementOptions = Omit<
  CreateCardNumberElementOptions,
  'targetId'
>;

type CreateCardExpirationDateElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'placeholder' | 'autoComplete'> &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
  };

type UpdateCardExpirationDateElementOptions = Omit<
  CreateCardExpirationDateElementOptions,
  'targetId'
>;

type CreateCardVerificationCodeElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'placeholder' | 'cardBrand' | 'autoComplete'> &
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
};

export { ELEMENTS_TYPES };
