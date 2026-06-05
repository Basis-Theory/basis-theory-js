interface CardDetails {
  bin?: string;
  last4?: string;
  expirationMonth?: number;
  expirationYear?: number;
  brand?: CardBrandType;
  funding?: FundingType;
  authentication?: string;
}

const enrichmentCardBrands = [
  'american-express',
  'diners-club',
  'discover',
  'ebt',
  'elo',
  'hiper',
  'hipercard',
  'jcb',
  'maestro',
  'mastercard',
  'mir',
  'private-label',
  'proprietary',
  'unionpay',
  'visa',
] as const;

type CardBrandType = typeof enrichmentCardBrands[number];

const enrichmentFundingTypes = ['prepaid', 'credit', 'debit'] as const;

type FundingType = typeof enrichmentFundingTypes[number];

export type { CardDetails, CardBrandType, FundingType };
export { enrichmentCardBrands, enrichmentFundingTypes };
