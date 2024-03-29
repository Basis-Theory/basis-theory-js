import type { BinDetails } from './bin-details';
import type { Primitive, TokenBase } from './shared';

const DATA_CLASSIFICATIONS = ['general', 'bank', 'pci', 'pii'] as const;

type DataClassification = typeof DATA_CLASSIFICATIONS[number];

const DATA_IMPACT_LEVELS = ['low', 'moderate', 'high'] as const;

type DataImpactLevel = typeof DATA_IMPACT_LEVELS[number];

const DATA_RESTRICTION_POLICIES = ['mask', 'redact'] as const;

type DataRestrictionPolicy = typeof DATA_RESTRICTION_POLICIES[number];

type DataObject<DataType = Primitive> = {
  [member: string]: TokenData<DataType>;
};
type DataArray<DataType> = Array<TokenData<DataType>>;
type TokenData<DataType = Primitive> =
  | Primitive
  | DataObject<DataType>
  | DataArray<DataType>
  | DataType;

type MaskObject = {
  [member: string]: TokenMask;
};
type MaskArray = Array<TokenMask>;
type TokenMask = string | null | MaskObject | MaskArray;

interface TokenEncryptionKey {
  key: string;
  alg: string;
}

interface TokenEncryption {
  cek: TokenEncryptionKey;
  kek: TokenEncryptionKey;
}

interface TokenPrivacy {
  classification?: DataClassification;
  impactLevel?: DataImpactLevel;
  restrictionPolicy?: DataRestrictionPolicy;
}

interface TokenEnrichments {
  binDetails?: BinDetails;
}

interface Token<DataType = Primitive> extends TokenBase {
  data: TokenData<DataType>;
  privacy?: TokenPrivacy;
  containers?: string[];
  encryption?: TokenEncryption;
  searchIndexes?: string[];
  fingerprintExpression?: string;
  mask?: TokenMask;
  expiresAt?: string;
  enrichments?: TokenEnrichments;
}

type CreateToken<DataType = Primitive> = Pick<
  Token<DataType>,
  | 'type'
  | 'data'
  | 'privacy'
  | 'containers'
  | 'metadata'
  | 'encryption'
  | 'searchIndexes'
  | 'fingerprintExpression'
  | 'mask'
  | 'expiresAt'
> & {
  deduplicateToken?: boolean;
  id?: string;
};

type UpdateToken<DataType = Primitive> = Partial<
  Pick<
    Token<DataType>,
    | 'data'
    | 'containers'
    | 'metadata'
    | 'encryption'
    | 'searchIndexes'
    | 'fingerprintExpression'
    | 'mask'
    | 'expiresAt'
  > & {
    privacy: Omit<TokenPrivacy, 'classification'>;
    deduplicateToken: boolean;
  }
>;

export type {
  Token,
  TokenEnrichments,
  CreateToken,
  UpdateToken,
  DataArray,
  DataObject,
  TokenData,
  DataClassification,
  DataImpactLevel,
  DataRestrictionPolicy,
};

export { DATA_CLASSIFICATIONS, DATA_IMPACT_LEVELS, DATA_RESTRICTION_POLICIES };
