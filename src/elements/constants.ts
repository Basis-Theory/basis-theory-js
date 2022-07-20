const ELEMENTS_INIT_ERROR_MESSAGE =
  'BasisTheory Elements was not properly initialized.';

const ELEMENTS_NOM_DOM_ERROR_MESSAGE =
  'Tried to load BasisTheoryElements in a non-DOM environment.';

const ELEMENTS_SCRIPT_LOAD_ERROR_MESSAGE =
  'Basis Theory Elements did not load properly.';

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

const AUTOCOMPLETE_VALUES = ['off', 'on'] as const;

export {
  ELEMENTS_INIT_ERROR_MESSAGE,
  ELEMENTS_NOM_DOM_ERROR_MESSAGE,
  ELEMENTS_SCRIPT_LOAD_ERROR_MESSAGE,
  ELEMENTS_SCRIPT_UNKNOWN_ERROR_MESSAGE,
  CARD_BRANDS,
  CARD_ICON_POSITIONS,
  AUTOCOMPLETE_VALUES,
};
