import type { Properties as CSSProperties } from 'csstype';

const SAFE_CSS_PROPERTIES = [
  'backgroundColor',
  'color',
  'fontFamily',
  'fontSize',
  'fontSmooth',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'padding',
  'textDecoration',
  'textShadow',
  'textTransform',
] as const;

type SafeCSSProperty = typeof SAFE_CSS_PROPERTIES[number];

const SAFE_CSS_PROPERTIES_ALTERNATES: Partial<
  Record<SafeCSSProperty, string[]>
> = {
  fontSmooth: ['-webkit-font-smoothing', '-moz-osx-font-smoothing'],
};

const SAFE_CSS_PROPERTIES_WITH_ALTERNATES = Object.keys(
  SAFE_CSS_PROPERTIES_ALTERNATES
);

type SafeStyle = Pick<CSSProperties, SafeCSSProperty>;

const CARD_ELEMENT_STYLE_VARIANT_SELECTORS = [
  ':hover',
  ':focus',
  ':read-only',
  '::placeholder',
  '::selection',
  ':disabled',
] as const;

type CardElementStyleVariantSelector = typeof CARD_ELEMENT_STYLE_VARIANT_SELECTORS[number];

type CardElementStyleVariantStyle = SafeStyle &
  Partial<Record<CardElementStyleVariantSelector, SafeStyle>>;

const CARD_ELEMENT_STYLE_VARIANTS = [
  'base',
  'complete',
  'invalid',
  'empty',
] as const;

const CARD_ELEMENT_STYLE_FONTS_ATTR = 'fonts' as const;

type CardElementStyleVariant = typeof CARD_ELEMENT_STYLE_VARIANTS[number];

type CardElementStyleFontAttr = typeof CARD_ELEMENT_STYLE_FONTS_ATTR;

type FontSource = string; // this could turn into an object in the future, to specify the font face attrs individually
type FontSources = FontSource[];

type Fonts = Record<CardElementStyleFontAttr, FontSources>;

type CardElementStyle = Partial<
  Record<CardElementStyleVariant, CardElementStyleVariantStyle> & Fonts
>;

type ElementStyle = CardElementStyle; // add others here as union type

type CopyIconStyles = {
  size?: string;
  color?: string;
  successColor?: string;
};

export {
  SAFE_CSS_PROPERTIES,
  SAFE_CSS_PROPERTIES_ALTERNATES,
  SAFE_CSS_PROPERTIES_WITH_ALTERNATES,
  CARD_ELEMENT_STYLE_VARIANT_SELECTORS,
  CARD_ELEMENT_STYLE_VARIANTS,
  CARD_ELEMENT_STYLE_FONTS_ATTR,
};

export type {
  CardElementStyle,
  CardElementStyleVariant,
  CardElementStyleVariantSelector,
  CardElementStyleVariantStyle,
  CopyIconStyles,
  ElementStyle,
  Fonts,
  FontSources,
  SafeCSSProperty,
  SafeStyle,
};
