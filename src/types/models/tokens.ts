import type { BinDetails } from './bin-details';
import type { Primitive, TokenBase } from './shared';

const DATA_CLASSIFICATIONS = ['general', 'bank', 'pci', 'pii'] as const;

type DataClassification = typeof DATA_CLASSIFICATIONS[number];

const DATA_IMPACT_LEVELS = ['low', 'moderate', 'high'] as const;

type DataImpactLevel = typeof DATA_IMPACT_LEVELS[number];

const DATA_RESTRICTION_POLICIES = ['mask', 'redact'] as const;

type DataRestrictionPolicy = typeof DATA_RESTRICTION_POLICIES[number];

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

type Token<DataType = Primitive> = TokenBase<DataType> & {
  id: string;
  privacy?: TokenPrivacy;
  containers?: string[];
  encryption?: TokenEncryption;
  searchIndexes?: string[];
  fingerprintExpression?: string;
  mask?: TokenMask;
  expiresAt?: string;
  enrichments?: TokenEnrichments;
  tenantId: string;
  fingerprint?: string;
  metadata?: Record<string, string>;
};

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
  DataClassification,
  DataImpactLevel,
  DataRestrictionPolicy,
};

export { DATA_CLASSIFICATIONS, DATA_IMPACT_LEVELS, DATA_RESTRICTION_POLICIES };
