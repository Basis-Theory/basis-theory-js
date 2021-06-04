export type Primitive = string | number | boolean | null;
export type DataObject = {
  [member: string]: TokenData;
};
export type DataArray = Array<TokenData>;
export type TokenData = Primitive | DataObject | DataArray;

export type TokenType = 'token' | 'card';

export interface CreateTokenResponse {
  id: string;
  tenantId: string;
  type: TokenType;
  createdBy: string;
  createdAt: string;
  metadata: unknown;
}

export interface GetTokenResponse extends CreateTokenResponse {
  data: unknown;
}

// we can disable for this next line as we are only exporting interfaces here
// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace TokensApi {
  export interface CreateTokenResponse {
    id: string;
    tenant_id: string;
    type: TokenType;
    created_by: string;
    created_at: string;
    metadata: unknown;
  }
}
