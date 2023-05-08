import { CardElementValue } from '../elements';
import { Card } from './cards';
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
type TokenMask = string | MaskObject | MaskArray;

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
  containers?: string[];
  encryption?: TokenEncryption;
  searchIndexes?: string[];
  fingerprintExpression?: string;
  mask?: TokenMask;
  expiresAt?: string;
}

interface Secondary {
  /**
   * URL of the secondary service
   */
  url: string;

  config: {
    /**
     * HTTP headers like content-type, authorization, etc required by the secondary service
     */
    headers: Record<string, unknown>;
  };
  /**
   * Payload to merge with the card object
   */
  payload: Record<string, unknown>;
  /**
   *  Used to specify the mapping between keys in the `Card` type and keys in the object expected by the secondary service.
   * The properties in the new object will be renamed as follows:
   * 1) `['number']` will default to `'number'`
   * 2) `['expirationDate', 'expDate']` will default to `'expDate'`
   */
  destinationType: (
    | [keyof CardElementValue<'static'>]
    | [keyof CardElementValue<'static'>, string]
  )[];
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
  /**
   * Used for writing data to a secondary service
   */
  secondary?: Secondary;
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
