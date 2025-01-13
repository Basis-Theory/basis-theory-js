const ELEMENTS_INIT_ERROR_MESSAGE =
  'BasisTheory Elements was not properly initialized.';

const ELEMENTS_NOM_DOM_ERROR_MESSAGE =
  'Tried to load BasisTheoryElements in a non-DOM environment.';

const ELEMENTS_SCRIPT_LOAD_ERROR_MESSAGE =
  'Basis Theory Elements did not load properly. Check network tab for more details.';

const ELEMENTS_SCRIPT_UNKNOWN_ERROR_MESSAGE =
  'There was an unknown error when loading Basis Theory Elements. Check the console for details.';

const CARD_BRANDS = [
  'visa',
  'mastercard',
  'american-express',
  'discover',
  'diners-club',
  'jcb',
  'unionpay',
  'maestro',
  'elo',
  'hiper',
  'hipercard',
  'mir',
  'unknown',
] as const;

const CARD_ICON_POSITIONS = ['left', 'right', 'none'] as const;

// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
const AUTOCOMPLETE_VALUES = [
  'additional-name',
  'address-level1',
  'address-level2',
  'address-level3',
  'address-level4',
  'address-line1',
  'address-line2',
  'address-line3',
  'bday-day',
  'bday-month',
  'bday-year',
  'bday',
  'billing',
  'cc-additional-name',
  'cc-csc',
  'cc-exp-month',
  'cc-exp-year',
  'cc-exp',
  'cc-family-name',
  'cc-given-name',
  'cc-name',
  'cc-number',
  'cc-type',
  'country-name',
  'country',
  'current-password',
  'email',
  'family-name',
  'fax',
  'given-name',
  'home',
  'honorific-prefix',
  'honorific-suffix',
  'language',
  'mobile',
  'name',
  'new-password',
  'nickname',
  'off',
  'on',
  'one-time-code',
  'organization-title',
  'organization',
  'page',
  'postal-code',
  'sex',
  'shipping',
  'street-address',
  'tel-area-code',
  'tel-country-code',
  'tel-extension',
  'tel-local-prefix',
  'tel-local-suffix',
  'tel-local',
  'tel-national',
  'tel',
  'transaction-amount',
  'transaction-currency',
  'url',
  'username',
  'work',
] as const;

export {
  ELEMENTS_INIT_ERROR_MESSAGE,
  ELEMENTS_NOM_DOM_ERROR_MESSAGE,
  ELEMENTS_SCRIPT_LOAD_ERROR_MESSAGE,
  ELEMENTS_SCRIPT_UNKNOWN_ERROR_MESSAGE,
  CARD_BRANDS,
  CARD_ICON_POSITIONS,
  AUTOCOMPLETE_VALUES,
};
