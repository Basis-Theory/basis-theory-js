import type { ElementStyle } from './styles';

const ELEMENTS_TYPES = ['card', 'text', 'cardExpirationDate'] as const;

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
}

type ElementOptions = ElementInternalOptions & SanitizedElementOptions;

type Transform = RegExp | [RegExp, string?] | null;

interface TransformOption {
  transform?: Transform;
}

type CustomizableElementOptions = Pick<ElementOptions, 'style' | 'disabled'>;

type CreateCardElementOptions = CustomizableElementOptions;

type UpdateCardElementOptions = CreateCardElementOptions;

type CreateTextElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'placeholder' | 'mask' | 'password'> &
  TransformOption &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
  };

type UpdateTextElementOptions = Omit<
  CreateTextElementOptions,
  'targetId' | 'mask'
>;

type CreateCardExpirationDateElementOptions = CustomizableElementOptions &
  Pick<ElementOptions, 'placeholder'> &
  Required<Pick<ElementOptions, 'targetId'>> & {
    'aria-label'?: string;
  };

type UpdateCardExpirationDateElementOptions = Omit<
  CreateCardExpirationDateElementOptions,
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
  CreateCardExpirationDateElementOptions,
  UpdateCardExpirationDateElementOptions,
};

export { ELEMENTS_TYPES };
