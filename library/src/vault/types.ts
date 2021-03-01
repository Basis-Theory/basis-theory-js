export interface TokenCreateResponse {
  token: string;
  data: string;
}

export type primitive = string | number | boolean | null;
export type DataObject = {
  [member: string]: TokenData;
};
export type DataArray = Array<TokenData>;
export type TokenData = primitive | DataObject | DataArray;
