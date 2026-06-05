/* eslint-disable @typescript-eslint/no-explicit-any */
interface BinDetails {
  cardBrand?: string;
  type?: string;
  prepaid?: boolean;
  cardSegmentType?: string;
  reloadable?: boolean;
  panOrToken?: string;
  accountUpdater?: boolean;
  alm?: boolean;
  domesticOnly?: boolean;
  gamblingBlocked?: boolean;
  level2?: boolean;
  level3?: boolean;
  issuerCurrency?: string;
  comboCard?: string;
  binLength?: number;
  authentication?: any;
  cost?: any;
  bank?: BinDetailsBank;
  country?: BinDetailsCountry;
  product?: BinDetailsProduct;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

interface BinDetailsBank {
  name?: string;
  phone?: string;
  url?: string;
  cleanName?: string;
}

interface BinDetailsCountry {
  alpha2?: string;
  name?: string;
  numeric?: string;
}

interface BinDetailsProduct {
  code?: string;
  name?: string;
}

export type {
  BinDetails,
  BinDetailsBank,
  BinDetailsCountry,
  BinDetailsProduct,
};
