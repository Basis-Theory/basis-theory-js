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

interface Token<DataType = Primitive> extends TokenBase {
  data: TokenData<DataType>;
  privacy?: TokenPrivacy;
  encryption?: TokenEncryption;
}

type CreateToken<DataType = Primitive> = Pick<
  Token<DataType>,
  'type' | 'data' | 'privacy' | 'metadata' | 'encryption'
>;

export type {
  Token,
  CreateToken,
  DataArray,
  DataObject,
  TokenData,
  DataClassification,
  DataImpactLevel,
  DataRestrictionPolicy,
};

export { DATA_CLASSIFICATIONS, DATA_IMPACT_LEVELS, DATA_RESTRICTION_POLICIES };
