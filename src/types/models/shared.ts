type Primitive = string | number | boolean | null;
type TokenType =
  | 'token'
  | 'card'
  | 'bank'
  | 'card_number'
  | 'us_bank_routing_number'
  | 'us_bank_account_number'
  | 'social_security_number';

interface Auditable {
  createdBy?: string;
  createdAt?: string;
  modifiedBy?: string;
  modifiedAt?: string;
}

type DataObject<DataType = Primitive> = {
  [member: string]: TokenData<DataType>;
};
type DataArray<DataType> = Array<TokenData<DataType>>;
type TokenData<DataType = Primitive> =
  | Primitive
  | DataObject<DataType>
  | DataArray<DataType>
  | DataType;

interface TokenBase<DataType = Primitive> extends Auditable {
  data: TokenData<DataType>;
  type: TokenType;
}

interface ReactResponse {
  tokens: DataObject;
  raw: DataObject;
}

export type {
  Primitive,
  Auditable,
  TokenType,
  TokenBase,
  ReactResponse,
  DataObject,
};
